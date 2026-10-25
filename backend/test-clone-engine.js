const dns = require('node:dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const { validateUrlSecurity } = require('./services/urlSecurityService');
const { calculateVisualFidelityReport } = require('./services/visualComparisonService');

console.log('🧪 Testing Advanced URL Clone Engine Services...');

// 1. SSRF Protection Tests
const testCases = [
  { url: 'http://127.0.0.1:8080', expectedValid: false, reason: 'Loopback IPv4' },
  { url: 'http://localhost/admin', expectedValid: false, reason: 'Localhost' },
  { url: 'http://169.254.169.254/latest/meta-data', expectedValid: false, reason: 'Cloud Link-Local Metadata' },
  { url: 'http://192.168.1.100', expectedValid: false, reason: 'Private 192.168.x subnet' },
  { url: 'http://10.0.0.1', expectedValid: false, reason: 'Private 10.x subnet' },
  { url: 'ftp://example.com/file', expectedValid: false, reason: 'Unsafe FTP protocol' },
  { url: 'https://pulseflow.io', expectedValid: true, reason: 'Public HTTPS Web Host' },
  { url: 'https://stripe.com', expectedValid: true, reason: 'Public HTTPS Web Host' },
];

let ssrfPassCount = 0;
for (const tc of testCases) {
  const res = validateUrlSecurity(tc.url);
  if (res.valid === tc.expectedValid) {
    console.log(`  ✓ SSRF Shield: ${tc.reason} (${tc.url}) -> ${res.valid ? 'ALLOWED' : 'BLOCKED'}`);
    ssrfPassCount++;
  } else {
    console.error(`  ✗ SSRF Fail: ${tc.url} expected valid=${tc.expectedValid}, got=${res.valid}`);
  }
}

// 2. Automated Visual Comparison Metric Test
const fidelity = calculateVisualFidelityReport(
  { colorsDetected: ['#3B82F6', '#1D4ED8', '#10B981'], headingsCount: 4 },
  {
    theme: { primaryColor: '#3B82F6', secondaryColor: '#1D4ED8', accentColor: '#10B981', backgroundColor: '#090D18' },
    pages: [{
      sections: [
        { type: 'navbar', elements: [] },
        { type: 'hero', elements: [{ type: 'heading' }, { type: 'button' }] },
        { type: 'features', elements: [{ type: 'card' }] },
        { type: 'pricing', elements: [{ type: 'card' }] },
        { type: 'faq', elements: [{ type: 'accordion' }] },
        { type: 'footer', elements: [] },
      ],
    }],
  }
);

console.log('\n📊 Visual Comparison & Structural Metric Results:');
console.log(`  Overall Similarity Score: ${fidelity.overallScore}%`);
console.log(`  Layout Structure: ${fidelity.layoutScore}%`);
console.log(`  Typography Hierarchy: ${fidelity.typographyScore}%`);
console.log(`  Color Palette Match: ${fidelity.colorScore}%`);
console.log(`  Interactivity Score: ${fidelity.interactiveScore}%`);
console.log(`  Discrepancies identified: ${fidelity.discrepancies.length}`);
console.log(`  Limitations documented: ${fidelity.limitations.length}`);

if (ssrfPassCount === testCases.length && fidelity.overallScore >= 90) {
  console.log('\n✅ ALL AUTOMATED VERIFICATION TESTS PASSED SUCCESSFULLY!');
  process.exit(0);
} else {
  console.error('\n❌ SOME VERIFICATION TESTS FAILED.');
  process.exit(1);
}
