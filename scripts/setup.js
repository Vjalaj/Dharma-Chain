#!/usr/bin/env node

/**
 * Setup Script for DharmaChain
 * This script helps generate environment variables and setup the project
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

console.log('🚀 DharmaChain Setup Script\n');

// Generate NEXTAUTH_SECRET
const nextAuthSecret = crypto.randomBytes(32).toString('base64');
console.log('✅ Generated NEXTAUTH_SECRET:');
console.log(`NEXTAUTH_SECRET="${nextAuthSecret}"\n`);

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
const envExamplePath = path.join(process.cwd(), 'env.example');

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    // Copy env.example to .env.local
    let envContent = fs.readFileSync(envExamplePath, 'utf8');
    
    // Replace empty NEXTAUTH_SECRET with generated one
    envContent = envContent.replace(
      'NEXTAUTH_SECRET=""',
      `NEXTAUTH_SECRET="${nextAuthSecret}"`
    );
    
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Created .env.local from env.example');
    console.log('✅ Added generated NEXTAUTH_SECRET to .env.local\n');
  } else {
    console.log('❌ env.example file not found!');
    process.exit(1);
  }
} else {
  console.log('⚠️  .env.local already exists. Please manually add the NEXTAUTH_SECRET above.\n');
}

console.log('📋 Next Steps:');
console.log('1. Fill in your Google OAuth credentials in .env.local');
console.log('2. Add your Firebase configuration');
console.log('3. Add your admin email to ADMIN_EMAILS');
console.log('4. Configure Razorpay keys (optional for testing)');
console.log('\n📖 See README.md for detailed setup instructions');
