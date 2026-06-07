fetch("http://localhost:5000/api/auth/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "Test User",
    email: "test@example.com",
    password: "password"
  })
}).then(async r => {
  console.log("Status:", r.status);
  console.log("Body:", await r.text());
}).catch(e => console.error("Error:", e));
