export default function DynamicTable({ width, height }) {
  // Legs at corners based on actual size
  const legInset = Math.min(10, width * 0.1);
  const legRadius = 4;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Table top */}
      <rect x="5" y="5" width={width - 10} height={height - 10} fill="#A0522D" stroke="#654321" strokeWidth="2" rx="3"/>

      {/* Table legs at corners */}
      <circle cx={legInset} cy={legInset} r={legRadius} fill="#654321"/>
      <circle cx={width - legInset} cy={legInset} r={legRadius} fill="#654321"/>
      <circle cx={legInset} cy={height - legInset} r={legRadius} fill="#654321"/>
      <circle cx={width - legInset} cy={height - legInset} r={legRadius} fill="#654321"/>
    </svg>
  );
}
