import { exec } from 'child_process';
import path from 'path';
import fs from 'fs-extra';


export default async function sparseClone({ url, branch }, targetDir) {
  await fs.ensureDir(targetDir);

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

  await run('git init', targetDir);
  await run(`git remote add origin ${url}`, targetDir);
  await run('git config core.sparseCheckout true', targetDir);
  await fs.writeFile(path.join(targetDir, '.git/info/sparse-checkout'), 'docs/\n');
  await run(`git pull origin ${branch}`, targetDir);

  console.log(`Cloned docs/ from ${url} to ${targetDir}`);
}