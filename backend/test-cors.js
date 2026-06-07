async function run() {
  try {
    const r1 = await fetch("http://localhost:5000/api/auth/login", {
      method: "OPTIONS",
      headers: {
        "Origin": "http://localhost:5174",
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "content-type"
      }
    });
    console.log("OPTIONS status:", r1.status);

    const r2 = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Origin": "http://localhost:5174"
      },
      body: JSON.stringify({ email: "invalid@test.com", password: "pass" })
    });
    console.log("POST status:", r2.status);
  } catch (err) {
    console.error(err);
  }
}
run();
