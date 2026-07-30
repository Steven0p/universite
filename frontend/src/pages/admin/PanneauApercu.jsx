import { useEffect, useState } from 'react';
import { faculteApi, coursApi, utilisateurApi, activiteApi } from '../../services/api.js';
import Chargement from '../../components/Chargement.jsx';

const ICONES_RESSOURCE = { faculte: 'fa-building-columns', cours: 'fa-book', utilisateur: 'fa-user' };
const LABEL_ACTION = { creation: 'a créé', modification: 'a modifié', suppression: 'a supprimé' };

const formaterDate = (iso) => new Date(iso).toLocaleString('fr-FR', {
  day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
});

export default function PanneauApercu({ onVoirActivite }) {
  const [donnees, setDonnees] = useState(null);

  useEffect(() => {
    Promise.all([faculteApi.lister(), coursApi.lister(), utilisateurApi.lister(), activiteApi.lister(5)])
      .then(([facultes, cours, utilisateurs, activites]) => setDonnees({ facultes, cours, utilisateurs, activites }))
      .catch(() => setDonnees({ facultes: [], cours: [], utilisateurs: [], activites: [] }));
  }, []);

  if (!donnees) return <Chargement pleinEcran={false} texte="Chargement de l'aperçu…" />;

  const { facultes, cours, utilisateurs, activites } = donnees;

  const coursParFaculte = facultes.map((f) => ({
    nom: f.nom,
    total: cours.filter((c) => c.faculteId === f.id).length,
  })).sort((a, b) => b.total - a.total);
  const maxCours = Math.max(1, ...coursParFaculte.map((f) => f.total));

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-5 grid-cols-2 md:grid-cols-4">
        {[
          { label: 'Facultés', valeur: facultes.length, icone: 'fa-building-columns' },
          { label: 'Cours', valeur: cours.length, icone: 'fa-book' },
          { label: 'Comptes', valeur: utilisateurs.length, icone: 'fa-users' },
          { label: 'Admins', valeur: utilisateurs.filter((u) => u.role === 'admin_general').length, icone: 'fa-user-shield' },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
            <span className="h-10 w-10 rounded-lg bg-navy-soft text-navy grid place-items-center mb-3">
              <i className={`fa-solid ${s.icone}`} />
            </span>
            <p className="text-2xl font-extrabold text-gray-900">{s.valeur}</p>
            <p className="text-sm text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <h2 className="flex items-center gap-2 text-[17px] font-bold text-gray-900 mb-4">
            <i className="fa-solid fa-chart-simple" /> Cours par faculté
          </h2>
          {coursParFaculte.length === 0 && <p className="text-gray-500 text-sm">Aucune faculté pour l'instant.</p>}
          <div className="flex flex-col gap-3">
            {coursParFaculte.map((f) => (
              <div key={f.nom}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-700">{f.nom}</span>
                  <span className="font-semibold text-gray-900">{f.total}</span>
                </div>
                <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full bg-navy rounded-full" style={{ width: `${(f.total / maxCours) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="flex items-center gap-2 text-[17px] font-bold text-gray-900">
              <i className="fa-solid fa-clock-rotate-left" /> Activité récente
            </h2>
            {onVoirActivite && (
              <button onClick={onVoirActivite} className="text-sm font-semibold text-navy hover:underline">
                Voir tout
              </button>
            )}
          </div>
          {activites.length === 0 && <p className="text-gray-500 text-sm">Aucune activité pour l'instant.</p>}
          <ul className="flex flex-col divide-y divide-gray-100">
            {activites.map((a) => (
              <li key={a.id} className="flex items-start gap-3 py-3 first:pt-0">
                <span className="shrink-0 h-8 w-8 rounded-full bg-gray-100 text-gray-500 grid place-items-center">
                  <i className={`fa-solid ${ICONES_RESSOURCE[a.ressource]} text-xs`} />
                </span>
                <div className="min-w-0">
                  <p className="text-sm text-gray-700">
                    <strong className="font-semibold text-gray-900">{a.utilisateurNom}</strong> {LABEL_ACTION[a.action]}{' '}
                    <span className="font-medium">« {a.libelle} »</span>
                  </p>
                  <p className="text-xs text-gray-400">{formaterDate(a.createdAt)}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
