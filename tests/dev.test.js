const test = require('ava');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function execute() {
	try {
		const { stdout, stderr } = await exec('./bin/vuec');
		console.log('stdout:', stdout);
		if (stderr) {
			console.error('stderr:', stderr);
		}
	} catch (err) {
		console.error(err);
	}
}

test('main', async (t) => {
	await execute();
	t.pass();
});



