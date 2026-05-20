import { Landmark, Calendar, Award, GraduationCap, ArrowRight } from "lucide-react";

export default function ResearchPage() {
  const timelineWeeks = [
    {
      week: "Week 1",
      title: "Foundations & Lexical Analyzer",
      desc: "Architected token specifications mapping standard lexical groups. Coded custom state tokenizers handling integers, decimals, strings, symbols, operators, single-line comments, and the core set of Gujarati keywords."
    },
    {
      week: "Week 2",
      title: "AST Grammar & Parser Construction",
      desc: "Designed strict BNF grammar rules for KemLang statements and expressions. Formulated a recursive-descent parser producing custom AST trees, mapping conditionals, loops, calculations, and assignments."
    },
    {
      week: "Week 3",
      title: "Evaluator Engine & Local Node CLI",
      desc: "Developed a recursive tree-walking interpreter (AST evaluator) managing variables memory and mathematical calculations. Integrated a global CLI tool (spawned via Node.js process) to run local .kem files."
    },
    {
      week: "Week 4",
      title: "FastAPI REST Server Deployment",
      desc: "Configured a high-performance web microservice powered by FastAPI and Uvicorn. Hooked up standard CORS rules, developed stdout capture string buffers, and deployed online using Render web service hosting."
    },
    {
      week: "Week 5",
      title: "React Monaco Playground Website",
      desc: "Designed and built the responsive web playground from scratch using React, Tailwind CSS, and Monaco Editor. Implemented dynamic token syntax highlighters and query-based base64 snippet loading."
    },
    {
      week: "Week 6",
      title: "VS Code Extension & Final Validation",
      desc: "Authored VS Code integration files compiling language grammars, brand icons, and custom snippets. Compiled final reports, presentations, and verified the complete interpreter test suites."
    }
  ];

  return (
    <div className="bg-canvas max-w-7xl mx-auto space-y-16 py-8">
      {/* Hero Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-card border border-hairline text-primary text-xs font-semibold uppercase tracking-wider font-body">
          Academic Research Essay
        </div>
        <h1 className="text-5xl md:text-6xl font-serif-editorial font-medium text-ink tracking-display-tight">
          Philosophy & Academic Origins
        </h1>
        <p className="text-lg text-muted max-w-2xl mx-auto font-body">
          Explore why KemLang was created, the pedagogical importance of mother-tongue coding, and the iterative Semester 5 internship development timeline.
        </p>
        <div className="w-16 h-0.5 bg-primary/30 mx-auto rounded-full" />
      </div>

      {/* Main Grid: Cultural Essay */}
      <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Side: Long-form Editorial Column */}
        <div className="lg:col-span-8 space-y-8 font-body text-body leading-relaxed select-text">
          <section className="space-y-4">
            <h2 className="text-3xl font-serif-editorial font-medium text-ink tracking-display-tight">
              1. The Vernacular Programming Movement
            </h2>
            <p className="text-sm">
              For decades, programming has carried a massive hidden barrier for millions of students globally: **the English language**. 
              Traditional syntax requires beginners to not only grasp new logic concepts (control flow, state, memory pointers) but to also parse error codes and keywords in a non-native vocabulary.
            </p>
            <p className="text-sm">
              **Vernacular Programming** breaks this friction down. Inspired by pioneers like *BhaiLang*, KemLang introduces a humorous, conversational, and culturally close Gujarati syntax. 
              By mapping concepts to words spoken at home, coding instantly shifts from an academic chore to a playful, friendly experience. It invites learners to view a program not as cold, corporate instructions, but as a *varta* (story) told directly to the processor.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-serif-editorial font-medium text-ink tracking-display-tight">
              2. Technical Design Principles
            </h2>
            <p className="text-sm">
              pedagogical syntax should never mean compromising on core developer engineering. KemLang implements a complete modern runtime pipeline:
            </p>
            <ul className="list-disc pl-5 text-sm space-y-2 text-body">
              <li>
                <strong>Strict BNF Grammar</strong>: A grammar that models standard control paradigms (ifs, whiles, reassignments) ensuring that structural lessons translate directly to commercial langauges like JavaScript or Python.
              </li>
              <li>
                <strong>Desi Error Compilation</strong>: Replacing generic stack trace crashes with comical, warm-tinted Gujarati error warnings (e.g., <i>"Statement pachi ';' mukto kharo bhai!"</i>) that decrease debugging anxiety.
              </li>
              <li>
                <strong>API First Architecture</strong>: A cloud-based execution framework allowing playgrounds, VS Code extensions, and command lines to access unified execution results dynamically.
              </li>
            </ul>
          </section>
        </div>

        {/* Right Side: Academic Bio Card */}
        <div className="lg:col-span-4 bg-surface-card border border-hairline p-8 rounded-lg space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-canvas border border-hairline text-primary select-none">
                <GraduationCap size={20} />
              </div>
              <h3 className="text-2xl font-serif-editorial font-semibold text-ink tracking-display-tight">
                Academic Context
              </h3>
            </div>
            <p className="text-xs text-muted leading-relaxed font-body">
              KemLang was developed as a capstone internship project for CSE Semester 5. The project has undergone formal evaluation and verification by university boards.
            </p>
          </div>

          <hr className="border-hairline" />

          <div className="space-y-4 font-body text-xs text-body">
            <div className="flex items-center justify-between">
              <span className="text-muted">Developer</span>
              <span className="font-semibold text-ink">Prit Patel</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted">Degree</span>
              <span className="font-semibold text-ink">B.Tech in CSE (Sem 5)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted">Project Focus</span>
              <span className="font-semibold text-ink">Language Design & DevTools</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted">Status</span>
              <span className="font-semibold text-accent-teal inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-teal inline-block" /> Completed & Verified
              </span>
            </div>
          </div>

          <hr className="border-hairline" />

          {/* Verification Badge */}
          <div className="flex gap-3 items-start p-4 rounded-lg bg-canvas border border-hairline">
            <Award size={18} className="text-primary mt-0.5 select-none" />
            <div>
              <h4 className="text-xs font-semibold text-ink">Sem 5 Verified</h4>
              <p className="text-[10px] text-muted leading-relaxed">Internship Completion Certificates signed and submitted for CSE boards validation.</p>
            </div>
          </div>
        </div>
      </div>

      <hr className="border-hairline" />

      {/* Timeline Section */}
      <div className="space-y-8">
        <div className="space-y-2">
          <h3 className="text-3xl font-serif-editorial font-medium text-ink tracking-display-tight">
            Iterative Internship Timeline
          </h3>
          <p className="text-sm text-muted font-body">
            Iterative development cycles captured across Weekly Internship Reports 1 through 6.
          </p>
        </div>

        <div className="relative border-l border-hairline ml-4 space-y-12">
          {timelineWeeks.map((tl, idx) => (
            <div key={idx} className="relative pl-8 group">
              {/* Bullet Node */}
              <div className="absolute -left-2.5 top-1.5 w-5 h-5 rounded-full bg-canvas border-2 border-hairline group-hover:border-primary transition-colors flex items-center justify-center select-none">
                <div className="w-1.5 h-1.5 rounded-full bg-muted-soft group-hover:bg-primary transition-colors" />
              </div>

              {/* Box */}
              <div className="space-y-2 font-body">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-primary tracking-wider uppercase">
                    {tl.week}
                  </span>
                  <ArrowRight size={12} className="text-muted-soft" />
                  <h4 className="font-semibold text-ink text-base">
                    {tl.title}
                  </h4>
                </div>
                <p className="text-xs text-body leading-relaxed max-w-3xl">
                  {tl.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
