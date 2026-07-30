const CONFIG = {
  erreur: { classes: 'bg-red-50 text-red-700 border border-red-200', icone: 'fa-circle-exclamation' },
  succes: { classes: 'bg-green-50 text-green-700 border border-green-200', icone: 'fa-circle-check' },
  info: { classes: 'bg-navy-soft text-navy border border-navy/20', icone: 'fa-circle-info' },
};

export default function Alerte({ variante = 'info', children }) {
  const { classes, icone } = CONFIG[variante];
  return (
    <div className={`flex items-start gap-2.5 rounded-lg px-3.5 py-3 text-sm mb-4 ${classes}`}>
      <i className={`fa-solid ${icone} mt-0.5`} />
      <span>{children}</span>
    </div>
  );
}
