export default function Champ({ label, erreur, as = 'input', className = '', children, ...props }) {
  const Balise = as;
  const classesChamp = [
    'w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900',
    'transition focus:outline-none focus:border-navy focus:bg-white focus:ring-3 focus:ring-navy/15',
    'disabled:opacity-60 disabled:cursor-not-allowed',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className="flex flex-col gap-1.5 mb-4">
      {label && <label className="text-sm font-semibold text-gray-900">{label}</label>}
      {as === 'select' ? (
        <select className={classesChamp} {...props}>{children}</select>
      ) : (
        <Balise className={classesChamp} {...props} />
      )}
      {erreur && <span className="text-[13px] text-red-700">{erreur}</span>}
    </div>
  );
}
