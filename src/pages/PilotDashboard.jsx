import { useEffect } from "react";
import { Link } from "react-router-dom";
import { currentCrewMember, rosterFlights } from "../data/crewData.js";

export default function PilotDashboard() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const staffId = params.get("staffId") || currentCrewMember.staffId;

    document.getElementById("welcome-name").textContent = `Welcome back, ${currentCrewMember.firstName}`;
    document.getElementById("welcome-role").textContent =
      `${currentCrewMember.role} · ${currentCrewMember.aircraftRating.join(", ")}`;
    document.getElementById("staff-id-badge").textContent = staffId;

    const nextFlight = rosterFlights[0];
    const nextFlightCard = document.getElementById("next-flight-card");
    nextFlightCard.innerHTML = `
      <div class="label">Next flight</div>
      <div class="next-flight-main">
        <span class="route">${nextFlight.origin} → ${nextFlight.destination}</span>
        <span class="flight-num">${nextFlight.flightNumber} · ${nextFlight.aircraft}</span>
      </div>
      <div class="next-flight-meta">
        <span>Date <span class="val">${nextFlight.date}</span></span>
        <span>Departure <span class="val">${nextFlight.depTime}</span></span>
        <span>Gate <span class="val">${nextFlight.gate}</span></span>
        <span>Passengers <span class="val">${nextFlight.passengerCount}/${nextFlight.capacity}</span></span>
      </div>
      <div class="next-flight-actions">
        <a href="/pilot/flight?id=${nextFlight.id}" class="btn-view-flight">View flight details</a>
      </div>
    `;
    document.getElementById("current-flight-link").href = `/pilot/flight?id=${nextFlight.id}`;

    document.getElementById("stat-flight-count").textContent = rosterFlights.length;
    document.getElementById("stat-ratings").textContent = currentCrewMember.aircraftRating.join(" / ");

    const dutyPct = Math.round((currentCrewMember.dutyHoursThisWeek / currentCrewMember.dutyHoursLimit) * 100);
    document.getElementById("stat-duty").textContent =
      `${currentCrewMember.dutyHoursThisWeek}h / ${currentCrewMember.dutyHoursLimit}h`;
    document.getElementById("duty-bar-fill").style.width = dutyPct + "%";

    const rosterPreview = document.getElementById("roster-preview");
    rosterFlights.slice(0, 3).forEach((f) => {
      const row = document.createElement("a");
      row.href = `/pilot/flight?id=${f.id}`;
      row.style.textDecoration = "none";
      row.style.color = "inherit";
      row.className = "roster-row";
      row.innerHTML = `
        <span class="date">${f.date}</span>
        <span class="route">${f.origin} → ${f.destination}</span>
        <span>${f.flightNumber}</span>
        <span>${f.aircraft}</span>
        <span class="status-pill">${f.status}</span>
      `;
      rosterPreview.appendChild(row);
    });
  }, []);

  return (
    <>
      <style>{`
        :root {
          --paper: #FFFFFF; --ink: #1A1A1A; --ink-soft: #6B6B6B; --brass: #D70218;
          --brass-dark: #A5011A; --line: #E6E0DC; --navy: #1A2438; --navy-soft: #2C3652;
          --success: #1F7A3F; --success-bg: #EAF6EE; --warn: #C98A00; --warn-bg: #FBF2E0;
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
        main { max-width: 980px; margin: 0 auto; padding: 40px 24px 100px; }
        .welcome-row { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 28px; flex-wrap: wrap; gap: 12px; }
        h1 { font-family: 'Fraunces', serif; font-weight: 500; font-size: 28px; margin: 0 0 4px; }
        .sub { color: var(--ink-soft); font-size: 14px; }
        .id-badge { background: #fff; border: 1px solid var(--line); border-radius: 4px; padding: 10px 16px; font-size: 13px; color: var(--ink-soft); }
        .id-badge strong { color: var(--ink); }
        .next-flight { background: var(--navy); color: #fff; border-radius: 6px; padding: 28px 32px; margin-bottom: 28px; position: relative; overflow: hidden; }
        .next-flight .label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #9FA9BE; margin-bottom: 10px; }
        .next-flight-main { display: flex; align-items: baseline; gap: 20px; flex-wrap: wrap; margin-bottom: 18px; }
        .next-flight .route { font-family: 'Fraunces', serif; font-size: 32px; }
        .next-flight .flight-num { font-size: 14px; color: #C9CFDA; }
        .next-flight-meta { display: flex; gap: 28px; flex-wrap: wrap; font-size: 13px; color: #C9CFDA; }
        .next-flight-meta .val { color: #fff; font-weight: 600; }
        .next-flight-actions { margin-top: 20px; }
        .btn-view-flight { display: inline-block; background: var(--brass); color: #fff; padding: 10px 20px; border-radius: 3px; text-decoration: none; font-size: 14px; font-weight: 600; }
        .btn-view-flight:hover { background: var(--brass-dark); }
        .stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 32px; }
        .stat-card { background: #fff; border: 1px solid var(--line); border-radius: 4px; padding: 18px 20px; }
        .stat-card .label { font-size: 12px; color: var(--ink-soft); margin-bottom: 6px; }
        .stat-card .value { font-family: 'Fraunces', serif; font-size: 22px; }
        .duty-bar { height: 6px; background: var(--line); border-radius: 3px; margin-top: 10px; overflow: hidden; }
        .duty-bar-fill { height: 100%; background: var(--brass); }
        .section-title { font-family: 'Fraunces', serif; font-size: 18px; font-weight: 500; margin: 0 0 16px; }
        .nav-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 36px; }
        .nav-card { background: #fff; border: 1px solid var(--line); border-radius: 4px; padding: 20px; text-decoration: none; color: var(--ink); transition: border-color 0.12s ease; }
        .nav-card:hover { border-color: var(--navy); }
        .nav-card .icon { font-size: 20px; margin-bottom: 10px; }
        .nav-card .title { font-weight: 600; font-size: 15px; margin-bottom: 4px; }
        .nav-card .desc { font-size: 13px; color: var(--ink-soft); }
        .roster-preview { background: #fff; border: 1px solid var(--line); border-radius: 4px; overflow: hidden; }
        .roster-row { display: grid; grid-template-columns: 90px 1fr 100px 90px 110px; align-items: center; padding: 14px 20px; font-size: 14px; border-bottom: 1px solid var(--line); }
        .roster-row:last-child { border-bottom: none; }
        .roster-row.header-row { background: #FAFAFA; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--ink-soft); font-weight: 600; }
        .roster-row .date { color: var(--ink-soft); }
        .roster-row .route { font-weight: 600; }
        .status-pill { display: inline-block; font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 10px; background: var(--success-bg); color: var(--success); width: fit-content; }
        @media (max-width: 720px) {
          .stats-row, .nav-cards { grid-template-columns: 1fr; }
          .roster-row { grid-template-columns: 1fr; gap: 4px; }
          .roster-row.header-row { display: none; }
        }
      `}</style>

      <header>
        <div className="logo">
          <img src="/assets/logo.png" alt="Tunisair logo" />
          <span className="portal-tag">Crew portal</span>
        </div>
        <nav>
          <Link to="/pilot/dashboard" className="active">Dashboard</Link>
          <Link to="/pilot/roster">My roster</Link>
          <Link to="/pilot/profile">Profile</Link>
          <Link to="/">Passenger site</Link>
        </nav>
      </header>

      <main>
        <div className="welcome-row">
          <div>
            <h1 id="welcome-name">Welcome back</h1>
            <p className="sub" id="welcome-role">—</p>
          </div>
          <div className="id-badge">Staff ID: <strong id="staff-id-badge">—</strong></div>
        </div>

        <div className="next-flight" id="next-flight-card"></div>

        <div className="stats-row">
          <div className="stat-card">
            <div className="label">Assigned flights (upcoming)</div>
            <div className="value" id="stat-flight-count">—</div>
          </div>
          <div className="stat-card">
            <div className="label">Aircraft ratings</div>
            <div className="value" id="stat-ratings">—</div>
          </div>
          <div className="stat-card">
            <div className="label">Duty hours this week</div>
            <div className="value" id="stat-duty">—</div>
            <div className="duty-bar"><div className="duty-bar-fill" id="duty-bar-fill"></div></div>
          </div>
        </div>

        <div className="section-title">Quick access</div>
        <div className="nav-cards">
          <Link to="/pilot/roster" className="nav-card">
            <div className="icon">🗓</div>
            <div className="title">My roster</div>
            <div className="desc">All upcoming assigned flights</div>
          </Link>
          <a href="#" className="nav-card" id="current-flight-link">
            <div className="icon">✈</div>
            <div className="title">Current / next flight</div>
            <div className="desc">Details, crew, and status controls</div>
          </a>
          <Link to="/pilot/profile" className="nav-card">
            <div className="icon">🪪</div>
            <div className="title">Profile & duty hours</div>
            <div className="desc">Certifications and rest compliance</div>
          </Link>
        </div>

        <div className="section-title">Upcoming roster</div>
        <div className="roster-preview" id="roster-preview">
          <div className="roster-row header-row">
            <span>Date</span>
            <span>Route</span>
            <span>Flight</span>
            <span>Aircraft</span>
            <span>Status</span>
          </div>
        </div>
      </main>
    </>
  );
}
