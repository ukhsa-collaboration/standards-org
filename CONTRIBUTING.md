# Contributing to UKHSA Organisational Standards

Thank you for your interest in contributing to the UKHSA Organisational Standards! This repository contains standards, guidelines and best practices that define how we do engineering at UKHSA and what we expect from our teams and partners.

## Table of Contents

- [Contributing to UKHSA Organisational Standards][1]
  - [Table of Contents][2]
  - [Code of Conduct][3]
  - [Getting Started][4]
    - [Setting Up Your Development Environment][5]
      - [1. Fork the repository][6]
      - [2. Clone the repository][7]
      - [3. Install dependencies][8]
    - [Understanding the Repository Structure][9]
  - [Contributing Process][10]
    - [Finding Issues to Work On][11]
    - [Signed Commits][12]
      - [1. Generate a GPG key (if you don't have one already)][13]
      - [2. Configure Git to use your GPG key][14]
      - [3. Add your GPG key to GitHub][15]
      - [4. Sign your commits][16]
    - [Opening New Issues][17]
    - [Making Changes][18]
      - [Example][19]
    - [Pull Request Process][20]
  - [Development Guidelines][21]
    - [Documentation Standards][22]
  - [Viewing the Guidelines Locally][23]
  - [Documentation Deployment][24]

## Code of Conduct

Please read the [Code of Conduct][25] before contributing.

## Getting Started

### Setting Up Your Development Environment

#### 1. Fork the repository

If you're an external contributor make sure to [fork this project first][26]

#### 2. Clone the repository

If you are a member of the `ukhsa-collaboration` GitHub organisation, you can clone the repository directly:

```bash
git clone https://github.com/ukhsa-collaboration/standards-org.git
cd standards-org
```

Otherwise, if you are an external contributor, you can clone your fork:

```bash
git clone https://github.com/YOUR-USERNAME/standards-org.git
cd standards-org
```

#### 3. Install dependencies

Before you begin, ensure you have the following installed:

| Tool | Version | Description |
| - | - | - |
| [Node.js][27] / npm | `v22 Latest LTS` | Required for packaging and testing spectral rules. |

You can install node using your system's package manager or download them from the [respective website][27].

You can verify your installations with:

```bash
node --version
npm --version
```

install the required dependencies with the following command:

```bash
npm install
```

### Understanding the Repository Structure

- `/docs/` - Documentation content written in Markdown
- `/src/` - Eleventy configurations and customisations
- `eleventy.config.json` - Eleventy configuration file

## Contributing Process

### Finding Issues to Work On

- Check the [Issues][28] section for open tasks
- Look for issues tagged with `good first issue` if you're new to the project

### Signed Commits

All commits to this repository **MUST** be signed with a GPG key to verify the committer's identity. This helps ensure the security and integrity of the codebase.

To set up signed commits:

#### 1. Generate a GPG key (if you don't have one already)

```bash
gpg --full-generate-key
```

#### 2. Configure Git to use your GPG key

```bash
# List your GPG keys to get the ID
gpg --list-secret-keys --keyid-format=long

# Configure Git to use your key (replace KEY_ID with your GPG key ID)
git config --global user.signingkey KEY_ID

# Enable commit signing by default
git config --global commit.gpgsign true
```

#### 3. Add your GPG key to GitHub

- Export your public key: `gpg --armor --export KEY_ID`
- Add this key to your GitHub account under Settings > SSH and GPG keys

#### 4. Sign your commits

```bash
# If you've enabled signing by default, just commit normally
git commit -m "Your commit message"

# Or explicitly sign a commit
git commit -S -m "Your commit message"
```

For more information, see GitHub's documentation on [signing commits][29].

### Opening New Issues

Before opening a new issue:

1. **[Search existing issues][30]** to avoid duplicates
1. **Use issue templates** if available
1. **Be clear and specific** about:
   - What needs to be changed/added
   - Why it's important
   - Any relevant context

### Making Changes

1. **Create a new branch** for your work:

   ```bash
   git checkout -b feature/your-feature-name
   ```

   or

   ```bash
   git checkout -b fix/issue-you-are-fixing
   ```

1. **Make your changes** following the [development guidelines][21] below.

1. **Commit your changes** with clear commit messages and sign them (see [Signed Commits][12]):

We follow the [Conventional Commits][31] specification for commit messages. This provides a standardised format that makes the commit history more readable and enables automated tools for versioning and changelog generation.

The commit message should be structured as follows:

```text
Subject:
<type>: <short summary>
  │           │
  │           └─⫸ Summary in present tense. Not capitalized. No period at the end.
  │
  └─⫸ Commit Type: build|docs|feat|fix|perf|refactor|revert|test

Body:
<detailed description of changes made in the commit> (wrap at 72 characters)

Footer:
<any additional information, such as references or issue numbers>
```

| Type | Description | SemVer Impact |
| - | - | - |
| `build` | A change to CI configuration files and scripts, or that affect the build system or external dependencies | None (*unless functionality is affected*) |
| `docs` | Documentation only changes | None |
| `feat` | A new feature | MINOR (`x.Y.z`) |
| `fix` | A bug fix | PATCH (`x.y.Z`) |
| `perf` | A code change that improves performance | PATCH (`x.y.Z`) |
| `refactor` | A code change that improve code quality but have no functional effect | None (*unless functionality is affected*) |
| `revert` | Reverts a previous commit | Depends on the reverted change |
| `test` | Adding or correcting tests | None |

> [!NOTE]
> A commit that has a footer `BREAKING CHANGE:`, or appends a `!` after the type/scope, introduces a breaking API change (correlating with [`MAJOR`][32] in Semantic Versioning). A BREAKING CHANGE can be part of commits of any *type*.

#### Example

```bash
git commit -m "feat(scope): add rate limiting recommendations"
```

or with more details:

```bash
git commit -m "fix(scope): correct validation for API versioning

Resolves issue #123"
```

### Pull Request Process

1. **Update your branch/fork** with the latest from upstream:

   If you are an external contributor, you will need to add the upstream repository as a remote, see [fork the repository][6] for more details.

   Make sure to keep your fork up to date with the main repository by [syncing your fork][33] with the upstream repository.

   If you are a member of the `ukhsa-collaboration` GitHub organisation, you can update your branch with the latest from `main` with the following commands:

   ```bash
   git fetch
   git rebase origin/main
   ```

   > [!NOTE]
   > This repository maintains a [linear commit history][34].
   >
   > Always use [`rebase`][35] instead of `merge` when keeping your branch up to date with the `main` branch.

1. **[link PR to issue][36]** if you are solving one.

1. **Push your changes** to your branch/fork:

   If its your fist push to the branch you can use:

   ```bash
   git push -u origin your-branch-name
   ```

   or if you have already pushed to the branch you can use:

   ```bash
   git push origin your-branch-name
   ```

   If you've previously pushed your branch and have rebased, you may need to force push:

   ```bash
   git push --force-with-lease origin your-branch-name
   ```

1. **Create a Pull Request** from your branch/fork to the main repository

   if you are a member of the `ukhsa-collaboration` GitHub organisation, you can create a [pull request][37] directly from your branch.

   If you are an external contributor, you can create a [pull request from your fork][38] to the main repository.

1. **Fill in the PR template** with all relevant information

1. **Request a review** from maintainers

1. **Address any feedback** provided during the review process. When making changes to address feedback:
   - Make additional commits while the PR is under review
   - Once approved, consider squashing related commits for a cleaner history
   - Use descriptive commit messages that explain the changes

1. **Prepare for merge**: Before your PR is merged, make sure your branch is up to date with the latest changes from the `main` branch.

   You should be able to do this from the [GitHub UI][39] or from the command line.

   If you are an external contributor, you can use the following commands to keep your branch up to date with the `main` branch:

   ```bash
   # from your feature branch
   git fetch upstream
   git rebase upstream/main
   ```

   If you are a member of the `ukhsa-collaboration` GitHub organisation, you can use the following commands to keep your branch up to date with the `main` branch:

   ```bash
   # from your feature branch
   git fetch
   git rebase origin/main
   ```

   Occasionally you may also be asked to squash your commits to maintain a clean project history. If you are an external contributor, you can use the following commands to squash your commits:

   ```bash
   # Squash multiple commits into one
   git rebase -i HEAD~{number of commits to squash}
   # and follow the instructions in the editor to squash your commits
   # or squash all commits since branching from main
   git fetch upstream
   git rebase -i upstream/main
   ```

   If you are a member of the `ukhsa-collaboration` GitHub organisation, you can use the following commands to squash your commits:

   ```bash
   # Squash multiple commits into one
   git rebase -i HEAD~{number of commits to squash}
   # and follow the instructions in the editor to squash your commits
   # or squash all commits since branching from main
   git fetch
   git rebase -i origin/main
   ```

   > [!NOTE]
   > This repository maintains a [linear commit history][34].
   >
   > Always use [`rebase`][35] instead of `merge` when keeping your branch up to date with the `main` branch (see previous step).

1. **Merge the PR**: Once approved and all status checks have passed, including the branch being up to date with main, you can merge your pull request. Only users with `write` or `admin` permissions on the repository can trigger this action. If you're an external contributor, a maintainer may need to do this for you.

1. Congratulations! 🎉🎉 You've successfully contributed to the UKHSA Organisational standards, any documentation changes will be automatically deployed to the [UKHSA Organisational standards][40] site.

## Development Guidelines

### Documentation Standards

- Write in clear, concise language suitable for technical audiences.
- Use [RFC2119][41] keywords (**MUST**, **SHOULD**, **MAY**, etc.) correctly to indicate requirement levels.
- Include practical examples where appropriate.
- Follow Markdown best practices for formatting.
- Documentation **SHOULD NOT** be added to the `docs/` directory directly (except the landing / core pages), as it is pulled in from other sources.
- Documentation is pulled in from other repositories see `src/build/obtain-docs.js` to add other repositories or to see how this works.
- Preview changes locally using `npx eleventy --serve` before submitting.

## Viewing the Guidelines Locally

The documentation is organised into various markdown files under the `docs/` directory. This is for the most part pulled in from other repositories using `npm run fetch`. You can navigate and edit these files directly but remember these changes will not be persisted to this repository so if you want to update those docs then do so at the relevant down stream repository. To preview the documentation as it will appear on the website:

```bash
# Start the eleventy development server
npx eleventy --serve
```

This will start a local server, and you can view the documentation in your browser at `http://localhost:8080`.

## Documentation Deployment

The documentation is continuously deployed from the `main` branch by GitHub Actions, using the workflow defined in `/.github/workflows/publish-guidelines.yml`.

When documentation changes are merged into the `main` branch, the documentation site is automatically updated and re-published on GitHub Pages.

Thank you for contributing to improving engineering standards, guidelines and best practices across the UKHSA!

[1]: #contributing-to-ukhsa-organisational-standards
[2]: #table-of-contents
[3]: #code-of-conduct
[4]: #getting-started
[5]: #setting-up-your-development-environment
[6]: #1-fork-the-repository
[7]: #2-clone-the-repository
[8]: #3-install-dependencies
[9]: #understanding-the-repository-structure
[10]: #contributing-process
[11]: #finding-issues-to-work-on
[12]: #signed-commits
[13]: #1-generate-a-gpg-key-if-you-dont-have-one-already
[14]: #2-configure-git-to-use-your-gpg-key
[15]: #3-add-your-gpg-key-to-github
[16]: #4-sign-your-commits
[17]: #opening-new-issues
[18]: #making-changes
[19]: #example
[20]: #pull-request-process
[21]: #development-guidelines
[22]: #documentation-standards
[23]: #viewing-the-guidelines-locally
[24]: #documentation-deployment
[25]: ./CODE_OF_CONDUCT.md
[26]: https://help.github.com/articles/fork-a-repo/
[27]: https://nodejs.org/en/download/
[28]: https://github.com/ukhsa-collaboration/standards-org/issues
[29]: https://docs.github.com/en/authentication/managing-commit-signature-verification/signing-commits
[30]: https://docs.github.com/en/github/searching-for-information-on-github/searching-on-github/searching-issues-and-pull-requests#search-by-the-title-body-or-comments
[31]: https://www.conventionalcommits.org/
[32]: http://semver.org/#summary
[33]: https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/syncing-a-fork
[34]: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches#require-linear-history
[35]: https://www.atlassian.com/git/tutorials/rewriting-history/git-rebase
[36]: https://docs.github.com/en/issues/tracking-your-work-with-issues/linking-a-pull-request-to-an-issue
[37]: https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request
[38]: https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork
[39]: https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/keeping-your-pull-request-in-sync-with-the-base-branch
[40]: https://ukhsa-collaboration.github.io/standards-org/
[41]: https://datatracker.ietf.org/doc/html/rfc2119
