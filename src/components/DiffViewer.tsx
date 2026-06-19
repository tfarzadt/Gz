import React, { useState } from 'react';
import { PatchFile } from '../types';
import { Clipboard, Check, Download, FileCode, CheckSquare, Code, AlertTriangle } from 'lucide-react';

interface DiffViewerProps {
  files: PatchFile[];
}

export const DiffViewer: React.FC<DiffViewerProps> = ({ files }) => {
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'diff' | 'code'>('diff');
  const [copied, setCopied] = useState(false);

  const activeFile = files[selectedFileIndex];

  const handleCopy = () => {
    const textToCopy = viewMode === 'diff' ? activeFile.unifiedDiff : (activeFile.fullContent || activeFile.unifiedDiff);
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = () => {
    const text = viewMode === 'diff' ? activeFile.unifiedDiff : (activeFile.fullContent || activeFile.unifiedDiff);
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = viewMode === 'diff' ? `${activeFile.filepath.split('/').pop()}.patch` : activeFile.filepath.split('/').pop() || 'patch';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Convert unified diff lines into highlighted lines
  const renderDiffLines = (diffStr: string) => {
    return diffStr.split('\n').map((line, idx) => {
      let bgClass = 'text-zinc-400 bg-transparent';
      if (line.startsWith('+') && !line.startsWith('+++')) {
        bgClass = 'bg-emerald-950/40 text-emerald-300 border-l-2 border-emerald-500 pl-1';
      } else if (line.startsWith('-') && !line.startsWith('---')) {
        bgClass = 'bg-rose-950/40 text-rose-300 border-l-2 border-rose-500 pl-1 line-through';
      } else if (line.startsWith('@@')) {
        bgClass = 'bg-zinc-900 text-cyan-400/90 font-bold border-l-2 border-cyan-500 pl-1 py-0.5';
      } else if (line.startsWith('---') || line.startsWith('+++')) {
        bgClass = 'text-zinc-200 font-bold bg-zinc-900/50 pl-1';
      }

      return (
        <div key={idx} className={`font-mono text-xs whitespace-pre-wrap leading-5 ${bgClass}`}>
          {line || ' '}
        </div>
      );
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="patch-diff-root">
      {/* Dynamic File Selector List */}
      <div className="lg:col-span-4 space-y-2">
        <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-3">Modernized Files ({files.length})</h3>
        <div className="space-y-1">
          {files.map((file, idx) => (
            <button
              key={idx}
              id={`file-btn-${idx}`}
              onClick={() => {
                setSelectedFileIndex(idx);
                setCopied(false);
              }}
              className={`w-full text-left p-3 rounded-lg border text-xs flex items-start gap-3 transition-all ${
                selectedFileIndex === idx
                  ? 'bg-zinc-800/80 border-cyan-500/80 shadow-md shadow-cyan-950/10'
                  : 'bg-zinc-900/40 border-zinc-800 hover:bg-zinc-800/40 text-zinc-400'
              }`}
            >
              <div className="p-1.5 rounded-md bg-zinc-950/60 mt-0.5">
                <FileCode className={`w-4 h-4 ${selectedFileIndex === idx ? 'text-cyan-400' : 'text-zinc-500'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate text-zinc-200">{file.filepath}</div>
                <div className="text-[10px] text-zinc-500 uppercase mt-0.5 flex gap-2">
                  <span className={file.status === 'added' ? 'text-emerald-400' : 'text-amber-400'}>
                    [{file.status.toUpperCase()}]
                  </span>
                  <span>• {file.fileType.toUpperCase()}</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="bg-amber-950/20 border border-amber-800/40 p-4 rounded-lg mt-4">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <div className="font-semibold text-amber-400">Memory Determinism Guard</div>
              <p className="text-zinc-400 leading-relaxed">
                Pointer alignment is strictly computed to 16 bytes. Dynamic allocations during multiplayer simulations utilize contiguous heaps to match structure alignment rules exactly.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Code / Patch display panel */}
      <div className="lg:col-span-8 flex flex-col h-[600px] border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950">
        <div className="flex justify-between items-center bg-zinc-900/90 px-4 py-3 border-b border-zinc-800">
          <div className="flex gap-2">
            <button
              id="view-mode-diff"
              onClick={() => setViewMode('diff')}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                viewMode === 'diff' ? 'bg-zinc-800 text-cyan-400 border border-cyan-800/30' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Unified Diff View
            </button>
            <button
              id="view-mode-code"
              onClick={() => {
                setViewMode('code');
                // Auto-generate realistic full code content if missing
                if (!activeFile.fullContent) {
                  activeFile.fullContent = activeFile.unifiedDiff
                    .split('\n')
                    .filter(line => !line.startsWith('-') && !line.startsWith('---') && !line.startsWith('@@'))
                    .map(line => line.startsWith('+') ? line.substring(1) : line)
                    .join('\n');
                }
              }}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                viewMode === 'code' ? 'bg-zinc-800 text-cyan-400 border border-cyan-800/30' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Full implementation Source
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="copy-patch-btn"
              onClick={handleCopy}
              className="p-1.5 rounded bg-zinc-850 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition-all flex items-center gap-1 text-[11px]"
              title="Copy snippet"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Clipboard className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
            <button
              id="download-patch-btn"
              onClick={downloadFile}
              className="p-1.5 rounded bg-zinc-850 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition-all flex items-center gap-1 text-[11px]"
              title="Download file"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
          </div>
        </div>

        {/* Info label */}
        <div className="bg-zinc-900/30 px-4 py-2 border-b border-zinc-800/65 text-[11px] text-zinc-500 flex gap-2">
          <span className="font-bold text-zinc-400">Target Path:</span>
          <span>{activeFile.filepath}</span>
        </div>

        {/* Scrollable code window */}
        <div className="flex-1 p-4 overflow-auto bg-zinc-950 font-mono select-text">
          {viewMode === 'diff' ? (
            <div className="space-y-0.5">{renderDiffLines(activeFile.unifiedDiff)}</div>
          ) : (
            <pre className="text-xs text-zinc-300 leading-5">
              <code>{activeFile.fullContent || activeFile.unifiedDiff}</code>
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};
