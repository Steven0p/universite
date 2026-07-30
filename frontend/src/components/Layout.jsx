import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

export default function Layout() {
  const [ouvert, setOuvert] = useState(false);

  const lienClasse = ({ isActive }) =>
    `inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[15px] font-semibold whitespace-nowrap ${
      isActive ? 'text-navy bg-navy-soft' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
    }`;

  return (
    <div className="min-h-full flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-[1120px] mx-auto px-6 py-3.5 flex items-center justify-between gap-4">
          <NavLink to="/" className="flex items-center gap-2.5 font-extrabold text-gray-900 text-[17px]" onClick={() => setOuvert(false)}>
            <span className="h-10 w-10 rounded-[10px] bg-gradient-to-br from-navy to-[#0a2740] text-or grid place-items-center text-lg">
              <i className="fa-solid fa-graduation-cap" />
            </span>
            <span>Plateforme Universitaire</span>
          </NavLink>

          <button
            className="md:hidden inline-flex border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-900"
            onClick={() => setOuvert((v) => !v)}
            aria-label="Ouvrir le menu"
          >
            <i className="fa-solid fa-bars" />
          </button>

          <nav
            className={`${ouvert ? 'flex' : 'hidden'} md:flex flex-col md:flex-row items-stretch md:items-center gap-1
              absolute md:static top-full left-0 right-0 bg-white md:bg-transparent border-b md:border-0 border-gray-200
              px-6 md:px-0 py-3 md:py-0 shadow-lg md:shadow-none`}
          >
            <NavLink to="/" end className={lienClasse} onClick={() => setOuvert(false)}>
              <i className="fa-solid fa-house" /> Accueil
            </NavLink>
            <NavLink to="/admin/login" className={lienClasse} onClick={() => setOuvert(false)}>
              <i className="fa-solid fa-user-shield" /> Administration
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[1120px] mx-auto px-6 py-10">
        <Outlet />
      </main>

      <footer className="bg-navy text-gray-300 mt-auto">
        <div className="max-w-[1120px] mx-auto px-6 py-7 flex items-center justify-between gap-4 flex-wrap text-sm border-t-2 border-or/50">
          <span>© {new Date().getFullYear()} Plateforme Universitaire Numérique</span>
          <span className="text-gray-400">Toutes les facultés, tous les cours, un seul endroit.</span>
        </div>
      </footer>
    </div>
  );
}
