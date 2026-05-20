import React, { useState, useEffect } from "react";
import { FolderHeart, Plus, FileCode, Trash2, ArrowUpRight, Check, AlertCircle } from "lucide-react";

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
      title: "Factorial calculations",
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
  // A year is not leap if divisible by 100 but not 400 (simplified logic)
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
    <div className="h-full flex flex-col space-y-4">
      
      {/* Visual directory header */}
      <div className="flex items-center justify-between border-b border-hairline/10 pb-3">
        <div className="flex items-center gap-2">
          <FolderHeart size={16} className="text-primary" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#faf9f5]">Varta Snippet Directory</h3>
        </div>
        
        {/* Toggle trigger to save current code */}
        <button
          onClick={() => setShowSaveForm(!showSaveForm)}
          className="px-2 py-1 bg-primary hover:bg-primary-active text-[#faf9f5] rounded text-[10px] font-semibold flex items-center gap-1 transition-all cursor-pointer"
        >
          <Plus size={11} />
          <span>Save Current Code</span>
        </button>
      </div>

      {/* Save Success Alerts */}
      {saveSuccess && (
        <div className="p-2 bg-accent-teal/10 border border-accent-teal/30 rounded text-accent-teal text-[10px] flex items-center gap-2 select-none animate-fadeIn">
          <Check size={12} />
          <span>Script saved successfully inside your local User Gallery!</span>
        </div>
      )}

      {/* Save Error Alerts */}
      {saveError && (
        <div className="p-2 bg-error/10 border border-error/30 rounded text-error text-[10px] flex items-center gap-2 select-none">
          <AlertCircle size={12} />
          <span>{saveError}</span>
        </div>
      )}

      {/* Form: Add Current Code */}
      {showSaveForm && (
        <div className="p-3 bg-surface-dark rounded border border-hairline/20 space-y-3 animate-fadeIn">
          <h4 className="text-[11px] font-bold text-primary uppercase tracking-wider">Save Sandbox Script</h4>
          
          <div className="space-y-2">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Script Title (e.g. Factorial Loops)"
              className="w-full bg-surface-dark-elevated text-xs text-[#faf9f5] px-2.5 py-1.5 rounded border border-hairline/10 focus:border-primary outline-none"
            />
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Brief description of the logic..."
              rows={2}
              className="w-full bg-surface-dark-elevated text-xs text-[#faf9f5] px-2.5 py-1.5 rounded border border-hairline/10 focus:border-primary outline-none resize-none font-body"
            />
          </div>

          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setShowSaveForm(false)}
              className="px-2 py-1 hover:bg-surface-dark-soft rounded text-[10px] text-muted-soft cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-1 bg-accent-teal hover:bg-accent-teal/90 text-[#faf9f5] text-[10px] font-semibold rounded cursor-pointer"
            >
              Save to Directory
            </button>
          </div>
        </div>
      )}

      {/* Scrollable list containing both community and custom saved items */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar max-h-[380px]">
        
        {/* User custom saved scripts gallery */}
        {userScripts.length > 0 && (
          <div className="space-y-2.5">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-accent-teal select-none">
              Your Custom Portfolio ({userScripts.length})
            </h4>
            
            <div className="space-y-2">
              {userScripts.map((script) => (
                <div
                  key={script.id}
                  onClick={() => onLoadCode(script.code)}
                  className="p-3 bg-surface-dark-elevated border border-accent-teal/10 hover:border-accent-teal/30 rounded-lg group cursor-pointer transition-all flex justify-between items-start"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <FileCode size={12} className="text-accent-teal" />
                      <span className="text-xs font-semibold text-[#faf9f5] group-hover:text-accent-teal transition-colors">
                        {script.title}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-soft leading-relaxed font-body">
                      {script.desc}
                    </p>
                    <span className="text-[9px] text-muted-soft/60 block select-none">
                      Saved: {script.date}
                    </span>
                  </div>

                  <button
                    onClick={(e) => handleDelete(script.id, e)}
                    className="p-1.5 text-muted hover:text-error hover:bg-error/10 rounded transition-all flex-shrink-0 cursor-pointer"
                    title="Delete program"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Global Catalog Section */}
        <div className="space-y-2.5">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary select-none">
            Pre-loaded Community Algorithms
          </h4>

          <div className="space-y-2">
            {communityDirectory.map((algo) => (
              <div
                key={algo.title}
                onClick={() => onLoadCode(algo.code)}
                className="p-3 bg-surface-dark-elevated border border-hairline/10 hover:border-primary/30 rounded-lg group cursor-pointer transition-all flex justify-between items-center"
              >
                <div className="space-y-1 pr-4">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-[#faf9f5] group-hover:text-primary transition-colors">
                      {algo.title}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase select-none ${
                      algo.difficulty === "Advanced" ? "bg-error/10 text-error border border-error/20" : "bg-accent-teal/10 text-accent-teal border border-accent-teal/20"
                    }`}>
                      {algo.difficulty}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-soft leading-relaxed font-body">
                    {algo.desc}
                  </p>
                </div>

                <ArrowUpRight size={14} className="text-muted-soft group-hover:text-primary transition-colors flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
