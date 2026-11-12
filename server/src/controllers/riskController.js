import { Project } from '../models/Project.js';
import { KnowledgeRecord } from '../models/KnowledgeRecord.js';
import { computeRisk } from '../ai/riskEngine.js';

// @desc    Get risk scores for all projects
// @route   GET /api/risk
export const getProjectRisks = async (req, res) => {
  try {
    const projects = await Project.findAll();
    const knowledgeRecords = await KnowledgeRecord.findAll();

    const results = projects.map(project => {
      // For this MVP, we'll link knowledge to projects by category or assume all knowledge applies.
      // In a full app, you'd filter knowledgeRecords where record.projectId === project.id
      const risk = computeRisk({ project, knowledgeRecords });
      
      return {
        projectId: project.id,
        projectName: project.name,
        criticality: project.criticality,
        riskScore: risk.score,
        riskLevel: risk.level,
        explanation: risk.explanation
      };
    });

    // Sort by highest risk first
    results.sort((a, b) => b.riskScore - a.riskScore);

    res.json(results);
  } catch (error) {
    console.error("Risk Error:", error);
    res.status(500).json({ error: 'Server error computing risks' });
  }
};