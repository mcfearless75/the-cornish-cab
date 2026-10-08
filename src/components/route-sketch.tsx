/** A driving line from OpenStreetMap coordinates. [lon, lat] pairs. Not a satnav. */
export function RouteSketch({ line }: { line: [number, number][] }) {
  if (line.length < 2) return null;
  const lons = line.map((point) => point[0]);
  const lats = line.map((point) => point[1]);
  const minX = Math.min(...lons);
  const maxX = Math.max(...lons);
  const minY = Math.min(...lats);
  const maxY = Math.max(...lats);
  const spanX = maxX - minX || 0.01;
  const spanY = maxY - minY || 0.01;
  const width = 640;
  const height = 280;
  const pad = 28;
  const x = (lon: number) => pad + ((lon - minX) / spanX) * (width - pad * 2);
  const y = (lat: number) => height - (pad + ((lat - minY) / spanY) * (height - pad * 2));
  const d = line.map((point, index) => `${index === 0 ? "M" : "L"}${x(point[0]).toFixed(1)},${y(point[1]).toFixed(1)}`).join(" ");
  const start = line[0];
  const end = line[line.length - 1];
  if (!start || !end) return null;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="mt-4 h-44 w-full rounded-2xl bg-harbour"
      role="img"
      aria-label="A simple line of the driving route. Not a navigation map."
    >
      <path d={d} fill="none" stroke="#e4b23c" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={x(start[0])} cy={y(start[1])} r="8" fill="#f3eee4" />
      <circle cx={x(end[0])} cy={y(end[1])} r="8" fill="#9a4528" />
    </svg>
  );
}
