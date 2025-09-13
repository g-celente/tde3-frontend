import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Layout from '../components/layout/Layout';
import ProtectedRoute from '../components/layout/ProtectedRoute';

// Páginas públicas
import Login from '../pages/Login';
import Register from '../pages/Register';

// Páginas protegidas
import Dashboard from '../pages/Dashboard';
import Documents from '../pages/Documents';
import DocumentUpload from '../pages/DocumentUpload';
import Checklists from '../pages/Checklists';
import CreateChecklist from '../pages/CreateChecklist';
import ChecklistDetail from '../pages/ChecklistDetail';
import NonConformityAction from '../pages/NonConformityAction';
import NonConformityDetail from '../pages/NonConformityDetail';
import Nonconformities from '../pages/Nonconformities';
import Reports from '../pages/Reports';

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/login" element={
        !isAuthenticated ? <Login /> : <Navigate to="/dashboard" />
      } />
      <Route path="/register" element={
        !isAuthenticated ? <Register /> : <Navigate to="/dashboard" />
      } />

      {/* Rotas protegidas */}
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        
        {/* Documentos */}
        <Route path="documents" element={<Documents />} />
        <Route path="documents/upload" element={<DocumentUpload />} />
        
        {/* Checklists */}
        <Route path="checklists" element={<Checklists />} />
        <Route path="checklists/create" element={<CreateChecklist />} />
        <Route path="checklists/:id" element={<ChecklistDetail />} />
        
        {/* Não Conformidades */}
        <Route path="nonconformities" element={<Nonconformities />} />
        <Route path="nonconformities/checklist/:checklistId" element={<Nonconformities />} />
        <Route path="nonconformities/:id" element={<NonConformityDetail />} />
        <Route path="nonconformities/action/:id" element={<NonConformityAction />} />
        
        {/* Relatórios */}
        <Route path="reports/:id" element={<Reports />} />
      </Route>

      {/* Rota padrão para redirecionar para o login */}
      <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
    </Routes>
  );
};

export default AppRoutes;