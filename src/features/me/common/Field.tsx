

export function Field({
  label,
  required,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  error?: string;
}) {
  return (
    <div>
      <label className="block text-[14px] font-semibold text-[#0A1B2C]">
        {label} {required && <span style={{ color: "#D64545" }}>*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-md border px-4 h-[46px] text-[15px] text-[#0A1B2C] outline-none focus:border-[#B88A2E] bg-white transition-colors"
        style={{ borderColor: error ? "#D64545" : "#D9D3C4" }}
      />
      {error && (
        <p className="mt-1 text-[12px]" style={{ color: "#D64545" }}>
          {error}
        </p>
      )}
    </div>
  );
}
