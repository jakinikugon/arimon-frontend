interface BorderProps {
  color: string;
  children: React.ReactNode;
}

export function Marker({ color, children }: BorderProps) {
  return (
    <span
      className="marker"
      style={{
        background: `linear-gradient(transparent 50%, ${color} 50%)`,
      }}
    >
      {children}
    </span>
  );
}
