import { User } from '../models/User.js';

// @desc    Get all users
// @route   GET /api/users
export const getUsers = async (req, res) => {
  try {
    // Fetch all users, but exclude their passwords for security
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching users' });
  }
};