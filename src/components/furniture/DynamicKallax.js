export default function DynamicKallax({ width, height }) {
  // Calculate number of compartments based on width (~50cm each)
  const compartmentWidth = 50;
  const numCompartments = Math.max(2, Math.floor(width / compartmentWidth));
  const actualCompartmentWidth = (width - 4) / numCompartments;
  const dividerWidth = 4;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer frame */}
      <rect x="2" y="2" width={width - 4} height={height - 4} fill="#E8DCC8" stroke="#C9B896" strokeWidth="2" rx="1"/>

      {/* Vertical dividers */}
      {Array.from({ length: numCompartments - 1 }).map((_, i) => (
        <rect
          key={i}
          x={2 + (i + 1) * actualCompartmentWidth}
          y="2"
          width={dividerWidth}
          height={height - 4}
          fill="#C9B896"
        />
      ))}

      {/* Inner shadows for compartments */}
      {Array.from({ length: numCompartments }).map((_, i) => (
        <rect
          key={i}
          x={6 + i * actualCompartmentWidth}
          y="6"
          width={actualCompartmentWidth - dividerWidth - 4}
          height={height - 12}
          fill="#D4C8B0"
          opacity="0.3"
        />
      ))}
    </svg>
  );
}
