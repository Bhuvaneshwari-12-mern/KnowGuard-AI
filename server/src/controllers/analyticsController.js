import { User } from '../models/User.js';
import { Project } from '../models/Project.js';
import { KnowledgeRecord } from '../models/KnowledgeRecord.js';
import { KnowledgeTransfer } from '../models/KnowledgeTransfer.js';

// @desc    Get dashboard analytics
// @route   GET /api/analytics
export const getDashboardStats = async (req, res) => {
  try {
    // 1. Basic Counts
    const totalEmployees = await User.count();
    const totalProjects = await Project.count();
    const totalDocs = await KnowledgeRecord.count();
    
    // 2. Transfer Stats
    const pendingTransfers = await KnowledgeTransfer.count({ where: { status: 'PENDING' } });
    const completedTransfers = await KnowledgeTransfer.count({ where: { status: 'COMPLETED' } });

    // 3. Critical Knowledge
    const criticalDocs = await KnowledgeRecord.count({ where: { isCritical: true } });

    // 4. Project Risk Breakdown
    const projects = await Project.findAll();
    let highRiskProjects = 0;
    
    // We reuse a simplified version of the risk logic here to count how many are HIGH or CRITICAL
    // (In a real app, you might save the risk score to the DB, but we compute it on the fly)
    projects.forEach(p => {
      // Simplified risk check: if it's HIGH/CRITICAL but has no critical docs
      if (['HIGH', 'CRITICAL'].includes(p.criticality) && criticalDocs === 0) {
        highRiskProjects++;
      }
    });

    // 5. Recent Activity (just grabbing the latest 3 documents for now)
    const recentDocs = await KnowledgeRecord.findAll({ 
      limit: 3, 
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'title', 'createdAt']
    });

    res.json({
      summary: {
        employees: totalEmployees,
        projects: totalProjects,
        documents: totalDocs,
        criticalDocs: criticalDocs,
        pendingTransfers: pendingTransfers,
        completedTransfers: completedTransfers,
        highRiskProjects: highRiskProjects
      },
      recentDocs
    });

  } catch (error) {
    console.error("Analytics Error:", error);
    res.status(500).json({ error: 'Server error generating analytics' });
  }
};