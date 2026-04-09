export function GachonLogo({ size = 36, className = '' }) {
  return (
    <img
      src="/src/assets/gachon-logo.jpg"
      alt="가천대학교 로고"
      style={{ width: size, height: size }}
      className={`object-contain ${className}`}
    />
  );
}
