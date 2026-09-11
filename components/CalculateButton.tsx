type CalculateButtonProps = {
  onClick: () => void;
};

export function CalculateButton({ onClick }: CalculateButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-2xl bg-sage-700 px-5 py-3 text-sm font-medium tracking-wide text-white transition-colors hover:bg-sage-800 focus:outline-none focus:ring-2 focus:ring-sage-200 focus:ring-offset-2"
    >
      Calcular huella
    </button>
  );
}
