const fs = require('fs');
const path = require('path');
const axios = require('axios');

function readEnv() {
  const envPath = path.resolve(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) return {};
  const raw = fs.readFileSync(envPath, 'utf8');
  const lines = raw.split(/\r?\n/).filter(Boolean);
  const obj = {};
  for (const line of lines) {
    const m = line.match(/^([^=]+)=(.*)$/);
    if (m) obj[m[1]] = m[2];
  }
  return obj;
}

function parseArgs() {
  const args = process.argv.slice(2);
  const out = {};
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--base' && args[i + 1]) {
      out.base = args[i + 1];
      i++;
    }
    if (a === '--timeout' && args[i + 1]) {
      out.timeout = Number(args[i + 1]);
      i++;
    }
  }
  return out;
}

async function run() {
  const env = readEnv();
  const args = parseArgs();
  const base = args.base || env.API_BASE_URL || env.EXPO_PUBLIC_API_BASE_URL || 'http://127.0.0.1:5000';
  const timeout = args.timeout || 20000;
  console.log('Using API base URL:', base);

  const email = `test+${Date.now()}@example.com`;
  const password = 'Str0ngP@ssw0rd!';
  const userName = 'mobileuser';

  try {
    console.log('\n1) Registering user...');
    const reg = await axios.post(`${base}/api/auth/register-jwt`, { email, password, userName }, { timeout });
    console.log('Register response:', reg.data);
    const accessToken = reg.data?.data?.accessToken || reg.data?.accessToken || null;
    const refreshToken = reg.data?.data?.refreshToken || reg.data?.refreshToken || null;

    console.log('\n2) Logging in user...');
    const login = await axios.post(`${base}/api/auth/login-jwt`, { email, password }, { timeout });
    console.log('Login response:', login.data);

    const loginRefresh = login.data?.data?.refreshToken || refreshToken;
    console.log('\n3) Refreshing token (should rotate)...');
    const refresh = await axios.post(`${base}/api/auth/refresh`, { refreshToken: loginRefresh }, { timeout });
    console.log('Refresh response:', refresh.data);
    const newRefresh = refresh.data?.data?.refreshToken || null;

    console.log('\n4) Logging out (revoke refresh)...');
    const logout = await axios.post(`${base}/api/auth/logout-jwt`, { refreshToken: newRefresh || loginRefresh }, { timeout });
    console.log('Logout response:', logout.data);

    console.log('\n5) Confirm refresh fails after logout (expected)');
    try {
      await axios.post(`${base}/api/auth/refresh`, { refreshToken: newRefresh || loginRefresh }, { timeout });
      console.error('Unexpected: refresh succeeded after logout');
    } catch (err) {
      console.log('Expected refresh failure after logout:', err.response ? err.response.data : err.message);
    }

    console.log('\nTest completed successfully');
  } catch (e) {
    if (e.response) {
      console.error('Request failed:', e.response.status, e.response.data);
    } else {
      console.error('Error:', e.message);
    }
    process.exitCode = 1;
  }
}

run();
