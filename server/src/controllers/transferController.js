import { KnowledgeTransfer } from '../models/KnowledgeTransfer.js';

// @desc    Get all transfers
// @route   GET /api/transfers
export const getTransfers = async (req, res) => {
  try {
    const transfers = await KnowledgeTransfer.findAll({ order: [['createdAt', 'DESC']] });
    res.json(transfers);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching transfers' });
  }
};

// @desc    Create a new transfer task
// @route   POST /api/transfers
export const createTransfer = async (req, res) => {
  try {
    const { title, description, deadline } = req.body;
    const transfer = await KnowledgeTransfer.create({ title, description, deadline });
    res.status(201).json(transfer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error creating transfer' });
  }
};

// @desc    Update transfer status
// @route   PATCH /api/transfers/:id
export const updateTransferStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const transfer = await KnowledgeTransfer.findByPk(id);
    if (!transfer) return res.status(404).json({ error: 'Transfer not found' });

    transfer.status = status;
    await transfer.save();
    res.json(transfer);
  } catch (error) {
    res.status(500).json({ error: 'Server error updating transfer' });
  }
};