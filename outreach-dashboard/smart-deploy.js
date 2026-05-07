const fs = require('fs');
const crypto = require('crypto');
const { execSync } = require('child_process');

const DEPLOY_TRACKER = '.last-deploy-hash';

// Calculate hash of key files
function getFilesHash() {
  const files = [
    'index.html',
    'public/index.html',
    'api/contacts.js',
    'api/analytics.js',
    'api/templates.js',
    'api/optimize.js'
  ];
  
  const hash = crypto.createHash('md5');
  
  for (const file of files) {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file);
      hash.update(content);
    }
  }
  
  return hash.digest('hex');
}

// Check if deployment is needed
function shouldDeploy() {
  const currentHash = getFilesHash();
  
  if (!fs.existsSync(DEPLOY_TRACKER)) {
    return true;
  }
  
  const lastHash = fs.readFileSync(DEPLOY_TRACKER, 'utf8').trim();
  return currentHash !== lastHash;
}

// Save deployment hash
function saveDeployHash() {
  const hash = getFilesHash();
  fs.writeFileSync(DEPLOY_TRACKER, hash);
}

// Main deploy function
function deploy() {
  console.log('[' + new Date().toISOString() + '] Checking if deployment is needed...');
  
  if (!shouldDeploy()) {
    console.log('No changes detected. Skipping deployment.');
    return false;
  }
  
  console.log('Changes detected. Deploying...');
  
  try {
    // Git commit and push
    execSync('git add -A', { stdio: 'inherit' });
    execSync('git commit -m "auto: data sync ' + new Date().toISOString().split('T')[0] + '"', { stdio: 'inherit' });
    execSync('git push origin main', { stdio: 'inherit' });
    
    // Save hash after successful deploy
    saveDeployHash();
    
    console.log('Deployment triggered successfully!');
    return true;
  } catch (error) {
    console.error('Deployment failed:', error.message);
    return false;
  }
}

// Run if called directly
if (require.main === module) {
  deploy();
}

module.exports = { deploy, shouldDeploy, getFilesHash };