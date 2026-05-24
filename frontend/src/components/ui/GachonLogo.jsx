import sometimeLogo from '../../assets/sometime-logo.png';

export function GachonLogo({ size = 36, className = '' }) {
  return (
    <img
      src={sometimeLogo}
      alt="Sometime 로고"
      style={{ width: size, height: size }}
      className={`object-contain ${className}`}
    />
  );
}
