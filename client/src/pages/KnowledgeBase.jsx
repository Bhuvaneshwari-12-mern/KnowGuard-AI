import { useState, useEffect } from 'react';
import api from '../services/api';
import { BookOpen, AlertCircle, ChevronDown, ChevronUp, FileText, Search, PlusCircle, Trash2 } from 'lucide-react';

export default function KnowledgeBase() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('PROCESS');
  const [content, setContent] = useState('');
  const [isCritical, setIsCritical] = useState(false);

  const fetchRecords = async () => {
    try {
        const response = await api.get('/knowledge');
        setRecords(response.data);
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/knowledge', { title, category, content, isCritical });
      setTitle('');
      setCategory('PROCESS');
      setContent('');
      setIsCritical(false);
      fetchRecords();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to permanently delete this knowledge record?")) {
      try {
        await api.delete(`/knowledge/${id}`);
        fetchRecords();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredRecords = records.filter(record => 
    record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Knowledge Base</h2>
          <p className="text-slate-500 mt-1 text-lg">Capture, organize, and search your organization's critical knowledge.</p>
        </div>
        
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={18} className="text-slate-400" />
          </div>
          <input 
            type="text" 
            placeholder="Search documents..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm transition-all text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form */}
        <div className="lg:col-span-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-8">
            <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                <PlusCircle size={22} className="text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">New Knowledge</h3>
                <p className="text-xs text-slate-500">Add a manual entry to the base.</p>
              </div>
            </div>
            
            <form onSubmit={handleCreate} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Title</label>
                <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" 
                  placeholder="e.g. Database Backup Process" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all appearance-none cursor-pointer">
                  <option value="PROJECT">Project</option>
                  <option value="TECHNOLOGY">Technology</option>
                  <option value="PROCESS">Process</option>
                  <option value="TROUBLESHOOTING">Troubleshooting</option>
                  <option value="DECISION">Decision</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Content</label>
                <textarea required value={content} onChange={(e) => setContent(e.target.value)} rows="5"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none text-sm"
                  placeholder="Write the detailed knowledge here..."></textarea>
              </div>
              <div className="flex items-center gap-3 p-3.5 bg-red-50 border border-red-100 rounded-xl cursor-pointer transition-colors hover:bg-red-100">
                <input type="checkbox" checked={isCritical} onChange={(e) => setIsCritical(e.target.checked)} 
                  className="w-5 h-5 text-red-600 rounded border-red-300 focus:ring-red-500 cursor-pointer" />
                <label className="text-sm font-bold text-red-700 cursor-pointer flex items-center gap-1.5 w-full">
                  <AlertCircle size={16} /> Mark as Critical
                </label>
              </div>
              <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-xl transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2">
                <FileText size={18} /> Save Entry
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Interactive Cards */}
        <div className="lg:col-span-8 space-y-5">
          {loading ? (
             [1, 2, 3].map(i => (
               <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-pulse">
                 <div className="flex items-center gap-3 mb-4">
                   <div className="w-10 h-10 rounded-full bg-slate-200"></div>
                   <div className="space-y-2">
                     <div className="h-4 bg-slate-200 rounded w-48"></div>
                     <div className="h-3 bg-slate-200 rounded w-24"></div>
                   </div>
                 </div>
                 <div className="space-y-3 mt-4">
                   <div className="h-3 bg-slate-100 rounded w-full"></div>
                   <div className="h-3 bg-slate-100 rounded w-full"></div>
                   <div className="h-3 bg-slate-100 rounded w-3/4"></div>
                 </div>
               </div>
             ))
          ) : filteredRecords.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center shadow-sm">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={32} className="text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">No results found</h3>
              <p className="text-slate-500">We couldn't find any documents matching "{searchQuery}"</p>
            </div>
          ) : (
            filteredRecords.map(record => {
              const isExpanded = expandedId === record.id;
              
              return (
                <div key={record.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col">
                  <div className="flex justify-between items-start mb-5">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm ${record.isCritical ? 'bg-red-50 text-red-600' : 'bg-indigo-50 text-indigo-600'}`}>
                        <BookOpen size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {record.title}
                        </h3>
                        <div className="flex gap-2 mt-1.5">
                          <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider rounded-md border border-slate-200">
                            {record.category}
                          </span>
                          {record.isCritical && (
                            <span className="px-2.5 py-0.5 bg-red-50 text-red-700 text-xs font-bold uppercase tracking-wider rounded-md border border-red-100 flex items-center gap-1">
                              <AlertCircle size={12} /> Critical
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* ALWAYS VISIBLE DELETE BUTTON */}
                    <button 
                      onClick={() => handleDelete(record.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-600 hover:text-white border border-red-100 hover:border-red-600 rounded-lg transition-all shadow-sm"
                      title="Delete Record"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                  
                  {/* Interactive Text Area */}
                  <div 
                    onClick={() => toggleExpand(record.id)}
                    className={`relative bg-slate-50 rounded-xl border border-slate-100 p-5 cursor-pointer transition-all duration-500 ease-in-out ${isExpanded ? 'min-h-[100px]' : 'max-h-[120px] overflow-hidden'}`}
                  >
                    <p className="text-slate-600 text-sm leading-7 whitespace-pre-wrap font-normal">
                      {record.content}
                    </p>
                    
                    {/* Fade overlay when collapsed */}
                    {!isExpanded && (
                      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-50 via-slate-50/80 to-transparent flex items-end justify-center pb-2">
                        <span className="text-xs font-bold text-indigo-600 bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors">
                          Click to read full text
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Expand/Collapse Button */}
                  <div className="mt-4 flex justify-end">
                    <button 
                      onClick={() => toggleExpand(record.id)}
                      className="flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors bg-slate-50 hover:bg-indigo-50 px-4 py-2 rounded-lg"
                    >
                      {isExpanded ? (
                        <><ChevronUp size={16} /> Collapse Document</>
                      ) : (
                        <><ChevronDown size={16} /> Read Full Document</>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}