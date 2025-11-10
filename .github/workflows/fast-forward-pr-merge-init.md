# GitHub Actions Workflow: `fast-forward-pr-merge-init.yml`

This document explains the purpose, logic, and security rationale behind the [`.github/workflows/fast-forward-pr-merge-init.yml`][1] workflow in this repository.

## Overview

This workflow is the **first phase** of a two-phase secure PR merge process designed to control and secure the merging of pull requests (PRs) via the addition of a special `fast-forward` label to a pull request. It ensures that only users with sufficient repository permissions (`write` or `admin`) can trigger a merge, and provides clear feedback to users who lack the required permissions.

If the user passes these checks, a second workflow, [`fast-forward-pr-merge-privileged.yml`][2], is triggered to perform the actual fast-forward merge and post the final result.

It is especially important when accepting contributions from external users via a forked repository, which is how most open source contributions are made.

## When Does This Workflow Run?

The workflow is triggered when a pull request receives the `fast-forward` label (`pull_request` event, type `labeled`).

## What Does the Workflow Do?

### 1. Checks User Permissions

- The workflow determines the GitHub username of the user who added the label.
- It uses the GitHub CLI (`gh api`) to fetch the user's permission level on the repository (e.g., `read`, `triage`, `write`, `maintain`, `admin`).
- The permission is stored for use in later steps.

### 2. Handles Insufficient Permissions

- If the user **DOES NOT** have `write` or `admin` permissions:
  - The workflow fails with a clear error message, preventing any further merge automation.
  - The privileged workflow (second phase) will post a comment on the PR stating that the user does not have permission to merge the PR and should contact a member of the [API Standards Team][3] for assistance.

### 3. Event Payload Publishing

- If the user **DOES** have `write` or `admin` permissions:
  - The workflow saves the full event payload (the GitHub event data) as an artifact for use with the second phase of the workflow, but it's also useful for auditing or debugging purposes.

## Why Is This Workflow Needed?

- **True Fast-Forward Merges:** GitHub's "Rebase and merge" option is not a true fast-forward merge. Instead, it rewrites commit SHAs and the process strips any commit signatures, which can break commit verification and audit trails. This workflow enables a genuine fast-forward merge, preserving original commit SHAs and signatures (at least until GitHub support a true fast-forward merge).
  - See: [GitHub Docs – About merge methods on GitHub][4]
  - See: [GitHub Community - Feature Request: Only allow for --ff merges for PRs][5]
  - See: [GitHub Community – GPG signature lost when merging a PR][6]

- **Preserves Conventional Commit History:** True fast-forward merges retain the original commits and their message structure intact, which is especially valuable for our adoption of [Conventional Commits][7]. Unlike GitHub's `squash-merges` which combine all changes into a single commit with limited control over the structure of the final commit message (making it difficult to ensure it adheres to the conventional commit standard). This enables automated changelog generation, better traceability of features and fixes, and more meaningful project history.

## Why is the Workflow Split into Two Phases?

Splitting the merge process into two distinct workflows is a best practice for securing GitHub Actions, especially when privileged operations (like merging to a protected branch) are involved. This approach is recommended by GitHub Security Lab and is designed to mitigate several classes of vulnerabilities:

### Security Boundaries

By separating the unprivileged (label-triggered) phase from the privileged (merge-executing) phase, you create a strong security boundary. The first workflow runs with minimal permissions and only performs checks and artifact publishing. The second, privileged workflow (triggered by `workflow_run`) runs with elevated permissions and only after all checks have passed.

### Prevents Privilege Escalation

If a single workflow both checked permissions and performed the merge, an attacker could potentially exploit timing or event confusion such as **Time Of Check to Time Of Use** ([TOCTOU][8]) attacks to escalate privileges or inject malicious code between steps. By splitting the workflows, the privileged phase only runs after the unprivileged phase has completed and its outputs (artifacts) are validated.

### Mitigates Artifact Poisoning

Artifacts passed from the unprivileged to the privileged workflow are treated as untrusted. This separation allows you to validate and sanitise any data before it is used in a privileged context, reducing the risk of artifact poisoning attacks.

### Reduces Risk from Untrusted Triggers

Triggers like `issue_comment` or `pull_request_target` can be abused by attackers to execute workflows with elevated permissions. By using a label gate and a two-phase approach, you ensure that only trusted actors (with `write` or `admin` permissions) can initiate the privileged merge, and that the code being merged is exactly what was reviewed and approved.

### Aligns with GitHub Security Guidance

GitHub’s own security research recommends splitting workflows into unprivileged and privileged components, using `workflow_run` as a secure handoff point. This pattern is now widely adopted in the open source community to prevent supply chain attacks and workflow abuse.

[1]: ./.github/workflows/fast-forward-pr-merge-init.yml
[2]: ./fast-forward-pr-merge-privileged.md
[3]: https://github.com/orgs/ukhsa-collaboration/teams/api-standards-team
[4]: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/about-merge-methods-on-github#rebasing-and-merging-your-commits
[5]: https://github.com/orgs/community/discussions/4618
[6]: https://github.com/orgs/community/discussions/10410
[7]: https://www.conventionalcommits.org/
[8]: https://en.wikipedia.org/wiki/Time-of-check_to_time-of-use
