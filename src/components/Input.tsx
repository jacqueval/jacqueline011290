type Props = {
  type: string;
  placeholder: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

export function Input({ type, placeholder, value, onChange, onKeyPress }: Props) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onKeyPress={onKeyPress}
      className="
        w-full p-4 rounded-2xl
        bg-black/40 border border-white/20
        text-white text-lg outline-none
        focus:border-purple-500
      "
    />
  );
}
