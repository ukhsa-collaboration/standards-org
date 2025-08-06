import { exec } from 'child_process';
import path from 'path';
import fs from 'fs-extra';

// Helper to run commands async
const run = (cmd, cwd) => new Promise((resolve, reject) => {
  exec(cmd, { cwd }, (err, stdout, stderr) => {
    if (err) {
      reject(stderr || stdout);
    } else {
      resolve(stdout);
    }
  });
});


async function getGitFileMeta(filePath, repoRoot, relPath) {
  const fileRelToRepo = path.relative(repoRoot, filePath);
  const logFormat = '%H|%an|%aI';
  const logCmd = `git log --follow --pretty=format:'${logFormat}' --date=iso -- "${fileRelToRepo}"`;
  const logOut = await run(logCmd, repoRoot);
  const lines = logOut.trim().split('\n').filter(Boolean);

  if (lines.length === 0) {
    return null;
  }

  const first = lines[lines.length - 1].split('|'); // Oldest commit
  const last = lines[0].split('|'); // Most recent commit
  const contributors = [...new Set(lines.map(l => l.split('|')[1]))];

  const permalink = await generateGithubPermalink(repoRoot, fileRelToRepo);

  return {
    file: `./docs/${repoRoot.split(path.sep)[1]}/${relPath}`,
    permalink: permalink,
    created: first[2],
    createdBy: first[1],
    lastUpdated: last[2],
    lastUpdatedBy: last[1],
    contributors
  };
}


export async function generateGithubPermalink(repoRoot, fileRelToRepo) {
  const repoUrl = (await run('git remote get-url origin', repoRoot)).trim();
  const headSha = (await run('git rev-parse HEAD', repoRoot)).trim();

  const githubMatch = repoUrl.match(/github.com[:/](.+)\/(.+?)(\\.git)?$/);

  const owner = githubMatch[1];
  const repo = githubMatch[2].replace('.git', '');
  return `https://github.com/${owner}/${repo}/blob/${headSha}/${fileRelToRepo}`;
}

async function scanRepo(repoDir, parentDir, fileTypesToInclude = []) {
  const files = await fs.readdir(repoDir, { withFileTypes: true });
  let results = [];
  for (const file of files) {
    const filePath = path.join(repoDir, file.name);
    if (file.isDirectory()) {
      const subResults = await scanRepo(filePath, parentDir, fileTypesToInclude);
      results = results.concat(subResults);
    } else {
      // Only include files with specified extensions
      if (!fileTypesToInclude.some(ext => file.name.endsWith(ext))) continue;
      // Path relative to docs folder (omit 'docs/' prefix)
      const docsRoot = path.join(parentDir, 'docs');
      const relPath = path.relative(docsRoot, filePath);

      const meta = await getGitFileMeta(filePath, parentDir, relPath);
      if (meta) results.push(meta);
    }
  }

  return results;
}


export default async function generateFileMetadata(repoPath, fileTypesToInclude = ['.md']) {
  const docsPath = path.join(repoPath, 'docs');
  if (!(await fs.pathExists(docsPath))) {
    console.error(`Docs folder not found in ${repoPath}`);
    return;
  }
  const meta = await scanRepo(docsPath, repoPath, fileTypesToInclude);
  const result = meta.reduce((accumulator, item) => {
    accumulator[item.file] = item;
    return accumulator;
  }, {});
  const repoName = path.basename(repoPath);
  const outputFile = path.join(repoPath, 'docs', `${repoName}-meta.json`);
  await fs.writeJson(outputFile, result, { spaces: 2 });
  console.log(`File metadata written to ${outputFile}`);
}
