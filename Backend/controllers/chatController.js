const { generateEmbedding, generateAnswer } = require('../services/aiService');
const Chunk = require('../models/Chunk');
const logger = require('../utils/logger');

const askQuestion = async (req, res) => {
  try {
    const { repoUrl, question } = req.body;

    if (!repoUrl || !question) {
      return res.status(400).json({ success: false, message: 'repoUrl and question are required.' });
    }

    logger.info(`Answering question for ${repoUrl}: "${question}"`);

    // 1. Generate embedding for the user's question
    const questionEmbedding = await generateEmbedding(question);

    // 2. Perform Vector Search in MongoDB
    // Note: This requires an Atlas Vector Search index named 'vector_index' to be created on the `embedding` field.
    const retrievedChunks = await Chunk.aggregate([
      {
        $vectorSearch: {
          index: 'vector_index',
          path: 'embedding',
          queryVector: questionEmbedding,
          numCandidates: 100,
          limit: 5, // Get top 5 most relevant chunks
          filter: { repoUrl } // Pre-filter by the specific repository
        }
      },
      {
        $project: {
          _id: 0,
          filePath: 1,
          codeContent: 1,
          score: { $meta: 'vectorSearchScore' }
        }
      }
    ]);

    if (!retrievedChunks || retrievedChunks.length === 0) {
      return res.status(200).json({ 
        success: true, 
        answer: "I couldn't find any relevant code chunks in the database for this repository. Please make sure the repository has been ingested successfully." 
      });
    }

    logger.info(`Retrieved ${retrievedChunks.length} relevant chunks.`);

    // Also fetch the folder structure to help with general questions
    const filePaths = await Chunk.distinct('filePath', { repoUrl });

    // 3. Generate answer using LLM
    const answer = await generateAnswer(question, retrievedChunks, filePaths);

    res.status(200).json({ success: true, answer });
  } catch (error) {
    logger.error('Error in askQuestion controller:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  askQuestion,
};
