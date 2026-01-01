const { createPublicKey } = require('crypto');
const { execSync } = require('child_process');

const privateKey = `-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCgrOvxc3vKqZN3
G3SXg7FWuGdLNw3hZHI7a6CVWuTMETfMzobBirciVdVQWMT8NwtB/LGx6BD3DWYc
TMf7tBv/oiBWdKP/Rj8LUpwHCak1eCdrFGvT85ubpzhWF27cpdn7NGsJ9fHeiZX+
7IfgYXWK0qrgTczoCtNcz/hUGruHpQ94RJ9oopvZzAprDSnt+ohAt7PRFfYq7LAX
u1Dl0RxNAqenQAbgllc6eS3gu31avvnF/h3aiBPhT3D3GqquBInsTrQoMCJdE15c
rLgqQWPMuGkehlIM74WERWDSVF17uU10U5Nlj9v6zq75kNmEQRtqSoVt2iTc1B0f
HGu/JyJLAgMBAAECggEAE3AoEStX8BIo0XGEXuojM6sWb/6Gktx8h1zDbh4zbM6u
cfwQSGzYL/KzXkeG+T5Ngduowa2iE8lOr6DIVtaYxoneIKd2yaS9bsi9MIrGKj5R
gn5Tdy5TBncp9RxboJz97IqQYoGbE8GQYGlMHOSdfEB1RLKU1gOtQ16zm7UqN8Qa
pmzc5ykluoslS2NJs0yH/0veYykcw+h9KA4lIreax7CV5KfvBJSSJ2XlQmaFcDY8
QbBdC6j8tIRmynknViKC0i2OpDhJg73t6GQiG8KvSOiFw8g8uVXt1YM8sNxndRaG
qQ99IUc0WGzBqC65IPoVvTMqqy6u5AWJCbydYcd9FQKBgQDUGOXeKDXRtuGWE3dD
WJ+CCUdQm7lKq09WLwADFMn22DpaxYbBLTqiBpHe4Rs/NPawfPT+D9l8Coq3PU/N
nYtC6/LLA41mDX4K61Zsm3VYCZibSVYyFBWm37vKqYIP6ZwBOEebpeRXH3CPsbL5
a7NRNKyTyB/yIh+7KN4h78h5HQKBgQDB7yq6NkTBXScAMvOVS0tSjWVCGHa2il/r
i5oGQNoF6riGULinNjBN7cFIoM0tcmXGW4h6mkOkPNRHVNPtNykOzAoQo6UmUDb5
UKCfm8BfRgtkXlFI+elg/lyqpLWvX4TOlKyQpIVJCcNYIHI7OVYFQYz24gwUYzia
O2qqRo0UhwKBgA7BGKSGqY/IKBM3kXFW5em22YYq/w3JswAsztRoCtCoJA8SdJhV
nCGPUXBuumWAOrT2TFisI5X0acfrdPS5w+lI3p/uxFRYFe+OhXmSquwP5tTOmjdr
nEH6iGbFue1/c8HF931FYggJgNwOIYQmUNgSUPsKzeYbJ5fudN1pf8mlAoGAGOa7
xsM3Gtj6LAVez3mmh0gOi2kWvSORY24+bbUgCYh0/xIYU6galbcEjW3QSpiYxtpz
8MIkE0+YNjyHJbticzrxw+cvSnccR/D5XuUh01nsFowhxcwJEmI2xdZ2WblbFSdz
7PKjBpjRU1x/LmmTSQN8tSqbQHbpCqy8ana6oLsCgYBjVx92v0ocZc9fipwD2KgU
Y1pHMrFZ9xFMbCL/cgn3DdzeFFnbPN6sfmoWlbeqg8hIwxSc0QLsJzms+Szcgo4h
2UzvqjRUiV31K0YelrHWF2dP5CAs7aXKlrm7+38Xv2NKpms3gaTZVDoxetEDfEnF
EQ7JD8pz+GwJXVP3YWHgrw==
-----END PRIVATE KEY-----`;

try {
    console.log("Generating JWKS...");
    const publicKey = createPublicKey(privateKey);
    const jwk = publicKey.export({ format: 'jwk' });

    // Construct the JWKS object
    // @convex-dev/auth expects standard JWKS format
    const jwks = JSON.stringify({
        keys: [
            {
                ...jwk,
                use: 'sig',
                alg: 'RS256',
                kid: 'convex-auth-key-1' // arbitrary ID
            }
        ]
    });

    console.log("Setting JWT_PRIVATE_KEY...");
    // Use replace to handle newlines correctly in argument if needed, but simple string usually works in shell
    // We use standard input or careful quoting? 
    // execSync handles arguments array if using spawn, but here we construct command string. 
    // It's safer to print and let shell handle, or use a library.
    // We'll trust execSync with quoted string.

    // Set Private Key
    // We need to escape newlines for the shell command
    const escapedPrivateKey = privateKey.replace(/\n/g, '\\n');
    execSync(`npx convex env set JWT_PRIVATE_KEY "${escapedPrivateKey}"`, { stdio: 'inherit' });

    console.log("Setting JWKS...");
    const escapedJwks = jwks.replace(/"/g, '\\"');
    execSync(`npx convex env set JWKS "${escapedJwks}"`, { stdio: 'inherit' });

    // Set Resend Key (Assuming user wants it synced)
    // I'll skip this for now to avoid overwriting if they have a dev-specific one, 
    // but usually they want the one that works.
    // Check if RESEND_API_KEY is in process.env? No, we need to know the value.
    // I will just fix the Auth keys for now.

    console.log("✅ DONE! Keys have been set.");

} catch (err) {
    console.error("❌ Failed:", err.message);
}
