// Responsive login/sign-in/profile toggle and authentication
const menuToggle = document.getElementById("menuToggle");
const loginContainer = document.getElementById("loginContainer");

function adjustLoginLayout() {
  if (window.innerWidth <= 600) {
    loginContainer.style.display = "none";
    menuToggle.style.display = "block";
  } else {
    loginContainer.style.display = "flex";
    menuToggle.style.display = "none";
  }
}

menuToggle.addEventListener("click", () => {
  if (loginContainer.style.display === "flex") {
    loginContainer.style.display = "none";
  } else {
    loginContainer.style.display = "flex";
    loginContainer.style.flexDirection = "column";
    loginContainer.style.alignItems = "flex-end";
  }
});

adjustLoginLayout();
window.addEventListener("resize", adjustLoginLayout);

// User Authentication Logic
const loginBtn = document.querySelector(".login-btn");
const signinBtn = document.querySelector(".signin-btn");

function showAuthForm(mode) {
  const form = document.createElement("div");
  form.className = "auth-form";
  form.innerHTML = `
    <h3>${mode === "signup" ? "Sign Up" : "Login"}</h3>
    <input type="email" id="authEmail" placeholder="Email" required />
    ${mode === "signup" ? `
      <input type="password" id="authPassword" placeholder="Create Password" required />
      <input type="password" id="confirmPassword" placeholder="Confirm Password" required />
    ` : `
      <input type="password" id="authPassword" placeholder="Password" required />
    `}
    <button id="submitAuth">${mode === "signup" ? "Create Account" : "Login"}</button>
    <button id="cancelAuth">Cancel</button>
  `;

  form.style.position = "fixed";
  form.style.top = "50%";
  form.style.left = "50%";
  form.style.transform = "translate(-50%, -50%)";
  form.style.background = "#fff";
  form.style.color = "#333";
  form.style.padding = "20px";
  form.style.borderRadius = "12px";
  form.style.zIndex = "2000";
  form.style.boxShadow = "0 10px 30px rgba(0,0,0,0.2)";

  document.body.appendChild(form);

  document.getElementById("cancelAuth").addEventListener("click", () => {
    form.remove();
  });

  const submitBtn = document.getElementById("submitAuth");

  submitBtn.addEventListener("click", () => {
    const email = document.getElementById("authEmail").value.trim();
    const password = document.getElementById("authPassword").value.trim();
    const confirmPassword = mode === "signup" ? document.getElementById("confirmPassword").value.trim() : null;

    if (!email || !password || (mode === "signup" && !confirmPassword)) {
      alert("Please fill all required fields.");
      return;
    }

    if (mode === "signup") {
      if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
      }

      if (localStorage.getItem(email)) {
        alert("User already exists. Please log in.");
        return;
      }

      localStorage.setItem(email, JSON.stringify({ password, verified: false }));
      alert("Account created! Verification link has been sent to your email.");

      const chatBox = document.querySelector("#chatMessages");
      const fakeEmail = document.createElement("div");
      fakeEmail.className = "bot-message";
      fakeEmail.style.margin = "10px 0";
      fakeEmail.style.padding = "10px";
      fakeEmail.style.background = "#eef6f8";
      fakeEmail.style.borderLeft = "4px solid #00bfa6";
      fakeEmail.style.borderRadius = "6px";
      fakeEmail.innerText = `📩 Health AI Bot: Hi ${email}, please verify your email by replying with "verified" here.`;
      if (chatBox) {
        chatBox.appendChild(fakeEmail);
      }

      // Store for simulated verification
      window.pendingVerificationEmail = email;
    } else {
      const storedUser = localStorage.getItem(email);

      if (!storedUser) {
        alert("Email address not found.");
        return;
      }

      const { password: storedPassword, verified } = JSON.parse(storedUser);

      if (password !== storedPassword) {
        alert("Incorrect password.");
      } else if (!verified) {
        alert("Please verify your email first.");
      } else {
        alert("Login successful! Welcome back.");
      }
    }

    form.remove();
  });
}

loginBtn.addEventListener("click", () => showAuthForm("login"));
signinBtn.addEventListener("click", () => showAuthForm("signup"));

// Simulated email verification (acts as if user verified via email after sending a message)
function simulateEmailVerificationOnMessage(message) {
  if (window.pendingVerificationEmail && message.toLowerCase().includes("verified")) {
    const storedUser = JSON.parse(localStorage.getItem(window.pendingVerificationEmail));
    storedUser.verified = true;
    localStorage.setItem(window.pendingVerificationEmail, JSON.stringify(storedUser));
    alert(`Email for ${window.pendingVerificationEmail} has been verified! You can now log in.`);
    delete window.pendingVerificationEmail;
  }
}

// Example message send trigger
const sendBtn = document.querySelector("#sendBtn");
const messageInput = document.querySelector("#userInput");

if (sendBtn && messageInput) {
  sendBtn.addEventListener("click", () => {
    const message = messageInput.value;
    if (message) {
      simulateEmailVerificationOnMessage(message);
    }
  });
}
