# GitHub Actions Workflow: `fast-forward-pr-merge-privileged.yml`

This document explains the purpose, logic, and security rationale behind the [`.github/workflows/fast-forward-pr-merge-privileged.yml`][1] workflow in this repository.

## Purpose and Overview

This workflow is the **second phase** of a two-phase pull request (PR) merge process. It works in tandem with the [`fast-forward-pr-merge-init.yml`][2] workflow to allow privileged users to trigger a fast-forward merge of a PR by adding the `fast-forward` label to an open pull request.

The workflow ensures that only users with `write` or `admin` permissions can perform this action, and that the PR is in a clean, mergeable state. It provides clear feedback to users and maintains a full audit trail of the event and actions taken.

## How Does It Work?

### 1. Triggering

- The workflow is triggered by a `workflow_run` event, specifically when the `Fast Forward PR Merge Initialise` workflow completes.
- It only proceeds if the initial workflow succeeded and the event was an `pull_request` being labelled with `fast-forward` and is still open.

### 2. Importing and Validating Event Data

- Downloads the event artifact created by the initial workflow, which contains the full GitHub event payload (including the PR and label details).

### 3. On Failure

- If the initial workflow failed, this job posts a failure comment to the PR, sets a failure status, and removes the `fast-forward` label.

### 4. On Success and Permission Check

- If the initial workflow succeeded and the PR is still open and labelled correctly:
  - Checks the permissions of the user who triggered the label.
  - If the user does **not** have `write` or `admin` permissions at the time of merge, posts a failure comment and removes the label.

### 5. Fast-Forward Merging

- If all checks pass and the PR is in a `clean` (mergeable) state:
  - Checks out the incoming PR branch and the base branch.
  - Rebases the base branch onto the PR branch (fast-forward merge).
  - Pushes the updated base branch to GitHub.
- If the PR is not mergeable (e.g., conflicts), it does not attempt the merge and posts a failure comment.
- After any attempt, the `fast-forward` label is removed from the PR.

### 6. Feedback and Audit Trail

- Posts a comment on the PR indicating success or failure, with a link to the workflow run for details.
- Maintains a full audit trail by saving event data and merge results.

## Why Is This Workflow Needed?

- **True Fast-Forward Merges:** GitHub's "Rebase and merge" option is not a true fast-forward merge. Instead, it rewrites commit SHAs and the process strips any commit signatures, which can break commit verification and audit trails. This workflow enables a genuine fast-forward merge, preserving original commit SHAs and signatures (at least until GitHub supports a true fast-forward merge).
  - See: [GitHub Docs – About merge methods on GitHub][3]
  - See: [GitHub Community - Feature Request: Only allow for --ff merges for PRs][4]
  - See: [GitHub Community – GPG signature lost when merging a PR][5]

- **Preserves Conventional Commit History:** True fast-forward merges retain the original commits and their message structure intact, which is especially valuable for our adoption of [Conventional Commits][6]. Unlike GitHub's `squash-merges` which combine all changes into a single commit with limited control over the structure of the final commit message (making it difficult to ensure it adheres to the conventional commit standard). This enables automated changelog generation, better traceability of features and fixes, and more meaningful project history.

[1]: ./fast-forward-pr-merge-privileged.yml
[2]: ./fast-forward-pr-merge-init.md
[3]: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/about-merge-methods-on-github#rebasing-and-merging-your-commits
[4]: https://github.com/orgs/community/discussions/4618
[5]: https://github.com/orgs/community/discussions/10410
[6]: https://www.conventionalcommits.org/
