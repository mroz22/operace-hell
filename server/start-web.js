const args = [ 'start' ];
const opts = { stdio: 'inherit', cwd: 'web', shell: true };

require('child_process').spawn('npm', args, opts);
