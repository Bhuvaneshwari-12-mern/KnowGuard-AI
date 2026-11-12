import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FolderKanban, BookOpen, AlertTriangle, Users, ArrowRightLeft, ShieldCheck, Clock } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.get('/analytics');
        setData(response.data);
      } catch (err) {
        console.error("Failed to fetch analytics", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const { summary, recentDocs } = data;

  return (
    <div className="max-w-6xl mx-auto pb-12">
      
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome back, {user.firstName}!</h2>
        <p className="text-slate-500 mt-1 text-lg">Here is the live status of your organization's knowledge.</p>
      </div>

      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-50 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600">
              <Users size={24} />
            </div>
          </div>
          <div className="relative z-10">
            <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider">Total Employees</h3>
            <p className="text-4xl font-black text-slate-900 mt-2">{summary.employees}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-50 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
              <FolderKanban size={24} />
            </div>
          </div>
          <div className="relative z-10">
            <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider">Active Projects</h3>
            <p className="text-4xl font-black text-slate-900 mt-2">{summary.projects}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-50 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600">
              <BookOpen size={24} />
            </div>
          </div>
          <div className="relative z-10">
            <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider">Knowledge Docs</h3>
            <p className="text-4xl font-black text-slate-900 mt-2">{summary.documents}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-red-50 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center text-red-600">
              <AlertTriangle size={24} />
            </div>
          </div>
          <div className="relative z-10">
            <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider">High Risk Projects</h3>
            <p className="text-4xl font-black text-slate-900 mt-2">{summary.highRiskProjects}</p>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Progress and Transfers */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Knowledge Coverage Bar */}
          <div className="bg-slate-900 p-8 rounded-3xl shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-20 -mr-20 -mt-20"></div>
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <ShieldCheck className="text-indigo-400" /> Organization Knowledge Health
            </h3>
            <p className="text-slate-400 text-sm mb-6">Based on critical documentation coverage.</p>
            
            <div className="flex items-end gap-4 mb-2">
              <span className="text-5xl font-black text-white">{summary.criticalDocs}</span>
              <span className="text-slate-400 font-medium pb-1">Critical documents recorded</span>
            </div>
            
            <div className="w-full bg-slate-800 rounded-full h-4 mt-4 overflow-hidden shadow-inner">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-4 rounded-full" 
                style={{ width: `${Math.min(100, (summary.criticalDocs / 10) * 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-indigo-300 mt-2 font-medium">Aim for at least 10 critical documents to secure your knowledge base.</p>
          </div>

          {/* Transfers Overview */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <ArrowRightLeft className="text-indigo-500" /> Knowledge Transfers
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={16} className="text-amber-600" />
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Pending</span>
                </div>
                <p className="text-3xl font-black text-amber-700">{summary.pendingTransfers}</p>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck size={16} className="text-emerald-600" />
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Completed</span>
                </div>
                <p className="text-3xl font-black text-emerald-700">{summary.completedTransfers}</p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Recent Activity */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm h-full">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Recently Added Docs</h3>
            <div className="space-y-4">
              {recentDocs.length === 0 ? (
                <p className="text-slate-500 text-sm">No documents uploaded yet.</p>
              ) : (
                recentDocs.map(doc => (
                  <div key={doc.id} className="flex gap-3 items-start border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 text-slate-500 mt-0.5">
                      <BookOpen size={14} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-800 line-clamp-1">{doc.title}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{new Date(doc.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}