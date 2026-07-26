const axios = require('axios');
const logger = require('../utils/logger');

// Common non-code or binary file extensions to ignore
const IGNORED_EXTENSIONS = [
  '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico',
  '.mp4', '.mp3', '.pdf', '.zip', '.tar', '.gz',
  '.lock', 'package-lock.json', 'yarn.lock', '.gitignore'
];

/**
 * Extracts owner and repo name from a GitHub URL.
 * @param {string} url - e.g., https://github.com/expressjs/express
 * @returns { owner, repo }
 */
const parseRepoUrl = (url) => {
  if (!url) throw new Error('URL is empty');
  
  // Clean up URL: remove whitespace, trailing slashes, and .git extension
  let cleanUrl = url.trim().replace(/\.git$/, '').replace(/\/$/, '');
  
  let owner, repo;
  
  if (cleanUrl.includes('github.com/')) {
    const match = cleanUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/i);
    if (!match) throw new Error('Invalid GitHub URL');
    owner = match[1];
    repo = match[2];
  } else {
    // Fallback for "owner/repo" format
    const parts = cleanUrl.split('/').filter(p => p.trim() !== '');
    if (parts.length < 2) throw new Error('Invalid repository format. Use owner/repo or full GitHub URL.');
    // In case they pass something weird, just take the last two parts
    owner = parts[parts.length - 2];
    repo = parts[parts.length - 1];
  }

  return { owner, repo };
};

/**
 * Fetches the file tree of a GitHub repository.
 * @param {string} owner
 * @param {string} repo
 * @returns {Array} List of file objects
 */
const fetchRepoTree = async (owner, repo) => {
  try {
    const headers = {};
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }

    // Get the default branch (usually main or master)
    const repoInfo = await axios.get(`https://api.github.com/repos/${owner}/${repo}`, { headers });
    const defaultBranch = repoInfo.data.default_branch;

    // Fetch the tree recursively
    const treeUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`;
    const response = await axios.get(treeUrl, { headers });

    // Filter to only include files (blobs), not directories (trees), and ignore certain extensions
    const files = response.data.tree.filter(item => {
      if (item.type !== 'blob') return false;
      const lowerPath = item.path.toLowerCase();
      return !IGNORED_EXTENSIONS.some(ext => lowerPath.endsWith(ext));
    });

    return files;
  } catch (error) {
    logger.error('Error fetching repo tree:', error.response?.data || error.message);
    throw new Error('Failed to fetch repository tree from GitHub.');
  }
};

/**
 * Fetches the raw content of a specific file from GitHub.
 * @param {string} owner 
 * @param {string} repo 
 * @param {string} fileSha 
 * @returns {string} File content
 */
const fetchFileContent = async (owner, repo, fileSha) => {
  try {
    const headers = {
      'Accept': 'application/vnd.github.v3.raw'
    };
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }

    const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/git/blobs/${fileSha}`, { headers });
    
    // Convert to string if Axios auto-parsed it as JSON
    let content = response.data;
    if (typeof content !== 'string') {
      content = JSON.stringify(content, null, 2);
    }
    return content;
  } catch (error) {
    logger.error(`Error fetching file content for SHA ${fileSha}:`, error.message);
    return null; // Return null to skip files that fail
  }
};

module.exports = {
  parseRepoUrl,
  fetchRepoTree,
  fetchFileContent,
};
