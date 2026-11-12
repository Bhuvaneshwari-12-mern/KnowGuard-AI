import { Project } from '../models/Project.js';

// @desc    Get all projects
// @route   GET /api/projects
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({ order: [['createdAt', 'DESC']] });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching projects' });
  }
};

// @desc    Create a new project
// @route   POST /api/projects
export const createProject = async (req, res) => {
  try {
    const { name, description, criticality } = req.body;
    
    const project = await Project.create({
      name,
      description,
      criticality,
    });

    res.status(201).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error creating project' });
  }
};