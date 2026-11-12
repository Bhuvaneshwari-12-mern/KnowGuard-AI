import { useState, useEffect } from 'react';
import api from '../services/api';
import { ShieldAlert, AlertTriangle, CheckCircle, Info, Activity, TrendingUp, ChevronRight } from 'lucide-react';

export default function RiskAnalysis() {
  const [risks, setRisks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRisks = async () => {
      try {
        const response = await api.get('/risk');
        setRisks(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRisks();
  }, []);

  // Helper to get styles
  const getRiskTheme = (level) => {
    switch(level) {
      case 'CRITICAL': return { text: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/20', bar: 'bg-rose-500', glow: 'shadow-[0_0_15px_rgba(244,63,94,0.3)]' };
      case 'HIGH': return { text: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20', bar: 'bg-orange-500', glow: 'shadow-[0_0_15px_rgba(249,115,22,0.3)]' };
      case 'MEDIUM': return { text: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', bar: 'bg-amber-500', glow: 'shadow-[0_0_15px_rgba(245,158,11,0.3)]' };
      default: return { text: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', bar: 'bg-emerald-500', glow: 'shadow-[0_0_15px_rgba(16,185,129,0.3)]' };
    }
  };

  const getIcon = (level) => {
    switch(level) {
      case 'CRITICAL': return <ShieldAlert size={20} />;
      case 'HIGH': return <AlertTriangle size={20} />;
      case 'MEDIUM': return <Info size={20} />;
      default: return <CheckCircle size={20} />;
    }
  };

  // Parse the explanation text into a structured array
  const parseExplanation = (explanationText) => {
    return explanationText.split('\n').map(line => {
      // Example: "• criticalDocumentation: 2 critical... (0/30 pts)"
      const match = line.match(/• (.*?): (.*?) \((\d+)\/(\d+) pts\)/);
      if (match) {
        return { 
          key: match[1], 
          desc: match[2], 
          points: parseInt(match[3]), 
          max: parseInt(match[4]) 
        };
      }
      return null;
    }).filter(Boolean);
  };

  const stats = {
    critical: risks.filter(r => r.riskLevel === 'CRITICAL').length,
    high: risks.filter(r => r.riskLevel === 'HIGH').length,
    medium: risks.filter(r => r.riskLevel === 'MEDIUM').length,
    low: risks.filter(r => r.riskLevel === 'LOW').length,
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Risk Intelligence</h2>
          <p className="text-slate-500 mt-1 text-lg">Automated scoring for organizational knowledge loss.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <>
          {/* Top Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Critical', count: stats.critical, level: 'CRITICAL' },
              { label: 'High', count: stats.high, level: 'HIGH' },
              { label: 'Medium', count: stats.medium, level: 'MEDIUM' },
              { label: 'Low', count: stats.low, level: 'LOW' },
            ].map((stat) => {
              const theme = getRiskTheme(stat.level);
              return (
                <div key={stat.label} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
                  <div>
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                    <p className="text-3xl font-black text-slate-900 mt-1">{stat.count}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${theme.bg} ${theme.text} ${theme.glow}`}>
                    {getIcon(stat.level)}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Risk Cards */}
          <div className="space-y-6">
            {risks.map(risk => {
              const theme = getRiskTheme(risk.riskLevel);
              const parsedFactors = parseExplanation(risk.explanation);
              
              return (
                <div key={risk.projectId} className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden relative">
                  
                  {/* Colored Top Bar */}
                  <div className={`h-1.5 w-full ${theme.bar}`}></div>

                  <div className="p-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
                      {/* Project Info */}
                      <div className="flex items-center gap-5">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 ${theme.bg} border ${theme.border} ${theme.glow}`}>
                          <span className={theme.text}>{getIcon(risk.riskLevel)}</span>
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-slate-900">{risk.projectName}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-slate-500 font-medium">Criticality:</span>
                            <span className="text-sm font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">{risk.criticality}</span>
                          </div>
                        </div>
                      </div>

                      {/* Big Score Display */}
                      <div className="flex items-center gap-5 bg-slate-900 p-4 rounded-2xl pr-8 shadow-lg">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center border-4 ${theme.border} bg-slate-800 ${theme.glow}`}>
                          <span className={`text-2xl font-black text-white`}>{risk.riskScore}</span>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Risk Assessment</p>
                          <p className={`text-xl font-black tracking-widest uppercase ${theme.text}`}>{risk.riskLevel}</p>
                        </div>
                      </div>
                    </div>

                    {/* Factor Breakdown */}
                    <div className="mt-6">
                      <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Activity size={18} className="text-indigo-500" /> 
                        Risk Factor Breakdown
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {parsedFactors.map((factor, i) => {
                          const percentage = (factor.points / factor.max) * 100;
                          return (
                            <div key={i} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col gap-2">
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-bold text-slate-700 capitalize">
                                  {factor.key.replace(/([A-Z])/g, ' $1').trim()}
                                </span>
                                <span className={`text-xs font-bold px-2 py-1 rounded-md ${factor.points > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                  {factor.points} / {factor.max} pts
                                </span>
                              </div>
                              <p className="text-xs text-slate-500">{factor.desc}</p>
                              
                              {/* Progress Bar */}
                              <div className="w-full bg-slate-200 rounded-full h-2 mt-1 overflow-hidden">
                                <div 
                                  className={`h-2 rounded-full ${factor.points > (factor.max / 2) ? 'bg-rose-500' : factor.points > 0 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}