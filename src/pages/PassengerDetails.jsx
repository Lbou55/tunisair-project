import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function PassengerDetails() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const passengerCount = parseInt(params.get("passengers")) || 1;
    const seatsParam = params.get("seats");
    const seats = seatsParam ? seatsParam.split(",") : [];

    document.getElementById("details-sub").textContent =
      `Fill in the information for ${passengerCount} traveler${passengerCount > 1 ? "s" : ""}.`;

    const passengerList = document.getElementById("passenger-list");

    function buildPassengerCard(index) {
      const seatTag = seats[index] ? seats[index] : "—";
      const wrapper = document.createElement("div");
      wrapper.className = "passenger-card";
      wrapper.dataset.passengerIndex = index;
      wrapper.innerHTML = `
        <div class="passenger-header">
          <h2>Passenger ${index + 1}</h2>
          <span class="seat-tag">Seat ${seatTag}</span>
        </div>
        <div class="field-row">
          <div class="field" data-field="firstName">
            <label>First name</label>
            <input type="text" name="firstName">
            <span class="err-msg"></span>
          </div>
          <div class="field" data-field="lastName">
            <label>Last name</label>
            <input type="text" name="lastName">
            <span class="err-msg"></span>
          </div>
        </div>
        <div class="field-row three">
          <div class="field" data-field="dob">
            <label>Date of birth</label>
            <input type="date" name="dob">
            <span class="err-msg"></span>
          </div>
          <div class="field" data-field="nationality">
            <label>Nationality</label>
            <input type="text" name="nationality" placeholder="e.g. Tunisian">
            <span class="err-msg"></span>
          </div>
          <div class="field" data-field="passport">
            <label>Passport / ID number</label>
            <input type="text" name="passport">
            <span class="err-msg"></span>
          </div>
        </div>
      `;
      return wrapper;
    }

    for (let i = 0; i < passengerCount; i++) {
      passengerList.appendChild(buildPassengerCard(i));
    }

    function setError(fieldEl, message) {
      fieldEl.classList.add("error");
      fieldEl.querySelector(".err-msg").textContent = message;
    }
    function clearError(fieldEl) {
      fieldEl.classList.remove("error");
      fieldEl.querySelector(".err-msg").textContent = "";
    }
    function isValidEmail(value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    function handleSubmit(e) {
      e.preventDefault();
      let valid = true;

      document.querySelectorAll(".passenger-card").forEach((card) => {
        ["firstName", "lastName", "dob", "nationality", "passport"].forEach((name) => {
          const field = card.querySelector(`[data-field="${name}"]`);
          const input = field.querySelector("input");
          clearError(field);
          if (!input.value.trim()) {
            setError(field, "Required");
            valid = false;
          }
        });
      });

      const emailField = document.getElementById("field-contact-email");
      const phoneField = document.getElementById("field-contact-phone");
      const emailInput = document.getElementById("contact-email");
      const phoneInput = document.getElementById("contact-phone");
      clearError(emailField);
      clearError(phoneField);

      if (!emailInput.value.trim()) {
        setError(emailField, "Required"); valid = false;
      } else if (!isValidEmail(emailInput.value.trim())) {
        setError(emailField, "Enter a valid email"); valid = false;
      }
      if (!phoneInput.value.trim()) {
        setError(phoneField, "Required"); valid = false;
      }

      if (!valid) return;

      const passengers = [...document.querySelectorAll(".passenger-card")].map((card) => ({
        firstName: card.querySelector('[name="firstName"]').value.trim(),
        lastName: card.querySelector('[name="lastName"]').value.trim(),
        dob: card.querySelector('[name="dob"]').value,
        nationality: card.querySelector('[name="nationality"]').value.trim(),
        passport: card.querySelector('[name="passport"]').value.trim()
      }));

      const payload = {
        passengers,
        contactEmail: emailInput.value.trim(),
        contactPhone: phoneInput.value.trim()
      };
      console.log("Passenger details (would be sent with the booking):", payload);

      const names = passengers.map((p) => `${p.firstName} ${p.lastName}`).join(",");
      const nextParams = new URLSearchParams(window.location.search);
      nextParams.set("names", names);
      nextParams.set("contactEmail", payload.contactEmail);

      navigate("/payment?" + nextParams.toString());
    }

    const form = document.getElementById("passenger-form");
    form.addEventListener("submit", handleSubmit);
    return () => form.removeEventListener("submit", handleSubmit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <style>{`
        :root {
          --paper: #FFFFFF; --ink: #1A1A1A; --ink-soft: #6B6B6B; --brass: #D70218;
          --brass-dark: #A5011A; --line: #E6E0DC; --danger: #A5011A;
        }
        * { box-sizing: border-box; }
        body { margin: 0; background: var(--paper); color: var(--ink); font-family: 'Inter', sans-serif; line-height: 1.5; }
        header { padding: 28px 40px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--line); }
        .logo img { height: 60px; width: auto; }
        nav a { color: var(--ink-soft); text-decoration: none; font-size: 14px; margin-left: 28px; }
        main { max-width: 760px; margin: 0 auto; padding: 40px 24px 120px; }
        h1 { font-family: 'Fraunces', serif; font-weight: 500; font-size: 30px; margin: 0 0 4px; }
        .sub { color: var(--ink-soft); font-size: 14px; margin: 0 0 32px; }
        .steps { display: flex; gap: 8px; margin-bottom: 32px; font-size: 12px; color: var(--ink-soft); }
        .step { display: flex; align-items: center; gap: 6px; }
        .step .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--line); }
        .step.done .dot, .step.active .dot { background: var(--brass); }
        .step.active { color: var(--ink); font-weight: 600; }
        .step-sep { color: var(--line); }
        .passenger-card { border: 1px solid var(--line); border-radius: 4px; padding: 28px; margin-bottom: 20px; position: relative; }
        .passenger-card::before { content: ""; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: var(--brass); border-radius: 4px 4px 0 0; }
        .passenger-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
        .passenger-header h2 { font-family: 'Fraunces', serif; font-size: 18px; font-weight: 500; margin: 0; }
        .passenger-header .seat-tag { font-size: 12px; color: var(--brass-dark); background: #FCEBEC; padding: 4px 10px; border-radius: 3px; font-weight: 600; }
        .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .field-row.three { grid-template-columns: 1fr 1fr 1fr; }
        .field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 18px; }
        .field label { font-size: 12px; color: var(--ink-soft); }
        .field input, .field select { font-family: 'Inter', sans-serif; font-size: 15px; padding: 10px 0; border: none; border-bottom: 1px solid var(--line); background: transparent; color: var(--ink); width: 100%; }
        .field input:focus, .field select:focus { outline: none; border-bottom: 1px solid var(--brass-dark); }
        .field.error input, .field.error select { border-bottom: 1px solid var(--danger); }
        .field .err-msg { font-size: 12px; color: var(--danger); min-height: 14px; }
        .contact-card { border: 1px solid var(--line); border-radius: 4px; padding: 28px; margin-bottom: 32px; }
        .contact-card h2 { font-family: 'Fraunces', serif; font-size: 18px; font-weight: 500; margin: 0 0 4px; }
        .contact-card .hint { font-size: 13px; color: var(--ink-soft); margin-bottom: 20px; }
        .continue-btn { width: 100%; background: var(--brass); color: #fff; border: none; border-radius: 3px; padding: 14px; font-family: 'Inter', sans-serif; font-weight: 600; font-size: 15px; cursor: pointer; }
        .continue-btn:hover { background: var(--brass-dark); }
        @media (max-width: 640px) { .field-row, .field-row.three { grid-template-columns: 1fr; } }
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
        <div className="steps">
          <div className="step done"><span className="dot"></span> Flight</div>
          <span className="step-sep">—</span>
          <div className="step done"><span className="dot"></span> Seats</div>
          <span className="step-sep">—</span>
          <div className="step active"><span className="dot"></span> Passenger details</div>
          <span className="step-sep">—</span>
          <div className="step"><span className="dot"></span> Payment</div>
        </div>

        <h1>Passenger details</h1>
        <p className="sub" id="details-sub">Fill in the information for each traveler.</p>

        <form id="passenger-form" noValidate>
          <div id="passenger-list"></div>

          <div className="contact-card">
            <h2>Contact information</h2>
            <p className="hint">We'll send your booking confirmation and any updates here.</p>

            <div className="field-row">
              <div className="field" id="field-contact-email">
                <label htmlFor="contact-email">Email</label>
                <input type="email" id="contact-email" name="contactEmail" placeholder="you@example.com" />
                <span className="err-msg"></span>
              </div>
              <div className="field" id="field-contact-phone">
                <label htmlFor="contact-phone">Phone</label>
                <input type="tel" id="contact-phone" name="contactPhone" placeholder="+216 00 000 000" />
                <span className="err-msg"></span>
              </div>
            </div>
          </div>

          <button type="submit" className="continue-btn">Continue to payment</button>
        </form>
      </main>
    </>
  );
}
