import { useState, useEffect } from 'react';
import api from '../services/api';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [criticality, setCriticality] = useState('MEDIUM');

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      setProjects(response.data);
    } catch (err) {
      console.error("Error fetching projects", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', { name, description, criticality });
      setName('');
      setDescription('');
      setCriticality('MEDIUM');
      fetchProjects(); // Refresh list
    } catch (err) {
      console.error("Error creating project", err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Projects</h2>
          <p className="text-slate-500">Manage your organization's initiatives.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Project Form */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Add New Project</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Project Name</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="3"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Criticality</label>
              <select value={criticality} onChange={(e) => setCriticality(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition bg-white">
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition">
              Create Project
            </button>
          </form>
        </div>

        {/* Project List */}
        <div className="lg:col-span-2">
          {loading ? (
            <p className="text-slate-500">Loading projects...</p>
          ) : projects.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500">
              No projects found. Create one to get started.
            </div>
          ) : (
            <div className="space-y-4">
              {projects.map(project => (
                <div key={project.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center hover:shadow-md transition">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">{project.name}</h3>
                    <p className="text-sm text-slate-500 mt-1">{project.description || 'No description provided.'}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                    project.criticality === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                    project.criticality === 'HIGH' ? 'bg-orange-100 text-orange-700' :
                    project.criticality === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {project.criticality}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}