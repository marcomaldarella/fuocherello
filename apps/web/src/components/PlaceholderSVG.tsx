interface PlaceholderSVGProps {
  width: number
  height: number
  query?: string
}

export default function PlaceholderSVG({ width, height, query }: PlaceholderSVGProps) {
  const label = query ? `Placeholder image for: ${query}` : "Placeholder image"

  return (
    <svg
      role="img"
      aria-label={label}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width={width} height={height} fill="#e5e7eb" />
      <rect x={0} y={0} width={width} height={height} fill="none" stroke="#d1d5db" />
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fill="#6b7280"
        fontSize={Math.max(12, Math.round(Math.min(width, height) / 18))}
        fontFamily="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial"
      >
        {width}×{height}
      </text>
    </svg>
  )
}

