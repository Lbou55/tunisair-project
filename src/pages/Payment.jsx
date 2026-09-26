import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Payment() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const flightLabel = params.get("flight") || "TU 101 · TUN → CDG";
    const cabin = params.get("cabin") || "economy";
    const passengers = parseInt(params.get("passengers")) || 1;
    const seatsParam = params.get("seats");
    const seats = seatsParam ? seatsParam.split(",") : [];
    const subtotal = parseFloat(params.get("subtotal")) || 245 * passengers;
    const taxes = Math.round(subtotal * 0.13);

    document.getElementById("sum-flight").textContent = flightLabel;
    document.getElementById("sum-cabin").textContent = cabin.charAt(0).toUpperCase() + cabin.slice(1);
    document.getElementById("sum-passengers").textContent = passengers;
    document.getElementById("sum-seats").textContent = seats.length ? seats.join(", ") : "—";
    document.getElementById("sum-subtotal").textContent = `$${subtotal}`;
    document.getElementById("sum-taxes").textContent = `$${taxes}`;

    let discount = 0;
    function recalcTotal() {
      const total = subtotal - discount + taxes;
      document.getElementById("sum-total").textContent = `$${total}`;
    }
    recalcTotal();

    const validPromo = { code: "SKYLINE10", percent: 10 };
    function handleApplyPromo() {
      const input = document.getElementById("promo");
      const msg = document.getElementById("promo-msg");
      const code = input.value.trim().toUpperCase();

      if (!code) {
        msg.textContent = "Enter a code first";
        msg.className = "promo-msg error";
        return;
      }
      if (code === validPromo.code) {
        discount = Math.round(subtotal * (validPromo.percent / 100));
        msg.textContent = `Applied — ${validPromo.percent}% off`;
        msg.className = "promo-msg success";
        document.getElementById("discount-line").style.display = "flex";
        document.getElementById("sum-discount").textContent = `-$${discount}`;
      } else {
        discount = 0;
        msg.textContent = "Invalid or expired code";
        msg.className = "promo-msg error";
        document.getElementById("discount-line").style.display = "none";
      }
      recalcTotal();
    }
    document.getElementById("apply-promo").addEventListener("click", handleApplyPromo);

    const cardNumberInput = document.getElementById("card-number");
    function handleCardNumberInput() {
      let digits = cardNumberInput.value.replace(/\D/g, "").slice(0, 16);
      cardNumberInput.value = digits.replace(/(.{4})/g, "$1 ").trim();
    }
    cardNumberInput.addEventListener("input", handleCardNumberInput);

    const expiryInput = document.getElementById("expiry");
    function handleExpiryInput() {
      let digits = expiryInput.value.replace(/\D/g, "").slice(0, 4);
      if (digits.length >= 3) {
        expiryInput.value = digits.slice(0, 2) + "/" + digits.slice(2);
      } else {
        expiryInput.value = digits;
      }
    }
    expiryInput.addEventListener("input", handleExpiryInput);

    const cvvInput = document.getElementById("cvv");
    function handleCvvInput() {
      cvvInput.value = cvvInput.value.replace(/\D/g, "").slice(0, 4);
    }
    cvvInput.addEventListener("input", handleCvvInput);

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

    function handleSubmit(e) {
      e.preventDefault();
      let valid = true;
      ["field-card-name", "field-card-number", "field-expiry", "field-cvv"].forEach(clearError);

      const cardName = document.getElementById("card-name").value.trim();
      const cardDigits = cardNumberInput.value.replace(/\D/g, "");
      const expiry = expiryInput.value;
      const cvv = cvvInput.value;

      if (!cardName) { setError("field-card-name", "Required"); valid = false; }

      if (cardDigits.length !== 16) {
        setError("field-card-number", "Enter a 16-digit card number"); valid = false;
      }

      if (!/^\d{2}\/\d{2}$/.test(expiry)) {
        setError("field-expiry", "Use MM/YY"); valid = false;
      } else {
        const [mm, yy] = expiry.split("/").map(Number);
        const now = new Date();
        const currentYY = now.getFullYear() % 100;
        const currentMM = now.getMonth() + 1;
        if (mm < 1 || mm > 12) {
          setError("field-expiry", "Invalid month"); valid = false;
        } else if (yy < currentYY || (yy === currentYY && mm < currentMM)) {
          setError("field-expiry", "Card expired"); valid = false;
        }
      }

      if (cvv.length < 3) {
        setError("field-cvv", "Invalid CVV"); valid = false;
      }

      if (!valid) return;

      const payload = {
        cardName,
        cardLast4: cardDigits.slice(-4),
        expiry,
        total: document.getElementById("sum-total").textContent
      };
      console.log("Payment payload (would be sent to /api/v1/payments):", payload);

      const nextParams = new URLSearchParams(window.location.search);
      nextParams.set("total", payload.total);
      navigate("/confirmation?" + nextParams.toString());
    }

    const form = document.getElementById("payment-form");
    form.addEventListener("submit", handleSubmit);

    return () => {
      document.getElementById("apply-promo")?.removeEventListener("click", handleApplyPromo);
      cardNumberInput.removeEventListener("input", handleCardNumberInput);
      expiryInput.removeEventListener("input", handleExpiryInput);
      cvvInput.removeEventListener("input", handleCvvInput);
      form.removeEventListener("submit", handleSubmit);
    };
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
        main { max-width: 900px; margin: 0 auto; padding: 40px 24px 120px; }
        .steps { display: flex; gap: 8px; margin-bottom: 32px; font-size: 12px; color: var(--ink-soft); }
        .step { display: flex; align-items: center; gap: 6px; }
        .step .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--line); }
        .step.done .dot, .step.active .dot { background: var(--brass); }
        .step.active { color: var(--ink); font-weight: 600; }
        .step-sep { color: var(--line); }
        h1 { font-family: 'Fraunces', serif; font-weight: 500; font-size: 30px; margin: 0 0 4px; }
        .sub { color: var(--ink-soft); font-size: 14px; margin: 0 0 32px; }
        .layout { display: grid; grid-template-columns: 1fr 320px; gap: 32px; align-items: start; }
        .pay-card { border: 1px solid var(--line); border-radius: 4px; padding: 28px; position: relative; }
        .pay-card::before { content: ""; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: var(--brass); border-radius: 4px 4px 0 0; }
        .pay-card h2 { font-family: 'Fraunces', serif; font-size: 18px; font-weight: 500; margin: 0 0 20px; }
        .card-brands { display: flex; gap: 8px; margin-bottom: 20px; }
        .card-brand { font-size: 11px; font-weight: 600; color: var(--ink-soft); border: 1px solid var(--line); border-radius: 3px; padding: 5px 10px; }
        .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 18px; }
        .field label { font-size: 12px; color: var(--ink-soft); }
        .field input { font-family: 'Inter', sans-serif; font-size: 15px; padding: 10px 0; border: none; border-bottom: 1px solid var(--line); background: transparent; color: var(--ink); width: 100%; letter-spacing: 0.02em; }
        .field input:focus { outline: none; border-bottom: 1px solid var(--brass-dark); }
        .field.error input { border-bottom: 1px solid var(--danger); }
        .field .err-msg { font-size: 12px; color: var(--danger); min-height: 14px; }
        .promo-row { display: flex; gap: 10px; margin-top: 6px; margin-bottom: 24px; }
        .promo-row input { flex: 1; font-family: 'Inter', sans-serif; font-size: 14px; padding: 10px 0; border: none; border-bottom: 1px solid var(--line); background: transparent; color: var(--ink); }
        .promo-row input:focus { outline: none; border-bottom: 1px solid var(--brass-dark); }
        .apply-btn { background: none; border: 1px solid var(--line); border-radius: 3px; padding: 0 16px; font-size: 13px; font-weight: 600; color: var(--brass-dark); cursor: pointer; }
        .apply-btn:hover { border-color: var(--brass-dark); }
        .promo-msg { font-size: 12px; margin-top: -18px; margin-bottom: 20px; min-height: 14px; }
        .promo-msg.success { color: #1F7A3F; }
        .promo-msg.error { color: var(--danger); }
        .secure-note { font-size: 12px; color: var(--ink-soft); display: flex; align-items: center; gap: 6px; margin-bottom: 20px; }
        .pay-btn { width: 100%; background: var(--brass); color: #fff; border: none; border-radius: 3px; padding: 14px; font-family: 'Inter', sans-serif; font-weight: 600; font-size: 15px; cursor: pointer; }
        .pay-btn:hover { background: var(--brass-dark); }
        .summary-panel { border: 1px solid var(--line); border-radius: 4px; padding: 24px; position: sticky; top: 24px; }
        .summary-panel h2 { font-family: 'Fraunces', serif; font-size: 18px; font-weight: 500; margin: 0 0 16px; }
        .summary-line { display: flex; justify-content: space-between; font-size: 14px; color: var(--ink-soft); margin-bottom: 10px; }
        .summary-line span:last-child { color: var(--ink); }
        .summary-divider { border-top: 1px solid var(--line); margin: 16px 0; }
        .total-row { display: flex; justify-content: space-between; align-items: baseline; }
        .total-row .label { font-size: 13px; color: var(--ink-soft); }
        .total-row .value { font-family: 'Fraunces', serif; font-size: 26px; color: var(--brass-dark); }
        @media (max-width: 720px) {
          .layout { grid-template-columns: 1fr; }
          .summary-panel { position: static; order: -1; }
          .field-row { grid-template-columns: 1fr; }
        }
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
          <div className="step done"><span className="dot"></span> Passenger details</div>
          <span className="step-sep">—</span>
          <div className="step active"><span className="dot"></span> Payment</div>
        </div>

        <h1>Payment</h1>
        <p className="sub">Enter your card details to complete the booking.</p>

        <div className="layout">
          <div className="pay-card">
            <h2>Card details</h2>
            <div className="card-brands">
              <span className="card-brand">Visa</span>
              <span className="card-brand">Mastercard</span>
              <span className="card-brand">Amex</span>
            </div>

            <form id="payment-form" noValidate>
              <div className="field" id="field-card-name">
                <label htmlFor="card-name">Name on card</label>
                <input type="text" id="card-name" autoComplete="cc-name" />
                <span className="err-msg"></span>
              </div>

              <div className="field" id="field-card-number">
                <label htmlFor="card-number">Card number</label>
                <input type="text" id="card-number" inputMode="numeric" placeholder="1234 5678 9012 3456" autoComplete="cc-number" maxLength={19} />
                <span className="err-msg"></span>
              </div>

              <div className="field-row">
                <div className="field" id="field-expiry">
                  <label htmlFor="expiry">Expiry (MM/YY)</label>
                  <input type="text" id="expiry" placeholder="MM/YY" autoComplete="cc-exp" maxLength={5} />
                  <span className="err-msg"></span>
                </div>
                <div className="field" id="field-cvv">
                  <label htmlFor="cvv">CVV</label>
                  <input type="text" id="cvv" inputMode="numeric" placeholder="123" autoComplete="cc-csc" maxLength={4} />
                  <span className="err-msg"></span>
                </div>
              </div>

              <label htmlFor="promo" style={{ fontSize: "12px", color: "var(--ink-soft)" }}>Promo code (optional)</label>
              <div className="promo-row">
                <input type="text" id="promo" placeholder="e.g. SKYLINE10" />
                <button type="button" className="apply-btn" id="apply-promo">Apply</button>
              </div>
              <div className="promo-msg" id="promo-msg"></div>

              <p className="secure-note">🔒 This is a simulated checkout — no real payment is processed.</p>

              <button type="submit" className="pay-btn" id="pay-btn">Pay now</button>
            </form>
          </div>

          <div className="summary-panel">
            <h2>Order summary</h2>

            <div className="summary-line"><span>Flight</span><span id="sum-flight">TU 101 · TUN → CDG</span></div>
            <div className="summary-line"><span>Cabin</span><span id="sum-cabin">Economy</span></div>
            <div className="summary-line"><span>Passengers</span><span id="sum-passengers">1</span></div>
            <div className="summary-line"><span>Seats</span><span id="sum-seats">—</span></div>

            <div className="summary-divider"></div>

            <div className="summary-line"><span>Fare subtotal</span><span id="sum-subtotal">$245</span></div>
            <div className="summary-line" id="discount-line" style={{ display: "none" }}><span>Discount</span><span id="sum-discount">-$0</span></div>
            <div className="summary-line"><span>Taxes & fees</span><span id="sum-taxes">$32</span></div>

            <div className="summary-divider"></div>

            <div className="total-row">
              <span className="label">Total</span>
              <span className="value" id="sum-total">$277</span>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
