"use client";
import "./index.css";
import { useState, useRef } from "react";
import Editor from "./components/Editor";
import ConsoleOutput from "./components/ConsoleOutput";
import Documentation from "./components/Documentation";
import KemGPT from "./components/KemGPT";
import VartaHub from "./components/VartaHub";
import ASTVisualizer from "./components/ASTVisualizer";
import Transpiler from "./components/Transpiler";
import VSCodePage from "./components/VSCodePage";
import ResearchPage from "./components/ResearchPage";
import AdSenseUnit from "./components/AdSenseUnit";
import { Play, Trash2, Github, ChevronDown, Sparkles, BookOpen, Layers, Settings, FileText, Share2 } from "lucide-react";

export default function App() {
  const [code, setCode] = useState(`sharu {

  // Variable declarations (only integers and strings)
  do name = "KemLang";
  do age = 20;
  do isActive = kharu;

  // Conditional - If/Else
  jo (age >= 18) {
    lakho("Adult user");
  } nahitar {
    lakho("Minor user");
  }

  // Boolean Check
  jo (isActive) {
    lakho("User is active");
  } nahitar {
    lakho("User is inactive");
  }

  // Loop without string concatenation
  do i = 0;
  jyaare (i < 3) {
    lakho("Counting:" + i);
    do i = i + 1;
  }

} samaapt
`);
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ast, setAst] = useState(null);
  const [activeTab, setActiveTab] = useState("playground");

  const playgroundRef = useRef(null);

  const scrollToPlayground = () => {
    playgroundRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const runCode = async () => {
    setIsLoading(true);
    setError(null);
    setOutput("Running code...");
    setAst(null);

    try {
      const response = await fetch("https://kemlang-backend.onrender.com/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (data.success) {
        setOutput(data.output || "No output");
        setAst(data.ast || null);
        setError(false);
      } else {
        setOutput(data.error || "⚠️ Unknown error occurred.");
        setAst(null);
        setError(true);
      }
    } catch (err) {
      setOutput(`Unexpected error: ${err.message}`);
      setAst(null);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const clearCode = () => {
    setCode("// Write your KemLang code here\n");
    setOutput("");
    setAst(null);
  };

  const handleLoadCode = (newCode) => {
    setCode(newCode);
    setActiveTab("playground");
    scrollToPlayground();
  };

  const [showCookieConsent, setShowCookieConsent] = useState(true);

  return (
    <div className="bg-canvas text-ink min-h-screen font-sans selection:bg-primary/20 flex flex-col">
      
      {/* Editorial Header / Brand Pinned Nav */}
      <nav className="sticky top-0 z-50 bg-canvas/85 backdrop-blur-md border-b border-hairline transition-all">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div 
            className="flex items-center gap-2.5 cursor-pointer select-none" 
            onClick={() => { setActiveTab("playground"); scrollToPlayground(); }}
          >
            {/* Anthropic style asterisk-like radial mark */}
            <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
              <path d="M12 2v20M2 12h20M5 5l14 14M5 19L19 5" />
            </svg>
            <span className="font-serif-editorial text-2xl font-medium tracking-tight text-ink">
              kemlang
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {[
              { id: "playground", label: "Sandbox" },
              { id: "kemgpt", label: "KemGPT AI" },
              { id: "vartahub", label: "VartaHub" },
              { id: "docs", label: "Documentation" },
              { id: "vscode", label: "VS Code" },
              { id: "research", label: "Research" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  scrollToPlayground();
                }}
                className={`text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "text-primary"
                    : "text-muted hover:text-ink"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/pritpatel2412/kemlang"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-ink transition-colors"
              title="GitHub Repository"
            >
              <Github size={20} />
            </a>
            <button
              onClick={() => { setActiveTab("playground"); scrollToPlayground(); }}
              className="bg-primary hover:bg-primary-active text-white text-xs font-semibold px-4 py-2 rounded-md transition-colors shadow-sm select-none"
            >
              Try Sandbox
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Sub-Navigation menu strip */}
      <div className="md:hidden sticky top-[61px] z-40 bg-surface-soft border-b border-hairline overflow-x-auto whitespace-nowrap scrollbar-none flex gap-1 px-4 py-2">
        {[
          { id: "playground", label: "💻 Sandbox" },
          { id: "kemgpt", label: "💬 KemGPT" },
          { id: "vartahub", label: "🤝 VartaHub" },
          { id: "docs", label: "📄 Docs" },
          { id: "vscode", label: "📦 VS Code" },
          { id: "research", label: "🔬 Research" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === tab.id
                ? "bg-surface-cream-strong text-ink border border-hairline"
                : "text-muted hover:text-ink"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Hero Band - 6-6 Grid Layout (Only on Sandbox/Playground page) */}
      {activeTab === "playground" && (
        <section className="bg-canvas border-b border-hairline py-20 px-6 md:px-12 flex flex-col justify-center relative overflow-hidden">
          <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-12 items-center">
            
            {/* Hero Content Left */}
            <div className="md:col-span-7 flex flex-col items-start text-left animate-fadeIn">
              <div className="inline-flex items-center gap-2 bg-surface-soft border border-hairline px-3 py-1 rounded-full text-xs font-medium text-primary mb-6">
                <span className="flex h-1.5 w-1.5 rounded-full bg-accent-teal animate-pulse" />
                <span>KemLang v0.4.0 is now live</span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl font-serif-editorial text-ink mb-6 leading-[1.08] tracking-tight">
                Write programs, <br />
                <span className="text-primary italic">Desi style.</span>
              </h1>
              
              <p className="text-base sm:text-lg text-body mb-8 max-w-xl leading-relaxed">
                Meet the thinking partner you can talk to in local voice. KemLang is a toy educational programming language with custom Gujarati keywords designed to make compiling logic structures delightfully engaging.
              </p>
              
              <div className="flex flex-wrap gap-3 mb-8">
                <button
                  onClick={() => { setActiveTab("playground"); scrollToPlayground(); }}
                  className="bg-primary hover:bg-primary-active text-white text-sm font-semibold px-6 py-3 rounded-md transition-colors shadow-sm cursor-pointer"
                >
                  Launch Sandbox
                </button>
                <button
                  onClick={() => { setActiveTab("kemgpt"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className="bg-canvas hover:bg-surface-soft border border-hairline text-ink text-sm font-semibold px-6 py-3 rounded-md transition-colors cursor-pointer"
                >
                  Ask KemGPT AI
                </button>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-surface-soft border border-hairline font-mono text-xs text-body-strong">
                <span className="text-primary">$</span>
                <span>npm install -g kemlang</span>
              </div>
            </div>

            {/* Hero Illustration mockup Right */}
            <div className="md:col-span-5 w-full">
              <div className="bg-surface-dark border border-surface-dark-elevated rounded-xl p-5 shadow-2xl flex flex-col font-mono text-xs text-on-dark-soft select-none relative max-w-md mx-auto">
                <div className="flex items-center justify-between border-b border-surface-dark-elevated pb-3 mb-4">
                  <span className="text-[10px] uppercase tracking-wider text-muted-soft">preview.kem</span>
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-error" />
                    <div className="w-2 h-2 rounded-full bg-accent-amber" />
                    <div className="w-2 h-2 rounded-full bg-success" />
                  </div>
                </div>
                
                <div className="space-y-1.5 leading-relaxed overflow-x-auto whitespace-pre text-left">
                  <div><span className="text-muted-soft">1</span> <span className="text-primary font-bold">sharu</span> &#123;</div>
                  <div><span className="text-muted-soft">2</span>   <span className="text-[#8E8B82] italic">// Declare variables</span></div>
                  <div><span className="text-muted-soft">3</span>   <span className="text-primary">do</span> name = <span className="text-accent-teal">"KemLang"</span>;</div>
                  <div><span className="text-muted-soft">4</span>   <span className="text-primary">do</span> active = <span className="text-accent-amber">kharu</span>;</div>
                  <div><span className="text-muted-soft">5</span> </div>
                  <div><span className="text-muted-soft">6</span>   <span className="text-[#8E8B82] italic">// Condition check</span></div>
                  <div><span className="text-muted-soft">7</span>   <span className="text-primary">jo</span> (active) &#123;</div>
                  <div><span className="text-muted-soft">8</span>     <span className="text-on-dark">lakho</span>(<span className="text-accent-teal">"Kem cho, "</span> + name);</div>
                  <div><span className="text-muted-soft">9</span>   &#125;</div>
                  <div><span className="text-muted-soft">10</span> <span className="text-primary font-bold">&#125; samaapt</span></div>
                </div>

                {/* absolute overlay badge */}
                <div className="absolute -bottom-4 -right-4 bg-surface-card border border-hairline text-ink rounded-lg p-3 shadow-lg flex items-center gap-2 select-none">
                  <svg className="w-4 h-4 text-primary animate-spin-slow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 2v20M2 12h20M5 5l14 14M5 19L19 5" />
                  </svg>
                  <div className="text-left">
                    <p className="text-[10px] font-bold text-ink uppercase tracking-wider">Compiled Output</p>
                    <p className="text-xs text-muted font-sans font-medium">"Kem cho, KemLang"</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Tab View Port (Alternates based on page type) */}
      <main className="flex-1">
        {activeTab === "playground" && (
          <section ref={playgroundRef} className="py-16 px-6 bg-surface-soft border-b border-hairline">
            <div className="max-w-7xl mx-auto">
              <div className="space-y-8 animate-fadeIn">
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-hairline">
                  <div>
                    <h2 className="text-4xl font-serif-editorial text-ink mb-2">Interactive Sandbox</h2>
                    <p className="text-muted text-sm font-body">
                      Execute code, inspect AST parse tokens, and transpile logic trees instantly.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      id="run-code-button"
                      onClick={runCode}
                      disabled={isLoading}
                      className="flex items-center gap-2 bg-primary hover:bg-primary-active disabled:bg-primary-disabled text-white px-5 py-2.5 rounded-md text-sm font-semibold transition-colors shadow-sm select-none cursor-pointer"
                    >
                      <Play size={15} />
                      {isLoading ? "Running..." : "Run Code"}
                    </button>
                    <button
                      onClick={clearCode}
                      className="flex items-center gap-2 bg-canvas hover:bg-surface-soft border border-hairline text-ink px-5 py-2.5 rounded-md text-sm font-semibold transition-colors select-none cursor-pointer"
                    >
                      <Trash2 size={15} />
                      Clear
                    </button>
                  </div>
                </div>

                {/* Editor + Output Area - Premium alternating cards */}
                <div className="grid lg:grid-cols-12 gap-8">
                  
                  {/* Code Editor Mockup Card */}
                  <div className="lg:col-span-7 bg-surface-dark border border-surface-dark-elevated rounded-lg shadow-xl overflow-hidden flex flex-col">
                    <div className="bg-surface-dark-soft px-4 py-3.5 border-b border-surface-dark-elevated flex items-center justify-between select-none">
                      <span className="text-[10px] font-bold font-mono text-on-dark-soft uppercase tracking-wider">playground.kem</span>
                      <div className="flex gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-error" />
                        <div className="w-2 h-2 rounded-full bg-accent-amber" />
                        <div className="w-2 h-2 rounded-full bg-success" />
                      </div>
                    </div>
                    <div className="h-[450px] sm:h-[500px] bg-surface-dark">
                      <Editor code={code} onChange={setCode} />
                    </div>
                  </div>

                  {/* Console Output Mockup Card */}
                  <div className="lg:col-span-5 flex flex-col gap-6">
                    <div className="bg-surface-dark border border-surface-dark-elevated rounded-lg shadow-xl overflow-hidden flex flex-col h-full min-h-[300px]">
                      <div className="bg-surface-dark-soft px-4 py-3.5 border-b border-surface-dark-elevated flex items-center justify-between select-none">
                        <span className="text-[10px] font-bold font-mono text-on-dark-soft uppercase tracking-wider">compiler_stdout</span>
                        <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[9px] font-bold uppercase tracking-widest border border-primary/20">
                          Live Sandbox
                        </span>
                      </div>
                      <div className="flex-1 flex flex-col justify-between bg-surface-dark">
                        <ConsoleOutput output={output} error={error} />
                      </div>
                    </div>

                    {/* High-Yield AdSense Unit Banner */}
                    <AdSenseUnit slot="8074288228358823" />
                  </div>
                </div>

                {/* AST Visualizer & Transpiler side-by-side hub inside Dark Mockups */}
                <div className="grid lg:grid-cols-2 gap-8 pt-8 border-t border-hairline">
                  <div className="bg-surface-dark border border-surface-dark-elevated p-6 rounded-lg shadow-xl text-on-dark text-left">
                    <ASTVisualizer ast={ast} />
                  </div>
                  <div className="bg-surface-dark border border-surface-dark-elevated p-6 rounded-lg shadow-xl text-on-dark text-left">
                    <Transpiler ast={ast} />
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === "kemgpt" && (
          <section className="py-12 px-6 bg-canvas min-h-[70vh]">
            <div className="max-w-7xl mx-auto animate-fadeIn">
              <KemGPT onInjectCode={handleLoadCode} />
            </div>
          </section>
        )}

        {activeTab === "vartahub" && (
          <section className="py-12 px-6 bg-canvas min-h-[70vh]">
            <div className="max-w-7xl mx-auto animate-fadeIn">
              <VartaHub currentCode={code} onLoadCode={handleLoadCode} />
            </div>
          </section>
        )}

        {activeTab === "docs" && (
          <section className="py-12 px-6 bg-canvas min-h-[70vh]">
            <div className="max-w-7xl mx-auto animate-fadeIn">
              <Documentation onLoadCode={handleLoadCode} />
            </div>
          </section>
        )}

        {activeTab === "vscode" && (
          <section className="py-12 px-6 bg-canvas min-h-[70vh]">
            <div className="max-w-7xl mx-auto animate-fadeIn">
              <VSCodePage />
            </div>
          </section>
        )}

        {activeTab === "research" && (
          <section className="py-12 px-6 bg-canvas min-h-[70vh]">
            <div className="max-w-7xl mx-auto animate-fadeIn">
              <ResearchPage />
            </div>
          </section>
        )}
      </main>

      {/* Floating Cookie Consent banner */}
      {showCookieConsent && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-surface-dark text-on-dark rounded-lg p-5 border border-surface-dark-elevated shadow-2xl animate-fadeIn flex flex-col gap-4 text-left">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2v20M2 12h20M5 5l14 14M5 19L19 5" />
              </svg>
              <h4 className="font-serif-editorial text-lg text-on-dark font-medium">Cookie Settings</h4>
            </div>
            <button 
              onClick={() => setShowCookieConsent(false)}
              className="text-on-dark-soft hover:text-on-dark text-lg"
            >
              &times;
            </button>
          </div>
          <p className="text-xs text-on-dark-soft leading-relaxed">
            We use essential cookies to manage your editor templates and optimize our Google AdSense high-yield advertising layouts. By continuing, you agree to our policies.
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowCookieConsent(false)}
              className="text-xs text-on-dark-soft hover:text-on-dark px-3 py-1.5 font-medium"
            >
              Declined
            </button>
            <button
              onClick={() => setShowCookieConsent(false)}
              className="bg-primary hover:bg-primary-active text-white text-xs font-semibold px-3 py-1.5 rounded"
            >
              Accept Cookies
            </button>
          </div>
        </div>
      )}

      {/* Dark Navy Footer Pacing Layer */}
      <footer className="bg-surface-dark py-16 px-6 border-t border-surface-dark-elevated mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 select-none text-left">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
              <path d="M12 2v20M2 12h20M5 5l14 14M5 19L19 5" />
            </svg>
            <span className="font-serif-editorial text-xl font-medium tracking-tight text-on-dark">
              kemlang
            </span>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-on-dark-soft text-xs font-medium">
            <p>
              © {new Date().getFullYear()} KemLang. Created by{" "}
              <a
                href="https://pritfolio.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-semibold"
              >
                Prit Patel
              </a>
            </p>
            <div className="flex gap-4">
              <a
                href="https://github.com/pritpatel2412/kemlang"
                target="_blank"
                rel="noopener noreferrer"
                className="text-on-dark-soft hover:text-on-dark transition-colors"
                title="GitHub Repo"
              >
                <Github size={18} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
