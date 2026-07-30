const VARIANTES = {
  neutre: 'bg-gray-100 text-gray-500 border border-gray-200',
  navy: 'bg-navy-soft text-navy border border-navy/20',
  or: 'bg-amber-50 text-amber-800 border border-amber-200',
};

export default function Badge({ variante = 'neutre', icone, children }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ${VARIANTES[variante]}`}>
      {icone && <i className={`fa-solid ${icone}`} />}
      {children}
    </span>
  );
}
