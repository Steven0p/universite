import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import Layout from './components/Layout.jsx';
import RoutePrivee from './components/RoutePrivee.jsx';
import Accueil from './pages/Accueil.jsx';
import FaculteDetail from './pages/FaculteDetail.jsx';
import CoursDetail from './pages/CoursDetail.jsx';
import Login from './pages/admin/Login.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Accueil />} />
          <Route path="/facultes/:id" element={<FaculteDetail />} />
          <Route path="/cours/:id" element={<CoursDetail />} />
          <Route path="/admin/login" element={<Login />} />
          <Route
            path="/admin/dashboard"
            element={
              <RoutePrivee>
                <Dashboard />
              </RoutePrivee>
            }
          />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
