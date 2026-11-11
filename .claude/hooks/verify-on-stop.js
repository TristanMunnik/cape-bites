// Stop hook: the Test stage's feedback loop. Before Claude finishes a turn, run
// server tests and/or client lint for whichever side has uncommitted changes.
// If anything fails, Claude is sent back to fix it.
const { execSync, spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const checks = [
    { folder: 'server', label: 'Server tests', command: 'npm test' },
    { folder: 'client', label: 'Client lint', command: 'npm run lint' },
];

// Returns a list of failure messages (empty when everything passes).
function runChecks(input) {
    // Already sent back once this turn; let it stop so we never loop forever.
    if (input.stop_hook_active) return [];

    const projectDir = process.env.CLAUDE_PROJECT_DIR || input.cwd;
    const changedFiles = execSync('git status --porcelain', { cwd: projectDir, encoding: 'utf8' })
        .split('\n')
        .map((line) => line.slice(3).trim())
        .filter(Boolean);
    const failures = [];

    for (const check of checks) {
        const changed = changedFiles.some((file) => file.startsWith(`${check.folder}/`));
        const installed = fs.existsSync(path.join(projectDir, check.folder, 'node_modules'));
        if (!changed || !installed) continue;

        const result = spawnSync(check.command, {
            cwd: path.join(projectDir, check.folder),
            encoding: 'utf8',
            shell: true,
        });

        if (result.status !== 0) {
            const output = `${result.stdout}\n${result.stderr}`.trim().slice(-3000);
            failures.push(`${check.label} failed (${check.command} in ${check.folder}/):\n${output}`);
        }
    }

    return failures;
}

const failures = runChecks(JSON.parse(fs.readFileSync(0, 'utf8')));

if (failures.length > 0) {
    process.stdout.write(JSON.stringify({
        decision: 'block',
        reason: `AI-native SDLC (Test stage): fix these before finishing. Don't weaken or delete tests to make them pass.\n\n${failures.join('\n\n')}`,
    }));
}
