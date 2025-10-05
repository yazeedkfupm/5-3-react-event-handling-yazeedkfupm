#!/usr/bin/env node
/**
 * React Lab – Task Tracker (State + Event Handling)
 * Grader (CommonJS) — flexible, attempt-aware, state-focused
 *
 * Grading policy for tasks (out of 80):
 * - No meaningful attempt (no state/events/components wired): 0/80
 * - Attempted (partial):                                     minimum 60/80
 * - Fully complete (all tasks strong):                        award actual earned (up to 80/80)
 *
 * Per task: Completeness 8, Correctness 6, Code Quality 6 = 20
 * Submission: 20 (on time) / 10 (late)
 * Report shows Achieved/Missed checks and detailed feedback.
 */

const fs = require("fs");
const path = require("path");

// ---------- helpers ----------
const read = (p) => { try { return fs.readFileSync(p, "utf8"); } catch { return ""; } };
const exists = (p) => { try { return fs.existsSync(p); } catch { return false; } };
const has = (txt, pattern) => (txt ? (pattern instanceof RegExp ? pattern.test(txt) : txt.includes(pattern)) : false);

const nowIso = () => new Date().toISOString();
const getCommitIso = () => {
  try {
    const p = process.env.GITHUB_EVENT_PATH;
    if (p && fs.existsSync(p)) {
      const payload = JSON.parse(fs.readFileSync(p, "utf8"));
      const t = payload?.head_commit?.timestamp
        || payload?.commits?.[payload.commits?.length - 1]?.timestamp
        || payload?.repository?.pushed_at
        || payload?.workflow_run?.head_commit?.timestamp;
      if (t) return new Date(t).toISOString();
    }
  } catch {}
  try {
    const { execSync } = require("child_process");
    const iso = execSync("git log -1 --pretty=format:%cI", { encoding: "utf8" }).trim();
    if (iso) return new Date(iso).toISOString();
  } catch {}
  return nowIso();
};
const isLate = (dueIso, commitIso) => {
  try { return new Date(commitIso).getTime() > new Date(dueIso).getTime(); } catch { return false; }
};

// ---------- robust file discovery ----------
function findFirstFile(relCandidates, baseCandidates) {
  for (const base of baseCandidates) {
    for (const rel of relCandidates) {
      const p = path.join(base, rel);
      if (exists(p)) return p;
    }
  }
  return null;
}

// likely bases (ordered)
const BASES = [
  path.resolve(__dirname, ".."),                        // …/5-3-react-event-handling
  process.cwd(),                                       // workflow working dir (repo root)
  path.resolve(process.cwd(), "5-3-react-event-handling"),
  path.resolve(__dirname),                             // …/script (unlikely, but harmless)
];

const FILES = {
  app: findFirstFile(
    ["src/components/TaskApp.jsx", "src/TaskApp.jsx", "TaskApp.jsx"],
    BASES
  ),
  list: findFirstFile(
    ["src/components/TaskList.jsx", "src/TaskList.jsx", "TaskList.jsx"],
    BASES
  ),
  item: findFirstFile(
    ["src/components/TaskItem.jsx", "src/TaskItem.jsx", "TaskItem.jsx"],
    BASES
  ),
};

const code = {
  app: read(FILES.app || ""),
  list: read(FILES.list || ""),
  item: read(FILES.item || ""),
};

// Fixed due date: 6 Oct 2025, 23:59:59 Asia/Riyadh (UTC+03:00)
const DEFAULT_DUE_ISO = "2025-10-06T23:59:59+03:00";
const DUE_DATE_ISO = process.env.DUE_DATE || DEFAULT_DUE_ISO;

// ---------- scoring model ----------
function runChecks(checks, maxPoints) {
  // Each check: {desc, test: boolean, pts}
  let earned = 0;
  const achieved = [];
  const missed = [];
  for (const c of checks) {
    if (c.test) { earned += c.pts; achieved.push(`✅ ${c.desc}`); }
    else { missed.push(`❌ ${c.desc}`); }
  }
  return {
    earned: Math.min(maxPoints, earned),
    achieved,
    missed,
    passedCount: achieved.length,
    totalCount: checks.length,
  };
}

// ---------- NEW: clearer task section formatting ----------
function taskSection(name, completeness, correctness, quality, finalScore) {
  const lines = [];

  // Task heading
  lines.push(`## ${name}`);
  lines.push(`**Score:** ${finalScore}/20`);
  lines.push("");

  // Helper to render each category consistently
  const renderCategory = (title, detail, max) => {
    const block = [];
    block.push(`### ${title} — ${detail.earned}/${max}`);
    if (detail.achieved.length) {
      block.push("**What you achieved:**");
      block.push(...detail.achieved.map(s => `- ${s}`));
    } else {
      block.push("_No checks achieved yet._");
    }
    if (detail.missed.length) {
      block.push("**What to improve:**");
      block.push(...detail.missed.map(s => `- ${s}`));
    }
    block.push(""); // spacer
    return block.join("\n");
  };

  // Ordered sections per your request
  lines.push(renderCategory("Correctness", correctness, 6));
  lines.push(renderCategory("Completeness", completeness, 8));
  lines.push(renderCategory("Code Quality", quality, 6));

  return lines.join("\n");
}

// ---------- Task checks (state-focused, top-level only) ----------

// Common state regexes
const usesUseState = (name) => has(code.app, new RegExp(`\\[\\s*${name}\\s*,\\s*set${name.replace(/^./, c => c.toUpperCase())}\\s*\\]\\s*=\\s*useState\\s*\\(`));
const usesTextState = usesUseState("text") || has(code.app, /\[\s*text\s*,\s*setText\s*\]\s*=\s*useState\s*\(/);
const usesTasksState = usesUseState("tasks") || has(code.app, /\[\s*tasks\s*,\s*setTasks\s*\]\s*=\s*useState\s*\(/);

// Task 1: Capture Input (controlled input with text state)
const t1Completeness = runChecks([
  { desc: "An input field is present", test: has(code.app, /<input[^>]*>/i), pts: 2 },
  { desc: "Input is bound to state via value={text}", test: has(code.app, /value\s*=\s*{?\s*text\s*}?/), pts: 3 },
  { desc: "Text state declared with useState", test: usesTextState, pts: 3 },
], 8);
const t1Correctness = runChecks([
  { desc: "Input has an onChange handler", test: has(code.app, /onChange\s*=\s*{[^}]+}/), pts: 2 },
  { desc: "onChange reads e.target.value", test: has(code.app, /(\(|\s)(e|event)\)?\s*=>[\s\S]*?(e|event)\.target\.value/), pts: 2 },
  { desc: "Current text value is rendered somewhere (preview/paragraph/etc.)", test: has(code.app, /\{?\s*text\s*\}?[^=]*<\/|You typed:|aria-live|preview/i), pts: 2 },
], 6);
const t1Quality = runChecks([
  { desc: "TaskApp component is exported (export default)", test: has(code.app, /export\s+default/), pts: 3 },
  { desc: "Clean JSX structure around input row", test: has(code.app, /<div\s+className="inputRow">[\s\S]*<\/div>/), pts: 3 },
], 6);

// Task 2: Submit → Add to tasks state → Render list
const t2Completeness = runChecks([
  { desc: "Tasks state declared with useState([])", test: usesTasksState, pts: 3 },
  { desc: "A Submit button exists with onClick", test: has(code.app, /<button[^>]*>\s*Submit\s*<\/button>/i) && has(code.app, /onClick\s*=\s*{[^}]+}/), pts: 3 },
  { desc: "TaskList is rendered from TaskApp", test: has(code.app, /<TaskList\b[^>]*>/), pts: 2 },
], 8);
const t2Correctness = runChecks([
  { desc: "Submit adds an object {id, text} immutably (setTasks(prev => [...prev, {...}]))", test: has(code.app, /setTasks\s*\(\s*prev\s*=>\s*\[\s*\.\.\.\s*prev\s*,\s*{[\s\S]*id[\s\S]*text[\s\S]*}\s*\]\s*\)/), pts: 3 },
  { desc: "Input cleared after submit (setText(\"\") or setText(''))", test: has(code.app, /setText\s*\(\s*(['"])\1\s*\)/), pts: 2 },
  { desc: "Empty submissions guarded (trim or length check)", test: has(code.app, /\.trim\s*\(\)\s*\)|if\s*\(\s*!?text\s*\)/), pts: 1 },
], 6);
const t2Quality = runChecks([
  { desc: "TaskList and TaskItem exported", test: has(code.list, /export\s+default/) && has(code.item, /export\s+default/), pts: 3 },
  { desc: "List rendering uses map with a stable key", test: has(code.list, /\.map\s*\(/) && has(code.list, /key\s*=\s*{[^}]+}/), pts: 3 },
], 6);

// Task 3: Delete Button → Remove from tasks (filter)
const t3Completeness = runChecks([
  { desc: "Delete button present in TaskItem", test: has(code.item, /<button[^>]*>(\s*🗑️|[^<]*Delete[^<]*)<\/button>/i), pts: 4 },
  { desc: "Delete button wired via onClick", test: has(code.item, /onClick\s*=\s*{[^}]+}/), pts: 4 },
], 8);
const t3Correctness = runChecks([
  { desc: "Delete removes matching task using filter / onDelete(id)", test: has(code.app, /setTasks\s*\(\s*prev\s*=>\s*prev\.filter\s*\(\s*\w+\s*=>/) || has(code.item, /onDelete\s*\(\s*id\s*\)|onDelete\(\s*\w+\s*\)/), pts: 6 },
], 6);
const t3Quality = runChecks([
  { desc: "Delete handler is concise and readable", test: has(code.item, /onClick\s*=\s*{\s*\(\)\s*=>|onClick\s*=\s*{\s*\(\s*.*\s*\)\s*=>/), pts: 3 },
  { desc: "Components exported properly", test: has(code.item, /export\s+default/) || has(code.list, /export\s+default/), pts: 3 },
], 6);

// Task 4: Clear All → Reset tasks state
const t4Completeness = runChecks([
  { desc: "Clear All button exists", test: has(code.app, /<button[^>]*>[^<]*Clear\s*All[^<]*<\/button>/i), pts: 4 },
  { desc: "Clear All button has onClick handler", test: has(code.app, /onClick\s*=\s*{[^}]+}/), pts: 4 },
], 8);
const t4Correctness = runChecks([
  { desc: "Clear All empties tasks via setTasks([])", test: has(code.app, /setTasks\s*\(\s*\[\s*\]\s*\)/) || has(code.app, /setTasks\s*\(\s*prev\s*=>\s*\[\s*\]\s*\)/), pts: 6 },
], 6);
const t4Quality = runChecks([
  { desc: "Clear handler defined as a simple function/arrow", test: has(code.app, /const\s+\w+\s*=\s*\(\)\s*=>\s*{/) || has(code.app, /function\s+\w+\s*\(/), pts: 3 },
  { desc: "TaskApp exported", test: has(code.app, /export\s+default/), pts: 3 },
], 6);

// ---------- compute raw per task ----------
const perTaskRaw = [
  { name: "Task 1 (Capture Input with State)", c: t1Completeness, k: t1Correctness, q: t1Quality },
  { name: "Task 2 (Submit → Add to State → Display)", c: t2Completeness, k: t2Correctness, q: t2Quality },
  { name: "Task 3 (Delete Task)", c: t3Completeness, k: t3Correctness, q: t3Quality },
  { name: "Task 4 (Clear All Tasks)", c: t4Completeness, k: t4Correctness, q: t4Quality },
];

let perTask = perTaskRaw.map(x => ({
  name: x.name,
  completeness: x.c.earned,
  correctness: x.k.earned,
  quality: x.q.earned,
  raw: x.c.earned + x.k.earned + x.q.earned,
  cDetail: x.c,
  kDetail: x.k,
  qDetail: x.q,
}));

let tasksTotalRaw = perTask.reduce((s, t) => s + t.raw, 0);

// ---------- attempt policy (flexible) ----------
const attemptSignals = [
  /useState\s*\(/,
  /value\s*=\s*{[^}]+}/,
  /onChange\s*=\s*{[^}]+}/,
  /onClick\s*=\s*{[^}]+}/,
  /<TaskList\b/,
  /<TaskItem\b/,
  /setTasks\s*\(/,
  /setText\s*\(/,
];
const attemptDetected =
  attemptSignals.some(rx => has(code.app, rx) || has(code.list, rx) || has(code.item, rx));

// Task-level full completion heuristic (for transparency only)
const t1Full = t1Completeness.earned >= 7 && t1Correctness.earned >= 5;
const t2Full = t2Completeness.earned >= 7 && t2Correctness.earned >= 5;
const t3Full = t3Completeness.earned >= 7 && t3Correctness.earned >= 5;
const t4Full = t4Completeness.earned >= 7 && t4Correctness.earned >= 5;
const allFull = t1Full && t2Full && t3Full && t4Full;

// Apply flexible policy:
// - If no meaningful attempt → 0/80 for tasks
// - If attempted but below 60 → raise to 60/80 (distribute across tasks without mentioning boosts)
// - If fully complete → show actual earned (no floor)
const MIN_ATTEMPT_TOTAL = 60;
let tasksTotalFinal = tasksTotalRaw;

if (!attemptDetected) {
  tasksTotalFinal = 0;
  perTask = perTask.map(t => ({ ...t, raw: 0 }));
} else if (!allFull && tasksTotalRaw < MIN_ATTEMPT_TOTAL) {
  let deficit = MIN_ATTEMPT_TOTAL - tasksTotalRaw;
  const room = perTask.map(t => 20 - t.raw);
  // Distribute small bumps evenly to preserve relative weights
  while (deficit > 0 && room.some(r => r > 0)) {
    for (let i = 0; i < perTask.length && deficit > 0; i++) {
      if (room[i] > 0) {
        perTask[i].raw += 1;
        room[i] -= 1;
        deficit -= 1;
      }
    }
  }
  tasksTotalFinal = perTask.reduce((s, t) => s + t.raw, 0);
}

// ---------- submission ----------
const commitIso = getCommitIso();
const late = isLate(DUE_DATE_ISO, commitIso);
const submissionPoints = late ? 10 : 20;

// ---------- report ----------
const header = `# Auto Grade Report

**Commit Time:** ${commitIso}
**Due Date:** ${DUE_DATE_ISO}
**Submission:** ${submissionPoints}/20 ${late ? "(Late submission detected)" : "(On time)"}

**Files detected**
- TaskApp: ${FILES.app || "NOT FOUND"}
- TaskList: ${FILES.list || "NOT FOUND"}
- TaskItem: ${FILES.item || "NOT FOUND"}
`;

// NOTE: use real newlines ("\n"), not escaped "\\n"
const sections = perTask.map(t => {
  return taskSection(
    t.name,
    t.cDetail,
    t.kDetail,
    t.qDetail,
    t.raw // final per-task score shown; no mention of boosts
  );
}).join("\n\n");

const totals = `
## Totals
- Tasks Total: **${tasksTotalFinal}/80**
- Submission: **${submissionPoints}/20**
- **Grand Total: ${tasksTotalFinal + submissionPoints}/100**
`;

const report = `${header}\n${sections}\n\n${totals}\n`;

// Student-friendly JSON (keeps detected file paths for debugging)
const json = {
  commitIso,
  dueDateIso: DUE_DATE_ISO,
  late,
  submissionPoints,
  files: FILES,
  tasks: perTask.map(t => ({
    name: t.name,
    final: t.raw,
    achieved: {
      completeness: t.cDetail.achieved,
      correctness: t.kDetail.achieved,
      quality: t.qDetail.achieved,
    },
    missed: {
      completeness: t.cDetail.missed,
      correctness: t.kDetail.missed,
      quality: t.qDetail.missed,
    },
  })),
  tasksTotal: tasksTotalFinal,
  grandTotal: tasksTotalFinal + submissionPoints,
  attemptDetected,
  allTasksFullyComplete: allFull,
};

try { fs.writeFileSync("grade-report.md", report, "utf8"); } catch {}
try { fs.writeFileSync("grade.json", JSON.stringify(json, null, 2), "utf8"); } catch {}
try { fs.writeFileSync("grader.js", fs.readFileSync(__filename, "utf8"), "utf8"); } catch {}
console.log(report);
