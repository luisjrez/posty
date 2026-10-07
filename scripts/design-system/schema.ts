import { z } from 'zod';

const PrimitiveValueSchema = z.union([z.string(), z.number()]);

export const TokenSchema = z.object({
  $type: z.string(),
  $value: z.union([PrimitiveValueSchema, z.record(z.string(), PrimitiveValueSchema)]),
  $description: z.string().optional(),
});

export type Token = z.infer<typeof TokenSchema>;
export type TokenGroup = { [key: string]: Token | TokenGroup };

export const TokenGroupSchema: z.ZodType<TokenGroup> = z.lazy(() =>
  z.record(z.string(), z.union([TokenSchema, TokenGroupSchema])),
);

export const ManifestSchema = z.object({
  name: z.string().min(1),
  version: z.string().min(1),
  themes: z.object({ light: z.string(), dark: z.string() }),
  tokens: z.array(z.string()).min(1),
  fonts: z.array(z.object({ family: z.string().min(1), file: z.string().min(1) })),
});

export type Manifest = z.infer<typeof ManifestSchema>;

export const REQUIRED_SHARED_GROUPS = [
  'space',
  'radius',
  'fontFamily',
  'fontSize',
  'lineHeight',
  'typography',
] as const;
export const REQUIRED_THEME_GROUPS = ['color'] as const;
