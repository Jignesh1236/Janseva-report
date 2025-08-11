const { spawn } = require('child_process');

console.log('🚀 Starting Jan Seva Kendra application...');
console.log('📊 Admin login system ready!');
console.log('');
console.log('🔑 Login Credentials:');
console.log('   Admin: admin123 (for /report/admin)');
console.log('   Reports: report123 (for /reports/view)');
console.log('');
console.log('💡 Available pages:');
console.log('   • /report/admin - Admin dashboard');
console.log('   • /reports/view - Report viewer'); 
console.log('   • /debug-auth - Authentication testing');
console.log('   • /debug - System debugging');
console.log('');

const server = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true
});

server.on('error', (error) => {
  console.error('❌ Failed to start server:', error);
});

server.on('close', (code) => {
  console.log(`🛑 Server stopped with code ${code}`);
});