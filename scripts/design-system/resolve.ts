import type { Token, TokenGroup } from './schema';

type Primitive = string | number;
export type ResolvedValue = Primitive | Record<string, Primitive>;
export type ResolvedTree = { [key: string]: ResolvedValue | ResolvedTree };

const ALIAS = /^\{([^}]+)\}$/;

function isToken(node: Token | TokenGroup): node is Token {
  return '$value' in node;
}

export function flatten(tree: TokenGroup, prefix = ''): Map<string, Token> {
  const out = new Map<string, Token>();
  for (const [key, node] of Object.entries(tree)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (isToken(node)) {
      out.set(path, node);
    } else {
      for (const [childPath, token] of flatten(node, path)) out.set(childPath, token);
    }
  }
  return out;
}

export function resolveAll(tokens: Map<string, Token>): {
  values: Map<string, ResolvedValue>;
  issues: string[];
} {
  const values = new Map<string, ResolvedValue>();
  const issues: string[] = [];

  const resolvePrimitive = (raw: Primitive, from: string, stack: string[]): Primitive | null => {
    if (typeof raw === 'number') return raw;
    const match = ALIAS.exec(raw);
    const target = match?.[1];
    if (target === undefined) return raw;
    if (stack.includes(target)) {
      issues.push(`Alias cycle: ${[...stack, target].join(' → ')}`);
      return null;
    }
    const resolved = resolveToken(target, [...stack, target], from);
    if (resolved === null) return null;
    if (typeof resolved === 'object') {
      issues.push(
        `"${from}" references composite token "${target}" where a single value is expected`,
      );
      return null;
    }
    return resolved;
  };

  const resolveToken = (path: string, stack: string[], from: string): ResolvedValue | null => {
    const cached = values.get(path);
    if (cached !== undefined) return cached;
    const token = tokens.get(path);
    if (!token) {
      issues.push(`"${from}" references unknown token "{${path}}"`);
      return null;
    }
    const raw = token.$value;
    let result: ResolvedValue | null;
    if (typeof raw === 'object') {
      const composite: Record<string, Primitive> = {};
      let ok = true;
      for (const [field, fieldValue] of Object.entries(raw)) {
        const resolved = resolvePrimitive(fieldValue, path, stack);
        if (resolved === null) ok = false;
        else composite[field] = resolved;
      }
      result = ok ? composite : null;
    } else {
      result = resolvePrimitive(raw, path, stack);
    }
    if (result !== null) values.set(path, result);
    return result;
  };

  for (const path of tokens.keys()) resolveToken(path, [path], path);
  return { values, issues: [...new Set(issues)] };
}

export function unflatten(values: Map<string, ResolvedValue>, root: string): ResolvedTree {
  const out: ResolvedTree = {};
  for (const [path, value] of values) {
    if (!path.startsWith(`${root}.`)) continue;
    const segments = path.slice(root.length + 1).split('.');
    const leaf = segments.pop();
    if (leaf === undefined) continue;
    let node = out;
    for (const segment of segments) {
      const next = node[segment];
      if (next !== undefined && isTree(next)) {
        node = next;
      } else {
        const created: ResolvedTree = {};
        node[segment] = created;
        node = created;
      }
    }
    node[leaf] = value;
  }
  return out;
}

function isTree(value: ResolvedValue | ResolvedTree): value is ResolvedTree {
  return typeof value === 'object';
}
