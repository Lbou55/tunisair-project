import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function Confirmation() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    function randomRef() {
      const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
      let ref = "";
      for (let i = 0; i < 6; i++) ref += chars[Math.floor(Math.random() * chars.length)];
      return ref;
    }

    const flightLabel = params.get("flight") || "TU 101";
    const origin = params.get("origin") || "TUN";
    const destination = params.get("destination") || "CDG";
    const departDate = params.get("departDate") || "";
    const depTime = params.get("depTime") || "08:15";
    const cabin = params.get("cabin") || "economy";
    const total = params.get("total") || "$277";
    const seatsParam = params.get("seats");
    const seats = seatsParam ? seatsParam.split(",") : ["5A"];
    const passengerNames = params.get("names");
    const names = passengerNames ? passengerNames.split(",") : ["Passenger 1"];

    document.getElementById("booking-ref").textContent = randomRef();
    document.getElementById("route-cities").textContent = `${origin} → ${destination}`;
    document.getElementById("route-date").textContent = departDate || "Date to be confirmed";
    document.getElementById("info-flight").textContent = flightLabel;
    document.getElementById("info-cabin").textContent = cabin.charAt(0).toUpperCase() + cabin.slice(1);
    document.getElementById("info-departure").textContent = `${departDate || "—"} · ${depTime}`;
    document.getElementById("info-total").textContent = total;

    const rowsContainer = document.getElementById("passenger-rows");
    names.forEach((name, i) => {
      const row = document.createElement("div");
      row.className = "passenger-row";
      row.innerHTML = `<span>${name}</span><span class="seat">Seat ${seats[i] || "—"}</span>`;
      rowsContainer.appendChild(row);
    });

    function handlePrint() {
      window.print();
    }
    document.getElementById("print-btn").addEventListener("click", handlePrint);
    return () => document.getElementById("print-btn")?.removeEventListener("click", handlePrint);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <style>{`
        :root {
          --paper: #FFFFFF; --ink: #1A1A1A; --ink-soft: #6B6B6B; --brass: #D70218;
          --brass-dark: #A5011A; --line: #E6E0DC; --success: #1F7A3F; --success-bg: #EAF6EE;
        }
        * { box-sizing: border-box; }
        body { margin: 0; background: var(--paper); color: var(--ink); font-family: 'Inter', sans-serif; line-height: 1.5; }
        header { padding: 28px 40px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--line); }
        .logo img { height: 60px; width: auto; }
        nav a { color: var(--ink-soft); text-decoration: none; font-size: 14px; margin-left: 28px; }
        main { max-width: 640px; margin: 0 auto; padding: 56px 24px 100px; }
        .success-banner { text-align: center; margin-bottom: 36px; }
        .success-icon { width: 56px; height: 56px; border-radius: 50%; background: var(--success-bg); color: var(--success); display: flex; align-items: center; justify-content: center; font-size: 26px; margin: 0 auto 16px; }
        h1 { font-family: 'Fraunces', serif; font-weight: 500; font-size: 30px; margin: 0 0 6px; }
        .success-banner .sub { color: var(--ink-soft); font-size: 14px; }
        .ticket { background: #FFFFFF; border: 1px solid var(--line); border-radius: 4px; position: relative; margin-bottom: 24px; }
        .ticket-top { padding: 28px 28px 20px; display: flex; justify-content: space-between; align-items: flex-start; }
        .ref-block .label { font-size: 11px; color: var(--ink-soft); text-transform: uppercase; letter-spacing: 0.06em; }
        .ref-block .value { font-family: 'Fraunces', serif; font-size: 22px; color: var(--brass-dark); letter-spacing: 0.04em; }
        .route-block { text-align: right; }
        .route-block .cities { font-family: 'Fraunces', serif; font-size: 20px; }
        .route-block .date { font-size: 13px; color: var(--ink-soft); }
        .perf-line { border-top: 2px dashed var(--line); position: relative; margin: 0 -1px; }
        .perf-line::before, .perf-line::after { content: ""; position: absolute; top: -9px; width: 18px; height: 18px; background: var(--paper); border: 1px solid var(--line); border-radius: 50%; }
        .perf-line::before { left: -10px; }
        .perf-line::after { right: -10px; }
        .ticket-bottom { padding: 20px 28px 28px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin-bottom: 20px; }
        .info-item .label { font-size: 11px; color: var(--ink-soft); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
        .info-item .value { font-size: 15px; }
        .passenger-table { border-top: 1px solid var(--line); padding-top: 16px; }
        .passenger-table .label { font-size: 11px; color: var(--ink-soft); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 10px; }
        .passenger-row { display: flex; justify-content: space-between; font-size: 14px; padding: 6px 0; }
        .passenger-row .seat { color: var(--brass-dark); font-weight: 600; }
        .barcode { margin-top: 20px; height: 40px; background: repeating-linear-gradient(90deg, var(--ink) 0px, var(--ink) 2px, transparent 2px, transparent 5px); opacity: 0.85; }
        .actions { display: flex; gap: 12px; margin-bottom: 40px; }
        .btn { flex: 1; text-align: center; padding: 13px; border-radius: 3px; font-weight: 600; font-size: 14px; cursor: pointer; text-decoration: none; border: none; font-family: 'Inter', sans-serif; }
        .btn-primary { background: var(--brass); color: #fff; }
        .btn-primary:hover { background: var(--brass-dark); }
        .btn-secondary { background: #fff; color: var(--ink); border: 1px solid var(--line); }
        .btn-secondary:hover { border-color: var(--brass-dark); color: var(--brass-dark); }
        .home-link { display: block; text-align: center; font-size: 14px; color: var(--ink-soft); text-decoration: none; }
        .home-link:hover { color: var(--brass-dark); }
        @media (max-width: 480px) {
          .info-grid { grid-template-columns: 1fr; }
          .ticket-top { flex-direction: column; gap: 12px; }
          .route-block { text-align: left; }
          .actions { flex-direction: column; }
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
        <div className="success-banner">
          <div className="success-icon">✓</div>
          <h1>Booking confirmed</h1>
          <p className="sub">A copy of this e-ticket has been sent to your email.</p>
        </div>

        <div className="ticket">
          <div className="ticket-top">
            <div className="ref-block">
              <div className="label">Booking reference</div>
              <div className="value" id="booking-ref">—</div>
            </div>
            <div className="route-block">
              <div className="cities" id="route-cities">TUN → CDG</div>
              <div className="date" id="route-date">—</div>
            </div>
          </div>

          <div className="perf-line"></div>

          <div className="ticket-bottom">
            <div className="info-grid">
              <div className="info-item"><div className="label">Flight</div><div className="value" id="info-flight">TU 101</div></div>
              <div className="info-item"><div className="label">Cabin</div><div className="value" id="info-cabin">Economy</div></div>
              <div className="info-item"><div className="label">Departure</div><div className="value" id="info-departure">—</div></div>
              <div className="info-item"><div className="label">Amount paid</div><div className="value" id="info-total">—</div></div>
            </div>

            <div className="passenger-table">
              <div className="label">Passengers & seats</div>
              <div id="passenger-rows"></div>
            </div>

            <div className="barcode"></div>
          </div>
        </div>

        <div className="actions">
          <button className="btn btn-secondary" id="print-btn">Print / Save PDF</button>
          <Link to="/" className="btn btn-primary">Book another flight</Link>
        </div>

        <Link to="/" className="home-link">Back to home</Link>
      </main>
    </>
  );
}
