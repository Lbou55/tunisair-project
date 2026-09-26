import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { currentCrewMember, rosterFlights } from "../data/crewData.js";

export default function PilotFlightDetail() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const flightId = searchParams.get("id");
    const flight = rosterFlights.find((f) => f.id === flightId) || rosterFlights[0];

    let currentStatus = flight.status;

    const statusLabels = {
      scheduled: "Scheduled",
      boarding: "Boarding",
      departed: "Departed",
      landed: "Landed",
      delayed: "Delayed"
    };
    const statusFlow = ["scheduled", "boarding", "departed", "landed"];

    function renderHeader() {
      document.getElementById("flight-title").textContent = `${flight.flightNumber} · ${flight.origin} → ${flight.destination}`;
      document.getElementById("flight-sub").textContent = `${flight.date} · ${flight.aircraft}`;

      ["status-pill-main", "status-pill-side"].forEach((id) => {
        const el = document.getElementById(id);
        el.textContent = statusLabels[currentStatus];
        el.className = "status-pill " + currentStatus;
      });
    }

    function renderInfo() {
      document.getElementById("info-aircraft").textContent = flight.aircraft;
      document.getElementById("info-gate").textContent = flight.gate;
      document.getElementById("info-dep").textContent = flight.depTime;
      document.getElementById("info-arr").textContent = flight.arrTime;

      document.getElementById("load-text").textContent = `${flight.passengerCount} / ${flight.capacity}`;
      const pct = Math.round((flight.passengerCount / flight.capacity) * 100);
      document.getElementById("load-bar-fill").style.width = pct + "%";
    }

    function renderCrew() {
      const list = document.getElementById("crew-list");
      list.innerHTML = "";
      flight.crew.forEach((member) => {
        const isSelf = member.name === `${currentCrewMember.firstName} ${currentCrewMember.lastName}`;
        const row = document.createElement("div");
        row.className = "crew-row" + (isSelf ? " self" : "");
        row.innerHTML = `<span class="crew-name">${member.name}</span><span class="crew-role">${member.role}</span>`;
        list.appendChild(row);
      });
    }

    function renderStatusOptions() {
      const container = document.getElementById("status-options");
      container.innerHTML = "";
      const options = [...statusFlow, "delayed"];

      options.forEach((status) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "status-btn" + (status === currentStatus ? " current" : "");
        btn.innerHTML = `${statusLabels[status]} <span class="check">✓</span>`;
        btn.addEventListener("click", () => {
          if (status === currentStatus) return;
          currentStatus = status;
          console.log(`Flight ${flight.id} status updated to: ${status}`);
          renderHeader();
          renderStatusOptions();
          const confirmEl = document.getElementById("update-confirm");
          confirmEl.classList.add("show");
          setTimeout(() => confirmEl.classList.remove("show"), 2500);
        });
        container.appendChild(btn);
      });
    }

    renderHeader();
    renderInfo();
    renderCrew();
    renderStatusOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <>
      <style>{`
        :root {
          --paper: #FFFFFF; --ink: #1A1A1A; --ink-soft: #6B6B6B; --brass: #D70218;
          --brass-dark: #A5011A; --line: #E6E0DC; --navy: #1A2438; --success: #1F7A3F;
          --success-bg: #EAF6EE; --warn: #C98A00; --warn-bg: #FBF2E0; --muted-bg: #F1EFEA;
        }
        * { box-sizing: border-box; }
        body { margin: 0; background: #FAFAF8; color: var(--ink); font-family: 'Inter', sans-serif; line-height: 1.5; }
        header { padding: 20px 40px; display: flex; align-items: center; justify-content: space-between; background: var(--navy); }
        .logo { display: flex; align-items: center; gap: 12px; }
        .logo img { height: 40px; width: auto; filter: brightness(0) invert(1); }
        .portal-tag { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #B9C0CC; border-left: 1px solid #3A4356; padding-left: 12px; }
        nav a { color: #C9CFDA; text-decoration: none; font-size: 14px; margin-left: 26px; }
        nav a.active { color: #fff; font-weight: 600; }
        nav a:hover { color: #fff; }
        main { max-width: 900px; margin: 0 auto; padding: 40px 24px 100px; }
        .back-link { display: inline-block; font-size: 13px; color: var(--ink-soft); text-decoration: none; margin-bottom: 18px; }
        .back-link:hover { color: var(--navy); }
        .title-row { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 28px; flex-wrap: wrap; gap: 16px; }
        h1 { font-family: 'Fraunces', serif; font-weight: 500; font-size: 30px; margin: 0 0 4px; }
        .sub { color: var(--ink-soft); font-size: 14px; }
        .status-pill { display: inline-block; font-size: 12px; font-weight: 600; padding: 6px 14px; border-radius: 12px; }
        .status-pill.scheduled { background: var(--success-bg); color: var(--success); }
        .status-pill.boarding { background: var(--warn-bg); color: var(--warn); }
        .status-pill.departed { background: var(--muted-bg); color: var(--ink-soft); }
        .status-pill.landed { background: #E7EEFB; color: #2A4D8F; }
        .status-pill.delayed { background: #FCEBEC; color: var(--brass-dark); }
        .layout { display: grid; grid-template-columns: 1fr 300px; gap: 24px; align-items: start; }
        .card { background: #fff; border: 1px solid var(--line); border-radius: 4px; padding: 24px; margin-bottom: 20px; }
        .card h2 { font-family: 'Fraunces', serif; font-size: 17px; font-weight: 500; margin: 0 0 16px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
        .info-item .label { font-size: 11px; color: var(--ink-soft); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
        .info-item .value { font-size: 15px; }
        .load-bar-row { margin-top: 18px; }
        .load-bar-row .label { font-size: 12px; color: var(--ink-soft); margin-bottom: 6px; display: flex; justify-content: space-between; }
        .load-bar { height: 8px; background: var(--muted-bg); border-radius: 4px; overflow: hidden; }
        .load-bar-fill { height: 100%; background: var(--brass); }
        .crew-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid var(--line); font-size: 14px; }
        .crew-row:last-child { border-bottom: none; }
        .crew-row .crew-role { font-size: 12px; color: var(--ink-soft); }
        .crew-row.self .crew-name::after { content: " (you)"; color: var(--ink-soft); font-weight: 400; }
        .crew-name { font-weight: 600; }
        .status-card { position: sticky; top: 20px; }
        .status-card .current-status { margin-bottom: 18px; }
        .status-options { display: flex; flex-direction: column; gap: 8px; }
        .status-btn { text-align: left; background: #fff; border: 1px solid var(--line); border-radius: 4px; padding: 12px 14px; font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600; color: var(--ink); cursor: pointer; display: flex; align-items: center; justify-content: space-between; }
        .status-btn:hover { border-color: var(--navy); }
        .status-btn.current { background: var(--navy); color: #fff; border-color: var(--navy); cursor: default; }
        .status-btn .check { display: none; }
        .status-btn.current .check { display: inline; }
        .update-confirm { margin-top: 14px; font-size: 12px; color: var(--success); display: none; }
        .update-confirm.show { display: block; }
        @media (max-width: 720px) {
          .layout { grid-template-columns: 1fr; }
          .info-grid { grid-template-columns: 1fr; }
          .status-card { position: static; }
        }
      `}</style>

      <header>
        <div className="logo">
          <img src="/assets/logo.png" alt="Tunisair logo" />
          <span className="portal-tag">Crew portal</span>
        </div>
        <nav>
          <Link to="/pilot/dashboard">Dashboard</Link>
          <Link to="/pilot/roster">My roster</Link>
          <Link to="/pilot/profile">Profile</Link>
          <Link to="/">Passenger site</Link>
        </nav>
      </header>

      <main>
        <Link to="/pilot/roster" className="back-link">← Back to roster</Link>

        <div className="title-row">
          <div>
            <h1 id="flight-title">—</h1>
            <p className="sub" id="flight-sub">—</p>
          </div>
          <span className="status-pill" id="status-pill-main">—</span>
        </div>

        <div className="layout">
          <div>
            <div className="card">
              <h2>Flight information</h2>
              <div className="info-grid">
                <div className="info-item"><div className="label">Aircraft</div><div className="value" id="info-aircraft">—</div></div>
                <div className="info-item"><div className="label">Gate</div><div className="value" id="info-gate">—</div></div>
                <div className="info-item"><div className="label">Departure</div><div className="value" id="info-dep">—</div></div>
                <div className="info-item"><div className="label">Arrival</div><div className="value" id="info-arr">—</div></div>
              </div>
              <div className="load-bar-row">
                <div className="label">
                  <span>Passenger load</span>
                  <span id="load-text">—</span>
                </div>
                <div className="load-bar"><div className="load-bar-fill" id="load-bar-fill"></div></div>
              </div>
            </div>

            <div className="card">
              <h2>Crew on this flight</h2>
              <div id="crew-list"></div>
            </div>
          </div>

          <div className="card status-card">
            <h2>Flight status</h2>
            <div className="current-status">
              Current: <span className="status-pill" id="status-pill-side">—</span>
            </div>
            <div className="status-options" id="status-options"></div>
            <p className="update-confirm" id="update-confirm">Status updated.</p>
          </div>
        </div>
      </main>
    </>
  );
}
