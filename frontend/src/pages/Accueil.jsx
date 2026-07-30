import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { faculteApi } from '../services/api.js';
import Chargement from '../components/Chargement.jsx';
import Alerte from '../components/Alerte.jsx';

export default function Accueil() {
  const [facultes, setFacultes] = useState(null);
  const [erreur, setErreur] = useState('');
  const [recherche, setRecherche] = useState('');

  useEffect(() => {
    faculteApi.lister().then(setFacultes).catch((e) => setErreur(e.message));
  }, []);

  const facultesFiltrees = useMemo(() => {
    if (!facultes) return [];
    const q = recherche.trim().toLowerCase();
    if (!q) return facultes;
    return facultes.filter((f) => f.nom.toLowerCase().includes(q));
  }, [facultes, recherche]);

  return (
    <div>
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-navy to-[#0a2740] text-white px-6 py-14 md:px-10 mb-10">
        <div className="relative z-10 max-w-xl">
          <h1 className="text-3xl md:text-[2.5rem] font-extrabold tracking-tight leading-tight">
            Toutes les facultés de l'université, un seul portail
          </h1>
          <p className="mt-4 text-lg text-slate-200 max-w-[54ch]">
            Consultez la présentation de chaque faculté et la liste complète de ses cours :
            code, crédits, semestre et enseignant.
          </p>
          <p className="mt-6 text-sm text-slate-300">
            <i className="fa-solid fa-circle-info" /> Les noms de l'université et des facultés seront
            complétés au fur et à mesure de leur communication.
          </p>
        </div>
      </section>

      <div className="mb-7">
        <div className="relative max-w-md">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="search"
            placeholder="Rechercher une faculté…"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white pl-10 pr-3.5 py-3 text-sm focus:outline-none focus:border-navy focus:ring-3 focus:ring-navy/15"
          />
        </div>
      </div>

      {erreur && <Alerte variante="erreur">{erreur}</Alerte>}

      {!facultes && !erreur && <Chargement texte="Chargement des facultés…" pleinEcran={false} />}

      {facultes && facultesFiltrees.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <i className="fa-solid fa-building-columns text-3xl text-gray-200 block mb-3" />
          <p>Aucune faculté ne correspond à votre recherche.</p>
        </div>
      )}

      {facultesFiltrees.length > 0 && (
        <div className="grid gap-5 grid-cols-[repeat(auto-fill,minmax(260px,1fr))]">
          {facultesFiltrees.map((f) => (
            <Link
              key={f.id}
              to={`/facultes/${f.id}`}
              className="flex flex-col gap-3.5 bg-white border border-gray-200 rounded-2xl shadow-sm p-6 no-underline transition hover:-translate-y-1 hover:shadow-lg hover:border-navy"
            >
              <span className="h-14 w-14 rounded-xl bg-navy-soft text-navy grid place-items-center text-2xl">
                <i className="fa-solid fa-building-columns" />
              </span>
              <h3 className="text-lg font-bold text-navy">{f.nom}</h3>
              {f.description && <p className="text-gray-500 text-[15px]">{f.description}</p>}
              {f.doyen && (
                <div className="mt-auto flex items-center justify-between text-sm text-gray-500">
                  <span><i className="fa-solid fa-user-tie" /> {f.doyen}</span>
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
