const { execSync } = require('child_process');

async function run() {
  const email = "test@multica.ai";
  const res1 = await fetch("http://localhost:8080/auth/send-code", {
    method: "POST", headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ email })
  });

  const codeStr = execSync(`docker compose -f docker-compose.selfhost.yml exec -T postgres psql -U multica -d multica -c "SELECT code FROM verification_code WHERE email='test@multica.ai' ORDER BY created_at DESC LIMIT 1" -t`).toString().trim();

  const res2 = await fetch("http://localhost:8080/auth/verify-code", {
    method: "POST", headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ email, code: codeStr })
  });
  const data2 = await res2.json();
  const token = data2.token;

  console.log("Fetching workspaces via Proxy WITH BOTH Cookie AND Authorization header...");
  const res3 = await fetch("http://localhost:3000/api/workspaces", {
    headers: { 
      "Cookie": `multica_token=${token}`,
      "Authorization": `Bearer ${token}` 
    }
  });
  console.log("Proxy status:", res3.status);
  console.log("Proxy response:", (await res3.text()).substring(0, 100));
}
run().catch(console.error);
