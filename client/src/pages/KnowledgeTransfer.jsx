import { useState, useEffect } from 'react';
import api from '../services/api';
import { ArrowRightLeft, Clock, CheckCircle2, PlayCircle, Plus, Calendar, X } from 'lucide-react';

export default function KnowledgeTransfer() {
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');

  const fetchTransfers = async () => {
    try {
      const response = await api.get('/transfers');
      setTransfers(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransfers();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/transfers', { title, description, deadline });
      setTitle('');
      setDescription('');
      setDeadline('');
      setIsModalOpen(false);
      fetchTransfers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.patch(`/transfers/${id}`, { status: newStatus });
      fetchTransfers();
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusPill = (status) => {
    switch(status) {
      case 'PENDING': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200"><Clock size={12}/> Pending</span>;
      case 'IN_PROGRESS': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200"><PlayCircle size={12}/> In Progress</span>;
      case 'COMPLETED': return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200"><CheckCircle2 size={12}/> Completed</span>;
      default: return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-12 relative">
      
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            Knowledge Transfer
          </h2>
          <p className="text-slate-500 mt-2 text-lg">Track handover tasks and ensure critical knowledge is shared.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-5 rounded-xl transition-all shadow-sm flex items-center gap-2 text-sm"
        >
          <Plus size={18} /> New Handover Task
        </button>
      </div>

      {/* Main Table Area */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        {loading ? (
           <div className="p-12 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>
        ) : transfers.length === 0 ? (
          <div className="p-16 text-center">
            <ArrowRightLeft size={56} className="mx-auto text-slate-200 mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-1">No transfer tasks yet</h3>
            <p className="text-slate-500">Create your first handover task to get started.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Task Details</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Deadline</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transfers.map(task => (
                <tr key={task.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className={`text-base font-bold ${task.status === 'COMPLETED' ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                        {task.title}
                      </span>
                      <span className="text-sm text-slate-500 mt-1 line-clamp-1">{task.description}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                      <Calendar size={16} className="text-slate-400" />
                      {new Date(task.deadline).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    {getStatusPill(task.status)}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <select 
                      value={task.status} 
                      onChange={(e) => handleStatusChange(task.id, e.target.value)}
                      className="text-sm font-medium bg-white border border-slate-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer hover:border-indigo-300 transition-colors"
                    >
                      <option value="PENDING">Mark Pending</option>
                      <option value="IN_PROGRESS">Mark In Progress</option>
                      <option value="COMPLETED">Mark Completed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modern Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <ArrowRightLeft size={18} className="text-indigo-600" /> Create Transfer Task
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Task Title</label>
                <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm" 
                  placeholder="e.g. Handover API keys" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
                <textarea required value={description} onChange={(e) => setDescription(e.target.value)} rows="3"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none text-sm"
                  placeholder="What exactly needs to be transferred?"></textarea>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Deadline</label>
                <input type="date" required value={deadline} onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm" />
              </div>
              <div className="pt-2">
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2">
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}