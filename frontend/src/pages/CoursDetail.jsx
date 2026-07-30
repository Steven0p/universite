import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { coursApi } from '../services/api.js';
import Chargement from '../components/Chargement.jsx';
import Alerte from '../components/Alerte.jsx';

export default function CoursDetail() {
  const { id } = useParams();
  const [cours, setCours] = useState(null);
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    setCours(null);
    setErreur('');
    coursApi.obtenir(id).then(setCours).catch((e) => setErreur(e.message));
  }, [id]);

  if (erreur) return <Alerte variante="erreur">{erreur}</Alerte>;
  if (!cours) return <Chargement texte="Chargement du cours…" />;

  const faculte = cours.Faculte;

  return (
    <div>
      <p className="text-sm text-gray-500 mb-4">
        <Link to="/" className="font-semibold hover:text-navy">Accueil</Link>
        {faculte && <> / <Link to={`/facultes/${faculte.id}`} className="font-semibold hover:text-navy">{faculte.nom}</Link></>}
        {' '}/ {cours.nom}
      </p>

      <div className="mb-7">
        <span className="inline-flex items-center gap-1 rounded-full bg-navy-soft text-navy font-bold text-xs px-2.5 py-1">
          {cours.code}
        </span>
        <h1 className="text-2xl font-extrabold tracking-tight mt-2.5">{cours.nom}</h1>
      </div>

      <dl className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 max-w-xl">
        {faculte && (
          <>
            <dt className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-1">Faculté</dt>
            <dd className="mb-4"><Link to={`/facultes/${faculte.id}`} className="text-navy font-semibold hover:underline">{faculte.nom}</Link></dd>
          </>
        )}
        <dt className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-1">Description</dt>
        <dd className="mb-4">{cours.description || 'Aucune description fournie.'}</dd>
        <dt className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-1">Crédits</dt>
        <dd className="mb-4">{cours.credits}</dd>
        <dt className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-1">Semestre</dt>
        <dd className="mb-4">{cours.semestre || 'Non précisé'}</dd>
        <dt className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-1">Enseignant</dt>
        <dd>{cours.enseignant || 'Non précisé'}</dd>
      </dl>
    </div>
  );
}
