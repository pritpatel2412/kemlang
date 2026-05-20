import { useState } from "react";
import { Play, BookOpen, Terminal, Cpu, Globe, FileCode, Check, Sparkles, Layers, ArrowRight } from "lucide-react";
import { CpuArchitecture } from "./CpuArchitecture";

export default function LandingPage({ onLaunchSandbox, onOpenDocs }) {
  const [activeKeyword, setActiveKeyword] = useState("sharu");
  const [copiedText, setCopiedText] = useState(false);

  const keywordsList = {
    sharu: {
      gujarati: "શરૂ",
      meaning: "Start / Begin",
      desc: "Marks the absolute entry point of every KemLang program. Every script must open its block structure with this keyword, establishing the namespace scope.",
      syntax: "sharu { ... } samaapt",
      snippet: `sharu {
  // Your code starts here
  do count = 10;
} samaapt`
    },
    samaapt: {
      gujarati: "સમાપ્ત",
      meaning: "End / Termination",
      desc: "Terminates the program boundaries. It pairs strictly with 'sharu' and signals to the AST interpreter that execution has completed and memory should be deallocated.",
      syntax: "sharu { ... } samaapt",
      snippet: `sharu {
  lakho("Varta poori!");
} samaapt`
    },
    do: {
      gujarati: "કરો (Assign)",
      meaning: "Declare / Mutate Variable",
      desc: "Instructs the scanner to assign or declare an identifier in the memory heap. KemLang variables are dynamically typed and support strings, integers, and booleans.",
      syntax: "do varName = expression;",
      snippet: `sharu {
  do vartaName = "KemLang";
  do varsho = 2026;
} samaapt`
    },
    jo: {
      gujarati: "જો (If)",
      meaning: "Conditional Fork",
      desc: "Evaluates an expression inside parenthetical parameters. If the assertion evaluates to truthy ('kharu'), the parser enters the designated block structure.",
      syntax: "jo (condition) { ... } nahitar { ... }",
      snippet: `sharu {
  do marks = 85;
  jo (marks >= 35) {
    lakho("Pass thai gaya, shabash!");
  }
} samaapt`
    },
    nahitar: {
      gujarati: "નહિતર (Else)",
      meaning: "Conditional Fallback",
      desc: "Handles logic branching when the primary 'jo' conditional block evaluates to falsy ('khotu'). Guarantees execution safety and dual-path routing.",
      syntax: "jo (condition) { ... } nahitar { ... }",
      snippet: `sharu {
  do age = 15;
  jo (age >= 18) {
    lakho("Vote aapi shako chho");
  } nahitar {
    lakho("Haji thodi raah jovo bhai!");
  }
} samaapt`
    },
    jyaare: {
      gujarati: "જ્યારે (While)",
      meaning: "Loop Control Flow",
      desc: "Instantiates a traditional logic loop. The body of the block continues executing iteratively as long as the relational boolean expression remains true.",
      syntax: "jyaare (condition) { ... }",
      snippet: `sharu {
  do count = 1;
  jyaare (count <= 3) {
    lakho("Count: " + count);
    do count = count + 1;
  }
} samaapt`
    },
    lakho: {
      gujarati: "લખો (Print)",
      meaning: "Standard Output Output",
      desc: "Directs strings, literal numbers, or evaluated variable states to the standard output buffer (stdout). Essential for output presentation and terminal logs.",
      syntax: "lakho(expression);",
      snippet: `sharu {
  lakho("Kem cho Gujarat!");
  lakho(100 + 50);
} samaapt`
    },
    jaano: {
      gujarati: "જાણો (Input)",
      meaning: "Standard Input Reader",
      desc: "Allows interactive script prompts. Temporarily halts evaluation to prompt the user for input stream values and saves the resulting string into a variable.",
      syntax: "jaano(varName);",
      snippet: `sharu {
  do userResponse = "";
  lakho("Tamarun naam?");
  jaano(userResponse);
  lakho("Welcome, " + userResponse);
} samaapt`
    }
  };

  const handleCopySnippet = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="bg-canvas text-ink min-h-screen font-sans selection:bg-primary/20 space-y-24 py-8 px-6 md:px-12 max-w-7xl mx-auto">
      
      {/* 1. Hero Section */}
      <section className="grid lg:grid-cols-12 gap-12 items-center pt-8">
        <div className="lg:col-span-7 space-y-8 text-left animate-fadeIn">
          <div className="inline-flex items-center gap-2 bg-surface-soft border border-hairline px-3.5 py-1.5 rounded-full text-xs font-semibold text-primary">
            <Sparkles size={14} className="animate-pulse" />
            <span>Interactive Educational Language</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-serif-editorial text-ink leading-[1.08] tracking-tight">
            Programming, <br />
            <span className="text-primary italic">spoken from the heart.</span>
          </h1>

          <p className="text-lg text-body leading-relaxed max-w-xl font-body">
            KemLang is an ultra-premium, full-featured educational programming language utilizing warm, intuitive Gujarati keywords. Break down the English syntax barrier and let vernacular clarity make logic compiling accessible and delightful.
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={onLaunchSandbox}
              className="flex items-center gap-2 bg-primary hover:bg-primary-active text-[#faf9f5] px-7 py-3.5 rounded-md text-sm font-semibold transition-colors shadow-sm cursor-pointer select-none"
            >
              <Play size={16} />
              <span>Launch Sandbox Playground</span>
            </button>
            <button
              onClick={onOpenDocs}
              className="flex items-center gap-2 bg-canvas hover:bg-surface-soft border border-hairline text-ink px-7 py-3.5 rounded-md text-sm font-semibold transition-colors cursor-pointer select-none"
            >
              <BookOpen size={16} />
              <span>Explore Technical Docs</span>
            </button>
          </div>
        </div>

        {/* Hero Interactive Code Mockup */}
        <div className="lg:col-span-5 w-full animate-fadeIn" style={{ animationDelay: "150ms" }}>
          <div className="bg-surface-dark border border-surface-dark-elevated rounded-xl p-5 shadow-2xl flex flex-col font-mono text-xs text-on-dark-soft select-none relative max-w-md mx-auto">
            <div className="flex items-center justify-between border-b border-surface-dark-elevated pb-3 mb-4">
              <div className="flex items-center gap-2">
                <FileCode size={14} className="text-primary" />
                <span className="text-[10px] uppercase tracking-wider text-on-dark-soft font-bold">namaste.kem</span>
              </div>
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-error" />
                <div className="w-2 h-2 rounded-full bg-accent-amber" />
                <div className="w-2 h-2 rounded-full bg-success" />
              </div>
            </div>

            <div className="space-y-1.5 leading-relaxed text-left">
              <div><span className="text-[#55534c]">1</span> <span className="text-primary font-bold">sharu</span> &#123;</div>
              <div><span className="text-[#55534c]">2</span>   <span className="text-muted-soft italic">// Dynamic storage</span></div>
              <div><span className="text-[#55534c]">3</span>   <span className="text-primary">do</span> active = <span className="text-accent-amber">kharu</span>;</div>
              <div><span className="text-[#55534c]">4</span> </div>
              <div><span className="text-[#55534c]">5</span>   <span className="text-primary">jo</span> (active) &#123;</div>
              <div><span className="text-[#55534c]">6</span>     <span className="text-on-dark font-semibold">lakho</span>(<span className="text-accent-teal">"Kem cho, Gujarat!"</span>);</div>
              <div><span className="text-[#55534c]">7</span>   &#125;</div>
              <div><span className="text-[#55534c]">8</span> <span className="text-primary font-bold">&#125; samaapt</span></div>
            </div>

            {/* absolute badge representing compiler feedback */}
            <div className="absolute -bottom-5 -right-4 bg-surface-card border border-hairline text-ink rounded-lg p-3.5 shadow-xl flex items-center gap-3">
              <div className="p-2 bg-accent-teal/10 text-accent-teal border border-accent-teal/20 rounded-lg">
                <Terminal size={16} />
              </div>
              <div className="text-left font-sans">
                <p className="text-[9px] font-bold text-muted uppercase tracking-wider">Interpreter Run</p>
                <p className="text-xs font-semibold text-ink">"Kem cho, Gujarat!"</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="border-hairline" />

      {/* 2. The Pedagogical Purpose ("The Why") */}
      <section className="space-y-8 text-left">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-card border border-hairline text-primary text-xs font-semibold uppercase tracking-wider font-body">
            Educational Purpose
          </div>
          <h2 className="text-4xl md:text-5xl font-serif-editorial text-ink tracking-display-tight">
            Democratizing STEM through mother-tongue clarity.
          </h2>
          <p className="text-base text-body leading-relaxed font-body">
            Computer science is a study of logic, algorithmic structures, and mathematical modeling. Yet, for millions of students worldwide, learning to code presents a double-hurdle: mastering abstract execution models while translating instructions in a non-native language.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 pt-4">
          <div className="p-6 bg-surface-card border border-hairline rounded-xl space-y-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-3 w-fit rounded-lg bg-canvas text-primary border border-hairline">
              <Globe size={20} />
            </div>
            <h4 className="text-xl font-serif-editorial font-bold text-ink">Language Inclusivity</h4>
            <p className="text-xs text-body leading-relaxed font-body">
              Fluency in English shouldn't be a prerequisite to coding. By providing keywords spoken at home, KemLang enables a playful, logical foundation from day one.
            </p>
          </div>

          <div className="p-6 bg-surface-card border border-hairline rounded-xl space-y-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-3 w-fit rounded-lg bg-canvas text-primary border border-hairline">
              <Cpu size={20} />
            </div>
            <h4 className="text-xl font-serif-editorial font-bold text-ink">Focus on Core Logic</h4>
            <p className="text-xs text-body leading-relaxed font-body">
              Students grasp state declarations, conditional routing, and iterative counting loops without wrestling with archaic, complex syntax rules.
            </p>
          </div>

          <div className="p-6 bg-surface-card border border-hairline rounded-xl space-y-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-3 w-fit rounded-lg bg-canvas text-primary border border-hairline">
              <Sparkles size={20} />
            </div>
            <h4 className="text-xl font-serif-editorial font-bold text-ink">Humorous Error Handling</h4>
            <p className="text-xs text-body leading-relaxed font-body">
              Errors are framed with conversational, warm Gujarati feedback instead of cold hex errors, reducing learning frustration and encouraging discovery.
            </p>
          </div>
        </div>
      </section>

      <hr className="border-hairline" />

      {/* 3. The Tech Story (Authentic Compiler Pipeline) */}
      <section className="space-y-12 text-left">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-card border border-hairline text-primary text-xs font-semibold uppercase tracking-wider font-body">
              Engineering Story
            </div>
            <h2 className="text-4xl md:text-5xl font-serif-editorial text-ink tracking-display-tight">
              An authentic, robust tree-walking interpreter.
            </h2>
            <p className="text-base text-body leading-relaxed font-body">
              KemLang is **not** a basic string replacement or regular expression transpilation framework. It is a full-fledged language compiler featuring a custom scanner, a rigid recursive parser, and a real-time memory evaluator.
            </p>
            <p className="text-sm text-body leading-relaxed font-body">
              At the core of KemLang lies a virtual execution environment. While the tokenizer outputs structured symbols and the parser maps syntactic operations, the runtime dynamically evaluates variables, scopes, and flow states through a simulated hardware register logic.
            </p>
          </div>

          {/* High-fidelity visual CPU layout showing runtime registers flow */}
          <div className="lg:col-span-5 w-full">
            <div className="bg-surface-dark border border-surface-dark-elevated rounded-2xl p-6 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden select-none min-h-[260px]">
              {/* Ambient overlay */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(204,120,92,0.06),transparent_60%)] pointer-events-none" />
              <div className="relative w-full aspect-[2/1] flex items-center justify-center">
                <CpuArchitecture text="KEM-VM" className="w-full h-full" />
              </div>
              <div className="mt-4 text-center z-10">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-success/10 text-success border border-success/20 text-[10px] font-mono uppercase font-bold tracking-widest animate-pulse">
                  Runtime Processor Active
                </span>
                <p className="text-[11px] text-on-dark-soft font-mono mt-2">
                  Tree-walking evaluator routing memory registers along glowing flow lines
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Timeline of Compilation */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Step 1 */}
          <div className="relative p-6 bg-surface-soft border border-hairline rounded-xl space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold font-mono text-primary uppercase tracking-widest">Phase 01</span>
                <span className="text-xs font-semibold text-muted font-mono">Lexer Scanner</span>
              </div>
              <h4 className="text-2xl font-serif-editorial font-bold text-ink">Lexical Analysis</h4>
              <p className="text-xs text-body leading-relaxed font-body">
                The scanner loops character-by-character over source code. It validates literal definitions, tracks comment boundaries, and maps keyword identifiers like <code>sharu</code> and <code>samaapt</code> to discrete structured token structures.
              </p>
            </div>
            <div className="p-3 bg-[#181715] rounded-lg border border-hairline/10 font-mono text-[10px] text-muted-soft select-none mt-4 text-left leading-relaxed">
              <span className="text-accent-teal">"sharu"</span> <span className="text-[#faf9f5]">→</span> <span className="text-primary font-bold">TOKEN_SHARU</span><br />
              <span className="text-accent-teal">"do age = 10"</span> <span className="text-[#faf9f5]">→</span> <span className="text-accent-amber">[DO, ID("age"), EQ, INT(10)]</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative p-6 bg-surface-soft border border-hairline rounded-xl space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold font-mono text-primary uppercase tracking-widest">Phase 02</span>
                <span className="text-xs font-semibold text-muted font-mono">AST Parser</span>
              </div>
              <h4 className="text-2xl font-serif-editorial font-bold text-ink">Syntactic Parsing</h4>
              <p className="text-xs text-body leading-relaxed font-body">
                An LL(1) recursive-descent parser consumes the flat stream of tokens. Evaluating grammar expressions against Backus-Naur Form rules, it constructs a rich, hierarchical Abstract Syntax Tree representing program execution trees.
              </p>
            </div>
            <div className="p-3 bg-[#181715] rounded-lg border border-hairline/10 font-mono text-[10px] text-muted-soft select-none mt-4 text-left leading-relaxed">
              <span className="text-accent-teal">{`{ type: "ASSIGN",`}</span><br />
              <span className="text-accent-teal">{`  varName: "age",`}</span><br />
              <span className="text-accent-teal">{`  value: { type: "LITERAL", value: 10 } }`}</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative p-6 bg-surface-soft border border-hairline rounded-xl space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold font-mono text-primary uppercase tracking-widest">Phase 03</span>
                <span className="text-xs font-semibold text-muted font-mono">AST Evaluator</span>
              </div>
              <h4 className="text-2xl font-serif-editorial font-bold text-ink">Memory Tree-Walk</h4>
              <p className="text-xs text-body leading-relaxed font-body">
                The tree-walking interpreter evaluates the syntax tree dynamically node-by-node. It maintains a scoped variables memory heap, runs operations, and routes variables to outputs inside a sandboxed environment.
              </p>
            </div>
            <div className="p-3 bg-[#181715] rounded-lg border border-hairline/10 font-mono text-[10px] text-muted-soft select-none mt-4 text-left leading-relaxed">
              <span className="text-success">✔ Memory Heap Map initialized</span><br />
              <span className="text-accent-amber">evaluating Assignment ID: age → 10</span>
            </div>
          </div>

        </div>
      </section>

      <hr className="border-hairline" />

      {/* 4. About Gujarati Language */}
      <section className="grid lg:grid-cols-12 gap-12 items-center text-left">
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-card border border-hairline text-primary text-xs font-semibold uppercase tracking-wider font-body">
            Cultural Context
          </div>
          <h2 className="text-4xl md:text-5xl font-serif-editorial text-ink tracking-display-tight">
            Gujarati: The language of enterprise and warmth.
          </h2>
          <p className="text-sm text-body leading-relaxed font-body">
            Gujarati is an Indo-Aryan language spoken by over 60 million people globally, predominantly in the Indian state of Gujarat. Highly distinct, the script features a beautiful, fluid structure without the top horizontal line (shirorekha) found in sister scripts like Hindi (Devanagari).
          </p>
          <p className="text-sm text-body leading-relaxed font-body">
            Known historically as a language of global commerce, trade, and community storytelling (*Vartas*), Gujarati naturally integrates warmth and humor. KemLang embodies this spirit, translating standard binary instructions into idioms that feel personal, familiar, and culturally alive.
          </p>
        </div>

        {/* Graphic details box showing key specs */}
        <div className="lg:col-span-6 bg-surface-card border border-hairline p-8 rounded-xl space-y-6">
          <h4 className="text-2xl font-serif-editorial font-bold text-ink">Language Demographics & Traits</h4>
          <hr className="border-hairline" />

          <div className="space-y-4 font-body text-xs text-body">
            <div className="flex items-center justify-between">
              <span className="text-muted">Global Speakers</span>
              <span className="font-semibold text-ink">60,000,000+</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted">Origin Classification</span>
              <span className="font-semibold text-ink">Indo-Aryan Family</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted">Script Style</span>
              <span className="font-semibold text-ink">Abugida (Fluid cursives, no top bars)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted">Design Philosophy</span>
              <span className="font-semibold text-primary italic">"Varta" Conversational Narrative</span>
            </div>
          </div>
          
          <hr className="border-hairline" />

          <div className="p-4 bg-canvas border border-hairline rounded-lg text-xs leading-relaxed text-muted font-body">
            "Coding is a mechanism of expressing structured stories to a machine. Expressing stories in the vocabulary of home is a powerful human experience."
          </div>
        </div>
      </section>

      <hr className="border-hairline" />

      {/* 5. Interactive Keywords Translator Widget */}
      <section className="space-y-8 text-left">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-card border border-hairline text-primary text-xs font-semibold uppercase tracking-wider font-body">
            Interactive Widget
          </div>
          <h2 className="text-4xl md:text-5xl font-serif-editorial text-ink tracking-display-tight">
            Explore KemLang grammar.
          </h2>
          <p className="text-sm text-body font-body">
            Click on any of the core Gujarati keywords to explore their program operations, meanings, syntax parameters, and working context examples.
          </p>
        </div>

        {/* Translator Grid Layout */}
        <div className="grid lg:grid-cols-12 gap-8 items-start pt-4">
          
          {/* Keyword buttons panel */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3">
            {Object.keys(keywordsList).map((key) => {
              const item = keywordsList[key];
              const isSelected = activeKeyword === key;
              return (
                <button
                  key={key}
                  onClick={() => {
                    setActiveKeyword(key);
                    setCopiedText(false);
                  }}
                  className={`p-4 rounded-xl border text-left transition-all select-none cursor-pointer flex flex-col justify-between h-28 ${
                    isSelected
                      ? "bg-surface-cream-strong border-primary shadow-sm scale-[1.01] ring-1 ring-primary/30"
                      : "bg-surface-card border-hairline hover:border-primary/40 hover:bg-surface-cream-strong/50"
                  }`}
                >
                  <span className="text-xs font-mono font-bold text-primary tracking-widest">{key}</span>
                  <div>
                    <span className="block text-2xl font-serif-editorial font-bold text-ink leading-none mt-1">{item.gujarati}</span>
                    <span className="block text-[10px] text-muted mt-1 leading-none font-body font-semibold uppercase tracking-wider">{item.meaning}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Details side card */}
          <div className="lg:col-span-7 bg-[#181715] text-[#faf9f5] border border-hairline/10 p-6 rounded-xl space-y-6 shadow-xl flex flex-col justify-between min-h-[360px]">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-hairline/10 pb-3">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary text-[10px] font-mono font-bold uppercase tracking-wider">
                    {activeKeyword}
                  </span>
                  <span className="text-xl font-serif-editorial text-on-dark font-medium italic">
                    ({keywordsList[activeKeyword].gujarati})
                  </span>
                </div>
                <div className="text-[10px] text-on-dark-soft uppercase font-bold tracking-widest font-mono">
                  {keywordsList[activeKeyword].meaning}
                </div>
              </div>

              <p className="text-xs text-on-dark-soft leading-relaxed font-body">
                {keywordsList[activeKeyword].desc}
              </p>

              <div className="space-y-1.5 font-mono text-[11px]">
                <span className="text-primary font-bold uppercase tracking-wider block text-[9px] select-none">Syntactic Syntax</span>
                <div className="p-2.5 bg-[#0f0f0e] rounded text-accent-teal border border-hairline/5">
                  {keywordsList[activeKeyword].syntax}
                </div>
              </div>

              <div className="space-y-1.5 font-mono text-[11px] relative group">
                <div className="flex justify-between items-center select-none">
                  <span className="text-primary font-bold uppercase tracking-wider block text-[9px]">Syntax Context Example</span>
                  <button
                    onClick={() => handleCopySnippet(keywordsList[activeKeyword].snippet)}
                    className="text-[9px] text-on-dark-soft hover:text-on-dark font-semibold uppercase flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    {copiedText ? <Check size={10} className="text-accent-teal" /> : null}
                    <span>{copiedText ? "Copied" : "Copy Example"}</span>
                  </button>
                </div>
                <pre className="p-4 bg-[#0c0c0b] text-on-dark-soft rounded border border-hairline/5 overflow-x-auto text-left selection:bg-primary/20 leading-relaxed font-semibold">
                  {keywordsList[activeKeyword].snippet}
                </pre>
              </div>
            </div>

            {/* Load preset into Sandbox button */}
            <div className="flex justify-end pt-4 border-t border-hairline/5 select-none">
              <button
                onClick={() => {
                  onLaunchSandbox(keywordsList[activeKeyword].snippet);
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary-active text-[#faf9f5] rounded text-xs font-semibold cursor-pointer shadow-md shadow-primary/5 transition-all"
              >
                <span>Launch in Sandbox Editor</span>
                <ArrowRight size={12} />
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* Pre-footer Call To Action */}
      <section className="bg-surface-card border border-hairline rounded-xl p-8 md:p-12 text-center space-y-6 shadow-sm select-none">
        <h3 className="text-3xl md:text-5xl font-serif-editorial text-ink tracking-display-tight">
          Ready to tell your <span className="text-primary italic">varta</span>?
        </h3>
        <p className="text-sm text-body max-w-xl mx-auto font-body">
          Compile statements, evaluate boolean checks, track Abstract Syntax Trees, and transpile programs into direct Javascript in the premium interactive playground sandbox.
        </p>
        <button
          onClick={onLaunchSandbox}
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary-active text-[#faf9f5] px-8 py-3.5 rounded-md text-sm font-semibold transition-all shadow-md shadow-primary/10 cursor-pointer"
        >
          <Play size={15} />
          <span>Launch Interactive Sandbox</span>
        </button>
      </section>

    </div>
  );
}
