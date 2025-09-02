#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Icon sizes needed for Safari compatibility
const iconSizes = [
  { size: 57, name: 'apple-touch-icon-57x57.png' },
  { size: 60, name: 'apple-touch-icon-60x60.png' },
  { size: 72, name: 'apple-touch-icon-72x72.png' },
  { size: 76, name: 'apple-touch-icon-76x76.png' },
  { size: 114, name: 'apple-touch-icon-114x114.png' },
  { size: 120, name: 'apple-touch-icon-120x120.png' },
  { size: 144, name: 'apple-touch-icon-144x144.png' },
  { size: 152, name: 'apple-touch-icon-152x152.png' },
  { size: 180, name: 'apple-touch-icon-180x180.png' },
  { size: 192, name: 'apple-touch-icon-192x192.png' },
  { size: 512, name: 'apple-touch-icon-512x512.png' }
];

const iconsDir = path.join(__dirname, '..', 'public', 'icons');
const svgPath = path.join(iconsDir, 'app-icon.svg');

// Check if sharp is available
let sharp;
try {
  sharp = require('sharp');
  console.log('✅ Sharp found, generating PNG icons...');
} catch (err) {
  console.log('❌ Sharp not found. Install with: npm install sharp');
  console.log('\n📋 Manual Icon Creation Instructions:');
  console.log('-----------------------------------');
  console.log('Since Sharp is not installed, please create these PNG icons manually:');
  console.log('\n1. Open your SVG icon in a vector graphics editor (Inkscape, Adobe Illustrator, etc.)');
  console.log('2. Export the following PNG sizes to public/icons/:');
  iconSizes.forEach(({ size, name }) => {
    console.log(`   - ${name} (${size}x${size}px)`);
  });
  console.log('\n3. Or use an online converter like:');
  console.log('   - https://convertio.co/svg-png/');
  console.log('   - https://cloudconvert.com/svg-to-png');
  console.log('\n4. Or install Sharp and run this script again:');
  console.log('   npm install sharp');
  console.log('   node scripts/generate-icons.js');
  process.exit(0);
}

async function generateIcons() {
  try {
    // Check if SVG file exists
    if (!fs.existsSync(svgPath)) {
      console.error('❌ SVG file not found:', svgPath);
      process.exit(1);
    }

    // Ensure icons directory exists
    if (!fs.existsSync(iconsDir)) {
      fs.mkdirSync(iconsDir, { recursive: true });
    }

    console.log('📱 Generating Safari-compatible PNG icons...');

    // Generate each icon size
    for (const { size, name } of iconSizes) {
      const outputPath = path.join(iconsDir, name);
      
      await sharp(svgPath)
        .resize(size, size)
        .png()
        .toFile(outputPath);
      
      console.log(`✅ Created: ${name} (${size}x${size}px)`);
    }

    console.log('\n🎉 All icons generated successfully!');
    console.log('📋 Next steps:');
    console.log('1. Deploy your app');
    console.log('2. Test in Safari on iOS');
    console.log('3. Try adding to home screen');

  } catch (error) {
    console.error('❌ Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons();
