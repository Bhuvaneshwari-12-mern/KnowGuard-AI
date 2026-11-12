import { KnowledgeRecord } from '../models/KnowledgeRecord.js';
import fs from 'fs';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import mammoth from 'mammoth';

// @desc    Get all knowledge records
// @route   GET /api/knowledge
export const getKnowledge = async (req, res) => {
  try {
    const records = await KnowledgeRecord.findAll({ order: [['createdAt', 'DESC']] });
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching knowledge' });
  }
};

// @desc    Create a new knowledge record
// @route   POST /api/knowledge
export const createKnowledge = async (req, res) => {
  try {
    const { title, category, content, isCritical } = req.body;
    
    const record = await KnowledgeRecord.create({
      title,
      category,
      content,
      isCritical: isCritical || false
    });

    res.status(201).json(record);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error creating knowledge' });
  }
};

// @desc    Upload a document and extract text
// @route   POST /api/knowledge/upload
export const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const fileExt = req.file.originalname.split('.').pop().toLowerCase();
    let extractedText = '';

    console.log(`Processing file: ${fileExt}`);

    // Extract text based on file type
    if (fileExt === 'pdf') {
      const dataBuffer = new Uint8Array(fs.readFileSync(filePath));
      const pdf = await pdfjsLib.getDocument({ data: dataBuffer }).promise;
      let textContent = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const text = await page.getTextContent();
        textContent += text.items.map(s => s.str).join(' ') + '\n';
      }
      extractedText = textContent;
    } else if (fileExt === 'docx') {
      const result = await mammoth.extractRawText({ path: filePath });
      extractedText = result.value;
    } else if (fileExt === 'txt') {
      extractedText = fs.readFileSync(filePath, 'utf8');
    }

    console.log(`Extracted ${extractedText.length} characters.`);

    // Save to database
    const record = await KnowledgeRecord.create({
      title: req.file.originalname,
      category: req.body.category || 'OTHER',
      content: extractedText || 'No text could be extracted.',
      isCritical: req.body.isCritical === 'true'
    });

    // Delete the file after reading it
    fs.unlinkSync(filePath);

    res.status(201).json({ message: 'File processed successfully', record });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    res.status(500).json({ error: 'Error processing document' });
  }
};
// @desc    Delete a knowledge record
// @route   DELETE /api/knowledge/:id
export const deleteKnowledge = async (req, res) => {
  try {
    const { id } = req.params;
    const record = await KnowledgeRecord.findByPk(id);
    
    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }

    await record.destroy();
    res.json({ message: 'Record deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error deleting record' });
  }
};