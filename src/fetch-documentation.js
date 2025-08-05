import fetch from 'node-fetch';
import unzipper from 'unzipper';
import path from 'path';
import fs from 'fs-extra';

const documentation = new Map();

documentation.set('api-guidelines', { outputDir: 'api-design-guidelines', branch: 'feature/eleventy' });
//documentation.set('standards-development', { outputDir: 'development-standards', branch: 'main' });

for (const [repository, { outputDir, branch }] of documentation.entries()) {
  await downloadFolderFromGitHub({
    repo: `ukhsa-collaboration/${repository}`,
    branch: branch || 'main',
    inputDocsPath: 'docs/',
    outputDir: `docs/${outputDir}`
  })
}

async function downloadFolderFromGitHub({ repo, branch = 'main', inputDocsPath, outputDir }) {
  // Download the entire repo as ZIP
  const zipUrl = `https://github.com/${repo}/archive/refs/heads/${branch}.zip`;
  const tempDir = path.join('__tmp_extract__');

  // Ensure dirs exist
  await fs.ensureDir(outputDir);
  await fs.emptyDir(tempDir);

  const response = await fetch(zipUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch ZIP: ${response.statusText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const directory = await unzipper.Open.buffer(buffer);
  await directory.extract({ path: tempDir });


  // The folder inside the zip will be named like repo-branch/inputDocsPath
  const extractedBase = path.join(tempDir, `${repo.split('/')[1]}-${branch.replaceAll('/', '-')}`);
  const srcFolder = path.join(extractedBase, inputDocsPath);
  const destFolder = path.join(outputDir, path.basename(inputDocsPath));

  // Copy the folder to output
  await fs.copy(srcFolder, outputDir);

  // Cleanup temp dir
  await fs.remove(tempDir);

  console.log(`Folder "${inputDocsPath}" downloaded to "${outputDir}" from ${repo} branch ${branch}`);
}