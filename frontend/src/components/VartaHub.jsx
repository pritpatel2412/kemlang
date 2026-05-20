import React, { useState, useEffect } from "react";
import { FolderHeart, Plus, FileCode, Trash2, ArrowUpRight, Check, AlertCircle, Sparkles, BookOpen, User, ShieldAlert } from "lucide-react";

export default function VartaHub({ currentCode, onLoadCode }) {
  const [userScripts, setUserScripts] = useState([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");

  // Pre-loaded offline catalog of advanced community algorithms
  const communityDirectory = [
    {
      title: "Prime Tester (Avibhaajya Sankhya)",
      desc: "Simulates modular arithmetic to assert if a number is prime.",
      difficulty: "Advanced",
      code: `sharu {
  // Test primality of a target number
  do target = 13;
  do divisor = 2;
  do isPrime = kharu;

  jyaare (divisor < target) {
    // In KemLang, we compute modulus using division
    do remainder = target - ((target / divisor) * divisor);
    jo (remainder == 0) {
      isPrime = khotu;
    }
    divisor = divisor + 1;
  }

  jo (isPrime) {
    lakho(target + " is a PRIME number!");
  } nahitar {
    lakho(target + " is NOT prime.");
  }
} samaapt`
    },
    {
      title: "Factorial Calculation",
      desc: "Computes deep factorials using descending while loop parameters.",
      difficulty: "Intermediate",
      code: `sharu {
  do limit = 6;
  do multiplier = 1;
  do result = 1;

  jyaare (multiplier <= limit) {
    result = result * multiplier;
    multiplier = multiplier + 1;
  }
  lakho("Factorial of " + limit + " is: " + result);
} samaapt`
    },
    {
      title: "Leap Year Assertion",
      desc: "Uses division offsets to evaluate leap years dynamically.",
      difficulty: "Intermediate",
      code: `sharu {
  do year = 2024;
  
  // A leap year is divisible by 4
  do check4 = year - ((year / 4) * 4) == 0;
  // A year is not leap if divisible by 100 but not 400
  do check100 = year - ((year / 100) * 100) == 0;
  do check400 = year - ((year / 400) * 400) == 0;

  do isLeap = check4;
  jo (check100) {
    isLeap = check400;
  }

  jo (isLeap) {
    lakho(year + " is a LEAP year!");
  } nahitar {
    lakho(year + " is a standard year.");
  }
} samaapt`
    },
    {
      title: "Nested Multiplier Grid",
      desc: "Simulates matrix multiplier grids inside compound conditional layers.",
      difficulty: "Advanced",
      code: `sharu {
  do row = 1;
  jyaare (row <= 3) {
    do col = 1;
    jyaare (col <= 3) {
      do val = row * col;
      lakho(row + " x " + col + " = " + val);
      col = col + 1;
    }
    row = row + 1;
  }
} samaapt`
    }
  ];

  // Load user scripts from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("kemlang_user_scripts");
      if (stored) {
        setUserScripts(JSON.parse(stored));
      }
    } catch (err) {
      console.error("Failed to load local storage user scripts", err);
    }
  }, []);

  const handleSave = () => {
    setSaveError("");
    setSaveSuccess(false);

    if (!title.trim()) {
      setSaveError("Please provide a name for your custom script.");
      return;
    }

    if (!currentCode || !currentCode.includes("sharu") || !currentCode.includes("samaapt")) {
      setSaveError("Code must represent a valid script starting with 'sharu' and ending with 'samaapt'.");
      return;
    }

    const newScript = {
      id: `script_${Date.now()}`,
      title: title.trim(),
      desc: desc.trim() || "User created sandbox program",
      code: currentCode,
      date: new Date().toLocaleDateString()
    };

    const updated = [...userScripts, newScript];
    setUserScripts(updated);
    localStorage.setItem("kemlang_user_scripts", JSON.stringify(updated));

    setTitle("");
    setDesc("");
    setShowSaveForm(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleDelete = (id, e) => {
    e.stopPropagation(); // Avoid loading script upon deletion trigger
    const updated = userScripts.filter((s) => s.id !== id);
    setUserScripts(updated);
    localStorage.setItem("kemlang_user_scripts", JSON.stringify(updated));
  };

  return (
    <div className="bg-canvas max-w-7xl mx-auto space-y-12 py-8">
      {/* Header section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-card border border-hairline text-primary text-xs font-semibold uppercase tracking-wider font-body">
          Algorithm Hub
        </div>
        <h1 className="text-5xl md:text-6xl font-serif-editorial text-ink tracking-display-tight">
          Varta Snippet Directory
        </h1>
        <p className="text-lg text-muted max-w-2xl mx-auto font-body">
          Explore complex algorithms created by the community, or save your custom playground scripts into your offline personal portfolio.
        </p>
        <div className="w-16 h-0.5 bg-primary/30 mx-auto rounded-full" />
      </div>

      {/* Grid container: Left side Save & User scripts, Right side Community Library */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left column: Portfolio Controls & Saved Scripts (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-surface-card border border-hairline p-6 rounded-lg space-y-6 text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded bg-canvas border border-hairline text-primary">
                  <FolderHeart size={18} />
                </div>
                <h3 className="text-xl font-serif-editorial font-bold text-ink">Personal Portfolio</h3>
              </div>
              
              {!showSaveForm && (
                <button
                  onClick={() => setShowSaveForm(true)}
                  className="px-3 py-1.5 bg-primary hover:bg-primary-active text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                >
                  <Plus size={14} />
                  <span>Save Sandbox</span>
                </button>
              )}
            </div>

            <p className="text-xs text-muted leading-relaxed font-body">
              Easily capture the logic script currently active inside your code playground. Scripts are preserved securely within your local browser sandbox workspace.
            </p>

            {/* Save Form Panel */}
            {showSaveForm && (
              <div className="p-4 bg-canvas border border-hairline rounded-lg space-y-4 animate-fadeIn">
                <div className="flex justify-between items-center pb-2 border-b border-hairline">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary">Save Sandbox Script</h4>
                  <button 
                    onClick={() => setShowSaveForm(false)}
                    className="text-muted hover:text-ink text-sm cursor-pointer"
                  >
                    &times;
                  </button>
                </div>

                {saveError && (
                  <div className="p-2.5 bg-error/10 border border-error/20 rounded text-error text-[10px] flex items-center gap-2 font-body">
                    <ShieldAlert size={14} className="flex-shrink-0" />
                    <span>{saveError}</span>
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-muted mb-1 select-none font-body">Script Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., Matrix Multiplier, Prime Loop"
                      className="w-full bg-surface-card text-xs text-ink px-3 py-2 rounded border border-hairline focus:border-primary outline-none font-body"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-muted mb-1 select-none font-body">Short Description</label>
                    <textarea
                      value={desc}
                      onChange={(e) => setDesc(e.target.value)}
                      placeholder="What logic structure does this template evaluate?"
                      rows={3}
                      className="w-full bg-surface-card text-xs text-ink px-3 py-2 rounded border border-hairline focus:border-primary outline-none resize-none font-body"
                    />
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <button
                    onClick={() => setShowSaveForm(false)}
                    className="px-3 py-1.5 hover:bg-surface-soft rounded text-xs text-muted font-body cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-1.5 bg-accent-teal hover:bg-accent-teal/90 text-white text-xs font-semibold rounded cursor-pointer"
                  >
                    Save to Directory
                  </button>
                </div>
              </div>
            )}

            {/* Save Success Banner */}
            {saveSuccess && (
              <div className="p-3 bg-accent-teal/10 border border-accent-teal/20 rounded text-accent-teal text-xs flex items-center gap-2 select-none animate-fadeIn font-body">
                <Check size={16} className="text-accent-teal" />
                <span>Script successfully compiled and saved offline!</span>
              </div>
            )}

            {/* List: User saved portfolios */}
            <div className="space-y-3 pt-2">
              {userScripts.length === 0 ? (
                <div className="text-center py-6 border border-dashed border-hairline rounded bg-canvas">
                  <FileCode className="mx-auto text-muted-soft opacity-40 mb-2" size={24} />
                  <p className="text-xs text-muted-soft font-body font-medium">No custom scripts saved yet.</p>
                  <p className="text-[10px] text-muted-soft/70 font-body mt-1 max-w-[200px] mx-auto">Open the Sandbox, write a code structure, then click Save.</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
                  {userScripts.map((script) => (
                    <div
                      key={script.id}
                      onClick={() => onLoadCode(script.code)}
                      className="p-3 bg-canvas border border-hairline hover:border-primary/45 rounded-lg group cursor-pointer transition-all flex justify-between items-start text-left"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <User size={12} className="text-accent-teal flex-shrink-0" />
                          <span className="text-xs font-semibold text-ink group-hover:text-primary transition-colors">
                            {script.title}
                          </span>
                        </div>
                        <p className="text-[10px] text-body leading-relaxed font-body">
                          {script.desc}
                        </p>
                        <span className="text-[9px] text-muted-soft block select-none">
                          Created: {script.date}
                        </span>
                      </div>

                      <button
                        onClick={(e) => handleDelete(script.id, e)}
                        className="p-1 text-muted hover:text-error hover:bg-error/10 rounded transition-all flex-shrink-0 cursor-pointer ml-2"
                        title="Delete script"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right column: Preloaded advanced community catalog (7 cols) */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <div className="bg-surface-card border border-hairline p-6 rounded-lg space-y-6">
            <div className="flex items-center gap-2.5 pb-2 border-b border-hairline">
              <div className="p-2 rounded bg-canvas border border-hairline text-primary">
                <Sparkles size={18} />
              </div>
              <h3 className="text-xl font-serif-editorial font-bold text-ink">Community Algorithms</h3>
            </div>

            <p className="text-xs text-muted leading-relaxed font-body">
              Select and execute fully functional, verified complex algorithms. These showcase advanced programming paradigms (loops, conditions, arithmetic workarounds) written in native KemLang.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              {communityDirectory.map((algo) => (
                <div
                  key={algo.title}
                  onClick={() => onLoadCode(algo.code)}
                  className="bg-canvas border border-hairline hover:border-primary/40 hover:shadow-sm p-4 rounded-lg group cursor-pointer transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-semibold text-ink group-hover:text-primary transition-colors leading-snug">
                        {algo.title}
                      </h4>
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase select-none flex-shrink-0 border ${
                        algo.difficulty === "Advanced"
                          ? "bg-error/10 text-error border-error/20"
                          : "bg-accent-amber/10 text-accent-amber border-accent-amber/20"
                      }`}>
                        {algo.difficulty}
                      </span>
                    </div>
                    
                    <p className="text-[11px] text-body leading-relaxed font-body">
                      {algo.desc}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-primary text-[10px] font-bold uppercase tracking-wider pt-4 select-none">
                    <span>Inject snippet</span>
                    <ArrowUpRight size={14} className="text-muted-soft group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
