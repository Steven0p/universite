import { useEffect, useState } from 'react';
import { faculteApi } from '../../services/api.js';
import Bouton from '../../components/Bouton.jsx';
import Champ from '../../components/Champ.jsx';
import Alerte from '../../components/Alerte.jsx';
import Chargement from '../../components/Chargement.jsx';

const FORM_VIDE = { nom: '', description: '', doyen: '', image: '' };

export default function PanneauFacultes({ onChange }) {
  const [facultes, setFacultes] = useState(null);
  const [form, setForm] = useState(FORM_VIDE);
  const [idEnEdition, setIdEnEdition] = useState(null);
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);

  const charger = () => faculteApi.lister().then(setFacultes).catch((e) => setErreur(e.message));

  useEffect(() => { charger(); }, []);

  const modifierChamp = (champ) => (e) => setForm((f) => ({ ...f, [champ]: e.target.value }));

  const commencerEdition = (f) => {
    setIdEnEdition(f.id);
    setForm({ nom: f.nom, description: f.description || '', doyen: f.doyen || '', image: f.image || '' });
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
      if (idEnEdition) {
        await faculteApi.modifier(idEnEdition, form);
      } else {
        await faculteApi.creer(form);
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

  const supprimer = async (f) => {
    if (!confirm(`Supprimer la faculté « ${f.nom} » et tous ses cours ?`)) return;
    try {
      await faculteApi.supprimer(f.id);
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
          <i className="fa-solid fa-building-columns" />
          {idEnEdition ? 'Modifier la faculté' : 'Ajouter une faculté'}
        </h2>
        {erreur && <Alerte variante="erreur">{erreur}</Alerte>}
        <form onSubmit={soumettre}>
          <Champ label="Nom" required value={form.nom} onChange={modifierChamp('nom')} placeholder="Faculté des sciences" />
          <Champ as="textarea" rows={3} label="Description" value={form.description} onChange={modifierChamp('description')} placeholder="Présentation courte de la faculté" />
          <Champ label="Doyen (optionnel)" value={form.doyen} onChange={modifierChamp('doyen')} placeholder="Dr. ..." />
          <Champ label="Image / logo (URL, optionnel)" value={form.image} onChange={modifierChamp('image')} placeholder="https://…" />
          <div className="flex items-center gap-3">
            <Bouton type="submit" chargement={chargement}>{idEnEdition ? 'Enregistrer' : 'Créer'}</Bouton>
            {idEnEdition && <Bouton type="button" variante="fantome" onClick={annulerEdition}>Annuler</Bouton>}
          </div>
        </form>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
        <h2 className="flex items-center gap-2 text-[17px] font-bold text-gray-900 mb-4"><i className="fa-solid fa-list" /> Facultés existantes</h2>
        {!facultes && <Chargement pleinEcran={false} />}
        {facultes && facultes.length === 0 && <p className="text-gray-500">Aucune faculté pour l'instant.</p>}
        {facultes && facultes.length > 0 && (
          <div className="overflow-x-auto border border-gray-200 rounded-2xl">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="bg-gray-50 text-gray-500 font-semibold text-xs uppercase tracking-wide text-left px-4 py-3">Nom</th>
                  <th className="bg-gray-50 text-gray-500 font-semibold text-xs uppercase tracking-wide text-left px-4 py-3">Doyen</th>
                  <th className="bg-gray-50 px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {facultes.map((f) => (
                  <tr key={f.id} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3">{f.nom}</td>
                    <td className="px-4 py-3 text-gray-500">{f.doyen || '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5 justify-end">
                        <Bouton taille="sm" variante="secondaire" onClick={() => commencerEdition(f)}>
                          <i className="fa-solid fa-pen" />
                        </Bouton>
                        <Bouton taille="sm" variante="rouge" onClick={() => supprimer(f)}>
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
