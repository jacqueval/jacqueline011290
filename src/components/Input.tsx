type Props = {
  type: string;
  placeholder: string;
};

export function Input({ type, placeholder }: Props) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className="
        w-full p-4 rounded-2xl
        bg-black/40 border border-white/20
        text-white text-lg outline-none
        focus:border-purple-500
      "
    />
  );
}
