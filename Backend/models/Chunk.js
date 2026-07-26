const mongoose = require('mongoose');

const chunkSchema = new mongoose.Schema({
  repoUrl: {
    type: String,
    required: true,
    index: true,
  },
  filePath: {
    type: String,
    required: true,
  },
  codeContent: {
    type: String,
    required: true,
  },
  embedding: {
    type: [Number],
    required: true,
    // Note: The embedding field will be used by MongoDB Atlas Vector Search.
    // The index must be created in the Atlas UI, not through Mongoose directly.
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Chunk', chunkSchema);
