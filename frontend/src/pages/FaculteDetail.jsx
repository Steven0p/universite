import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { faculteApi } from '../services/api.js';
import Chargement from '../components/Chargement.jsx';
import Alerte from '../components/Alerte.jsx';

export default function FaculteDetail() {
  const { id } = useParams();
  const [faculte, setFaculte] = useState(null);
  const [cours, setCours] = useState(null);
  const [erreur, setErreur] = useState('');
  const [recherche, setRecherche] = useState('');

  useEffect(() => {
    setFaculte(null);
    setCours(null);
    setErreur('');
    Promise.all([faculteApi.obtenir(id), faculteApi.coursDe(id)])
      .then(([f, c]) => { setFaculte(f); setCours(c); })
      .catch((e) => setErreur(e.message));
  }, [id]);

  const coursFiltres = useMemo(() => {
    if (!cours) return [];
    const q = recherche.trim().toLowerCase();
    if (!q) return cours;
    return cours.filter((c) => c.nom.toLowerCase().includes(q) || c.code.toLowerCase().includes(q));
  }, [cours, recherche]);

  if (erreur) return <Alerte variante="erreur">{erreur}</Alerte>;
  if (!faculte || !cours) return <Chargement texte="Chargement de la faculté…" />;

  return (
    <div>
      <p className="text-sm text-gray-500 mb-4">
        <Link to="/" className="font-semibold hover:text-navy">Accueil</Link> / {faculte.nom}
      </p>

      <div className="flex flex-col md:flex-row items-center md:items-center text-center md:text-left gap-5 mb-8">
        <span className="h-16 w-16 rounded-xl bg-navy-soft text-navy grid place-items-center text-3xl shrink-0">
          <i className="fa-solid fa-building-columns" />
        </span>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">{faculte.nom}</h1>
          {faculte.doyen && <p className="text-sm text-gray-500 mt-1"><i className="fa-solid fa-user-tie" /> {faculte.doyen}</p>}
        </div>
      </div>

      {faculte.description && <p className="text-gray-500 max-w-[70ch] mb-8">{faculte.description}</p>}

      <h2 className="text-xl font-bold mb-5">Cours proposés ({cours.length})</h2>

      <div className="mb-7">
        <div className="relative max-w-md">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="search"
            placeholder="Rechercher un cours par nom ou code…"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white pl-10 pr-3.5 py-3 text-sm focus:outline-none focus:border-navy focus:ring-3 focus:ring-navy/15"
          />
        </div>
      </div>

      {coursFiltres.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <i className="fa-solid fa-book text-3xl text-gray-200 block mb-3" />
          <p>Aucun cours ne correspond à votre recherche.</p>
        </div>
      )}

      {coursFiltres.length > 0 && (
        <div className="grid gap-5 grid-cols-[repeat(auto-fill,minmax(260px,1fr))]">
          {coursFiltres.map((c) => (
            <Link
              key={c.id}
              to={`/cours/${c.id}`}
              className="flex flex-col gap-2.5 bg-white border border-gray-200 rounded-2xl shadow-sm p-6 no-underline transition hover:-translate-y-1 hover:shadow-lg hover:border-navy"
            >
              <span className="self-start inline-flex items-center gap-1 rounded-full bg-navy-soft text-navy font-bold text-xs px-2.5 py-1">
                {c.code}
              </span>
              <h3 className="text-base font-bold text-navy">{c.nom}</h3>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-gray-500">
                {c.semestre && <span><i className="fa-solid fa-calendar" /> {c.semestre}</span>}
                <span><i className="fa-solid fa-star" /> {c.credits} crédits</span>
                {c.enseignant && <span><i className="fa-solid fa-chalkboard-user" /> {c.enseignant}</span>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
