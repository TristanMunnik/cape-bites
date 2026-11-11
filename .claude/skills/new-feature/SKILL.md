---
name: new-feature
description: Start a new feature the AI-native SDLC way - create the feature branch and intent file, then run the Plan stage interview. Use when the user wants to start building a new feature.
argument-hint: <feature-name in kebab-case>
disable-model-invocation: true
---

Start the feature `$ARGUMENTS` using the AI-native SDLC loop in CLAUDE.md.

1. **Branch.** Check `git status` is clean. Switch to `main`, pull, then create `feature/$ARGUMENTS`. If the working tree isn't clean, stop and ask the user what to do with their changes.
2. **Intent file.** If `docs/intent/$ARGUMENTS.md` already exists, use it. Otherwise copy `docs/intent/_template.md` to it and fill in the name and branch. Keep `Status: draft`.
3. **Plan stage.** Tell the user we're in the Plan stage and, in 1-2 lines, why it comes first. Read the relevant code so your questions are informed. Then interview the user, a few questions at a time, until the problem, users, success criteria, scope and non-goals, risks and open questions are clear. Update the intent file as answers come in.
4. **Design stage.** Once the intent is clear, propose the design (files, data/API changes, UI, edge cases, tests) and write it into the intent file's Design section.
5. **Approval gate.** Ask the user to review the intent file and change it to `Status: approved` themselves. Code edits under `server/` and `client/` are blocked by a hook until they do. Never set it yourself.
