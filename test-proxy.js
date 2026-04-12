const email = "test@multica.ai";
async function run() {
  console.log("1. Requesting auth code...");
  const res1 = await fetch("http://localhost:8080/auth/send-code", {
    method: "POST", headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ email })
  });
  console.log("Send code status:", res1.status);

  // We need to read the code from the db
  const { execSync } = require('child_process');
  const codeStr = execSync(`psql -U multica -d multica -c "SELECT code FROM verification_code WHERE email='test@multica.ai' ORDER BY created_at DESC LIMIT 1" -t`).toString().trim();
  console.log("Got code:", codeStr);

  const res2 = await fetch("http://localhost:8080/auth/verify-code", {
    method: "POST", headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ email, code: codeStr })
  });
  const data2 = await res2.json();
  const token = data2.token;
  console.log("Got token:", token.substring(0, 15) + "...");

  console.log("2. Fetching workspaces via Svelte Proxy (3001)...");
  const res3 = await fetch("http://localhost:3001/api/workspaces", {
    headers: { "Cookie": `multica_token=${token}` }
  });
  console.log("Proxy status:", res3.status);
  const text3 = await res3.text();
  console.log("Proxy response:", text3.substring(0, 200));
}
run().catch(console.error);
