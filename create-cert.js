import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const certDir = path.resolve('.cert');

// Create .cert directory if it doesn't exist
if (!fs.existsSync(certDir)) {
    fs.mkdirSync(certDir);
}

// Generate self-signed certificate
console.log('Generating self-signed certificate...');
execSync(`openssl req -x509 -newkey rsa:2048 -keyout ${path.join(certDir, 'key.pem')} -out ${path.join(certDir, 'cert.pem')} -days 365 -nodes -subj "/CN=localhost"`);
console.log('Certificate generated successfully!'); 