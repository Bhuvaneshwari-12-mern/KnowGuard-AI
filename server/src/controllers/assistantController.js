import { KnowledgeRecord } from '../models/KnowledgeRecord.js';

// Helper: Clean and tokenize text
const tokenize = (text) => {
  const stopWords = new Set(['the', 'a', 'an', 'is', 'are', 'of', 'to', 'in', 'and', 'or', 'for', 'on', 'with', 'how', 'what', 'where', 'which']);
  return text.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word));
};

// @desc    Ask the AI Assistant a question
// @route   POST /api/assistant/ask
export const askAssistant = async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ error: 'Question is required' });

    const records = await KnowledgeRecord.findAll();
    const questionTokens = tokenize(question);
    
    if (questionTokens.length === 0) {
      return res.json({ answer: "I couldn't understand the question. Could you rephrase?", sources: [] });
    }

    const scoredRecords = records.map(record => {
      const textToSearch = `${record.title} ${record.content} ${record.category}`;
      const docTokens = tokenize(textToSearch);
      
      let score = 0;
      questionTokens.forEach(qWord => {
        if (record.title.toLowerCase().includes(qWord)) score += 3;
        if (docTokens.includes(qWord)) score += 1;
      });

      return { record, score };
    })
    .filter(item => item.score > 0) 
    .sort((a, b) => b.score - a.score); 

    if (scoredRecords.length === 0) {
      return res.json({ 
        answer: "I searched the knowledge base but couldn't find any documents relevant to your question.", 
        sources: [] 
      });
    }

    const topMatches = scoredRecords.slice(0, 3);
    
    let answer = `Based on the organizational knowledge, here is what I found:\n\n`;
    topMatches.forEach((match, index) => {
      const snippet = match.record.content.substring(0, 200).replace(/\n/g, ' ') + '...';
      answer += `${index + 1}. **${match.record.title}**: ${snippet}\n\n`;
    });

    answer += `\nPlease review the sources below for the full context.`;

    res.json({
      answer,
      sources: topMatches.map(m => ({
        id: m.record.id,
        title: m.record.title,
        isCritical: m.record.isCritical
      }))
    });

  } catch (error) {
    console.error("Assistant Error:", error);
    res.status(500).json({ error: 'Server error processing question' });
  }
};