import { ArrowRightLeft } from 'lucide-react';
import { ShieldAlert } from 'lucide-react';
import { LayoutDashboard, Users, FolderKanban, BookOpen, Bot } from 'lucide-react';
import { UploadCloud } from 'lucide-react';


import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Employees', path: '/employees', icon: Users },
    { name: 'Projects', path: '/projects', icon: FolderKanban },
    { name: 'Knowledge Base', path: '/knowledge', icon: BookOpen },
    { name: 'Upload', path: '/upload', icon: UploadCloud },
    { name: 'AI Assistant', path: '/assistant', icon: Bot },
    { name: 'Risk Analysis', path: '/risk', icon: ShieldAlert },
    { name: 'Transfers', path: '/transfers', icon: ArrowRightLeft },
  ];

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      {/* Sidebar - Deep Navy with indigo active states */}
      <aside className="w-64 bg-[#0f172a] text-slate-300 flex flex-col shadow-xl z-10">
        <div className="h-16 flex items-center px-6 border-b border-slate-700/50">
          <span className="text-white font-bold text-xl tracking-wide flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-indigo-500 flex items-center justify-center text-xs">K</div>
            KnowGuard AI
          </span>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link 
                key={item.name}
                to={item.path} 
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-indigo-200' : 'text-slate-400'} />
                <span className="font-medium text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-700/50 bg-[#0b1120]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-sm">
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-indigo-300 font-medium">{user?.role}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors">
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto flex flex-col">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-8 shadow-sm z-0">
          <h1 className="text-xl font-semibold text-slate-800">Overview</h1>
        </header>
        <div className="p-8 flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
}