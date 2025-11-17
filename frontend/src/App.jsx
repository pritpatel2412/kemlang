"use client";
import "./index.css";
import { useState, useRef } from "react";
import Editor from "./components/Editor";
import ConsoleOutput from "./components/ConsoleOutput";
import Documentation from "./components/Documentation";
import { Play, Trash2, Github, ChevronDown } from "lucide-react";

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

  const playgroundRef = useRef(null);
  const docsRef = useRef(null);

  const scrollToPlayground = () => {
    playgroundRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToDocs = () => {
    docsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const runCode = async () => {
  setIsLoading(true);
  setError(null);
  setOutput("Running code...");

  try {
    const response = await fetch("https://kemlang-backend.onrender.com/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });

    const data = await response.json();

    if (data.success) {
      setOutput(data.output || "No output");
      setError(false);
    } else {
      setOutput(data.error || "⚠️ Unknown error occurred.");
      setError(true);
    }
  } catch (err) {
    setOutput(`Unexpected error: ${err.message}`);
    setError(true);
  } finally {
    setIsLoading(false);
  }
};


  const clearCode = () => {
    setCode("// Write your KemLang code here\n");
    setOutput("");
  };

  return (
    <div className="bg-[#121225] text-white">
      {/* Hero */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-4 py-16 relative">
        <img
          src="./logo.png"
          alt="KemLang Logo"
          className="w-[450px] sm:w-[550px] mb-6"
        />
        <p className="text-lg mb-8">A toy programming language playground</p>
        <div className="bg-[#1E1E3A] px-4 py-2 rounded-md mb-8 font-mono text-sm">
          npm i -g kemlang
        </div>
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={scrollToPlayground}
            className="bg-[#FF5733] hover:bg-[#FF7755] text-white px-8 py-3 rounded-md transition-colors"
          >
            Playground
          </button>
          <a
            href="https://github.com/pritpatel2412"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white hover:bg-gray-200 text-[#121225] px-8 py-3 rounded-md transition-colors"
          >
            View Source
          </a>
          <button
            onClick={scrollToDocs}
            className="bg-[#1E1E3A] hover:bg-[#2A2A4A] text-white px-8 py-3 rounded-md transition-colors"
          >
            Documentation
          </button>
        </div>
        <div className="mt-8 text-sm text-gray-400">
          Made by{" "}
          <a
            href="https://pritfolio.vercel.app/"
            className="text-[#FF5733] hover:underline"
            target="_blank"
          >
            @Prit Patel
          </a>
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown size={32} className="text-[#FF5733]" />
        </div>
      </section>

      {/* Playground */}
      <section ref={playgroundRef} className="min-h-screen py-16 px-4 bg-[#0F0F1A]">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold mb-8 text-[#FF5733]">Playground</h2>

          <div className="mb-4 flex flex-wrap justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">
              Write and execute KemLang code directly in your browser
            </p>
            <div className="flex gap-2">
              <button
                id="run-code-button"
                onClick={runCode}
                disabled={isLoading}
                className="flex items-center gap-2 bg-[#FF5733] hover:bg-[#FF7755] disabled:bg-gray-700 disabled:text-gray-400 px-4 py-2 rounded-md transition-colors"
              >
                <Play size={16} />
                {isLoading ? "Running..." : "Run"}
              </button>
              <button
                onClick={clearCode}
                className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md transition-colors"
              >
                <Trash2 size={16} />
                Clear
              </button>
            </div>
          </div>

          <div className="bg-[#1E1E3A] rounded-md overflow-hidden mb-4 border border-gray-800">
            <div className="h-[400px] sm:h-[500px]">
              <Editor code={code} onChange={setCode} />
            </div>
          </div>

          <div className="bg-[#1E1E3A] rounded-md overflow-hidden border border-gray-800">
            <div className="p-4 border-b border-gray-800">
              <h2 className="font-medium">Output</h2>
            </div>
            <ConsoleOutput output={output} error={error} />
          </div>
        </div>
      </section>

      {/* Docs */}
      <section ref={docsRef} className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold mb-8 text-[#FF5733]">Documentation</h2>
          <Documentation />
        </div>
      </section>

      <footer className="bg-[#0F0F1A] py-6 px-4 border-t border-gray-800">
  <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
    
    {/* Left: Logo */}
    <div className="flex items-center gap-2">
      <img src="/2-removebg-preview.png" alt="KemLang Logo" className="h-10" />
    </div>

    {/* Right: Text and GitHub link */}
    <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-gray-400 text-sm">
      <p className="text-center md:text-right">
        © {new Date().getFullYear()} KemLang. Created by{" "}
        <a
          href="https://pritfolio.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#FF5733] hover:underline"
        >
          Prit Patel
        </a>
      </p>
      <a
        href="https://github.com/pritpatel2412"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-400 hover:text-[#FF5733] transition-colors"
      >
        <Github size={20} />
      </a>
    </div>

  </div>
</footer>

    </div>
  );
}
