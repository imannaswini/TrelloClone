const assert = require("assert");

async function runTests() {
  console.log("Starting Auth Tests...");
  const uniqueId = Date.now();
  
  const memberEmail = `member_${uniqueId}@test.com`;
  const adminEmail = `admin_${uniqueId}@test.com`;
  const password = "password123";

  try {
    // 1. Member Registration
    const res1 = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Test Member", email: memberEmail, password: password, requestedRole: "member" })
    });
    assert.strictEqual(res1.status, 201, "Member registration failed");
    console.log("✅ Member registration passed");

    // 2. Member Login (Should be 403 Pending)
    const res1b = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: memberEmail, password: password })
    });
    assert.strictEqual(res1b.status, 403, "Pending member should get 403");
    console.log("✅ Member pending block passed");

    // 3. Admin Registration (Assuming ALLOW_ADMIN_REGISTRATION=true)
    const res2 = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Test Admin", email: adminEmail, password: password, requestedRole: "admin" })
    });
    assert.strictEqual(res2.status, 201, "Admin registration failed");
    console.log("✅ Admin registration passed (with env bypass)");

    // 4. Login as Admin
    const res3 = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: adminEmail, password: password })
    });
    assert.strictEqual(res3.status, 200, "Admin login failed");
    const adminLoginData = await res3.json();
    const adminToken = adminLoginData.token;
    assert.strictEqual(adminLoginData.user.role, "admin", "Admin role should be admin");
    console.log("✅ Admin login passed");

    // 5. Fetch Pending Users (to get the member ID)
    const res4 = await fetch(`http://localhost:5000/api/users/pending`, {
      method: "GET",
      headers: { 
        "Authorization": `Bearer ${adminToken}`
      }
    });
    assert.strictEqual(res4.status, 200, "Fetching pending users failed");
    const pendingUsers = await res4.json();
    const memberId = pendingUsers.find(u => u.email === memberEmail)._id;

    // 6. Member Approval Workflow
    const res5 = await fetch(`http://localhost:5000/api/users/${memberId}/approve`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${adminToken}`
      }
    });
    assert.strictEqual(res5.status, 200, "Member approval failed");
    console.log("✅ Member approval workflow passed");

    // 7. Member Login (Should now be 200)
    const res6 = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: memberEmail, password: password })
    });
    assert.strictEqual(res6.status, 200, "Approved member login failed");
    const memberLoginData = await res6.json();
    assert.strictEqual(memberLoginData.user.role, "member", "Member role should be member");
    console.log("✅ Approved member login passed");

    console.log("🎉 ALL TESTS PASSED!");
  } catch (err) {
    console.error("❌ Test failed:", err.message);
    process.exit(1);
  }
}

runTests();
