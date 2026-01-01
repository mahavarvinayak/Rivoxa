const { createPublicKey } = require('crypto');
const fs = require('fs');

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

    const jwks = JSON.stringify({
        keys: [
            {
                ...jwk,
                use: 'sig',
                alg: 'RS256',
                kid: 'convex-auth-key-1'
            }
        ]
    }, null, 2); // Pretty print for easier reading if needed, but minified is fine too.

    fs.writeFileSync('jwks_to_copy.txt', jwks);
    console.log("✅ Created 'jwks_to_copy.txt' - Open this and copy everything inside.");

    fs.writeFileSync('private_key_to_copy.txt', privateKey);
    console.log("✅ Created 'private_key_to_copy.txt' - Open this and copy everything inside.");

} catch (err) {
    console.error("❌ Failed:", err.message);
}
