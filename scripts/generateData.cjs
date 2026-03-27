const fs = require('fs');
const path = require('path');

const PREP_DIR = path.resolve(__dirname, '../../');

const SECTION_META = {
  '01-javascript':        { title: 'JavaScript',              icon: 'JS' },
  '02-react':             { title: 'React.js',                icon: '⚛️' },
  '03-nodejs-express':    { title: 'Node.js / Express',       icon: '🟢' },
  '04-mongodb':           { title: 'MongoDB',                 icon: '🍃' },
  '07-accessibility-wcag':{ title: 'Accessibility / WCAG',    icon: '♿' },
  '08-websockets-socketio':{ title: 'WebSockets / Socket.io', icon: '🔌' },
  '09-testing-jest':      { title: 'Testing / Jest',          icon: '🧪' },
  '10-devops-cicd':       { title: 'DevOps / CI/CD',          icon: '🚀' },
  '11-system-design':     { title: 'System Design',           icon: '🏗️' },
  '12-html-css':          { title: 'HTML / CSS',              icon: '🎨' },
  '13-dsa':               { title: 'DSA',                     icon: '🧮' },
  '14-behavioral':        { title: 'Behavioral',              icon: '🗣️' },
  '15-project-deep-dives':{ title: 'Project Deep-Dives',      icon: '🔍' },
};

function parseQuestions(content, sectionId, fileId) {
  const questions = [];

  // Universal split: match ## Q or ### Q followed by a number
  const questionBlocks = content.split(/(?=^#{2,3}\s*Q\d+[.:]\s)/m);

  for (const block of questionBlocks) {
    // Match headers like:
    //   ## Q1: Title [Easy]
    //   ## Q1. Title [Easy]
    //   ### Q1: Title [Easy]
    //   ### Q1. Title `[Easy]`
    //   ## Q1. Title (no difficulty in header)
    const headerMatch = block.match(
      /^#{2,3}\s*Q(\d+)[.:]\s*(.+?)\s*(?:`?\[(\w+(?:\s*\/\s*\w+)?)\]`?)?\s*$/m
    );
    if (!headerMatch) continue;

    const qNum = headerMatch[1];
    let title = headerMatch[2].trim();
    let difficulty = headerMatch[3] || '';

    // Remove header line from body
    const body = block.replace(/^#{2,3}\s*Q\d+[.:].*$/m, '').trim();

    // Some files have **Difficulty**: Easy on a separate line
    if (!difficulty) {
      const diffMatch = body.match(/^\*\*Difficulty\*\*:\s*(\w+)/m);
      if (diffMatch) {
        difficulty = diffMatch[1];
      }
    }

    // Clean trailing backticks or brackets from title
    title = title.replace(/`?\[.*?\]`?$/, '').trim();
    // Remove trailing difficulty tags that got mixed in
    title = title.replace(/\s*\[(?:Easy|Medium|Hard)(?:\s*\/\s*\w+)?\]\s*$/, '').trim();

    // Find Hinglish section
    const hinglishMarker = '**Samjho Hinglish mein:**';
    const hinglishIdx = body.indexOf(hinglishMarker);

    let englishAnswer, hinglishAnswer;

    if (hinglishIdx !== -1) {
      const englishRaw = body.substring(0, hinglishIdx);
      const hinglishRaw = body.substring(hinglishIdx + hinglishMarker.length);

      // Remove answer header and difficulty line
      englishAnswer = englishRaw
        .replace(/^\*\*Answer(?:\s*\(English\))?:\*\*\s*/m, '')
        .replace(/^\*\*Difficulty\*\*:\s*\w+\s*/m, '')
        .replace(/\n---\s*$/g, '')
        .trim();

      hinglishAnswer = hinglishRaw.replace(/\n---\s*$/g, '').trim();
    } else {
      englishAnswer = body
        .replace(/^\*\*Answer(?:\s*\(English\))?:\*\*\s*/m, '')
        .replace(/^\*\*Difficulty\*\*:\s*\w+\s*/m, '')
        .replace(/\n---\s*$/g, '')
        .trim();
      hinglishAnswer = '';
    }

    if (!difficulty) difficulty = 'Medium'; // default

    questions.push({
      id: `${sectionId}-${fileId}-q${qNum}`,
      title,
      difficulty,
      englishAnswer,
      hinglishAnswer,
    });
  }

  return questions;
}

function titleFromFilename(filename) {
  return filename
    .replace(/\.md$/, '')
    .replace(/^questions?$/, 'Questions')
    .replace(/-/g, ' ')
    .trim()
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ') || 'Questions';
}

function processSection(dirName) {
  const meta = SECTION_META[dirName];
  if (!meta) return null;

  const dirPath = path.join(PREP_DIR, dirName);
  if (!fs.existsSync(dirPath)) {
    console.warn(`Directory not found: ${dirPath}`);
    return null;
  }

  const mdFiles = fs.readdirSync(dirPath)
    .filter(f => f.endsWith('.md'))
    .sort();

  const files = [];
  for (const mdFile of mdFiles) {
    const content = fs.readFileSync(path.join(dirPath, mdFile), 'utf-8');
    const fileId = mdFile.replace(/\.md$/, '');
    const questions = parseQuestions(content, dirName, fileId);

    if (questions.length > 0) {
      files.push({
        id: fileId,
        title: titleFromFilename(mdFile),
        questions,
      });
    }
  }

  if (files.length === 0) return null;

  return {
    id: dirName,
    title: meta.title,
    icon: meta.icon,
    files,
  };
}

// Main
const sectionDirs = Object.keys(SECTION_META);
const sections = sectionDirs.map(processSection).filter(Boolean);

const totalQuestions = sections.reduce(
  (sum, s) => sum + s.files.reduce((fSum, f) => fSum + f.questions.length, 0), 0
);

const output = `// Auto-generated — do not edit manually
// Generated on ${new Date().toISOString()}
// Total: ${sections.length} sections, ${totalQuestions} questions

export const sections = ${JSON.stringify(sections, null, 2)};
`;

const outPath = path.join(__dirname, '../src/data/questions.js');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, output, 'utf-8');

console.log(`Generated ${outPath}`);
console.log(`Sections: ${sections.length}, Total questions: ${totalQuestions}`);
sections.forEach(s => {
  const qCount = s.files.reduce((sum, f) => sum + f.questions.length, 0);
  console.log(`  ${s.id}: ${qCount} questions across ${s.files.length} file(s)`);
});
