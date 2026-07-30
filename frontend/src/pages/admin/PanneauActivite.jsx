import { useEffect, useState } from 'react';
import { activiteApi } from '../../services/api.js';
import Alerte from '../../components/Alerte.jsx';
import Chargement from '../../components/Chargement.jsx';

const ICONES_RESSOURCE = {
  faculte: 'fa-building-columns',
  cours: 'fa-book',
  utilisateur: 'fa-user',
};

const CONFIG_ACTION = {
  creation: { label: 'a créé', classes: 'bg-green-50 text-green-700 border-green-200' },
  modification: { label: 'a modifié', classes: 'bg-navy-soft text-navy border-navy/20' },
  suppression: { label: 'a supprimé', classes: 'bg-red-50 text-red-700 border-red-200' },
};

const formaterDate = (iso) => new Date(iso).toLocaleString('fr-FR', {
  day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
});

export default function PanneauActivite({ limite = 100 }) {
  const [activites, setActivites] = useState(null);
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    activiteApi.lister(limite).then(setActivites).catch((e) => setErreur(e.message));
  }, [limite]);

  if (erreur) return <Alerte variante="erreur">{erreur}</Alerte>;
  if (!activites) return <Chargement pleinEcran={false} texte="Chargement de l'activité…" />;

  if (activites.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <i className="fa-solid fa-clock-rotate-left text-3xl text-gray-200 block mb-3" />
        <p>Aucune activité enregistrée pour l'instant.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
      <h2 className="flex items-center gap-2 text-[17px] font-bold text-gray-900 mb-5">
        <i className="fa-solid fa-clock-rotate-left" /> Journal d'activité
      </h2>
      <ul className="flex flex-col divide-y divide-gray-100">
        {activites.map((a) => {
          const config = CONFIG_ACTION[a.action];
          return (
            <li key={a.id} className="flex items-start gap-3 py-3.5">
              <span className={`shrink-0 h-9 w-9 rounded-full border grid place-items-center ${config.classes}`}>
                <i className={`fa-solid ${ICONES_RESSOURCE[a.ressource]}`} />
              </span>
              <div className="min-w-0">
                <p className="text-sm text-gray-900">
                  <strong className="font-semibold">{a.utilisateurNom}</strong>{' '}
                  <span className={`inline-block px-1.5 py-0.5 rounded text-xs font-semibold ${config.classes} border-0`}>{config.label}</span>{' '}
                  {a.ressource === 'faculte' && 'la faculté'}
                  {a.ressource === 'cours' && 'le cours'}
                  {a.ressource === 'utilisateur' && "l'utilisateur"}{' '}
                  <span className="font-medium">« {a.libelle} »</span>
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{formaterDate(a.createdAt)}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
