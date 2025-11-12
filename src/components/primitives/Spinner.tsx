const bars = Array(12).fill(0);

export function Spinner() {
  return (
    <div className="size-5">
      <div className="relative top-1/2 left-1/2 size-5">
        {bars.map((_, i) => (
          <div
            className="spinner-bar absolute h-[8%] w-[24%] left-[-10%] top-[-3.9%] rounded-md bg-gray-12 animate-[spin_1.2s_linear_infinite]"
            key={`spinner-bar-${i}`}
          />
        ))}
      </div>
    </div>
  );
}
