import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function Login() {
  useEffect(() => {
    const form = document.getElementById("login-form");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const formError = document.getElementById("form-error");

    function setError(fieldId, message) {
      const field = document.getElementById(fieldId);
      field.classList.add("error");
      field.querySelector(".err-msg").textContent = message;
    }
    function clearError(fieldId) {
      const field = document.getElementById(fieldId);
      field.classList.remove("error");
      field.querySelector(".err-msg").textContent = "";
    }
    function isValidEmail(value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    function handleSubmit(e) {
      e.preventDefault();
      let valid = true;
      formError.classList.remove("show");
      ["field-email", "field-password"].forEach(clearError);

      if (!emailInput.value.trim()) {
        setError("field-email", "Enter your email");
        valid = false;
      } else if (!isValidEmail(emailInput.value.trim())) {
        setError("field-email", "Enter a valid email");
        valid = false;
      }
      if (!passwordInput.value) {
        setError("field-password", "Enter your password");
        valid = false;
      }
      if (!valid) return;

      console.log("Login payload (would be sent to /api/v1/auth/login):", {
        email: emailInput.value.trim(),
        password: "••••••••",
        remember: document.getElementById("remember").checked
      });
      alert("Would log in with:\n" + emailInput.value.trim());
    }
    form.addEventListener("submit", handleSubmit);
    return () => form.removeEventListener("submit", handleSubmit);
  }, []);

  return (
    <>
      <style>{`
        :root {
          --paper: #FFFFFF; --ink: #1A1A1A; --ink-soft: #6B6B6B; --brass: #D70218;
          --brass-dark: #A5011A; --teal: #A5011A; --line: #E6E0DC; --danger: #A5011A;
        }
        * { box-sizing: border-box; }
        body { margin: 0; background: var(--paper); color: var(--ink); font-family: 'Inter', sans-serif; line-height: 1.5; }
        header { padding: 28px 40px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--line); }
        .logo img { height: 60px; width: auto; }
        nav a { color: var(--ink-soft); text-decoration: none; font-size: 14px; margin-left: 28px; }
        main { max-width: 420px; margin: 0 auto; padding: 80px 24px 100px; }
        h1 { font-family: 'Fraunces', serif; font-weight: 500; font-size: 34px; line-height: 1.15; margin: 0 0 8px; }
        .sub { color: var(--ink-soft); font-size: 15px; margin: 0 0 36px; }
        .card { background: #FFFFFF; border: 1px solid var(--line); border-radius: 4px; padding: 32px; position: relative; }
        .card::before { content: ""; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: var(--brass); border-radius: 4px 4px 0 0; }
        .field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 20px; }
        .field label { font-size: 12px; color: var(--ink-soft); }
        .field input { font-family: 'Inter', sans-serif; font-size: 16px; padding: 10px 0; border: none; border-bottom: 1px solid var(--line); background: transparent; color: var(--ink); width: 100%; }
        .field input:focus { outline: none; border-bottom: 1px solid var(--brass-dark); }
        .field.error input { border-bottom: 1px solid var(--danger); }
        .field .err-msg { font-size: 12px; color: var(--danger); min-height: 14px; }
        .row-between { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; font-size: 13px; }
        .remember { display: flex; align-items: center; gap: 6px; color: var(--ink-soft); cursor: pointer; }
        .remember input { accent-color: var(--brass-dark); }
        .forgot { color: var(--brass-dark); text-decoration: none; }
        .forgot:hover { text-decoration: underline; }
        .login-btn { width: 100%; background: var(--brass); color: #FFFFFF; border: none; border-radius: 3px; padding: 14px; font-family: 'Inter', sans-serif; font-weight: 600; font-size: 15px; cursor: pointer; transition: background 0.15s ease; }
        .login-btn:hover { background: var(--brass-dark); }
        .divider { display: flex; align-items: center; gap: 12px; margin: 28px 0; color: var(--ink-soft); font-size: 12px; }
        .divider::before, .divider::after { content: ""; flex: 1; height: 1px; background: var(--line); }
        .register-link { text-align: center; font-size: 14px; color: var(--ink-soft); }
        .register-link a { color: var(--brass-dark); text-decoration: none; font-weight: 600; }
        .register-link a:hover { text-decoration: underline; }
        .form-error { background: #FCE9E9; color: var(--danger); border-radius: 3px; padding: 10px 12px; font-size: 13px; margin-bottom: 20px; display: none; }
        .form-error.show { display: block; }
      `}</style>

      <header>
        <div className="logo">
          <img src="/assets/logo.png" alt="Tunisair logo" />
        </div>
        <nav>
          <Link to="/">Search flights</Link>
          <Link to="#">Manage booking</Link>
        </nav>
      </header>

      <main>
        <h1>Welcome back</h1>
        <p className="sub">Log in to manage your bookings and check-in online.</p>

        <div className="card">
          <div className="form-error" id="form-error">Incorrect email or password.</div>

          <form id="login-form" noValidate>
            <div className="field" id="field-email">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" placeholder="you@example.com" autoComplete="email" />
              <span className="err-msg"></span>
            </div>

            <div className="field" id="field-password">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" name="password" placeholder="••••••••" autoComplete="current-password" />
              <span className="err-msg"></span>
            </div>

            <div className="row-between">
              <label className="remember">
                <input type="checkbox" id="remember" name="remember" />
                Remember me
              </label>
              <Link to="#" className="forgot">Forgot password?</Link>
            </div>

            <button type="submit" className="login-btn">Log in</button>
          </form>

          <div className="divider">or</div>

          <p className="register-link">Don't have an account? <Link to="/signup">Create one</Link></p>
        </div>
      </main>
    </>
  );
}
