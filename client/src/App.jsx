import KnowledgeTransfer from './pages/KnowledgeTransfer';


import RiskAnalysis from './pages/RiskAnalysis';


import AIAssistant from './pages/AIAssistant';


import DocumentUpload from './pages/DocumentUpload';
import KnowledgeBase from './pages/KnowledgeBase';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppLayout from './layouts/AppLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Employees from './pages/Employees'; // <-- 1. IMPORT EMPLOYEES

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes (With Sidebar) */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            } 
          >
            {/* The pages that load inside the sidebar */}
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="projects" element={<Projects />} />
            
            {/* 2. ADD THE EMPLOYEES ROUTE RIGHT HERE */}
            <Route path="employees" element={<Employees />} /> 
            <Route path="knowledge" element={<KnowledgeBase />} />
            <Route path="upload" element={<DocumentUpload />} />
            <Route path="assistant" element={<AIAssistant />} />
            <Route path="risk" element={<RiskAnalysis />} />
            <Route path="transfers" element={<KnowledgeTransfer />} />






            
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;