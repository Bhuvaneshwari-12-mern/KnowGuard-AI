/**
 * Explainable, rule-based knowledge-risk scoring.
 * Score 0-100 (higher = more risk).
 */
export function computeRisk({ project, knowledgeRecords = [] }) {
  const factors = {};

  // 1) Critical knowledge presence (Weight: 30)
  // If a project has NO critical documents, it's high risk.
  const criticalDocs = knowledgeRecords.filter(k => k.isCritical).length;
  factors.criticalDocumentation = {
    weight: 30,
    raw: criticalDocs,
    points: criticalDocs === 0 ? 30 : (criticalDocs === 1 ? 15 : 0),
    note: `${criticalDocs} critical knowledge document(s) found`,
  };

  // 2) Documentation Coverage (Weight: 25)
  // If there are very few documents for a project, it's risky.
  const totalDocs = knowledgeRecords.length;
  factors.documentationCoverage = {
    weight: 25,
    raw: totalDocs,
    points: totalDocs === 0 ? 25 : (totalDocs < 3 ? 15 : 0),
    note: `Only ${totalDocs} total document(s) linked to this project`,
  };

  // 3) Project Criticality (Weight: 30)
  // If the project is marked CRITICAL, any lack of docs is a major issue.
  const critMap = { LOW: 0, MEDIUM: 10, HIGH: 20, CRITICAL: 30 };
  factors.projectCriticality = {
    weight: 30,
    raw: project?.criticality,
    points: critMap[project?.criticality] ?? 10,
    note: `Project is marked as ${project?.criticality}`,
  };

  // 4) Documentation Freshness (Weight: 15)
  // If docs haven't been updated in 6 months, they might be outdated.
  const staleDocs = knowledgeRecords.filter(d => {
    const months = (Date.now() - new Date(d.updatedAt).getTime()) / (1000 * 60 * 60 * 24 * 30);
    return months > 6;
  }).length;
  factors.documentFreshness = {
    weight: 15,
    raw: staleDocs,
    points: Math.min(15, staleDocs * 5),
    note: `${staleDocs} document(s) are older than 6 months`,
  };

  // Calculate Total Score
  const score = Object.values(factors).reduce((a, f) => a + f.points, 0);
  
  // Determine Risk Level
  const level = score >= 75 ? 'CRITICAL' : score >= 50 ? 'HIGH' : score >= 25 ? 'MEDIUM' : 'LOW';

  // Generate Explanation Text
  const explanation = Object.entries(factors)
    .map(([k, v]) => `• ${k}: ${v.note} (${v.points}/${v.weight} pts)`)
    .join('\n');

  return { score, level, factors, explanation };
}