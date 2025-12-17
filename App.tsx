
import React, { useState, useEffect } from 'react';
import { Platform, GeminiResponse, ImageStyle, ImageSize, ColorPalette, AspectRatio, BrandProfile, UserCredits, TextDensity } from './types';
import { processTextWithEmoji, generatePostImageVariation } from './geminiService';
import DocumentationView from './DocumentationView';
import PricingView from './PricingView';
import AuthModal from './AuthModal';
import { 
  ClipboardDocumentIcon, ArrowPathIcon, SparklesIcon, CheckIcon, 
  AdjustmentsHorizontalIcon, BookOpenIcon, 
  PhotoIcon, SwatchIcon, ArrowsPointingOutIcon, KeyIcon, 
  UserCircleIcon, ArrowRightOnRectangleIcon, CreditCardIcon,
  PaintBrushIcon, Square3Stack3DIcon, ChatBubbleBottomCenterTextIcon,
  RectangleGroupIcon, BeakerIcon, Bars3BottomLeftIcon,
  PuzzlePieceIcon, RocketLaunchIcon
} from '@heroicons/react/24/outline';

const App: React.FC = () => {
  const [view, setView] = useState<'app' | 'docs' | 'pricing'>('app');
  const [inputText, setInputText] = useState('');
  const [platform, setPlatform] = useState<Platform>(Platform.X);
  const [emojiCount, setEmojiCount] = useState<number>(3);
  const [textDensity, setTextDensity] = useState<TextDensity>(TextDensity.BALANCED);
  
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [credits, setCredits] = useState<UserCredits>({ remaining: 10, total: 10, isPro: false, hasCustomKey: false });

  const [brand, setBrand] = useState<BrandProfile>({ name: '', hexColor: '#000000', tone: 'Professional', isBrandModeActive: false });

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
      if ((window as any).aistudio?.hasSelectedApiKey) {
        const hasKey = await (window as any).aistudio.hasSelectedApiKey();
        setCredits(prev => ({ ...prev, hasCustomKey: !!hasKey }));
      }
    };
    checkKey();
  }, [view]);

  const handleProcess = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true);
    setResult(null);
    try {
      const data = await processTextWithEmoji(inputText, platform, emojiCount, textDensity);
      setResult(data);
    } catch (error) {
      console.error("Processing failed:", error);
      alert("Text analysis failed. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateImages = async () => {
    if (!inputText.trim()) return;
    
    const hasKey = await (window as any).aistudio?.hasSelectedApiKey();
    if (!hasKey) {
      alert("Pro Image generation requires a valid API key. Opening selection...");
      await (window as any).aistudio?.openSelectKey();
      return; // Guidelines say proceed, but we need to re-check after selection or let them try again.
    }

    if (!credits.hasCustomKey && !credits.isPro && credits.remaining <= 0) {
      alert("No credits remaining. Upgrade or use BYOK.");
      setView('pricing');
      return;
    }

    setIsGeneratingImg(true);
    setGeneratedImages([]);
    
    try {
      const variations = [1, 2, 3]; 
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
    } catch (error: any) {
      console.error("Image generation failed:", error);
      if (error.message?.includes("Requested entity was not found")) {
        alert("API Key not found or invalid. Please re-select.");
        (window as any).aistudio?.openSelectKey();
      } else {
        alert("Render failed. Ensure your selected API key has Image generation permissions.");
      }
    } finally {
      setIsGeneratingImg(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const StudioLogo = () => (
    <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setView('app')}>
      <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all shadow-xl shadow-zinc-200">
        <PuzzlePieceIcon className="w-6 h-6 text-white" />
      </div>
      <div className="flex flex-col">
        <span className="font-black tracking-tight text-xl leading-none">Contextmoji</span>
        <span className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em] leading-none mt-1.5">Studio v2.5</span>
      </div>
    </div>
  );

  if (view === 'docs') return <DocumentationView onBack={() => setView('app')} />;
  if (view === 'pricing') return <PricingView onBack={() => setView('app')} />;

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 selection:bg-zinc-200">
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onSuccess={(email) => setUser({ email })}
      />

      <nav className="sticky top-0 z-[60] glass-nav border-b border-zinc-200/60 px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <StudioLogo />
          <div className="hidden lg:flex flex-col">
            <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest leading-none">The Engine</span>
            <span className="text-xs font-bold text-zinc-500 mt-1">Precision Copywriting & Visual Asset Engine</span>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="hidden md:flex items-center gap-6 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">
             <button onClick={() => setView('app')} className={`${view === 'app' ? 'text-zinc-900' : 'hover:text-zinc-900'} transition-colors`}>Studio</button>
             <button onClick={() => setView('docs')} className={`${view === 'docs' ? 'text-zinc-900' : 'hover:text-zinc-900'} transition-colors`}>Manual</button>
             <button onClick={() => setView('pricing')} className={`${view === 'pricing' ? 'text-zinc-900' : 'hover:text-zinc-900'} transition-colors`}>Pricing</button>
          </div>

          <div className="h-6 w-[1px] bg-zinc-200" />

          <div className="flex items-center gap-4">
            <div 
              onClick={() => setView('pricing')}
              className="hidden xl:flex items-center gap-3 px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl cursor-pointer hover:border-zinc-400 transition-all shadow-sm"
            >
              <CreditCardIcon className="w-4 h-4 text-zinc-400" />
              <span className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">
                {credits.hasCustomKey ? 'BYOK ACTIVATED' : `${credits.remaining}/${credits.total} RENDERS`}
              </span>
            </div>

            {!user ? (
              <button onClick={() => setIsAuthModalOpen(true)} className="bg-zinc-900 text-white text-[10px] font-black uppercase tracking-[0.1em] px-6 py-3 rounded-xl hover:bg-zinc-800 transition-all shadow-lg active:scale-95">Sign Up</button>
            ) : (
              <div className="relative">
                <button onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)} className="flex items-center gap-2 p-1 rounded-full bg-zinc-100 border border-zinc-200 hover:border-zinc-300 transition-all">
                  <div className="w-9 h-9 rounded-full bg-zinc-900 flex items-center justify-center text-xs text-white font-black">{user.email.charAt(0).toUpperCase()}</div>
                </button>
                {isAccountMenuOpen && (
                  <div className="absolute right-0 mt-4 w-64 bg-white border border-zinc-200 rounded-2xl shadow-2xl py-3 z-[70] animate-in fade-in zoom-in-95">
                    <div className="px-5 py-3 border-b border-zinc-50 mb-2">
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Active Workspace</p>
                      <p className="text-sm font-bold text-zinc-900 truncate">{user.email}</p>
                    </div>
                    <button onClick={() => setView('pricing')} className="w-full text-left px-5 py-3 text-xs font-bold text-zinc-600 hover:bg-zinc-50 flex items-center gap-3">
                      <RocketLaunchIcon className="w-4 h-4" /> Subscription Info
                    </button>
                    <button onClick={() => (window as any).aistudio.openSelectKey()} className="w-full text-left px-5 py-3 text-xs font-bold text-zinc-600 hover:bg-zinc-50 flex items-center gap-3">
                      <KeyIcon className="w-4 h-4" /> Manage API Key
                    </button>
                    <div className="h-[1px] bg-zinc-100 my-2 mx-4"></div>
                    <button onClick={() => setUser(null)} className="w-full text-left px-5 py-3 text-xs font-black text-red-500 hover:bg-red-50 flex items-center gap-3">
                      <ArrowRightOnRectangleIcon className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="max-w-4xl mb-24 animate-in fade-in slide-in-from-top-6 duration-700">
          <div className="flex items-center gap-3 text-zinc-400 mb-8">
            <div className="h-0.5 w-12 bg-zinc-200" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Contextual Asset Engine</span>
          </div>
          <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 text-zinc-900 leading-[0.9] text-gradient">
            Design <span className="text-zinc-200">Impact.</span><br/>
            Render <span className="text-zinc-200">Results.</span>
          </h2>
          <p className="text-zinc-500 text-2xl font-medium leading-relaxed max-w-2xl">
            Engineer your social presence with precision copywriting and high-fidelity visuals—tailored for global reach.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
          {/* CONTROL PANEL */}
          <div className="lg:col-span-5 space-y-10 sticky top-32">
            <div className="bg-white border border-zinc-200 rounded-[2.5rem] shadow-2xl shadow-zinc-200/60 overflow-hidden">
              <div className="p-10 space-y-12">
                {/* SOURCE */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">Core Message</label>
                    <span className="text-[10px] font-black text-zinc-300 uppercase">{inputText.length} CHARS</span>
                  </div>
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Input your draft content here..."
                    className="w-full h-48 p-8 bg-zinc-50 border border-zinc-100 rounded-[2rem] focus:ring-4 focus:ring-zinc-900/5 focus:border-zinc-200 outline-none transition-all resize-none text-sm font-semibold leading-relaxed"
                  />
                </div>

                {/* COPYWRITING DIALS */}
                <div className="space-y-10 pt-10 border-t border-zinc-100">
                  <div className="flex items-center gap-4 text-zinc-900">
                    <div className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center">
                      <ChatBubbleBottomCenterTextIcon className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-black tracking-widest uppercase">Copywriting Studio</h3>
                  </div>
                  
                  {/* Platforms */}
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block">Target Ecosystem</label>
                    <div className="grid grid-cols-3 gap-3">
                      {Object.values(Platform).map((p) => (
                        <button
                          key={p}
                          onClick={() => setPlatform(p)}
                          className={`px-3 py-4 rounded-2xl text-[10px] font-black border transition-all ${
                            platform === p 
                            ? 'bg-zinc-900 border-zinc-900 text-white shadow-xl scale-[1.03]' 
                            : 'bg-white border-zinc-100 text-zinc-500 hover:border-zinc-300'
                          }`}
                        >
                          {p === Platform.BLUE_SKY ? 'BlueSky' : p === Platform.BRUT_SOCIAL ? 'Brut Soc' : p.split(' ')[0]}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-5">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Emoji Density</label>
                        <span className="text-[10px] font-black text-zinc-900 px-3 py-1 bg-zinc-100 rounded-lg">
                          {emojiCount}
                        </span>
                      </div>
                      <input 
                        type="range" min="0" max="15" value={emojiCount} 
                        onChange={(e) => setEmojiCount(parseInt(e.target.value))}
                        className="w-full h-2 bg-zinc-100 rounded-full appearance-none cursor-pointer accent-zinc-900"
                      />
                    </div>

                    <div className="space-y-5">
                      <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block">Text Density</label>
                      <div className="flex bg-zinc-100 p-1.5 rounded-2xl">
                        {Object.values(TextDensity).map(d => (
                          <button
                            key={d}
                            onClick={() => setTextDensity(d)}
                            className={`flex-1 py-2 text-[9px] font-black uppercase rounded-xl transition-all ${
                              textDensity === d ? 'bg-white shadow-md text-zinc-900' : 'text-zinc-400 hover:text-zinc-600'
                            }`}
                          >
                            {d}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleProcess}
                    disabled={isLoading || !inputText.trim()}
                    className="w-full h-16 bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-200 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-[1.5rem] shadow-2xl transition-all flex items-center justify-center gap-4 group active:scale-[0.98]"
                  >
                    {isLoading ? <ArrowPathIcon className="w-6 h-6 animate-spin" /> : <><SparklesIcon className="w-6 h-6 group-hover:rotate-45 transition-transform" /> Tune Context</>}
                  </button>
                </div>

                {/* VISUAL DIALS */}
                <div className="space-y-10 pt-10 border-t border-zinc-100">
                  <div className="flex items-center gap-4 text-zinc-900">
                    <div className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center">
                      <PhotoIcon className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-black tracking-widest uppercase">Visual Studio</h3>
                  </div>

                  <div className="p-6 bg-zinc-50 rounded-[2rem] border border-zinc-100 space-y-6 shadow-inner">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-3">
                        <PaintBrushIcon className="w-5 h-5" /> Brand Mode
                      </label>
                      <button 
                        onClick={() => setBrand(prev => ({ ...prev, isBrandModeActive: !prev.isBrandModeActive }))}
                        className={`w-12 h-7 rounded-full relative transition-all shadow-inner ${brand.isBrandModeActive ? 'bg-zinc-900' : 'bg-zinc-200'}`}
                      >
                        <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all shadow-md ${brand.isBrandModeActive ? 'left-6' : 'left-1'}`} />
                      </button>
                    </div>
                    {brand.isBrandModeActive && (
                      <div className="flex gap-4 animate-in slide-in-from-top-3">
                        <input type="color" value={brand.hexColor} onChange={(e) => setBrand(prev => ({ ...prev, hexColor: e.target.value }))} className="w-14 h-14 rounded-2xl border-none p-0 bg-transparent cursor-pointer overflow-hidden shadow-lg" />
                        <input type="text" value={brand.hexColor} onChange={(e) => setBrand(prev => ({ ...prev, hexColor: e.target.value }))} className="flex-1 bg-white border border-zinc-200 rounded-2xl px-5 text-xs font-black outline-none tracking-widest focus:border-zinc-900" placeholder="#000000" />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Asset Style</label>
                      <select value={imgStyle} onChange={(e) => setImgStyle(e.target.value as ImageStyle)} className="w-full bg-white border border-zinc-200 rounded-2xl p-4 text-[10px] font-black uppercase outline-none focus:ring-4 focus:ring-zinc-900/5">
                        {Object.values(ImageStyle).map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Ratio</label>
                      <select value={imgAspectRatio} onChange={(e) => setImgAspectRatio(e.target.value as AspectRatio)} className="w-full bg-white border border-zinc-200 rounded-2xl p-4 text-[10px] font-black uppercase outline-none focus:ring-4 focus:ring-zinc-900/5">
                        {Object.values(AspectRatio).map(ar => <option key={ar} value={ar}>{ar}</option>)}
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={handleGenerateImages}
                    disabled={isGeneratingImg || !inputText.trim()}
                    className="w-full h-16 bg-white border-2 border-zinc-900 text-zinc-900 text-[11px] font-black uppercase tracking-[0.2em] rounded-[1.5rem] hover:bg-zinc-50 transition-all flex items-center justify-center gap-4 disabled:opacity-30 shadow-2xl shadow-zinc-100"
                  >
                    {isGeneratingImg ? <ArrowPathIcon className="w-6 h-6 animate-spin" /> : <><Square3Stack3DIcon className="w-6 h-6" /> Render Visuals</>}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RESULTS */}
          <div className="lg:col-span-7 space-y-16">
            
            {/* VARIATIONS */}
            {(isGeneratingImg || generatedImages.length > 0) && (
               <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6">
                  <div className="flex items-center gap-4 text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em]">
                    <RectangleGroupIcon className="w-6 h-6" />
                    Asset Variations
                    <div className="h-[1px] flex-1 bg-zinc-200 ml-6 opacity-40" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {isGeneratingImg ? (
                      [1, 2, 3].map(i => <div key={i} className="aspect-square bg-zinc-100 rounded-[3rem] animate-pulse border border-zinc-200" />)
                    ) : (
                      generatedImages.map((img, idx) => (
                        <div key={idx} className="group relative bg-white border border-zinc-200 rounded-[3rem] overflow-hidden shadow-sm hover:border-zinc-900 transition-all hover:shadow-2xl hover:translate-y-[-6px]">
                          <img src={img} className="w-full aspect-square object-cover" alt="Variation" />
                          <div className="absolute inset-0 bg-zinc-900/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-6">
                             <div className="bg-white/10 px-4 py-2 rounded-full">
                                <span className="text-[10px] font-black text-white uppercase tracking-widest">Asset 0{idx + 1}</span>
                             </div>
                             <button onClick={() => { const l=document.createElement('a'); l.href=img; l.download=`Context-0${idx+1}.png`; l.click(); }} className="bg-white p-5 rounded-3xl shadow-2xl hover:scale-110 transition-transform">
                               <ArrowsPointingOutIcon className="w-6 h-6 text-zinc-900" />
                             </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
               </div>
            )}

            {/* TEXT RESULTS */}
            {isLoading || result ? (
              <div className="space-y-10">
                 <div className="flex items-center gap-4 text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em]">
                    <Bars3BottomLeftIcon className="w-6 h-6" />
                    Engine Analysis
                    <div className="h-[1px] flex-1 bg-zinc-200 ml-6 opacity-40" />
                  </div>
                
                 {isLoading ? (
                   <div className="h-72 bg-white border border-zinc-100 rounded-[3rem] animate-pulse flex flex-col items-center justify-center gap-6">
                       <SparklesIcon className="w-12 h-12 text-zinc-200 animate-spin" />
                       <span className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.5em]">Engineering Context...</span>
                   </div>
                 ) : result && (
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-700">
                      <div className="bg-white border-2 border-zinc-900 rounded-[3.5rem] p-12 shadow-2xl shadow-zinc-200 relative overflow-hidden">
                        <div className="absolute top-0 right-0 px-10 py-4 bg-zinc-900 text-[11px] font-black text-white uppercase tracking-[0.2em] rounded-bl-[2.5rem]">Optimal Output</div>
                        <p className="text-3xl font-bold leading-tight text-zinc-900 whitespace-pre-wrap tracking-tight">{result.originalWithEmoji}</p>
                        <div className="mt-12 pt-10 border-t border-zinc-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-zinc-50 rounded-2xl">
                              <BeakerIcon className="w-6 h-6 text-zinc-400" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Platform Note</span>
                              <span className="text-xs font-bold text-zinc-600 mt-1">{result.platformAdvice}</span>
                            </div>
                          </div>
                          <button onClick={() => copyToClipboard(result.originalWithEmoji, 'p')} className="bg-zinc-900 text-white px-10 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center gap-4 hover:bg-zinc-800 transition-all shadow-xl active:scale-95 w-full sm:w-auto justify-center">
                            {copiedId === 'p' ? <CheckIcon className="w-5 h-5" /> : <ClipboardDocumentIcon className="w-5 h-5" />}
                            {copiedId === 'p' ? 'Stored' : 'Copy Result'}
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {result.variations.map((v, i) => (
                          <div key={i} className="bg-white border border-zinc-100 rounded-[2.5rem] p-10 hover:border-zinc-900 transition-all group flex flex-col gap-8 shadow-sm hover:shadow-2xl">
                            <div className="flex-1">
                              <span className="text-[9px] font-black text-zinc-300 uppercase tracking-widest mb-4 block">Rewrite {i+1}</span>
                              <p className="text-base font-bold text-zinc-700 leading-relaxed">{v.text}</p>
                            </div>
                            <div className="flex items-center justify-between gap-6 pt-8 border-t border-zinc-50">
                              <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">{v.explanation}</span>
                              <button onClick={() => copyToClipboard(v.text, `v-${i}`)} className="p-4 bg-zinc-50 hover:bg-zinc-900 rounded-2xl text-zinc-400 hover:text-white transition-all">
                                {copiedId === `v-${i}` ? <CheckIcon className="w-6 h-6" /> : <ClipboardDocumentIcon className="w-6 h-6" />}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                 )}
              </div>
            ) : !generatedImages.length && !isGeneratingImg && (
              <div className="h-full min-h-[700px] border-[4px] border-dashed border-zinc-200 rounded-[4rem] flex flex-col items-center justify-center text-center p-24 bg-zinc-50/20">
                 <div className="w-28 h-28 bg-white rounded-[2.5rem] flex items-center justify-center mb-10 shadow-xl border border-zinc-100">
                    <SparklesIcon className="w-12 h-12 text-zinc-200" />
                 </div>
                 <h3 className="text-zinc-900 text-3xl font-black tracking-tight mb-6 uppercase">System Readiness</h3>
                 <p className="text-zinc-400 text-lg font-medium max-w-sm leading-relaxed">
                   The Creative Workstation is optimized and awaiting your input. Select an ecosystem to begin.
                 </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-zinc-200/60 py-40 px-6 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-16">
           <StudioLogo />
           <p className="text-[11px] font-black text-zinc-300 uppercase tracking-[0.6em] text-center max-w-xl leading-loose">
             Precision Asset Delivery &middot; 2026 &middot; Engineered by Nik Kale for professional distribution.
           </p>
           <div className="flex flex-wrap justify-center gap-12 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">
             <button onClick={() => setView('app')} className="hover:text-zinc-900 transition-colors">Workspace</button>
             <button onClick={() => setView('docs')} className="hover:text-zinc-900 transition-colors">Documentation</button>
             <button onClick={() => setView('pricing')} className="hover:text-zinc-900 transition-colors">Billing</button>
             <a href="#" className="hover:text-zinc-900 transition-colors">Status</a>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
