# Build Software with GitHub and GitHub Copilot

This template repository contains both the starter application and a self-guided hands-on lab covering planning, building, reviewing, and merging software with GitHub and GitHub Copilot.

## Start the lab

**Hosted lab:** [Open the Build Software with GitHub and GitHub Copilot lab](https://adu103.github.io/gh-lab-test/)

Keep the lab open in one browser tab. It will direct you back to this template, which you will use to create a new repository in your own GitHub account before making any changes.

The lab walks through:

1. Shape work as GitHub issues with clear acceptance criteria.
2. Give Copilot repository context with custom instructions.
3. Complete Story A from Plan → Build with coding agent → Copilot code review → Merge.
4. Complete Story B from Plan → Build with IDE Agent mode → Copilot code review → Merge.
5. Compare the two ways of working and continue the loop with another feature.

The sample application is a deliberately small React and TypeScript service-request tracker. It has enough code and tests for Copilot to reason about, while leaving several realistic features for workshop participants to build.

## Run the starter application

```powershell
npm install
npm run dev
```

Open the URL printed by Vite. In a Codespace, select **Open in Browser** when the forwarded port notification appears.

## Validate the project

```powershell
npm test
npm run lint
npm run build
```

## Open the interactive lab

No server, npm command, or GitHub Pages setup is required.

**On Windows:** double-click [`Open-Lab.cmd`](Open-Lab.cmd).

**On any operating system:** open [`lab.html`](lab.html) directly in a browser.

The lab is a single self-contained HTML file. Its copy buttons also work when the page is opened from the local filesystem.

## Optional: host the interactive lab

If you want to share a URL, a Pages workflow is included in [`.github/workflows/pages.yml`](.github/workflows/pages.yml).

To publish it:

1. Push this repository to GitHub.
2. Open **Settings → Pages**.
3. Under **Build and deployment**, select **GitHub Actions**.
4. Run the **Deploy lab to GitHub Pages** workflow, or push to the default branch.

When hosted through GitHub Pages, the lab automatically links back to the GitHub repository that published it. When opened locally, it defaults to `adu103/gh-lab-test`.

The lab uses progressive prompting: Story A provides guided prompts, while Story B gives
participants the goal and quality criteria but requires them to write their own issue,
planning, and Agent mode requests.

## Workshop design

| Story | Suggested path | Learning goal |
|---|---|---|
| Filter the request queue | Copilot coding agent | Delegate a well-scoped issue and review the resulting draft PR |
| Resolve a request | IDE agent mode | Review a plan, steer implementation, run tests, and open a PR |
| Show SLA urgency | Optional stretch | Repeat the workflow with less prescriptive guidance |

The repository intentionally does **not** contain `.github/copilot-instructions.md`. Creating and discussing that file is part of the lab.

See [`FACILITATOR.md`](FACILITATOR.md) for the preflight checklist, expected issue criteria, fallback paths, and delivery notes.

## Suggested timing

- Setup and repository context: 15 minutes
- Story A Plan, Build, and Review: 50 minutes
- Story B Plan, Build, and Review: 35 minutes
- Comparison and reflection: 10 minutes

Allow 90–120 minutes depending on participant experience and service availability.
