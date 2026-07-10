// フェーズK-3｜実写LINKAアバター（テナント色リング＝--color-primary）
// 画像＝/public/linka/linka-512.webp（設計書§7・配置済）。
export function LinkaAvatar({ size = 32, talking = false }: { size?: number; talking?: boolean }) {
  return (
    <span className="relative inline-block flex-shrink-0" style={{ width: size, height: size }}>
      <img
        src="/linka/linka-512.webp"
        alt="LINKA"
        width={size}
        height={size}
        className="rounded-full object-cover ring-2 ring-primary"
        style={{ width: size, height: size }}
      />
      {talking && (
        <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-primary" />
        </span>
      )}
    </span>
  );
}
