import path from 'path';
import fs from 'fs-extra';

import sparseClone from "./sparse-clone.js";
import generateFileMetadata from "./generate-docs-file-meta.js";
import repos from "./repos.js";

const tempDir = 'cloned-docs';
const targetDir = 'docs';
const fileTypesToInclude = ['.md']; // Specify file types to include

// Cleanup temp dir
await fs.remove(tempDir);

for (const repo of repos) {
  try {
    let outputDirName = repo.outputDirName ?? repo.url.split('/').pop().replace('.git', '');
    let cloneDir = path.join(tempDir, outputDirName);

    await sparseClone(repo, cloneDir);
    await generateFileMetadata(cloneDir, fileTypesToInclude);

    let destDir = path.join(targetDir, outputDirName);
    await fs.remove(destDir);
    // Copy the folder to output
    await fs.copy(path.join(cloneDir, 'docs'), destDir);
  } catch (err) {
    console.error(`Error processing ${repo.url}:`, err);
  }

  // Cleanup temp dir
  await fs.remove(tempDir);
}
