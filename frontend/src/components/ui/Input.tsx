import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

type InputProps = {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  showPassword?: boolean;
  autoComplete?: string;
};

function Input({
  id,
  label,
  type,
  placeholder,
  value,
  onChange,
  error,
  showPassword,
  autoComplete
}: InputProps) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <label
        htmlFor={id}
        className="mb-2 text-slate-900 font-medium text-sm block"
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={showPassword && show ? "text" : type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        className="px-3 py-2.5 text-sm text-slate-900 rounded-md bg-white w-full outline-1 -outline-offset-1 outline-slate-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600"
      />
      {showPassword && (
        <button
          type="button"
          className="absolute top-1/2 right-0 flex items-center justify-center px-3 text-slate-500 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md"
          onClick={() => setShow(!show)}
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <Eye /> : <EyeOff />}
        </button>
      )}

      {error && <p className="mt-1 text-sm text-red-800">{error}</p>}
    </div>
  );
}
export default Input;
