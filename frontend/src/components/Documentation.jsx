import { useState } from "react";
import { Copy, Check, BookOpen, Play, Code, HelpCircle, FileText, Cpu, Layers } from "lucide-react";
import AdSenseUnit from "./AdSenseUnit";

function CodeBlock({ code, onLoadCode }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simple syntax colorizer for Gujarati keywords to look incredibly premium in static cards
  const highlightCode = (raw) => {
    const keywords = ["sharu", "samaapt", "do", "jo", "nahitar", "jyaare", "jaano", "lakho", "kharu", "khotu", "kaam", "aap", "ane", "athva", "lambai", "umedo"];
    return raw.split("\n").map((line, lIdx) => {
      // Split line into words and preserve spaces/syntax
      let processed = line;
      
      // Match comments
      if (line.trim().startsWith("//")) {
        return (
          <div key={lIdx} className="text-muted-soft italic select-none">
            <span className="text-muted-soft/40 w-6 inline-block text-right pr-2 text-[10px] font-mono mr-2">{lIdx + 1}</span>
            {line}
          </div>
        );
      }

      // Highlight keywords
      keywords.forEach((kw) => {
        const regex = new RegExp(`\\b${kw}\\b`, "g");
        if (kw === "sharu" || kw === "samaapt" || kw === "kaam") {
          processed = processed.replace(regex, `<span class="text-primary font-semibold">${kw}</span>`);
        } else if (kw === "do" || kw === "jo" || kw === "nahitar" || kw === "jyaare" || kw === "jaano") {
          processed = processed.replace(regex, `<span class="text-primary">${kw}</span>`);
        } else if (kw === "lakho" || kw === "aap" || kw === "lambai" || kw === "umedo") {
          processed = processed.replace(regex, `<span class="text-accent-teal font-semibold">${kw}</span>`);
        } else if (kw === "kharu" || kw === "khotu") {
          processed = processed.replace(regex, `<span class="text-accent-amber">${kw}</span>`);
        } else if (kw === "ane" || kw === "athva") {
          processed = processed.replace(regex, `<span class="text-accent-teal">${kw}</span>`);
        }
      });

      // Match string literals
      processed = processed.replace(/"([^"\\]|\\.)*"/g, '<span class="text-accent-teal">$&</span>');

      return (
        <div key={lIdx} className="leading-relaxed">
          <span className="text-muted-soft/40 w-6 inline-block text-right pr-2 text-[10px] font-mono select-none mr-2">{lIdx + 1}</span>
          <span dangerouslySetInnerHTML={{ __html: processed }} />
        </div>
      );
    });
  };

  return (
    <div className="bg-surface-dark border border-surface-dark-elevated rounded-lg shadow-md overflow-hidden flex flex-col font-mono text-xs text-on-dark-soft text-left relative group">
      {/* File Bar header */}
      <div className="bg-surface-dark-soft px-4 py-2 border-b border-surface-dark-elevated flex items-center justify-between select-none">
        <span className="text-[9px] uppercase tracking-widest text-muted-soft font-bold">code snippet</span>
        <div className="flex gap-1.5">
          <button
            onClick={handleCopy}
            className="text-[10px] text-muted-soft hover:text-on-dark transition-colors flex items-center gap-1 cursor-pointer"
            title="Copy code"
          >
            {copied ? (
              <span className="text-success flex items-center gap-1"><Check size={11} /> Copied!</span>
            ) : (
              <span className="flex items-center gap-1"><Copy size={11} /> Copy</span>
            )}
          </button>
          {onLoadCode && (
            <button
              onClick={() => onLoadCode(code)}
              className="text-[10px] text-accent-teal hover:text-white transition-colors flex items-center gap-1 cursor-pointer ml-3 font-semibold"
              title="Run code in active sandbox"
            >
              <Play size={11} /> Inject
            </button>
          )}
        </div>
      </div>
      
      {/* Code viewport container */}
      <div className="p-4 overflow-x-auto whitespace-pre font-mono text-[#faf9f5]/90 select-text leading-relaxed max-h-[220px] custom-scrollbar">
        {highlightCode(code)}
      </div>
    </div>
  );
}

export default function Documentation({ onLoadCode }) {
  const categories = [
    {
      title: "Language Core",
      icon: Cpu,
      desc: "Every KemLang program is structured inside global boundary brackets, initiating logic blocks cleanly.",
      items: [
        {
          name: "Program Boundaries",
          desc: "Every script must begin with 'sharu' and conclude with 'samaapt', acting as boundary gates.",
          code: `sharu {\n  // your program starts here\n  lakho("Kem cho, Prit!");\n} samaapt`
        },
        {
          name: "Standard Comments",
          desc: "Document logic blocks using double slashes. The interpreter tokenizer skips commented lines.",
          code: `sharu {\n  // This is a single-line comment\n  do gravity = 9;\n} samaapt`
        }
      ]
    },
    {
      title: "State & Data Types",
      icon: Code,
      desc: "KemLang manages variable definitions dynamically. It supports integers, decimal numbers, string literals, booleans, and lists.",
      items: [
        {
          name: "Declarations (do)",
          desc: "Declare a new variable in scope using 'do varName = value;'. All statements must terminate with a semicolon.",
          code: `sharu {\n  do name = "Desi Coder";\n  do attempts = 3;\n  do passingScore = 75.5;\n} samaapt`
        },
        {
          name: "Booleans",
          desc: "Evaluate boolean expressions using native words: 'kharu' represents true, and 'khotu' represents false.",
          code: `sharu {\n  do isVerified = kharu;\n  do hasFailed = khotu;\n} samaapt`
        }
      ]
    },
    {
      title: "Logical & Modulo Operators",
      icon: Layers,
      desc: "Perform advanced logic and arithmetic operations using modulo and natural language logical connectors.",
      items: [
        {
          name: "Logical Connectors (ane, athva)",
          desc: "Evaluate compound boolean expressions. 'ane' evaluates to true only if both expressions are true. 'athva' evaluates to true if at least one is true.",
          code: `sharu {\n  do age = 20;\n  do isStudent = kharu;\n  jo (age >= 18 ane isStudent) {\n    lakho("Eligible for student discount!");\n  }\n} samaapt`
        },
        {
          name: "Modulo Remainder (%)",
          desc: "The modulo operator (%) calculates the remainder of a division between two integers.",
          code: `sharu {\n  do num = 10;\n  do rem = num % 3;\n  lakho("Remainder: " + rem); // Output: 1\n} samaapt`
        }
      ]
    },
    {
      title: "Arrays & Collections (yadi)",
      icon: HelpCircle,
      desc: "Create and mutate sequence lists. Use square brackets to declare arrays, get length with 'lambai', and append with 'umedo'.",
      items: [
        {
          name: "Lists & Index Access",
          desc: "Declare lists inside bracket syntax. Indexes are 0-indexed. Assign or retrieve elements directly using 'list[index]'.",
          code: `sharu {\n  do list = [10, 20];\n  list[1] = 50;\n  lakho("Value at index 1: " + list[1]);\n} samaapt`
        },
        {
          name: "List Operations (lambai, umedo)",
          desc: "Retrieve array size using 'lambai(list)', and append elements dynamically to the end using 'umedo(list, item)'.",
          code: `sharu {\n  do list = [10, 20];\n  umedo(list, 30);\n  do len = lambai(list);\n  lakho("Array length is " + len); // Output: 3\n} samaapt`
        }
      ]
    },
    {
      title: "Custom Functions & Recursion",
      icon: BookOpen,
      desc: "Define reusable functions using 'kaam', pass parameters, return values via 'aap', and solve problems recursively.",
      items: [
        {
          name: "Functions (kaam, aap)",
          desc: "Define functions using 'kaam name(args) { ... }'. Returns values back to caller scopes using 'aap'.",
          code: `kaam add(a, b) {\n  aap a + b;\n}\n\nsharu {\n  do sum = add(5, 7);\n  lakho("Sum: " + sum);\n} samaapt`
        },
        {
          name: "Recursion & Closures",
          desc: "Functions can call themselves recursively. Scopes are lexically isolated and support closures.",
          code: `kaam fact(n) {\n  jo (n <= 1) {\n    aap 1;\n  }\n  aap n * fact(n - 1);\n}\n\nsharu {\n  do res = fact(5);\n  lakho("fact(5) = " + res); // Output: 120\n} samaapt`
        }
      ]
    },
    {
      title: "Control Systems",
      icon: FileText,
      desc: "Direct execution logic dynamically using conditionals and looping variables.",
      items: [
        {
          name: "Conditionals (jo-nahitar)",
          desc: "Branch logic using if-else expressions. Evaluate conditions inside parenthesis: 'jo' (if), 'nahitar' (else).",
          code: `sharu {\n  do age = 17;\n  jo (age >= 18) {\n    lakho("Eligible for voting.");\n  } nahitar {\n    lakho("Minor user!");\n  }\n} samaapt`
        },
        {
          name: "Loops (jyaare)",
          desc: "Iterate loops while a condition remains 'kharu'. Re-assignment of variables does NOT use the 'do' prefix.",
          code: `sharu {\n  do index = 1;\n  jyaare (index <= 4) {\n    lakho("Loop counter: " + index);\n    index = index + 1; // standard assignment\n  }\n} samaapt`
        }
      ]
    },
    {
      title: "Stdout & Keyboard Stdin",
      icon: Cpu,
      desc: "Print values to the developer stdout terminal console, or pause execution to capture keyboard inputs.",
      items: [
        {
          name: "Output Console (lakho)",
          desc: "Print strings, variables, or expressions to the console terminal. Standard string concatenation is fully supported.",
          code: `sharu {\n  do tool = "Antigravity";\n  lakho("Powered by: " + tool);\n} samaapt`
        },
        {
          name: "Keyboard Input (jaano)",
          desc: "Pause the interpreter thread to capture user keyboard input directly from stdin, mapping it to a variable.",
          code: `sharu {\n  lakho("Enter user age:");\n  do userAge = "";\n  jaano userAge;\n  lakho("User is " + userAge + " years old!");\n} samaapt`
        }
      ]
    }
  ];

  return (
    <div className="bg-canvas max-w-7xl mx-auto space-y-16 py-8">
      {/* Header section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-card border border-hairline text-primary text-xs font-semibold uppercase tracking-wider font-body">
          Reference Manual - v2.0.0
        </div>
        <h1 className="text-5xl md:text-6xl font-serif-editorial text-ink tracking-display-tight">
          Syntax & Language Specification
        </h1>
        <p className="text-lg text-muted max-w-2xl mx-auto font-body">
          Learn how to structure code, declare variables, evaluate conditionals, call recursive functions, and manage arrays in KemLang. Click **Inject** on any card to run it in the Sandbox.
        </p>
        <div className="w-16 h-0.5 bg-primary/30 mx-auto rounded-full" />
      </div>

      {/* Spaced Editorial Sections */}
      <div className="space-y-24">
        {categories.map((cat, cIdx) => {
          const Icon = cat.icon;
          return (
            <div key={cIdx} className="space-y-8 pb-12 border-b border-hairline last:border-b-0">
              {/* Category Title & Banner */}
              <div className="flex flex-col md:flex-row md:items-center gap-4 text-left">
                <div className="p-3 w-fit rounded-lg bg-surface-card border border-hairline text-primary select-none flex-shrink-0">
                  <Icon size={24} />
                </div>
                <div className="space-y-1">
                  <h2 className="text-3xl font-serif-editorial font-medium text-ink">
                    {cat.title}
                  </h2>
                  <p className="text-sm text-muted max-w-3xl font-body">
                    {cat.desc}
                  </p>
                </div>
              </div>

              {/* Sub-item Grid columns */}
              <div className="grid md:grid-cols-2 gap-8">
                {cat.items.map((item, itemIdx) => (
                  <div 
                    key={itemIdx} 
                    className="bg-canvas border border-hairline/80 hover:border-hairline p-6 rounded-lg space-y-4 transition-all hover:shadow-sm text-left flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <h3 className="text-lg font-serif-editorial font-semibold text-ink">
                          {item.name}
                        </h3>
                      </div>
                      <p className="text-xs text-body leading-relaxed font-body">
                        {item.desc}
                      </p>
                    </div>

                    <div className="pt-2">
                      <CodeBlock code={item.code} onLoadCode={onLoadCode} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* AdSense Unit placement */}
      <div className="pt-8">
        <AdSenseUnit slot="8074288228358823" />
      </div>
    </div>
  );
}
