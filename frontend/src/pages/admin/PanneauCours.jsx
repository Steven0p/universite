import { useEffect, useState } from 'react';
import { coursApi, faculteApi } from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import Bouton from '../../components/Bouton.jsx';
import Champ from '../../components/Champ.jsx';
import Alerte from '../../components/Alerte.jsx';
import Chargement from '../../components/Chargement.jsx';

const formVide = (faculteParDefaut) => ({
  faculteId: faculteParDefaut || '',
  code: '',
  nom: '',
  description: '',
  credits: '',
  semestre: '',
  enseignant: '',
});

export default function PanneauCours({ onChange }) {
  const { utilisateur } = useAuth();
  const estResponsable = utilisateur?.role === 'responsable_faculte';

  const [facultes, setFacultes] = useState([]);
  const [cours, setCours] = useState(null);
  const [form, setForm] = useState(formVide(estResponsable ? utilisateur.faculteId : ''));
  const [idEnEdition, setIdEnEdition] = useState(null);
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);

  const charger = () => coursApi.lister(estResponsable ? { faculteId: utilisateur.faculteId } : {}).then(setCours).catch((e) => setErreur(e.message));

  useEffect(() => {
    faculteApi.lister().then(setFacultes).catch((e) => setErreur(e.message));
    charger();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const modifierChamp = (champ) => (e) => setForm((f) => ({ ...f, [champ]: e.target.value }));

  const commencerEdition = (c) => {
    setIdEnEdition(c.id);
    setForm({
      faculteId: c.faculteId,
      code: c.code,
      nom: c.nom,
      description: c.description || '',
      credits: c.credits ?? '',
      semestre: c.semestre || '',
      enseignant: c.enseignant || '',
    });
  };

  const annulerEdition = () => {
    setIdEnEdition(null);
    setForm(formVide(estResponsable ? utilisateur.faculteId : ''));
  };

  const soumettre = async (e) => {
    e.preventDefault();
    setErreur('');
    setChargement(true);
    try {
      const payload = { ...form, credits: form.credits === '' ? 0 : Number(form.credits) };
      if (idEnEdition) {
        await coursApi.modifier(idEnEdition, payload);
      } else {
        await coursApi.creer(payload);
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

  const supprimer = async (c) => {
    if (!confirm(`Supprimer le cours « ${c.nom} » ?`)) return;
    try {
      await coursApi.supprimer(c.id);
      await charger();
      onChange?.();
    } catch (err) {
      setErreur(err.message);
    }
  };

  const nomFaculte = (id) => facultes.find((f) => f.id === id)?.nom || '—';

  return (
    <div className="grid gap-6 md:grid-cols-[1fr_1.6fr] items-start">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
        <h2 className="flex items-center gap-2 text-[17px] font-bold text-gray-900 mb-4">
          <i className="fa-solid fa-book" />
          {idEnEdition ? 'Modifier le cours' : 'Ajouter un cours'}
        </h2>
        {erreur && <Alerte variante="erreur">{erreur}</Alerte>}
        <form onSubmit={soumettre}>
          <Champ
            as="select"
            label="Faculté"
            required
            disabled={estResponsable}
            value={form.faculteId}
            onChange={modifierChamp('faculteId')}
          >
            <option value="">— Choisir une faculté —</option>
            {facultes.map((f) => <option key={f.id} value={f.id}>{f.nom}</option>)}
          </Champ>
          <div className="grid grid-cols-2 gap-x-4">
            <Champ label="Code" required value={form.code} onChange={modifierChamp('code')} placeholder="INFO101" />
            <Champ label="Crédits" type="number" min="0" value={form.credits} onChange={modifierChamp('credits')} placeholder="3" />
          </div>
          <Champ label="Nom du cours" required value={form.nom} onChange={modifierChamp('nom')} placeholder="Introduction à la programmation" />
          <Champ as="textarea" rows={3} label="Description" value={form.description} onChange={modifierChamp('description')} />
          <div className="grid grid-cols-2 gap-x-4">
            <Champ label="Semestre" value={form.semestre} onChange={modifierChamp('semestre')} placeholder="S1" />
            <Champ label="Enseignant" value={form.enseignant} onChange={modifierChamp('enseignant')} placeholder="Nom de l'enseignant" />
          </div>
          <div className="flex items-center gap-3">
            <Bouton type="submit" chargement={chargement}>{idEnEdition ? 'Enregistrer' : 'Créer'}</Bouton>
            {idEnEdition && <Bouton type="button" variante="fantome" onClick={annulerEdition}>Annuler</Bouton>}
          </div>
        </form>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
        <h2 className="flex items-center gap-2 text-[17px] font-bold text-gray-900 mb-4"><i className="fa-solid fa-list" /> Cours existants</h2>
        {!cours && <Chargement pleinEcran={false} />}
        {cours && cours.length === 0 && <p className="text-gray-500">Aucun cours pour l'instant.</p>}
        {cours && cours.length > 0 && (
          <div className="overflow-x-auto border border-gray-200 rounded-2xl">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="bg-gray-50 text-gray-500 font-semibold text-xs uppercase tracking-wide text-left px-4 py-3">Code</th>
                  <th className="bg-gray-50 text-gray-500 font-semibold text-xs uppercase tracking-wide text-left px-4 py-3">Nom</th>
                  {!estResponsable && <th className="bg-gray-50 text-gray-500 font-semibold text-xs uppercase tracking-wide text-left px-4 py-3">Faculté</th>}
                  <th className="bg-gray-50 text-gray-500 font-semibold text-xs uppercase tracking-wide text-left px-4 py-3">Semestre</th>
                  <th className="bg-gray-50 px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {cours.map((c) => (
                  <tr key={c.id} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3">{c.code}</td>
                    <td className="px-4 py-3">{c.nom}</td>
                    {!estResponsable && <td className="px-4 py-3 text-gray-500">{c.Faculte?.nom || nomFaculte(c.faculteId)}</td>}
                    <td className="px-4 py-3 text-gray-500">{c.semestre || '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5 justify-end">
                        <Bouton taille="sm" variante="secondaire" onClick={() => commencerEdition(c)}>
                          <i className="fa-solid fa-pen" />
                        </Bouton>
                        <Bouton taille="sm" variante="rouge" onClick={() => supprimer(c)}>
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
