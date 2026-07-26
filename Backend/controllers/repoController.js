const { parseRepoUrl, fetchRepoTree, fetchFileContent } = require('../services/githubService');
const { splitCodeIntoChunks, generateEmbedding } = require('../services/aiService');
const Chunk = require('../models/Chunk');
const logger = require('../utils/logger');

const ingestRepo = async (req, res) => {
  try {
    const { repoUrl } = req.body;

    if (!repoUrl) {
      return res.status(400).json({ success: false, message: 'repoUrl is required.' });
    }

    // Check if repo is already ingested
    const existingChunks = await Chunk.countDocuments({ repoUrl });
    if (existingChunks > 0) {
      return res.status(200).json({ success: true, message: 'Repository already ingested.', count: existingChunks });
    }

    const { owner, repo } = parseRepoUrl(repoUrl);
    logger.info(`Starting ingestion for ${owner}/${repo}`);

    const files = await fetchRepoTree(owner, repo);
    logger.info(`Found ${files.length} valid files to process.`);

    let processedCount = 0;
    
    // In a real production app, this should be a background job (e.g. using BullMQ).
    // For this demonstration, we'll process it synchronously/in-memory.
    for (const file of files) {
      try {
        const fileContent = await fetchFileContent(owner, repo, file.sha);
        if (!fileContent) continue; // Skip if empty or failed

        // Split into chunks
        const chunks = await splitCodeIntoChunks(fileContent);

        // Process each chunk
        for (const chunk of chunks) {
          if (!chunk.trim()) continue;

          // Generate embedding for chunk
          const embedding = await generateEmbedding(chunk);

          // Save to MongoDB
          await Chunk.create({
            repoUrl,
            filePath: file.path,
            codeContent: chunk,
            embedding,
          });
          processedCount++;
        }
      } catch (err) {
        logger.warn(`Failed to process file ${file.path}: ${err.message}`);
        // continue with other files
      }
    }

    logger.info(`Successfully ingested ${processedCount} chunks for ${repoUrl}`);
    res.status(200).json({ success: true, message: 'Ingestion complete.', chunksProcessed: processedCount });
  } catch (error) {
    logger.error('Error in ingestRepo controller:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  ingestRepo,
};
