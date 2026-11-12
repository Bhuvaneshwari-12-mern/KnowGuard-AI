import { useState } from 'react';
import api from '../services/api';
import { UploadCloud, FileText, CheckCircle2 } from 'lucide-react';

export default function DocumentUpload() {
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState('PROCESS');
  const [isCritical, setIsCritical] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setSuccess(false);
    setError('');
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setError('');
    
    const formData = new FormData();
    formData.append('document', file);
    formData.append('category', category);
    formData.append('isCritical', isCritical);

    try {
      await api.post('/knowledge/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSuccess(true);
      setFile(null);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Upload Document</h2>
        <p className="text-slate-500">Upload PDF, DOCX, or TXT files to automatically extract knowledge.</p>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        {success && (
          <div className="mb-6 bg-green-50 text-green-700 p-4 rounded-lg flex items-center gap-2 border border-green-200">
            <CheckCircle2 size={20} /> Document processed and saved to Knowledge Base!
          </div>
        )}
        
        {error && <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-200">{error}</div>}

        <form onSubmit={handleUpload} className="space-y-6">
          {/* Drag & Drop Zone */}
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-10 text-center hover:bg-slate-50 transition cursor-pointer relative">
            <input type="file" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept=".pdf,.docx,.txt" />
            <UploadCloud size={48} className="mx-auto text-indigo-500 mb-4" />
            {file ? (
              <p className="text-indigo-600 font-medium">{file.name}</p>
            ) : (
              <>
                <p className="text-slate-700 font-medium">Click or drag file to this area to upload</p>
                <p className="text-slate-400 text-sm mt-1">Support for a single PDF, DOCX, or TXT file up to 10MB.</p>
              </>
            )}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                <option value="PROJECT">Project</option>
                <option value="TECHNOLOGY">Technology</option>
                <option value="PROCESS">Process</option>
                <option value="TROUBLESHOOTING">Troubleshooting</option>
                <option value="DECISION">Decision</option>
              </select>
            </div>
            <div className="flex items-center mt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={isCritical} onChange={(e) => setIsCritical(e.target.checked)} 
                  className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500" />
                <span className="text-sm font-medium text-red-600 flex items-center gap-1">
                  <FileText size={16} /> Mark as Critical
                </span>
              </label>
            </div>
          </div>

          <button type="submit" disabled={!file || uploading} 
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-medium py-3 rounded-lg transition">
            {uploading ? 'Extracting Text...' : 'Upload & Process Document'}
          </button>
        </form>
      </div>
    </div>
  );
}