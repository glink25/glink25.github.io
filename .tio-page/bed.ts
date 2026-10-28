import { slug, type TioObject } from '@glink25/tio-pages';

export interface BedOptions {
  databaseId: string;
  fields: { name: string; file: string; slug: string };
  slugify(name: string): string;
  route(slug: string): string;
}
/** Additional public files are publication policy owned by this workspace. */
export async function bedFiles(
  objects: readonly TioObject[],
  config: BedOptions,
  aliases: Record<string, string>,
  readAsset: (asset: TioObject) => Promise<Uint8Array | null>,
): Promise<Map<string, Uint8Array>> {
  const byId = new Map(objects.filter((o) => !o.deleted).map((o) => [o.id, o]));
  const files = new Map<string, Uint8Array>();
  const publish = async (path: string, id: string) => {
    const output = path.replace(/^\//, '');
    if (
      !output ||
      /[\\?#%\x00-\x1f]/.test(output) ||
      output.split('/').some((p) => !p || p === '.' || p === '..')
    )
      throw new Error(`Invalid Bed path: ${path}`);
    if (files.has(output)) throw new Error(`Duplicate Bed path: ${path}`);
    const asset = byId.get(id);
    if (asset?.type !== 'asset') throw new Error(`Missing Bed asset: ${id}`);
    const bytes = await readAsset(asset);
    if (!bytes || bytes.byteLength !== asset.byteSize)
      throw new Error(`Invalid Bed asset bytes: ${id}`);
    files.set(output, bytes);
  };
  // Keep externally shared URLs for images already stored in article assets.
  for (const [name, id] of Object.entries(aliases)) await publish(config.route(name), id);
  for (const row of objects.filter(
    (o) => o.type === 'record' && o.databaseId === config.databaseId && !o.deleted,
  )) {
    const props = row.properties ?? {};
    const refs = props[config.fields.file];
    if (!refs || (Array.isArray(refs) && refs.length === 0)) continue;
    if (
      !Array.isArray(refs) ||
      refs.length !== 1 ||
      typeof refs[0] !== 'string' ||
      !refs[0].startsWith('asset:')
    )
      throw new Error(`Bed requires exactly one file: ${row.id}`);
    const asset = byId.get(refs[0].slice(6));
    const extension = String(asset?.filename ?? '').match(/\.[A-Za-z0-9]+$/)?.[0] ?? '';
    const custom = props[config.fields.slug];
    if (custom != null && typeof custom !== 'string')
      throw new Error(`Invalid Bed slug: ${row.id}`);
    const value =
      typeof custom === 'string' && custom.trim()
        ? custom.trim()
        : config.slugify(String(props[config.fields.name] ?? '')) + extension;
    if (!value || value === extension) throw new Error(`Empty Bed slug: ${row.id}`);
    await publish(config.route(value), refs[0].slice(6));
  }
  return files;
}
export const bed: BedOptions = {
  databaseId: 'Bed',
  fields: { name: 'name', file: 'file', slug: 'slug' },
  slugify: (name) => slug(name, true),
  route: (slug) => '/post-assets/' + slug,
};
