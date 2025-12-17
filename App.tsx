
import React, { useState } from 'react';
import { Platform, GeminiResponse } from './types';
import { processTextWithEmoji } from './geminiService';
import DocumentationView from './DocumentationView';
import { 
  ClipboardDocumentIcon, 
  ArrowPathIcon, 
  SparklesIcon,
  CheckIcon,
  CommandLineIcon,
  AdjustmentsHorizontalIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';

const App: React.FC = () => {
  const [view, setView] = useState<'app' | 'docs'>('app');
  const [inputText, setInputText] = useState('');
  const [platform, setPlatform] = useState<Platform>(Platform.X);
  const [emojiCount, setEmojiCount] = useState<number>(3);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GeminiResponse | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleProcess = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true);
    try {
      const data = await processTextWithEmoji(inputText, platform, emojiCount);
      setResult(data);
    } catch (error) {
      console.error("Processing failed:", error);
      alert("Failed to analyze text. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getCharLimit = () => {
    if (platform === Platform.X) return 280;
    if (platform === Platform.THREADS) return 500;
    return 3000;
  };

  if (view === 'docs') {
    return (
      <div className="min-h-screen bg-[#fafafa] text-zinc-900 font-sans selection:bg-zinc-200">
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-200 px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('app')}>
            <div className="w-8 h-8 bg-zinc-900 rounded flex items-center justify-center">
              <CommandLineIcon className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold tracking-tight text-lg">Contextmoji</span>
          </div>
        </nav>
        <DocumentationView onBack={() => setView('app')} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 font-sans selection:bg-zinc-200">
      {/* Navbar - Shadcn Style */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-200 px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-zinc-900 rounded flex items-center justify-center">
            <CommandLineIcon className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold tracking-tight text-lg">Contextmoji</span>
          <span className="px-2 py-0.5 rounded-full bg-zinc-100 text-[10px] font-bold uppercase tracking-wider text-zinc-500 border border-zinc-200">Beta</span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setView('docs')}
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors flex items-center gap-1.5"
          >
            <BookOpenIcon className="w-4 h-4" />
            Documentation
          </button>
          <div className="h-4 w-[1px] bg-zinc-200" />
          <button className="bg-zinc-900 text-white text-xs font-medium px-4 py-2 rounded-md hover:bg-zinc-800 transition-all shadow-sm">
            Sign In
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 pt-12 pb-24">
        <div className="flex flex-col gap-10">
          {/* Hero Section */}
          <div className="max-w-2xl">
            <h2 className="text-4xl font-bold tracking-tight mb-3">Optimize your social reach.</h2>
            <p className="text-zinc-500 text-lg leading-relaxed">
              AI-driven emoji contextualization for professional and viral content. 
              Precision-tuned for the modern web.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Control Panel */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
                <div className="space-y-6">
                  {/* Textarea */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-semibold text-zinc-700">Content</label>
                      <span className={`text-[10px] font-mono ${inputText.length > getCharLimit() ? 'text-red-500' : 'text-zinc-400'}`}>
                        {inputText.length} / {getCharLimit()}
                      </span>
                    </div>
                    <textarea
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="What's on your mind? Contextmoji will handle the rest..."
                      className="w-full h-40 p-4 bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition-all resize-none text-sm leading-relaxed placeholder:text-zinc-400 shadow-inner"
                    />
                  </div>

                  {/* Settings */}
                  <div className="space-y-4 pt-4 border-t border-zinc-100">
                    <div>
                      <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3 block">Target Platform</label>
                      <div className="grid grid-cols-3 gap-2">
                        {Object.values(Platform).map((p) => (
                          <button
                            key={p}
                            onClick={() => setPlatform(p)}
                            className={`px-3 py-2 rounded-md text-[11px] font-bold border transition-all ${
                              platform === p 
                              ? 'bg-zinc-900 border-zinc-900 text-white shadow-md' 
                              : 'bg-white border-zinc-200 text-zinc-500 hover:border-zinc-400'
                            }`}
                          >
                            {p.split(' ')[0]}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Emoji Count Slider */}
                    <div className="pt-2">
                      <div className="flex justify-between items-center mb-4">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1">
                          <AdjustmentsHorizontalIcon className="w-3 h-3" />
                          Emoji Count
                        </label>
                        <span className="bg-zinc-100 px-2 py-0.5 rounded text-xs font-mono font-bold text-zinc-700 border border-zinc-200">
                          {emojiCount}
                        </span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="15" 
                        value={emojiCount} 
                        onChange={(e) => setEmojiCount(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-zinc-900"
                      />
                      <div className="flex justify-between mt-2 text-[10px] text-zinc-400 font-medium px-1 uppercase tracking-tighter">
                        <span>Minimalist</span>
                        <span>Standard</span>
                        <span>Heavy</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleProcess}
                    disabled={isLoading || !inputText.trim()}
                    className="w-full h-12 bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-200 text-white font-semibold rounded-lg shadow-lg shadow-zinc-200 transition-all flex items-center justify-center gap-2 group"
                  >
                    {isLoading ? (
                      <ArrowPathIcon className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <SparklesIcon className="w-4 h-4" />
                        Analyze & Generate
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Results Panel */}
            <div className="lg:col-span-7 space-y-6">
              {!result && !isLoading && (
                <div className="h-full min-h-[500px] border border-zinc-200 rounded-xl bg-white flex flex-col items-center justify-center p-12 text-center group">
                  <div className="w-16 h-16 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <SparklesIcon className="w-8 h-8 text-zinc-200" />
                  </div>
                  <h3 className="text-zinc-900 font-semibold mb-2">Ready for processing</h3>
                  <p className="text-zinc-400 text-sm max-w-xs leading-relaxed">
                    Paste your content on the left to generate platform-specific emoji variations and strategic hooks.
                  </p>
                </div>
              )}

              {isLoading && (
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-32 bg-zinc-100 rounded-xl animate-pulse border border-zinc-200" />
                  ))}
                </div>
              )}

              {result && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {/* Primary Result */}
                  <div className="bg-white border-2 border-zinc-900 rounded-xl p-8 relative overflow-hidden shadow-xl shadow-zinc-100">
                    <div className="absolute top-0 right-0 px-4 py-1.5 bg-zinc-900 text-[10px] font-bold text-white uppercase tracking-[0.2em] rounded-bl-lg">
                      Recommended
                    </div>
                    <div className="flex items-center gap-2 mb-6 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      Optimized for {platform}
                    </div>
                    <p className="text-zinc-800 text-xl leading-relaxed whitespace-pre-wrap font-medium">
                      {result.originalWithEmoji}
                    </p>
                    <div className="mt-8 flex items-center justify-between pt-6 border-t border-zinc-100">
                      <div className="text-xs text-zinc-500 flex items-center gap-2 max-w-[70%] italic">
                        <CheckIcon className="w-4 h-4 text-zinc-400" />
                        {result.platformAdvice}
                      </div>
                      <button
                        onClick={() => copyToClipboard(result.originalWithEmoji, 'primary')}
                        className="flex items-center gap-2 bg-zinc-50 hover:bg-zinc-100 px-4 py-2 rounded-md text-zinc-900 font-bold text-xs border border-zinc-200 transition-all"
                      >
                        {copiedId === 'primary' ? <CheckIcon className="w-4 h-4 text-green-600" /> : <ClipboardDocumentIcon className="w-4 h-4" />}
                        {copiedId === 'primary' ? 'Copied' : 'Copy Text'}
                      </button>
                    </div>
                  </div>

                  {/* Variations Section */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.3em] px-2 flex items-center gap-2">
                      Strategic Variations
                      <div className="h-[1px] flex-1 bg-zinc-100" />
                    </h4>
                    <div className="grid grid-cols-1 gap-4">
                      {result.variations.map((v, idx) => (
                        <div key={idx} className="group relative bg-white border border-zinc-200 rounded-xl p-6 hover:border-zinc-900 hover:shadow-lg transition-all">
                          <p className="text-zinc-800 leading-relaxed mb-4 font-medium">{v.text}</p>
                          <div className="flex items-end justify-between gap-4">
                            <div className="p-3 bg-zinc-50 rounded-lg text-xs text-zinc-500 italic leading-relaxed">
                              {v.explanation}
                            </div>
                            <button
                              onClick={() => copyToClipboard(v.text, `v-${idx}`)}
                              className="shrink-0 w-10 h-10 flex items-center justify-center bg-white border border-zinc-200 rounded-lg text-zinc-400 hover:text-zinc-900 hover:border-zinc-900 transition-all shadow-sm"
                            >
                              {copiedId === `v-${idx}` ? <CheckIcon className="w-5 h-5 text-green-500" /> : <ClipboardDocumentIcon className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="border-t border-zinc-200 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 grayscale opacity-50">
            <CommandLineIcon className="w-4 h-4" />
            <span className="text-xs font-bold tracking-tighter">CONTEXTMOJI</span>
          </div>
          <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-widest">
            Built for precision copywriters &middot; 2026 &middot; by Nik Kale
          </p>
          <div className="flex gap-4 text-xs font-bold text-zinc-400">
            <button onClick={() => setView('docs')} className="hover:text-zinc-900">Documentation</button>
            <a href="#" className="hover:text-zinc-900">Privacy</a>
            <a href="#" className="hover:text-zinc-900">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
