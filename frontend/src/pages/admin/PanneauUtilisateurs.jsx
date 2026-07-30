import { useEffect, useState } from 'react';
import { utilisateurApi, faculteApi } from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import Bouton from '../../components/Bouton.jsx';
import Champ from '../../components/Champ.jsx';
import Badge from '../../components/Badge.jsx';
import Alerte from '../../components/Alerte.jsx';
import Chargement from '../../components/Chargement.jsx';

const FORM_VIDE = { nom: '', email: '', motDePasse: '', role: 'responsable_faculte', faculteId: '' };

export default function PanneauUtilisateurs({ onChange }) {
  const { utilisateur: moi } = useAuth();
  const [utilisateurs, setUtilisateurs] = useState(null);
  const [facultes, setFacultes] = useState([]);
  const [form, setForm] = useState(FORM_VIDE);
  const [idEnEdition, setIdEnEdition] = useState(null);
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);

  const charger = () => utilisateurApi.lister().then(setUtilisateurs).catch((e) => setErreur(e.message));

  useEffect(() => {
    faculteApi.lister().then(setFacultes).catch((e) => setErreur(e.message));
    charger();
  }, []);

  const modifierChamp = (champ) => (e) => setForm((f) => ({ ...f, [champ]: e.target.value }));

  const commencerEdition = (u) => {
    setIdEnEdition(u.id);
    setForm({ nom: u.nom, email: u.email, motDePasse: '', role: u.role, faculteId: u.faculteId || '' });
  };

  const annulerEdition = () => {
    setIdEnEdition(null);
    setForm(FORM_VIDE);
  };

  const soumettre = async (e) => {
    e.preventDefault();
    setErreur('');
    setChargement(true);
    try {
      const payload = { ...form };
      if (idEnEdition && !payload.motDePasse) delete payload.motDePasse;
      if (idEnEdition) {
        await utilisateurApi.modifier(idEnEdition, payload);
      } else {
        await utilisateurApi.creer(payload);
      }
      annulerEdition();
      await charger();
      onChange?.();
    } catch (err) {
      setErreur(err.message);
    } finally {
      setChargement(false);
    }
  };

  const supprimer = async (u) => {
    if (!confirm(`Supprimer le compte de « ${u.nom} » ?`)) return;
    try {
      await utilisateurApi.supprimer(u.id);
      await charger();
      onChange?.();
    } catch (err) {
      setErreur(err.message);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-[1fr_1.6fr] items-start">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
        <h2 className="flex items-center gap-2 text-[17px] font-bold text-gray-900 mb-4">
          <i className="fa-solid fa-users-gear" />
          {idEnEdition ? "Modifier l'utilisateur" : 'Ajouter un utilisateur'}
        </h2>
        {erreur && <Alerte variante="erreur">{erreur}</Alerte>}
        <form onSubmit={soumettre}>
          <Champ label="Nom complet" required value={form.nom} onChange={modifierChamp('nom')} placeholder="Marie Louise" />
          <Champ label="E-mail" type="email" required value={form.email} onChange={modifierChamp('email')} placeholder="nom@universite.test" />
          <Champ
            label={idEnEdition ? 'Nouveau mot de passe (optionnel)' : 'Mot de passe'}
            type="password"
            required={!idEnEdition}
            value={form.motDePasse}
            onChange={modifierChamp('motDePasse')}
            placeholder={idEnEdition ? 'Laisser vide pour ne pas changer' : 'Au moins 8 caractères'}
          />
          <Champ as="select" label="Rôle" required value={form.role} onChange={modifierChamp('role')}>
            <option value="responsable_faculte">Responsable de faculté</option>
            <option value="admin_general">Administrateur général</option>
          </Champ>
          {form.role === 'responsable_faculte' && (
            <Champ as="select" label="Faculté" required value={form.faculteId} onChange={modifierChamp('faculteId')}>
              <option value="">— Choisir une faculté —</option>
              {facultes.map((f) => <option key={f.id} value={f.id}>{f.nom}</option>)}
            </Champ>
          )}
          <div className="flex items-center gap-3">
            <Bouton type="submit" chargement={chargement}>{idEnEdition ? 'Enregistrer' : 'Créer'}</Bouton>
            {idEnEdition && <Bouton type="button" variante="fantome" onClick={annulerEdition}>Annuler</Bouton>}
          </div>
        </form>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
        <h2 className="flex items-center gap-2 text-[17px] font-bold text-gray-900 mb-4"><i className="fa-solid fa-list" /> Comptes existants</h2>
        {!utilisateurs && <Chargement pleinEcran={false} />}
        {utilisateurs && utilisateurs.length === 0 && <p className="text-gray-500">Aucun utilisateur pour l'instant.</p>}
        {utilisateurs && utilisateurs.length > 0 && (
          <div className="overflow-x-auto border border-gray-200 rounded-2xl">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="bg-gray-50 text-gray-500 font-semibold text-xs uppercase tracking-wide text-left px-4 py-3">Nom</th>
                  <th className="bg-gray-50 text-gray-500 font-semibold text-xs uppercase tracking-wide text-left px-4 py-3">E-mail</th>
                  <th className="bg-gray-50 text-gray-500 font-semibold text-xs uppercase tracking-wide text-left px-4 py-3">Rôle</th>
                  <th className="bg-gray-50 px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {utilisateurs.map((u) => (
                  <tr key={u.id} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3">{u.nom}{u.id === moi.id && <span className="text-gray-400"> (vous)</span>}</td>
                    <td className="px-4 py-3 text-gray-500">{u.email}</td>
                    <td className="px-4 py-3">
                      {u.role === 'admin_general' ? (
                        <Badge variante="or" icone="fa-user-shield">Admin général</Badge>
                      ) : (
                        <Badge variante="navy" icone="fa-user-tie">{u.Faculte?.nom || 'Responsable'}</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5 justify-end">
                        <Bouton taille="sm" variante="secondaire" onClick={() => commencerEdition(u)}>
                          <i className="fa-solid fa-pen" />
                        </Bouton>
                        <Bouton taille="sm" variante="rouge" onClick={() => supprimer(u)} disabled={u.id === moi.id}>
                          <i className="fa-solid fa-trash" />
                        </Bouton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
