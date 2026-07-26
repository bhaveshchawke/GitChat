import React, { useState } from 'react';
import { Loader2, GitBranch } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '../../utils/cn';
import { ingestRepository } from '../../services/api';

function RepoInputForm({ onAnalyze }) {
  const [url, setUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) return;

    // Basic GitHub URL validation
    const githubRegex = /github\.com\/([^\/]+\/[^\/]+)/i;
    const match = url.match(githubRegex);
    let repoName = url;

    if (match) {
      repoName = match[1].replace('.git', '');
    } else if (url.includes('/') && !url.includes('http')) {
      repoName = url; // assume owner/repo format
    } else {
      toast.error('Please enter a valid GitHub repository URL.');
      return;
    }

    setIsProcessing(true);
    try {
      await ingestRepository(repoName);
      onAnalyze(repoName);
      setUrl('');
      toast.success(`Successfully analyzed ${repoName}`);
    } catch (error) {
      toast.error(error.message || `Failed to analyze ${repoName}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-black transition-colors">
          <GitBranch size={18} />
        </div>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste GitHub Repo URL..."
          className="w-full bg-white border border-gray-300 text-black text-sm rounded-xl focus:ring-1 focus:ring-black focus:border-black block pl-10 p-3 placeholder-gray-400 transition-all outline-none"
          disabled={isProcessing}
        />
      </div>
      
      <button
        type="submit"
        disabled={isProcessing || !url}
        className={cn(
          "w-full flex items-center justify-center gap-2 text-white bg-black hover:bg-gray-800 font-medium rounded-xl text-sm px-5 py-3 text-center transition-all duration-300 relative overflow-hidden",
          (isProcessing || !url) && "opacity-70 cursor-not-allowed"
        )}
      >
        {isProcessing ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            <span className="tracking-wide">Analyzing chunks...</span>
          </>
        ) : (
          <span className="tracking-wide">Analyze Repository</span>
        )}
      </button>
    </form>
  );
}

export default RepoInputForm;
