type ActivityInputProps = {
  value: string;
  onChange: (value: string) => void;
};

export function ActivityInput({
  value,
  onChange,
}: ActivityInputProps) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium text-stone-600">
        Actividades del día
      </span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={5}
        placeholder='Ej. "Hoy comí carne y viajé 20km en bus"'
        className="w-full resize-y rounded-2xl border border-stone-200 bg-white px-4 py-3 text-base leading-relaxed text-stone-800 outline-none placeholder:text-stone-400 focus:border-sage-400 focus:ring-2 focus:ring-sage-100"
      />
    </label>
  );
}
