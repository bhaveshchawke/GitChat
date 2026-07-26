const { RecursiveCharacterTextSplitter } = require("@langchain/textsplitters");
const { GoogleGenAI } = require("@google/genai");
const logger = require('../utils/logger');

// Initialize Google GenAI client
let aiClient;
try {
  aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
} catch (error) {
  logger.error("Failed to initialize GoogleGenAI. Is GEMINI_API_KEY set?");
}

/**
 * Splits code into manageable chunks.
 * @param {string} text - The raw code content
 * @returns {Array<string>} Array of text chunks
 */
const splitCodeIntoChunks = async (text) => {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  
  const docs = await splitter.createDocuments([text]);
  return docs.map(doc => doc.pageContent);
};

/**
 * Generates vector embeddings for a given text using Gemini.
 * @param {string} text 
 * @returns {Array<Number>} Vector embedding
 */
const generateEmbedding = async (text) => {
  try {
    const response = await aiClient.models.embedContent({
      model: 'gemini-embedding-001',
      contents: text,
    });
    return response.embeddings[0].values;
  } catch (error) {
    logger.error('Error generating embedding:', error.message);
    throw new Error('Failed to generate embedding');
  }
};

/**
 * Generates an answer using the Gemini LLM based on retrieved context.
 * @param {string} question - The user's question
 * @param {Array<Object>} contextChunks - Retrieved relevant code chunks
 * @returns {string} AI generated response
 */
const generateAnswer = async (question, contextChunks, filePaths = []) => {
  try {
    let contextStr = contextChunks.map(chunk => 
      `File: ${chunk.filePath}\n\`\`\`\n${chunk.codeContent}\n\`\`\`\n`
    ).join('\n');

    const folderStructure = filePaths.length > 0 
      ? `\nRepository Folder Structure:\n${filePaths.join('\n')}\n` 
      : '';

    const prompt = `You are "GitChat", an expert AI programming assistant (similar to GitHub Copilot or ChatGPT).
You are helping a developer understand and debug their GitHub repository.

REPOSITORY FOLDER STRUCTURE:
${folderStructure}

RETRIEVED CODE CHUNKS:
${contextStr}

USER QUESTION:
${question}

INSTRUCTIONS:
1. Answer the user's question helpfully and conversationally using the provided code chunks and folder structure.
2. If the user's question is vague (e.g., "give me a code snippet" or "find bugs"), either give a general overview based on the context, or politely ask them to clarify which specific file or feature they are asking about.
3. If the exact answer isn't in the provided chunks, use your general programming knowledge to help them, but gently mention that you are answering based on general best practices since the exact code wasn't retrieved.
4. IMPORTANT: Always reply in the same language the user used to ask the question (e.g., if they ask in Hindi or Hinglish, reply in Hindi/Hinglish).
5. Use Markdown formatting for all code blocks and make your response look beautiful and easy to read.

Answer:`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    logger.error('Error generating answer:', error.message);
    throw new Error('Failed to generate answer from LLM');
  }
};

module.exports = {
  splitCodeIntoChunks,
  generateEmbedding,
  generateAnswer,
};
