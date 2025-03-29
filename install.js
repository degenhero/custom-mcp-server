#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Main installation function
async function install() {
  console.log('\n=============================================');
  console.log('Custom MCP Server - Installation Script');
  console.log('=============================================\n');
  
  try {
    // Check for required environment variables
    await checkEnvironmentVariables();
    
    // Install dependencies
    console.log('\nInstalling dependencies...');
    execSync('npm install', { stdio: 'inherit' });
    
    // Create data directory
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      console.log('\nCreating data directory...');
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    console.log('\n=============================================');
    console.log('Installation completed successfully!');
    console.log('\nTo start the server, run:');
    console.log('  npm start');
    console.log('\nThe server will be available at:');
    console.log('  http://localhost:3000');
    console.log('=============================================\n');
    
  } catch (error) {
    console.error('\nError during installation:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Check and prompt for required environment variables
async function checkEnvironmentVariables() {
  console.log('Checking environment variables...');
  
  const envPath = path.join(process.cwd(), '.env');
  let envVars = {};
  
  // Read existing .env file if it exists
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        envVars[match[1]] = match[2];
      }
    });
  }
  
  // Required environment variables
  const requiredVars = {
    'BRAVE_API_KEY': 'Enter your Brave API key (press Enter to skip):',
    'GITHUB_TOKEN': 'Enter your GitHub access token (press Enter to skip):'
  };
  
  // Ask for missing variables
  for (const [key, prompt] of Object.entries(requiredVars)) {
    if (!envVars[key]) {
      const value = await askQuestion(prompt);
      if (value) {
        envVars[key] = value;
      }
    }
  }
  
  // Write to .env file
  const envContent = Object.entries(envVars)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
  
  fs.writeFileSync(envPath, envContent);
  console.log('.env file updated');
}

// Helper function to ask questions
function askQuestion(question) {
  return new Promise(resolve => {
    rl.question(question + ' ', answer => {
      resolve(answer.trim());
    });
  });
}

// Run the installation
install();
