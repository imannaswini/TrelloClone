const assert = require("assert");

async function check() {
  const uniqueId = Date.now();
  const res = await fetch("http://localhost:5000/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      name: "Test Admin Bug", 
      email: `admin_${uniqueId}@test.com`, 
      password: "password123", 
      requestedRole: "admin" 
    })
  });
  
  const data = await res.json();
  console.log("Status:", res.status);
  console.log("Data:", data);
}

check();
