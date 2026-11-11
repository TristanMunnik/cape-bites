// PreToolUse hook: blocks edits to app code until the feature's intent is approved.
// - Never on main/master.
// - On feature/<name>, only once docs/intent/<name>.md contains "Status: approved".
// Other branches (fix/, chore/) are allowed for small changes that don't need an intent.
const { execSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const guardedFolders = ['server', 'client'];

// Returns a reason to block the edit, or null to allow it.
function checkEdit(input) {
    const projectDir = process.env.CLAUDE_PROJECT_DIR || input.cwd;
    const filePath = input.tool_input && (input.tool_input.file_path || input.tool_input.notebook_path);
    if (!filePath) return null;

    const relativePath = path.relative(projectDir, path.resolve(projectDir, filePath));
    const topFolder = relativePath.split(path.sep)[0];
    if (!guardedFolders.includes(topFolder)) return null;

    const branch = execSync('git rev-parse --abbrev-ref HEAD', { cwd: projectDir, encoding: 'utf8' }).trim();

    if (branch === 'main' || branch === 'master') {
        return 'AI-native SDLC: app code is never edited on main. Start a feature with /new-feature <name>, or create a fix/ branch for a small fix.';
    }

    if (!branch.startsWith('feature/')) return null;

    const featureName = branch.slice('feature/'.length);
    const intentPath = path.join(projectDir, 'docs', 'intent', `${featureName}.md`);

    if (!fs.existsSync(intentPath)) {
        return `AI-native SDLC (Plan stage): write docs/intent/${featureName}.md from docs/intent/_template.md before editing code.`;
    }

    if (!/^Status:\s*approved\b/im.test(fs.readFileSync(intentPath, 'utf8'))) {
        return `AI-native SDLC (Plan/Design stage): docs/intent/${featureName}.md is not approved yet. Finish the intent and design with the user; only the user sets "Status: approved".`;
    }

    return null;
}

const reason = checkEdit(JSON.parse(fs.readFileSync(0, 'utf8')));

if (reason) {
    process.stdout.write(JSON.stringify({
        hookSpecificOutput: {
            hookEventName: 'PreToolUse',
            permissionDecision: 'deny',
            permissionDecisionReason: reason,
        },
    }));
}
