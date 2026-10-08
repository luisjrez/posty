import { copyFile, mkdir, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

import { DefaultArtifactClient } from '@actions/artifact';

const STATUS_ICON = { SUCCESS: '✅', ERROR: '❌', FAILURE: '❌', SKIPPED: '⏭️' };

function readAttribute(tag, name) {
  return tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1] ?? '';
}

function parseFlows(junit) {
  return [...junit.matchAll(/<testcase\b[^>]*>/g)].map(([tag]) => ({
    name: readAttribute(tag, 'name'),
    file: readAttribute(tag, 'file'),
    seconds: Number(readAttribute(tag, 'time')),
    status: readAttribute(tag, 'status') || (/\/>$/.test(tag) ? 'SUCCESS' : 'FAILURE'),
  }));
}

async function listFiles(dir) {
  const entries = await readdir(dir, { recursive: true, withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => path.join(entry.parentPath, entry.name));
}

async function upsertComment({ github, context }, marker, body) {
  const { owner, repo } = context.repo;
  const issue_number = context.payload.pull_request.number;
  const comments = await github.paginate(github.rest.issues.listComments, {
    owner,
    repo,
    issue_number,
  });
  const existing = comments.find((comment) => comment.body?.startsWith(marker));
  if (existing) {
    await github.rest.issues.updateComment({ owner, repo, comment_id: existing.id, body });
  } else {
    await github.rest.issues.createComment({ owner, repo, issue_number, body });
  }
}

export default async function report({ github, context, core }) {
  const PLATFORM = process.env.PLATFORM;
  const RESULTS_DIR = process.env.RESULTS_DIR;
  const REPORT = process.env.REPORT;
  const RESULTS_URL = process.env.RESULTS_URL;
  const flows = parseFlows(await readFile(REPORT, 'utf8'));
  const videos = (await listFiles(RESULTS_DIR)).filter((file) => file.endsWith('.mp4'));
  const staging = path.join(RESULTS_DIR, '.videos');
  await mkdir(staging, { recursive: true });

  const client = new DefaultArtifactClient();
  const runUrl = `${context.serverUrl}/${context.repo.owner}/${context.repo.repo}/actions/runs/${context.runId}`;

  const rows = [];
  for (const flow of flows) {
    const flowId = path.basename(flow.file, path.extname(flow.file));
    const video = videos.find((file) => path.basename(file) === `${flowId}.mp4`);
    let videoCell = '—';
    if (video) {
      const named = path.join(staging, `maestro-${PLATFORM}-${flowId}.mp4`);
      await copyFile(video, named);
      const { id } = await client.uploadArtifact(path.basename(named), [named], staging, {
        skipArchive: true,
        retentionDays: 14,
      });
      videoCell = `[▶ Watch](${runUrl}/artifacts/${id})`;
    }
    const icon = STATUS_ICON[flow.status] ?? '❔';
    rows.push(
      `| ${icon} | ${flow.name} | \`${flow.file}\` | ${flow.seconds.toFixed(1)}s | ${videoCell} |`,
    );
  }

  const marker = `<!-- maestro-${PLATFORM} -->`;
  const passed = flows.filter((flow) => flow.status === 'SUCCESS').length;
  const body = [
    marker,
    `### Maestro E2E · ${PLATFORM} · \`${context.payload.pull_request?.head.sha ?? context.sha}\``,
    '',
    `${passed}/${flows.length} flows passed · [run](${runUrl})${RESULTS_URL ? ` · [full results](${RESULTS_URL})` : ''}`,
    '',
    '| | Flow | File | Time | Video |',
    '| --- | --- | --- | --- | --- |',
    ...rows,
  ].join('\n');

  await core.summary.addRaw(body).write();
  if (context.payload.pull_request) await upsertComment({ github, context }, marker, body);
}
