const cp = require('child_process');

// Would have preferred to use https://github.com/sindresorhus/import-global/
// However due to a known limitation, it may return incorrect value in certain
// scenarios in Yarn. See https://github.com/sindresorhus/global-dirs/issues/13

const execSync = cmd => {
	try {
		const opts = {
			cwd: process.cwd(),
			env: process.env,
			encoding: 'utf8',
			windowsHide: true,
			stdio: 'pipe'
		}
		return cp.execSync(cmd, opts).trim();
	} catch(e) {
		return null;
	}
};

const npmGlobalModules = () => execSync('npm root -g');

const yarnGlobalModules = () => execSync('yarn global dir');

const supportGlobalResolving = (resolver, globalPaths) => {
	const doResolve = resolver.resolve;
	if (!Array.isArray(globalPaths)) globalPaths = [globalPaths];
	resolver.resolve = function(moduleName, relativeToPath) {
		try {
			// attempt normal resolving to support local & overrides
			return doResolve.call(resolver, moduleName, relativeToPath);
		} catch (e) {
			// support global-relative path resolving
			for(let i = 0; i < globalPaths.length; i++) {
				try {
					return doResolve.call(resolver, moduleName, globalPaths[i]);
				} catch(e2) {
					// continue to next globalPaths entry
				}
			}
			throw e;
		}
	};
};

module.exports = {
	npmGlobalModules,
	yarnGlobalModules,
	supportGlobalResolving
};
