#!/usr/bin/env node
/**
 * Build ChatGPT Knowledge files from the five original REA skills without
 * changing their source files. Run from the repository root:
 *   node scripts/build-chatgpt-knowledge.mjs
 */
import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join, relative, extname } from 'node:path';

const root = process.cwd();
const outDir = join(root, 'dist', 'chatgpt-knowledge');
const skillNames = [
  'reverse-engineer-anything',
  'rea-analysis-optimization',
  'rea-changelog-update',
  'rea-ci-tests-audit',
  'rea-tool-design',
];
const technicalDocs = [
  'docs/android-analysis.md',
  'docs/adb-device-analysis.md',
  'docs/apktool-resource-analysis.md',
  'docs/native-investigation.md',
  'docs/reverse-engineering-tools.md',
  'docs/mcp-contracts.md',
  'docs/mcp-prompts.md',
  'docs/tool-design.md',
  'docs/testing.md',
  'docs/managed-code-analysis.md',
  'docs/javascript-application-workflows.md',
  'docs/firmware-analysis.md',
  'docs/flutter-analysis.md',
  'docs/ida-provider.md',
  'docs/kuna-provider.md',
  'docs/installation.md',
  'chatgpt/rea-reverse-engineering/ANDROID_NATIVE_SOFTWARE_ANALYSIS.md',
];
const textExtensions = new Set([
  '.md', '.mdx', '.txt', '.json', '.yaml', '.yml', '.toml', '.xml',
  '.csv', '.tsv', '.ini', '.cfg', '.sh', '.py', '.js', '.mjs', '.ts',
  '.tsx', '.jsx', '.c', '.h', '.cpp', '.hpp', '.java', '.kt', '.rs',
  '.go', '.proto',
]);

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const found = [];
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) found.push(...await walk(full));
    else if (textExtensions.has(extname(entry.name).toLowerCase())) found.push(full);
  }
  return found;
}

function sha256(value) {
  return createHash('sha256').update(value, 'utf8').digest('hex');
}

async function sourceBlock(path) {
  const value = await readFile(join(root, path), 'utf8');
  const digest = sha256(value);
  return {
    path,
    digest,
    block: [
      '===== BEGIN SOURCE FILE: ' + path + ' =====',
      'SHA256: ' + digest,
      value.replace(/\s+$/, ''),
      '===== END SOURCE FILE: ' + path + ' =====',
      '',
    ].join('\n'),
  };
}

await mkdir(outDir, { recursive: true });
const manifest = [];

for (const name of skillNames) {
  const sourceDir = join(root, '.agents', 'skills', name);
  const files = await walk(sourceDir);
  const blocks = [];
  for (const file of files) {
    const path = relative(root, file).split('\\').join('/');
    const item = await sourceBlock(path);
    manifest.push({ group: name, path, sha256: item.digest });
    blocks.push(item.block);
  }
  const output = [
    '# REA Knowledge — Original skill: ' + name,
    '',
    'Verbatim-content bundle of the original skill files and text references. Source files are not modified.',
    '',
    ...blocks,
  ].join('\n');
  await writeFile(join(outDir, name + '.md'), output, 'utf8');
}

const docs = [];
for (const path of technicalDocs) {
  try {
    const item = await sourceBlock(path);
    docs.push(item.block);
    manifest.push({ group: 'technical-references', path, sha256: item.digest });
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error;
    console.warn('Skipping unavailable optional reference: ' + path);
  }
}
await writeFile(
  join(outDir, 'REA-Technical-References.md'),
  ['# REA Technical References', '', 'Selected Android, native, provider, software-analysis, and testing documentation from this checkout.', '', ...docs].join('\n'),
  'utf8',
);

const newSkillPath = 'chatgpt/rea-reverse-engineering/ANDROID_NATIVE_SOFTWARE_ANALYSIS.md';
const newSkill = await sourceBlock(newSkillPath);
await writeFile(join(outDir, 'REA-Android-Native-Software-Analysis.md'), '# ' + newSkillPath + '\n\n' + newSkill.block, 'utf8');
manifest.push({ group: 'new-chatgpt-skill', path: newSkillPath, sha256: newSkill.digest });

await writeFile(
  join(outDir, 'SOURCE-MANIFEST.json'),
  JSON.stringify({
    generatedAt: new Date().toISOString(),
    sourceFiles: manifest,
  }, null, 2) + '\n',
  'utf8',
);

console.log('Built ' + (skillNames.length + 2) + ' ChatGPT Knowledge files in dist/chatgpt-knowledge/.');
console.log('Included ' + manifest.length + ' source files. Original source files were not modified.');
