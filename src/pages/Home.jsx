import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const form = document.getElementById("search-form");
    const originInput = document.getElementById("origin");
    const destInput = document.getElementById("destination");
    const departInput = document.getElementById("depart-date");
    const returnInput = document.getElementById("return-date");
    const returnField = document.getElementById("field-return");
    const swapBtn = document.getElementById("swap-btn");
    const stubRoute = document.getElementById("stub-route");
    const stubDate = document.getElementById("stub-date");

    function updateStub() {
      const o = originInput.value.trim() || "—";
      const d = destInput.value.trim() || "—";
      stubRoute.textContent = o + " to " + d;
      stubDate.textContent = departInput.value || "Not set";
    }
    [originInput, destInput, departInput].forEach((el) =>
      el.addEventListener("input", updateStub)
    );

    function handleSwap() {
      const tmp = originInput.value;
      originInput.value = destInput.value;
      destInput.value = tmp;
      updateStub();
    }
    swapBtn.addEventListener("click", handleSwap);

    function handleTripTypeChange(e) {
      returnField.style.display = e.target.value === "roundtrip" ? "flex" : "none";
      if (e.target.value !== "roundtrip") {
        clearError("field-return");
        returnInput.value = "";
      }
    }
    const tripRadios = document.querySelectorAll('input[name="tripType"]');
    tripRadios.forEach((radio) => radio.addEventListener("change", handleTripTypeChange));

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

      ["field-origin", "field-destination", "field-depart"].forEach(clearError);
      const isRoundtrip =
        document.querySelector('input[name="tripType"]:checked').value === "roundtrip";
      if (isRoundtrip) clearError("field-return");

      if (!originInput.value.trim()) {
        setError("field-origin", "Enter a departure city");
        valid = false;
      }
      if (!destInput.value.trim()) {
        setError("field-destination", "Enter a destination city");
        valid = false;
      }
      if (
        originInput.value.trim() &&
        destInput.value.trim() &&
        originInput.value.trim().toLowerCase() === destInput.value.trim().toLowerCase()
      ) {
        setError("field-destination", "Must differ from origin");
        valid = false;
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (!departInput.value) {
        setError("field-depart", "Pick a departure date");
        valid = false;
      } else if (new Date(departInput.value) < today) {
        setError("field-depart", "Date is in the past");
        valid = false;
      }

      if (isRoundtrip) {
        if (!returnInput.value) {
          setError("field-return", "Pick a return date");
          valid = false;
        } else if (
          departInput.value &&
          new Date(returnInput.value) < new Date(departInput.value)
        ) {
          setError("field-return", "Before departure date");
          valid = false;
        }
      }

      if (!valid) return;

      const query = {
        tripType: document.querySelector('input[name="tripType"]:checked').value,
        origin: originInput.value.trim(),
        destination: destInput.value.trim(),
        departDate: departInput.value,
        returnDate: isRoundtrip ? returnInput.value : null,
        passengers: document.getElementById("passengers").value,
        cabin: document.getElementById("cabin").value
      };

      const cleanQuery = Object.fromEntries(
        Object.entries(query).filter(([, v]) => v !== null && v !== "")
      );
      const params = new URLSearchParams(cleanQuery);
      navigate("/results?" + params.toString());
    }
    form.addEventListener("submit", handleSubmit);

    return () => {
      [originInput, destInput, departInput].forEach((el) =>
        el.removeEventListener("input", updateStub)
      );
      swapBtn.removeEventListener("click", handleSwap);
      tripRadios.forEach((radio) => radio.removeEventListener("change", handleTripTypeChange));
      form.removeEventListener("submit", handleSubmit);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <style>{`
        :root {
          --paper: #FFFFFF;
          --ink: #1A1A1A;
          --ink-soft: #6B6B6B;
          --brass: #D70218;
          --brass-dark: #A5011A;
          --teal: #A5011A;
          --line: #E6E0DC;
          --danger: #A5011A;
        }
        * { box-sizing: border-box; }
        body { margin: 0; background: var(--paper); color: var(--ink); font-family: 'Inter', sans-serif; line-height: 1.5; }
        header { padding: 28px 40px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--line); }
        .logo { font-family: 'Fraunces', serif; font-size: 22px; font-weight: 600; letter-spacing: -0.01em; display: flex; align-items: center; gap: 8px; color: var(--brass-dark); }
        .logo svg { flex-shrink: 0; }
        nav a { color: var(--ink-soft); text-decoration: none; font-size: 14px; margin-left: 28px; }
        main { max-width: 920px; margin: 0 auto; padding: 64px 24px 100px; }
        h1 { font-family: 'Fraunces', serif; font-weight: 500; font-size: 44px; line-height: 1.15; max-width: 14ch; margin: 0 0 12px; }
        .sub { color: var(--ink-soft); font-size: 17px; max-width: 46ch; margin: 0 0 48px; }
        .ticket { background: #FFFFFF; border: 1px solid var(--line); border-radius: 4px; display: grid; grid-template-columns: 1fr 240px; position: relative; box-shadow: 0 1px 0 rgba(28,36,48,0.03); }
        .ticket-main { padding: 32px 36px; }
        .ticket-side { background: var(--brass); color: var(--paper); padding: 32px 28px; display: flex; flex-direction: column; justify-content: space-between; border-radius: 0 4px 4px 0; }
        .perf { position: absolute; top: 0; bottom: 0; right: 240px; width: 0; border-left: 2px dashed var(--line); }
        .punch { position: absolute; right: 232px; width: 16px; height: 16px; background: var(--paper); border-radius: 50%; border: 1px solid var(--line); }
        .punch.top { top: -8px; }
        .punch.bottom { bottom: -8px; }
        .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
        .field { display: flex; flex-direction: column; gap: 6px; }
        .field label { font-size: 12px; color: var(--ink-soft); text-transform: lowercase; }
        .field input, .field select { font-family: 'Inter', sans-serif; font-size: 16px; padding: 10px 0; border: none; border-bottom: 1px solid var(--line); background: transparent; color: var(--ink); }
        .field input:focus, .field select:focus { outline: none; border-bottom: 1px solid var(--brass-dark); }
        .field.error input, .field.error select { border-bottom: 1px solid var(--danger); }
        .field .err-msg { font-size: 12px; color: var(--danger); min-height: 14px; }
        .swap-btn { align-self: flex-end; background: none; border: 1px solid var(--line); border-radius: 50%; width: 30px; height: 30px; cursor: pointer; color: var(--ink-soft); font-size: 14px; display: flex; align-items: center; justify-content: center; margin-bottom: 6px; }
        .swap-btn:hover { border-color: var(--brass-dark); color: var(--brass-dark); }
        .origin-dest { display: grid; grid-template-columns: 1fr auto 1fr; gap: 16px; align-items: end; margin-bottom: 20px; }
        .trip-toggle { display: flex; gap: 18px; margin-bottom: 24px; }
        .trip-toggle label { font-size: 14px; color: var(--ink-soft); display: flex; align-items: center; gap: 6px; cursor: pointer; }
        .trip-toggle input { accent-color: var(--brass-dark); }
        .ticket-side .stub-label { font-size: 12px; color: rgba(255,255,255,0.75); }
        .ticket-side .stub-value { font-family: 'Fraunces', serif; font-size: 20px; margin-top: 2px; }
        .search-btn { width: 100%; background: var(--paper); color: var(--brass-dark); border: none; border-radius: 3px; padding: 14px; font-family: 'Inter', sans-serif; font-weight: 600; font-size: 15px; cursor: pointer; transition: background 0.15s ease; }
        .search-btn:hover { background: #F2F2F2; }
        .helper { margin-top: 18px; font-size: 13px; color: var(--ink-soft); }
        @media (max-width: 720px) {
          .ticket { grid-template-columns: 1fr; }
          .ticket-side { border-radius: 0 0 4px 4px; }
          .perf, .punch { display: none; }
          .origin-dest { grid-template-columns: 1fr; }
          .swap-btn { justify-self: start; transform: rotate(90deg); }
          h1 { font-size: 32px; }
        }
      `}</style>

      <header>
        <div className="logo">
          <img src="/assets/logo.png" alt="Tunisair logo" style={{ height: "60px", width: "auto" }} />
        </div>
        <nav>
          <Link to="#">Manage booking</Link>
          <Link to="/login">Log in</Link>
        </nav>
      </header>

      <main>
        <h1>Where to, next?</h1>
        <p className="sub">Search real-time fares and seat availability across every route we fly.</p>

        <form id="search-form" className="ticket" noValidate>
          <div className="ticket-main">
            <div className="trip-toggle">
              <label>
                <input type="radio" name="tripType" value="oneway" defaultChecked /> One way
              </label>
              <label>
                <input type="radio" name="tripType" value="roundtrip" /> Round trip
              </label>
            </div>

            <div className="origin-dest">
              <div className="field" id="field-origin">
                <label htmlFor="origin">From</label>
                <input type="text" id="origin" name="origin" placeholder="Tunis (TUN)" autoComplete="off" />
                <span className="err-msg"></span>
              </div>

              <button type="button" className="swap-btn" id="swap-btn" title="Swap origin and destination" aria-label="Swap origin and destination">⇄</button>

              <div className="field" id="field-destination">
                <label htmlFor="destination">To</label>
                <input type="text" id="destination" name="destination" placeholder="Paris (CDG)" autoComplete="off" />
                <span className="err-msg"></span>
              </div>
            </div>

            <div className="field-row">
              <div className="field" id="field-depart">
                <label htmlFor="depart-date">Departure</label>
                <input type="date" id="depart-date" name="departDate" />
                <span className="err-msg"></span>
              </div>
              <div className="field" id="field-return" style={{ display: "none" }}>
                <label htmlFor="return-date">Return</label>
                <input type="date" id="return-date" name="returnDate" />
                <span className="err-msg"></span>
              </div>
            </div>

            <div className="field-row">
              <div className="field">
                <label htmlFor="passengers">Passengers</label>
                <select id="passengers" name="passengers">
                  <option>1</option><option>2</option><option>3</option><option>4</option>
                  <option>5</option><option>6</option><option>7</option><option>8</option><option>9</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="cabin">Cabin</label>
                <select id="cabin" name="cabin">
                  <option value="economy">Economy</option>
                  <option value="business">Business</option>
                </select>
              </div>
            </div>
          </div>

          <div className="perf"></div>
          <div className="punch top"></div>
          <div className="punch bottom"></div>

          <div className="ticket-side">
            <div>
              <div className="stub-label">Route</div>
              <div className="stub-value" id="stub-route">— to —</div>
            </div>
            <div>
              <div className="stub-label">Date</div>
              <div className="stub-value" id="stub-date">Not set</div>
            </div>
            <button type="submit" className="search-btn">Search flights</button>
          </div>
        </form>

        <p className="helper">This search doesn't call a real backend yet — it validates your input and shows what would be sent to the flights API.</p>
      </main>
    </>
  );
}
