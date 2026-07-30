export default function Chargement({ texte = 'Chargement en cours…', pleinEcran = true }) {
  return (
    <div className={pleinEcran ? 'min-h-[50vh] grid place-items-center gap-3 text-gray-500' : 'flex items-center gap-3 text-gray-500'}>
      <span className="h-5 w-5 rounded-full border-[2.5px] border-gray-200 border-t-navy animate-spin" />
      <span>{texte}</span>
    </div>
  );
}
