# Facilitator guide

## Why this starter

Three approaches were considered:

| Approach | Strength | Tradeoff |
|---|---|---|
| Purpose-built service-request tracker | Predictable, small, testable, and designed around the exact learning objectives | The facilitator owns the starter |
| [`github/codespaces-react`](https://github.com/github/codespaces-react) | Existing public Codespaces sample | Exercises and architecture are not designed for this workflow |
| Blank repository built entirely by Copilot | Strong initial wow factor | Variable results and too much setup for a focused planning/build/review lab |

The purpose-built starter is recommended. Participants still create the repository instructions and all workshop features themselves, but everyone starts with the same working application and tests.

The lab deliberately removes scaffolding as participants progress:

- Story A runs through Plan, Build, and Review with guided prompts so participants can
  focus on understanding the full workflow.
- Story B repeats Plan, Build, and Review with the user need and quality checklist, but
  participants write their own issue-drafting, Plan mode, and Agent mode requests.
- The stretch story is independent practice.

## Preflight checklist

Complete this at least one day before the workshop:

- Publish the starter repository where every participant can fork it.
- Decide how to distribute the lab:
  - send participants the standalone `lab.html` file, or
  - enable GitHub Pages with **GitHub Actions** as the source.
- Confirm each participant has a GitHub Copilot license.
- Confirm Codespaces is available for the repository and participant accounts.
- Confirm Copilot coding agent is enabled for the organization/repository.
- Confirm Copilot code review is enabled and can be requested on a test pull request.
- Confirm GitHub Actions can run in participant forks.
- Test the lab once using a fresh fork and a non-admin account.

If your organization limits forking, create a repository from the starter template for each participant or team before the workshop.

## Suggested delivery

| Time | Activity |
|---|---|
| 0:00–0:10 | Fork, Codespace, baseline validation |
| 0:10–0:25 | Explore repository and create custom instructions |
| 0:25–0:40 | Story A: draft issue and review the plan |
| 0:40–1:00 | Story A: coding agent implementation |
| 1:00–1:15 | Story A: Copilot code review and human review |
| 1:15–1:50 | Story B: Plan, build in IDE Agent mode, and review |
| 1:50–2:00 | Compare the workflows and reflect |

For a 90-minute version, provide the custom-instructions content, create only the first two stories, and demonstrate rather than wait for the coding-agent run.

## Expected issue quality

Participants should write the issue with Copilot, not copy a provided answer. Use these criteria to coach or unblock them.

### Story A: Filter the request queue

- Status options include all statuses plus an unfiltered option.
- Priority options include all priorities plus an unfiltered option.
- Status and priority filters can be combined.
- The displayed result count reflects the filtered queue.
- A useful empty state appears when no requests match.
- Controls have accessible labels and work with a keyboard.
- Filtering logic is isolated in a pure helper with tests.
- Existing summary metrics continue to represent the full queue unless the issue explicitly decides otherwise.

### Story B: Resolve a request

- Open and in-progress requests have a clear Resolve action.
- Resolved requests do not offer the action.
- Activating the action changes the request status to Resolved.
- Queue summary metrics update immediately.
- The action has an accessible name and visible focus treatment.
- Status-update logic has focused tests.
- The implementation does not introduce a new dependency.

### Stretch: Show SLA urgency

- High priority is due four hours after submission, medium after one day, and low after three days.
- Each request shows a readable due time.
- Overdue active requests are clearly identified without relying on color alone.
- Resolved requests are not marked overdue.
- Date logic is deterministic and unit tested with a supplied current time.

## Fallback paths

### Coding agent is unavailable

Have the participant implement Story A in a second Codespace or local VS Code window using agent mode. Preserve the learning goal by treating it as a delegated task:

1. Give Copilot only the issue and repository instructions.
2. Ask it to work independently and run validation.
3. Do not steer until it produces a complete diff.
4. Open a separate pull request and compare it with the more interactive Story B experience.

### Copilot code review is unavailable

Use Copilot Chat from the pull request diff or Codespace:

```text
Review the changes on this branch against issue #ISSUE_NUMBER and
`.github/copilot-instructions.md`. Focus on correctness, missed edge cases,
accessibility, test quality, and unnecessary complexity. Do not edit files.
```

Make clear that this is a fallback and does not reproduce the full pull-request review experience.

### A coding-agent run takes too long

Move on to IDE agent mode and return to the draft pull request during the review section. The asynchronous nature of the workflow is part of the lesson.

## Discussion prompts

- Which acceptance criterion most improved the implementation?
- What did custom instructions influence?
- What was easier to delegate than to steer interactively?
- Where did Copilot make an assumption that a person needed to correct?
- Which code-review comment was most valuable? Which was not?
- What repository standard should be added to the instructions before the next issue?

## Workshop boundary

Stop with two reviewed, merge-ready pull requests. Do not add deployment, GitHub Advanced Security, attestations, or production operations to this lab. Those topics work better as a separate follow-on session.
