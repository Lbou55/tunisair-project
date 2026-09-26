import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  useEffect(() => {
    const form = document.getElementById("signup-form");
    const firstName = document.getElementById("first-name");
    const lastName = document.getElementById("last-name");
    const email = document.getElementById("email");
    const staffId = document.getElementById("staff-id");
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirm-password");
    const terms = document.getElementById("terms");
    const strengthFill = document.getElementById("strength-fill");
    const strengthLabel = document.getElementById("strength-label");
    const staffIdField = document.getElementById("field-staff-id");
    const roleRadios = document.querySelectorAll('input[name="role"]');

    function currentRole() {
      return [...roleRadios].find((r) => r.checked).value;
    }

    function handleRoleChange() {
      const needsStaffId = currentRole() !== "passenger";
      staffIdField.style.display = needsStaffId ? "flex" : "none";
      if (!needsStaffId) {
        clearError("field-staff-id");
        staffId.value = "";
      }
    }
    roleRadios.forEach((radio) => radio.addEventListener("change", handleRoleChange));

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
    function passwordScore(value) {
      let score = 0;
      if (value.length >= 8) score++;
      if (/[A-Z]/.test(value)) score++;
      if (/[0-9]/.test(value)) score++;
      if (/[^A-Za-z0-9]/.test(value)) score++;
      return score;
    }

    function handlePasswordInput() {
      const score = passwordScore(password.value);
      const pct = (score / 4) * 100;
      strengthFill.style.width = pct + "%";
      const colors = ["#A5011A", "#A5011A", "#C98A00", "#C98A00", "#1F7A3F"];
      strengthFill.style.background = colors[score];
      const labels = ["", "Weak", "Weak", "Good", "Strong"];
      strengthLabel.textContent = password.value ? labels[score] : "";
    }
    password.addEventListener("input", handlePasswordInput);

    function handleSubmit(e) {
      e.preventDefault();
      let valid = true;
      ["field-first", "field-last", "field-email", "field-staff-id", "field-password", "field-confirm", "field-terms"].forEach(clearError);

      const role = currentRole();

      if (!firstName.value.trim()) { setError("field-first", "Required"); valid = false; }
      if (!lastName.value.trim()) { setError("field-last", "Required"); valid = false; }

      if (!email.value.trim()) {
        setError("field-email", "Enter your email"); valid = false;
      } else if (!isValidEmail(email.value.trim())) {
        setError("field-email", "Enter a valid email"); valid = false;
      }

      if (role !== "passenger" && !staffId.value.trim()) {
        setError("field-staff-id", "Required for crew accounts"); valid = false;
      }

      if (!password.value) {
        setError("field-password", "Enter a password"); valid = false;
      } else if (password.value.length < 8) {
        setError("field-password", "At least 8 characters"); valid = false;
      }

      if (!confirmPassword.value) {
        setError("field-confirm", "Confirm your password"); valid = false;
      } else if (confirmPassword.value !== password.value) {
        setError("field-confirm", "Passwords don't match"); valid = false;
      }

      if (!terms.checked) {
        setError("field-terms", "You must accept the terms to continue"); valid = false;
      }

      if (!valid) return;

      const payload = {
        role,
        firstName: firstName.value.trim(),
        lastName: lastName.value.trim(),
        email: email.value.trim(),
        staffId: role !== "passenger" ? staffId.value.trim() : null,
        password: "••••••••"
      };
      console.log("Signup payload (would be sent to /api/v1/auth/register):", payload);

      const destinations = {
        passenger: "/",
        crew: "/pilot/dashboard"
      };
      navigate(destinations[role]);
    }
    form.addEventListener("submit", handleSubmit);

    return () => {
      roleRadios.forEach((radio) => radio.removeEventListener("change", handleRoleChange));
      password.removeEventListener("input", handlePasswordInput);
      form.removeEventListener("submit", handleSubmit);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <style>{`
        :root {
          --paper: #FFFFFF; --ink: #1A1A1A; --ink-soft: #6B6B6B; --brass: #D70218;
          --brass-dark: #A5011A; --teal: #A5011A; --line: #E6E0DC; --danger: #A5011A; --success: #1F7A3F;
        }
        * { box-sizing: border-box; }
        body { margin: 0; background: var(--paper); color: var(--ink); font-family: 'Inter', sans-serif; line-height: 1.5; }
        header { padding: 28px 40px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--line); }
        .logo img { height: 60px; width: auto; }
        nav a { color: var(--ink-soft); text-decoration: none; font-size: 14px; margin-left: 28px; }
        main { max-width: 440px; margin: 0 auto; padding: 72px 24px 100px; }
        h1 { font-family: 'Fraunces', serif; font-weight: 500; font-size: 34px; line-height: 1.15; margin: 0 0 8px; }
        .sub { color: var(--ink-soft); font-size: 15px; margin: 0 0 32px; }
        .card { background: #FFFFFF; border: 1px solid var(--line); border-radius: 4px; padding: 32px; position: relative; }
        .card::before { content: ""; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: var(--brass); border-radius: 4px 4px 0 0; }
        .role-toggle { display: flex; gap: 10px; margin-top: 6px; }
        .role-option { flex: 1; text-align: center; border: 1px solid var(--line); border-radius: 3px; padding: 10px 8px; font-size: 13px; color: var(--ink-soft); cursor: pointer; position: relative; }
        .role-option input { position: absolute; opacity: 0; pointer-events: none; }
        .role-option:has(input:checked) { border-color: var(--brass-dark); color: var(--brass-dark); background: #FCEBEC; font-weight: 600; }
        .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 18px; }
        .field label { font-size: 12px; color: var(--ink-soft); }
        .field input { font-family: 'Inter', sans-serif; font-size: 16px; padding: 10px 0; border: none; border-bottom: 1px solid var(--line); background: transparent; color: var(--ink); width: 100%; }
        .field input:focus { outline: none; border-bottom: 1px solid var(--brass-dark); }
        .field.error input { border-bottom: 1px solid var(--danger); }
        .field .err-msg { font-size: 12px; color: var(--danger); min-height: 14px; }
        .field .hint { font-size: 12px; color: var(--ink-soft); min-height: 14px; }
        .strength { height: 3px; border-radius: 2px; background: var(--line); margin-top: 6px; overflow: hidden; }
        .strength-fill { height: 100%; width: 0%; background: var(--danger); transition: width 0.2s ease, background 0.2s ease; }
        .terms { display: flex; align-items: flex-start; gap: 8px; font-size: 13px; color: var(--ink-soft); margin-bottom: 24px; }
        .terms input { margin-top: 3px; accent-color: var(--brass-dark); }
        .terms a { color: var(--brass-dark); text-decoration: none; }
        .terms a:hover { text-decoration: underline; }
        .signup-btn { width: 100%; background: var(--brass); color: #FFFFFF; border: none; border-radius: 3px; padding: 14px; font-family: 'Inter', sans-serif; font-weight: 600; font-size: 15px; cursor: pointer; transition: background 0.15s ease; }
        .signup-btn:hover { background: var(--brass-dark); }
        .login-link { text-align: center; font-size: 14px; color: var(--ink-soft); margin-top: 24px; }
        .login-link a { color: var(--brass-dark); text-decoration: none; font-weight: 600; }
        .login-link a:hover { text-decoration: underline; }
        @media (max-width: 480px) { .field-row { grid-template-columns: 1fr; } }
      `}</style>

      <header>
        <div className="logo">
          <img src="/assets/logo.png" alt="Tunisair logo" />
        </div>
        <nav>
          <Link to="/">Search flights</Link>
          <Link to="/login">Log in</Link>
        </nav>
      </header>

      <main>
        <h1>Create your account</h1>
        <p className="sub">Book faster and manage your trips in one place.</p>

        <div className="card">
          <form id="signup-form" noValidate>
            <div className="field" style={{ marginBottom: "24px" }}>
              <label style={{ marginBottom: "4px" }}>I am signing up as</label>
              <div className="role-toggle">
                <label className="role-option">
                  <input type="radio" name="role" value="passenger" defaultChecked />
                  <span>Passenger</span>
                </label>
                <label className="role-option">
                  <input type="radio" name="role" value="crew" />
                  <span>Pilot / Crew</span>
                </label>
              </div>
            </div>

            <div className="field-row">
              <div className="field" id="field-first">
                <label htmlFor="first-name">First name</label>
                <input type="text" id="first-name" name="firstName" autoComplete="given-name" />
                <span className="err-msg"></span>
              </div>
              <div className="field" id="field-last">
                <label htmlFor="last-name">Last name</label>
                <input type="text" id="last-name" name="lastName" autoComplete="family-name" />
                <span className="err-msg"></span>
              </div>
            </div>

            <div className="field" id="field-email">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" placeholder="you@example.com" autoComplete="email" />
              <span className="err-msg"></span>
            </div>

            <div className="field" id="field-staff-id" style={{ display: "none" }}>
              <label htmlFor="staff-id">Staff ID</label>
              <input type="text" id="staff-id" name="staffId" placeholder="e.g. TU-PLT-0412" autoComplete="off" />
              <span className="hint">Provided by Tunisair HR — required for crew accounts.</span>
              <span className="err-msg"></span>
            </div>

            <div className="field" id="field-password">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" name="password" placeholder="At least 8 characters" autoComplete="new-password" />
              <div className="strength"><div className="strength-fill" id="strength-fill"></div></div>
              <span className="hint" id="strength-label"></span>
              <span className="err-msg"></span>
            </div>

            <div className="field" id="field-confirm">
              <label htmlFor="confirm-password">Confirm password</label>
              <input type="password" id="confirm-password" name="confirmPassword" autoComplete="new-password" />
              <span className="err-msg"></span>
            </div>

            <label className="terms">
              <input type="checkbox" id="terms" name="terms" />
              <span>I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></span>
            </label>
            <div className="field" id="field-terms" style={{ marginTop: "-16px" }}>
              <span className="err-msg"></span>
            </div>

            <button type="submit" className="signup-btn">Create account</button>
          </form>

          <p className="login-link">Already have an account? <Link to="/login">Log in</Link></p>
        </div>
      </main>
    </>
  );
}
