import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { faculteApi, coursApi } from '../../services/api.js';
import Bouton from '../../components/Bouton.jsx';
import PanneauFacultes from './PanneauFacultes.jsx';
import PanneauCours from './PanneauCours.jsx';

export default function Dashboard() {
  const { utilisateur, logout } = useAuth();
  const navigate = useNavigate();
  const estAdmin = utilisateur.role === 'admin_general';
  const [onglet, setOnglet] = useState(estAdmin ? 'facultes' : 'cours');
  const [stats, setStats] = useState({ facultes: null, cours: null });

  const chargerStats = () => {
    faculteApi.lister().then((f) => setStats((s) => ({ ...s, facultes: f.length }))).catch(() => {});
    coursApi.lister(estAdmin ? {} : { faculteId: utilisateur.faculteId })
      .then((c) => setStats((s) => ({ ...s, cours: c.length }))).catch(() => {});
  };

  useEffect(() => { chargerStats(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const seDeconnecter = () => {
    logout();
    navigate('/');
  };

  const ongletClasse = (nom) =>
    `inline-flex items-center gap-2 px-4 py-2.5 font-semibold border-b-2 -mb-px ${
      onglet === nom ? 'text-navy border-navy' : 'text-gray-500 border-transparent hover:text-gray-900'
    }`;

  return (
    <div>
      <div className="rounded-2xl bg-gradient-to-br from-navy to-[#0a2740] text-white p-8 mb-7">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-extrabold">Bonjour, {utilisateur.nom}</h1>
            <p className="mt-1.5 text-slate-200">
              {estAdmin ? 'Administrateur général' : 'Responsable de faculté'} —
              gérez {estAdmin ? 'les facultés et les cours' : 'les cours de votre faculté'} de la plateforme.
            </p>
          </div>
          <Bouton variante="secondaire" onClick={seDeconnecter} icone="fa-right-from-bracket">
            Déconnexion
          </Bouton>
        </div>
        <div className="flex flex-wrap gap-3 mt-5">
          {estAdmin && (
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-2 text-sm text-slate-200">
              <i className="fa-solid fa-building-columns" /> <strong className="text-white font-extrabold">{stats.facultes ?? '…'}</strong> facultés
            </span>
          )}
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-2 text-sm text-slate-200">
            <i className="fa-solid fa-book" /> <strong className="text-white font-extrabold">{stats.cours ?? '…'}</strong> cours
          </span>
        </div>
      </div>

      <div className="flex gap-1 mb-7 border-b border-gray-200">
        {estAdmin && (
          <button className={ongletClasse('facultes')} onClick={() => setOnglet('facultes')}>
            <i className="fa-solid fa-building-columns" /> Facultés
          </button>
        )}
        <button className={ongletClasse('cours')} onClick={() => setOnglet('cours')}>
          <i className="fa-solid fa-book" /> Cours
        </button>
      </div>

      {onglet === 'facultes' && estAdmin && <PanneauFacultes onChange={chargerStats} />}
      {onglet === 'cours' && <PanneauCours onChange={chargerStats} />}
    </div>
  );
}
