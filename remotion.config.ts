import {Config} from '@remotion/cli/config';

Config.setEntryPoint('./src/index.ts');
Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);

// In Claude Code's remote sandbox, the Chrome download URL is blocked.
// A headless Chromium binary is already provided by the environment,
// so point Remotion at it. Falls back to Remotion's default elsewhere.
const SANDBOX_CHROME =
	'/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
try {
	// Only set it if the binary exists on this machine (e.g. the web sandbox).
	// eslint-disable-next-line @typescript-eslint/no-require-imports
	const fs = require('fs');
	if (fs.existsSync(SANDBOX_CHROME)) {
		Config.setBrowserExecutable(SANDBOX_CHROME);
	}
} catch {
	// ignore — use default Remotion Chrome download
}
