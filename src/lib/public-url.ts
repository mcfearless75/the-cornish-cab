/** Public file URL, including the GitHub Pages project prefix when one is set. */
export function publicUrl(path: string): string {
  const base = import.meta.env.BASE_URL || "/";
  return base + path.replace(/^\//, "");
}
