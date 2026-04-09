export function Slider({ value, onValueChange, min = 0, max = 100, step = 1, className = '' }) {
  const val = Array.isArray(value) ? value[0] : value;
  const percent = ((val - min) / (max - min)) * 100;

  return (
    <div className={`relative flex items-center ${className}`} style={{ height: 20 }}>
      <div className="relative h-2 w-full rounded-full bg-gray-200">
        <div
          className="absolute h-2 rounded-full bg-[#4F7CF3]"
          style={{ width: `${percent}%` }}
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={val}
        onChange={e => onValueChange([Number(e.target.value)])}
        className="absolute w-full opacity-0 cursor-pointer h-2"
        style={{ zIndex: 1 }}
      />
      <div
        className="absolute h-5 w-5 rounded-full border-2 border-[#4F7CF3] bg-white shadow"
        style={{ left: `calc(${percent}% - 10px)`, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
      />
    </div>
  );
}
