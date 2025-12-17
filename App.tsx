
import React, { useState, useEffect } from 'react';
import { Platform, GeminiResponse, ImageStyle, ImageSize, ColorPalette, AspectRatio, BrandProfile, UserCredits } from './types';
import { processTextWithEmoji, generatePostImageVariation } from './geminiService';
import DocumentationView from './DocumentationView';
import PricingView from './PricingView';
import AuthModal from './AuthModal';
import { 
  ClipboardDocumentIcon, ArrowPathIcon, SparklesIcon, CheckIcon, 
  CommandLineIcon, AdjustmentsHorizontalIcon, BookOpenIcon, 
  PhotoIcon, SwatchIcon, ArrowsPointingOutIcon, KeyIcon, 
  UserCircleIcon, ArrowRightOnRectangleIcon, CreditCardIcon,
  PaintBrushIcon, Square3Stack3DIcon, ChatBubbleBottomCenterTextIcon,
  RectangleGroupIcon
} from '@heroicons/react/24/outline';

const App: React.FC = () => {
  const [view, setView] = useState<'app' | 'docs' | 'pricing'>('app');
  const [inputText, setInputText] = useState('');
  const [platform, setPlatform] = useState<Platform>(Platform.X);
  const [emojiCount, setEmojiCount] = useState<number>(3);
  
  // Auth & Account State
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [credits, setCredits] = useState<UserCredits>({ remaining: 10, total: 10, isPro: false, hasCustomKey: false });

  // Brand State
  const [brand, setBrand] = useState<BrandProfile>({ name: '', hexColor: '#000000', tone: 'Professional', isBrandModeActive: false });

  // Image Generation States
  const [imgStyle, setImgStyle] = useState<ImageStyle>(ImageStyle.PROFESSIONAL);
  const [imgSize, setImgSize] = useState<ImageSize>(ImageSize.SIZE_1K);
  const [imgPalette, setImgPalette] = useState<ColorPalette>(ColorPalette.CORPORATE);
  const [imgAspectRatio, setImgAspectRatio] = useState<AspectRatio>(AspectRatio.LANDSCAPE);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isGeneratingImg, setIsGeneratingImg] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GeminiResponse | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const checkKey = async () => {
      const hasKey = await (window as any).aistudio?.hasSelectedApiKey();
      setCredits(prev => ({ ...prev, hasCustomKey: !!hasKey }));
    };
    checkKey();
  }, [view]);

  const handleProcess = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true);
    try {
      const data = await processTextWithEmoji(inputText, platform, emojiCount);
      setResult(data);
    } catch (error) {
      console.error("Processing failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateImages = async () => {
    if (!inputText.trim()) return;
    
    if (!credits.hasCustomKey && !credits.isPro && credits.remaining <= 0) {
      alert("No credits remaining. Upgrade or use BYOK.");
      setView('pricing');
      return;
    }

    setIsGeneratingImg(true);
    setGeneratedImages([]);
    
    try {
      const variations = [1, 2, 3]; // Generating 3 variations as default
      const results = await Promise.all(
        variations.map(() => generatePostImageVariation(
          inputText, 
          imgStyle, 
          imgSize, 
          imgPalette, 
          imgAspectRatio, 
          brand.isBrandModeActive ? brand.hexColor : undefined
        ))
      );
      setGeneratedImages(results);
      if (!credits.hasCustomKey) {
        setCredits(prev => ({ ...prev, remaining: Math.max(0, prev.remaining - 1) }));
      }
    } catch (error) {
      console.error("Image generation failed:", error);
    } finally {
      setIsGeneratingImg(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (view === 'docs') return <DocumentationView onBack={() => setView('app')} />;
  if (view === 'pricing') return <PricingView onBack={() => setView('app')} />;

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 font-sans selection:bg-zinc-200">
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onSuccess={(email) => setUser({ email })}
      />

      <nav className="sticky top-0 z-[60] bg-white/80 backdrop-blur-md border-b border-zinc-200 px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('app')}>
            <div className="w-8 h-8 bg-zinc-900 rounded flex items-center justify-center">
              <CommandLineIcon className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold tracking-tight text-lg">Contextmoji Studio</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-zinc-400">
             <button onClick={() => setView('docs')} className="hover:text-zinc-900 transition-colors">Docs</button>
             <button onClick={() => setView('pricing')} className="hover:text-zinc-900 transition-colors">Pricing</button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div 
            onClick={() => setView('pricing')}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-lg cursor-pointer hover:border-zinc-400 transition-all"
          >
            <CreditCardIcon className="w-3.5 h-3.5 text-zinc-400" />
            <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
              {credits.hasCustomKey ? 'Unlimited (BYOK)' : `${credits.remaining}/${credits.total} Credits`}
            </span>
          </div>

          {!user ? (
            <button onClick={() => setIsAuthModalOpen(true)} className="bg-zinc-900 text-white text-[11px] font-bold uppercase tracking-widest px-4 py-2 rounded-md hover:bg-zinc-800 transition-all">Sign In</button>
          ) : (
            <div className="relative">
              <button onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 border border-zinc-200 hover:border-zinc-300 transition-all">
                <div className="w-6 h-6 rounded-full bg-zinc-900 flex items-center justify-center text-[10px] text-white font-bold">{user.email.charAt(0).toUpperCase()}</div>
                <span className="text-xs font-medium text-zinc-700">{user.email.split('@')[0]}</span>
              </button>
              {isAccountMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-zinc-200 rounded-xl shadow-xl py-2 z-[70] animate-in fade-in zoom-in-95">
                  <div className="px-4 py-2 border-b border-zinc-50 mb-1">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Signed in as</p>
                    <p className="text-xs font-medium text-zinc-900 truncate">{user.email}</p>
                  </div>
                  <button onClick={() => setView('pricing')} className="w-full text-left px-4 py-2 text-xs text-zinc-600 hover:bg-zinc-50 flex items-center gap-2">
                    <SparklesIcon className="w-4 h-4" /> Subscription
                  </button>
                  <button onClick={() => (window as any).aistudio.openSelectKey()} className="w-full text-left px-4 py-2 text-xs text-zinc-600 hover:bg-zinc-50 flex items-center gap-2">
                    <KeyIcon className="w-4 h-4" /> Link API Key
                  </button>
                  <div className="h-[1px] bg-zinc-50 my-1"></div>
                  <button onClick={() => setUser(null)} className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2">
                    <ArrowRightOnRectangleIcon className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-12 pb-24">
        {/* HERO SECTION - RESTORED */}
        <div className="max-w-3xl mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
          <h2 className="text-5xl font-extrabold tracking-tighter mb-4 text-zinc-900 leading-[1.1]">
            The ultimate social toolkit.
          </h2>
          <p className="text-zinc-500 text-xl font-medium leading-relaxed max-w-2xl">
            Precision emoji contextualization and high-fidelity AI visuals, 
            tuned for every high-engagement platform.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* CONTROL SIDEBAR */}
          <div className="lg:col-span-5 space-y-8 sticky top-24">
            <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 space-y-8">
                {/* INPUT SECTION */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Post Draft</label>
                    <span className="text-[10px] font-mono text-zinc-400">{inputText.length} chars</span>
                  </div>
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Enter your thoughts..."
                    className="w-full h-40 p-5 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 outline-none transition-all resize-none text-sm leading-relaxed"
                  />
                </div>

                {/* COPYWRITING STUDIO (CONTEXT DIALS) - RESTORED */}
                <div className="space-y-6 pt-6 border-t border-zinc-100">
                  <div className="flex items-center gap-2 text-zinc-900">
                    <ChatBubbleBottomCenterTextIcon className="w-5 h-5" />
                    <h3 className="text-sm font-bold tracking-tight">Copywriting Studio</h3>
                  </div>
                  
                  {/* Platform Dial */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">Target Platform</label>
                    <div className="grid grid-cols-3 gap-2">
                      {Object.values(Platform).map((p) => (
                        <button
                          key={p}
                          onClick={() => setPlatform(p)}
                          className={`px-3 py-2.5 rounded-lg text-[10px] font-bold border transition-all ${
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

                  {/* Emoji Density Slider */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                        <AdjustmentsHorizontalIcon className="w-3.5 h-3.5" />
                        Emoji Density
                      </label>
                      <span className="bg-zinc-100 px-2 py-0.5 rounded text-[10px] font-mono font-bold text-zinc-700">
                        {emojiCount} Emojis
                      </span>
                    </div>
                    <input 
                      type="range" min="0" max="15" value={emojiCount} 
                      onChange={(e) => setEmojiCount(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-zinc-100 rounded-lg appearance-none cursor-pointer accent-zinc-900"
                    />
                  </div>

                  <button
                    onClick={handleProcess}
                    disabled={isLoading || !inputText.trim()}
                    className="w-full h-12 bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-200 text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 group"
                  >
                    {isLoading ? <ArrowPathIcon className="w-5 h-5 animate-spin" /> : <><SparklesIcon className="w-4 h-4" /> Apply Context</>}
                  </button>
                </div>

                {/* VISUAL STUDIO */}
                <div className="space-y-6 pt-8 border-t border-zinc-100">
                  <div className="flex items-center gap-2 text-zinc-900">
                    <PhotoIcon className="w-5 h-5" />
                    <h3 className="text-sm font-bold tracking-tight">Visual Studio</h3>
                  </div>

                  {/* Brand Mode Toggle */}
                  <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100 space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                        <PaintBrushIcon className="w-4 h-4" /> Brand Palette
                      </label>
                      <button 
                        onClick={() => setBrand(prev => ({ ...prev, isBrandModeActive: !prev.isBrandModeActive }))}
                        className={`w-9 h-5 rounded-full relative transition-all ${brand.isBrandModeActive ? 'bg-zinc-900' : 'bg-zinc-200'}`}
                      >
                        <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${brand.isBrandModeActive ? 'left-5' : 'left-1'}`} />
                      </button>
                    </div>
                    {brand.isBrandModeActive && (
                      <div className="flex gap-2 animate-in slide-in-from-top-1">
                        <input type="color" value={brand.hexColor} onChange={(e) => setBrand(prev => ({ ...prev, hexColor: e.target.value }))} className="w-10 h-10 rounded border-none p-0 bg-transparent cursor-pointer" />
                        <input type="text" value={brand.hexColor} onChange={(e) => setBrand(prev => ({ ...prev, hexColor: e.target.value }))} className="flex-1 bg-white border border-zinc-200 rounded-lg px-3 text-xs font-mono font-bold outline-none" placeholder="#000000" />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">Style</label>
                      <select value={imgStyle} onChange={(e) => setImgStyle(e.target.value as ImageStyle)} className="w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2.5 text-xs font-bold outline-none">
                        {Object.values(ImageStyle).map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">Aspect</label>
                      <select value={imgAspectRatio} onChange={(e) => setImgAspectRatio(e.target.value as AspectRatio)} className="w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2.5 text-xs font-bold outline-none">
                        {Object.values(AspectRatio).map(ar => <option key={ar} value={ar}>{ar}</option>)}
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={handleGenerateImages}
                    disabled={isGeneratingImg || !inputText.trim()}
                    className="w-full h-12 bg-white border-2 border-zinc-900 text-zinc-900 text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-zinc-50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isGeneratingImg ? <ArrowPathIcon className="w-5 h-5 animate-spin" /> : <><Square3Stack3DIcon className="w-5 h-5" /> Render Variations</>}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RESULTS AREA */}
          <div className="lg:col-span-7 space-y-10">
            {/* Visual Variations Gallery */}
            {(isGeneratingImg || generatedImages.length > 0) && (
               <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-[0.3em]">
                    <RectangleGroupIcon className="w-4 h-4" />
                    Visual Variations
                    <div className="h-[1px] flex-1 bg-zinc-100 ml-2" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {isGeneratingImg ? (
                      [1, 2, 3].map(i => <div key={i} className="aspect-square bg-zinc-100 rounded-2xl animate-pulse border border-zinc-200" />)
                    ) : (
                      generatedImages.map((img, idx) => (
                        <div key={idx} className="group relative bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm hover:border-zinc-900 transition-all">
                          <img src={img} className="w-full aspect-square object-cover" alt="Variation" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                             <button onClick={() => { const l=document.createElement('a'); l.href=img; l.download=`var-${idx}.png`; l.click(); }} className="bg-white p-2.5 rounded-xl shadow-lg hover:scale-110 transition-transform">
                               <ArrowsPointingOutIcon className="w-4 h-4 text-zinc-900" />
                             </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
               </div>
            )}

            {/* Optimized Copy Results */}
            {isLoading || result ? (
              <div className="space-y-6">
                 <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-[0.3em]">
                    <ChatBubbleBottomCenterTextIcon className="w-4 h-4" />
                    Copywriting Results
                    <div className="h-[1px] flex-1 bg-zinc-100 ml-2" />
                  </div>
                
                 {isLoading ? (
                   <div className="h-48 bg-white border border-zinc-200 rounded-2xl animate-pulse flex items-center justify-center">
                     <SparklesIcon className="w-8 h-8 text-zinc-100 animate-spin" />
                   </div>
                 ) : result && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="bg-white border-2 border-zinc-900 rounded-2xl p-8 shadow-xl shadow-zinc-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 px-5 py-1.5 bg-zinc-900 text-[9px] font-bold text-white uppercase tracking-widest rounded-bl-xl">Prime Context</div>
                        <p className="text-xl font-medium leading-relaxed text-zinc-900 whitespace-pre-wrap">{result.originalWithEmoji}</p>
                        <div className="mt-8 pt-6 border-t border-zinc-100 flex items-center justify-between">
                          <div className="text-[11px] text-zinc-500 italic max-w-sm">{result.platformAdvice}</div>
                          <button onClick={() => copyToClipboard(result.originalWithEmoji, 'p')} className="bg-zinc-900 text-white px-5 py-2.5 rounded-lg text-[11px] font-bold uppercase tracking-widest flex items-center gap-2">
                            {copiedId === 'p' ? <CheckIcon className="w-3.5 h-3.5" /> : <ClipboardDocumentIcon className="w-3.5 h-3.5" />}
                            Copy
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        {result.variations.map((v, i) => (
                          <div key={i} className="bg-white border border-zinc-200 rounded-2xl p-6 hover:border-zinc-900 transition-all flex flex-col gap-4">
                            <p className="text-sm font-medium text-zinc-800 leading-relaxed">{v.text}</p>
                            <div className="flex items-center justify-between gap-4 pt-4 border-t border-zinc-50">
                              <span className="text-[10px] text-zinc-400 font-medium italic">{v.explanation}</span>
                              <button onClick={() => copyToClipboard(v.text, `v-${i}`)} className="p-2 hover:bg-zinc-50 rounded-lg text-zinc-400 hover:text-zinc-900 transition-colors">
                                {copiedId === `v-${i}` ? <CheckIcon className="w-4 h-4 text-green-500" /> : <ClipboardDocumentIcon className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                 )}
              </div>
            ) : !generatedImages.length && !isGeneratingImg && (
              <div className="h-full min-h-[500px] border-2 border-dashed border-zinc-200 rounded-3xl flex flex-col items-center justify-center text-center p-12">
                 <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center mb-6">
                    <SparklesIcon className="w-8 h-8 text-zinc-200" />
                 </div>
                 <h3 className="text-zinc-900 font-bold mb-2">Studio Empty</h3>
                 <p className="text-zinc-400 text-sm max-w-xs">Enter your content and visual style in the sidebar to begin generating assets.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-zinc-200 py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
           <div className="flex items-center gap-2 opacity-50">
             <CommandLineIcon className="w-5 h-5" />
             <span className="font-bold uppercase text-xs tracking-widest">Contextmoji Studio</span>
           </div>
           <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.3em] text-center">
             Professional content assets &middot; 2026 &middot; Nik Kale
           </p>
           <div className="flex gap-8 text-[11px] font-bold uppercase tracking-widest text-zinc-400">
             <button onClick={() => setView