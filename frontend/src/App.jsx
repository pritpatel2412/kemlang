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

  return (
    <div className="bg-[#121225] text-white min-h-screen font-sans selection:bg-[#FF5733]/30">
      {/* Hero */}
      <section className="min-h-[85vh] flex flex-col items-center justify-center text-center px-4 py-16 relative bg-gradient-to-b from-[#121225] to-[#0F0F1A]">
        <img
          src="./2-removebg-preview.png"
          alt="KemLang Logo"
          className="w-[200px] sm:w-[250px] mb-6 drop-shadow-[0_0_25px_rgba(255,87,51,0.2)] animate-pulse"
        />
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-white via-gray-200 to-[#FF5733] bg-clip-text text-transparent">
          KemLang Playground
        </h1>
        <p className="text-lg text-gray-400 mb-8 max-w-2xl">
          A toy programming language built with Gujarati vocabulary. Write code with local flair, transpile to JavaScript, and visualize your syntax trees live.
        </p>
        <div className="bg-[#1E1E3A] border border-gray-800 px-6 py-3 rounded-full mb-8 font-mono text-sm shadow-inner text-gray-300">
          <span className="text-[#FF5733]">npm i -g</span> kemlang
        </div>
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => { setActiveTab("playground"); scrollToPlayground(); }}
            className="bg-[#FF5733] hover:bg-[#FF7755] text-white px-8 py-3 rounded-full font-medium transition-all transform hover:scale-105 shadow-lg shadow-[#FF5733]/20"
          >
            Open Sandbox
          </button>
          <button
            onClick={() => { setActiveTab("kemgpt"); scrollToPlayground(); }}
            className="bg-[#1E1E3A] hover:bg-[#2A2A4A] border border-gray-800 text-white px-8 py-3 rounded-full font-medium transition-all transform hover:scale-105"
          >
            Ask KemGPT
          </button>
          <a
            href="https://github.com/pritpatel2412/kemlang"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white hover:bg-gray-100 text-[#121225] px-8 py-3 rounded-full font-medium transition-all transform hover:scale-105 shadow-md"
          >
            GitHub Source
          </a>
        </div>
        <div className="mt-8 text-sm text-gray-400">
          Made by{" "}
          <a
            href="https://pritfolio.vercel.app/"
            className="text-[#FF5733] hover:underline font-semibold"
            target="_blank"
          >
            @Prit Patel
          </a>
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer" onClick={scrollToPlayground}>
          <ChevronDown size={32} className="text-[#FF5733]" />
        </div>
      </section>

      {/* Sticky Premium Navigation Hub */}
      <nav className="sticky top-0 z-50 bg-[#121225]/90 backdrop-blur-md border-b border-gray-800/80 shadow-xl transition-all">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => { setActiveTab("playground"); scrollToPlayground(); }}
          >
            <img src="./2-removebg-preview.png" alt="KemLang Logo" className="h-8" />
            <span className="font-extrabold text-lg tracking-wider bg-gradient-to-r from-[#FF5733] to-white bg-clip-text text-transparent font-mono">
              KEMLANG
            </span>
          </div>

          <div className="flex flex-wrap gap-1 sm:gap-2 justify-center">
            {[
              { id: "playground", label: "💻 Sandbox" },
              { id: "kemgpt", label: "💬 KemGPT AI" },
              { id: "vartahub", label: "🤝 VartaHub" },
              { id: "docs", label: "📄 Learn" },
              { id: "vscode", label: "📦 VS Code" },
              { id: "research", label: "🔬 Research" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  scrollToPlayground();
                }}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === tab.id
                    ? "bg-[#FF5733] text-white shadow-md shadow-[#FF5733]/20"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Tab View Port */}
      <section ref={playgroundRef} className="py-12 px-4 bg-[#0F0F1A]">
        <div className="max-w-7xl mx-auto">
          {activeTab === "playground" && (
            <div className="space-y-8 animate-fadeIn">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-3xl font-extrabold text-white">Interactive Sandbox</h2>
                  <p className="text-gray-400 text-sm mt-1">
                    Execute code, inspect lexical parse tokens, and transpile logic trees instantly.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    id="run-code-button"
                    onClick={runCode}
                    disabled={isLoading}
                    className="flex items-center gap-2 bg-[#FF5733] hover:bg-[#FF7755] disabled:bg-gray-700 disabled:text-gray-400 px-6 py-2.5 rounded-full font-semibold transition-all shadow-md shadow-[#FF5733]/15 active:scale-95"
                  >
                    <Play size={16} />
                    {isLoading ? "Running..." : "Run Sandbox"}
                  </button>
                  <button
                    onClick={clearCode}
                    className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-6 py-2.5 rounded-full font-semibold transition-all active:scale-95 border border-gray-700"
                  >
                    <Trash2 size={16} />
                    Clear
                  </button>
                </div>
              </div>

              {/* Editor + Output Area */}
              <div className="grid lg:grid-cols-12 gap-8">
                {/* Monaco Editor Container */}
                <div className="lg:col-span-7 bg-[#1E1E3A] rounded-2xl overflow-hidden border border-gray-800 shadow-2xl flex flex-col">
                  <div className="bg-[#121225] px-4 py-3 border-b border-gray-800 flex items-center justify-between">
                    <span className="text-xs font-bold font-mono text-gray-400 uppercase tracking-wider">playground.kem</span>
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                    </div>
                  </div>
                  <div className="h-[450px] sm:h-[500px]">
                    <Editor code={code} onChange={setCode} />
                  </div>
                </div>

                {/* Console Output Area */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                  <div className="bg-[#1E1E3A] rounded-2xl overflow-hidden border border-gray-800 shadow-2xl flex flex-col h-full min-h-[300px]">
                    <div className="bg-[#121225] px-4 py-3 border-b border-gray-800 flex items-center justify-between">
                      <span className="text-xs font-bold font-mono text-gray-400 uppercase tracking-wider">compiler_stdout</span>
                      <span className="px-2 py-0.5 rounded bg-[#FF5733]/15 text-[#FF5733] text-[10px] font-bold uppercase tracking-widest border border-[#FF5733]/25">
                        Live Sandbox
                      </span>
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <ConsoleOutput output={output} error={error} />
                    </div>
                  </div>

                  {/* Manual High-Yield Banner Ad Unit below compiler terminal */}
                  <AdSenseUnit slot="8074288228358823" />
                </div>
              </div>

              {/* AST Visualizer & Transpiler side-by-side hub */}
              <div className="grid lg:grid-cols-2 gap-8 pt-4 border-t border-gray-800/60">
                <div className="bg-[#1E1E3A]/40 border border-gray-800/80 p-6 rounded-2xl shadow-xl">
                  <ASTVisualizer ast={ast} />
                </div>
                <div className="bg-[#1E1E3A]/40 border border-gray-800/80 p-6 rounded-2xl shadow-xl">
                  <Transpiler ast={ast} />
                </div>
              </div>
            </div>
          )}

          {activeTab === "kemgpt" && (
            <div className="animate-fadeIn">
              <KemGPT onInjectCode={handleLoadCode} />
            </div>
          )}

          {activeTab === "vartahub" && (
            <div className="animate-fadeIn">
              <VartaHub currentCode={code} onLoadCode={handleLoadCode} />
            </div>
          )}

          {activeTab === "docs" && (
            <div className="animate-fadeIn">
              <Documentation />
            </div>
          )}

          {activeTab === "vscode" && (
            <div className="animate-fadeIn">
              <VSCodePage />
            </div>
          )}

          {activeTab === "research" && (
            <div className="animate-fadeIn">
              <ResearchPage />
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0F0F1A] py-8 px-4 border-t border-gray-800/60 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <img src="/2-removebg-preview.png" alt="KemLang Logo" className="h-10" />
            <span className="font-extrabold text-sm tracking-widest font-mono text-gray-400">KEMLANG PLAYGROUND</span>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-gray-400 text-sm">
            <p className="text-center md:text-right">
              © {new Date().getFullYear()} KemLang. Created by{" "}
              <a
                href="https://pritfolio.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FF5733] hover:underline font-semibold"
              >
                Prit Patel
              </a>
            </p>
            <div className="flex gap-4">
              <a
                href="https://github.com/pritpatel2412/kemlang"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#FF5733] transition-colors"
                title="GitHub Repo"
              >
                <Github size={22} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
