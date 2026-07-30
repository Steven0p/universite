import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import Bouton from '../../components/Bouton.jsx';
import Champ from '../../components/Champ.jsx';
import Alerte from '../../components/Alerte.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);

  const soumettre = async (e) => {
    e.preventDefault();
    setErreur('');
    setChargement(true);
    try {
      await login(email, motDePasse);
      navigate('/admin/dashboard');
    } catch (err) {
      setErreur(err.message);
    } finally {
      setChargement(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center p-6 bg-gradient-to-br from-navy to-[#0a2740]">
      <form className="w-full max-w-md bg-white rounded-2xl shadow-xl p-10" onSubmit={soumettre}>
        <span className="mx-auto mb-5 h-14 w-14 rounded-2xl bg-navy-soft text-navy grid place-items-center text-2xl">
          <i className="fa-solid fa-user-shield" />
        </span>
        <h2 className="text-2xl font-bold text-center text-gray-900">Espace administration</h2>
        <p className="text-gray-500 text-center mt-1.5 mb-7 text-sm">Connectez-vous pour gérer les facultés et les cours.</p>

        {erreur && <Alerte variante="erreur">{erreur}</Alerte>}

        <Champ
          label="Adresse e-mail"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@universite.test"
        />
        <Champ
          label="Mot de passe"
          type="password"
          required
          value={motDePasse}
          onChange={(e) => setMotDePasse(e.target.value)}
          placeholder="••••••••"
        />

        <Bouton type="submit" bloc chargement={chargement}>Se connecter</Bouton>

        <p className="text-center text-gray-500 mt-6 text-sm">
          <Link to="/" className="font-semibold hover:text-navy"><i className="fa-solid fa-arrow-left" /> Retour au site public</Link>
        </p>
      </form>
    </div>
  );
}
