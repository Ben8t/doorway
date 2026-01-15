export default function DynamicDesk({ width, height }) {
  const drawerWidth = 30;
  const drawerSpacing = 3;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Desktop */}
      <rect x="5" y="5" width={width - 10} height={height - 10} fill="#A0522D" stroke="#654321" strokeWidth="2" rx="2"/>

      {/* Drawers (left side) */}
      <rect x="10" y={height * 0.17} width={drawerWidth} height={height * 0.21} fill="#8B4513" stroke="#654321" strokeWidth="1" rx="1"/>
      <rect x="10" y={height * 0.42} width={drawerWidth} height={height * 0.21} fill="#8B4513" stroke="#654321" strokeWidth="1" rx="1"/>
      <rect x="10" y={height * 0.67} width={drawerWidth} height={height * 0.16} fill="#8B4513" stroke="#654321" strokeWidth="1" rx="1"/>

      {/* Drawer handles */}
      <circle cx={10 + drawerWidth - 5} cy={height * 0.275} r="1.5" fill="#654321"/>
      <circle cx={10 + drawerWidth - 5} cy={height * 0.525} r="1.5" fill="#654321"/>
      <circle cx={10 + drawerWidth - 5} cy={height * 0.75} r="1.5" fill="#654321"/>
    </svg>
  );
}
