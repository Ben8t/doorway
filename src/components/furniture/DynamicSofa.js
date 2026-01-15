export default function DynamicSofa({ width, height }) {
  // Calculate number of cushions based on width (each cushion ~60cm)
  const cushionWidth = 60;
  const numCushions = Math.max(2, Math.floor(width / cushionWidth));
  const actualCushionWidth = (width - 20) / numCushions;

  const armrestWidth = 10;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Main body */}
      <rect x={armrestWidth} y={height * 0.125} width={width - armrestWidth * 2} height={height * 0.75} fill="#4A5568" stroke="#2D3748" strokeWidth="2" rx="4"/>

      {/* Left armrest */}
      <rect x={armrestWidth * 0.5} y={height * 0.1} width={armrestWidth} height={height * 0.8} fill="#2D3748" stroke="#1A202C" strokeWidth="1" rx="2"/>

      {/* Right armrest */}
      <rect x={width - armrestWidth * 1.5} y={height * 0.1} width={armrestWidth} height={height * 0.8} fill="#2D3748" stroke="#1A202C" strokeWidth="1" rx="2"/>

      {/* Cushions */}
      {Array.from({ length: numCushions }).map((_, i) => (
        <rect
          key={i}
          x={armrestWidth + 5 + i * actualCushionWidth}
          y={height * 0.225}
          width={actualCushionWidth - 3}
          height={height * 0.55}
          fill="#718096"
          stroke="#4A5568"
          strokeWidth="1"
          rx="2"
        />
      ))}
    </svg>
  );
}
