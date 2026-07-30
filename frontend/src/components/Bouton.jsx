const VARIANTES = {
  primaire: 'bg-navy text-white hover:bg-navy-hover',
  secondaire: 'bg-white text-navy border border-gray-200 hover:border-navy hover:bg-navy-soft',
  fantome: 'bg-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-100',
  rouge: 'bg-red-600 text-white hover:bg-red-700',
  or: 'bg-or text-[#241a05] hover:bg-or-hover',
};

export default function Bouton({
  variante = 'primaire',
  taille,
  bloc = false,
  icone,
  chargement = false,
  children,
  className = '',
  ...props
}) {
  const classes = [
    'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition active:translate-y-px disabled:opacity-60 disabled:cursor-not-allowed',
    taille === 'sm' ? 'px-3 py-1.5 text-[13px]' : 'px-5 py-2.5 text-sm',
    VARIANTES[variante],
    bloc ? 'w-full' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button className={classes} disabled={chargement || props.disabled} {...props}>
      {chargement ? (
        <span className="h-4 w-4 rounded-full border-2 border-current/30 border-t-current animate-spin" />
      ) : icone ? (
        <i className={`fa-solid ${icone}`} />
      ) : null}
      {children}
    </button>
  );
}
