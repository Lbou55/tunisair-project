import { useEffect } from "react";
import { Link } from "react-router-dom";
import { currentCrewMember, rosterFlights } from "../data/crewData.js";

export default function PilotProfile() {
  useEffect(() => {
    const c = currentCrewMember;

    document.getElementById("avatar-initials").textContent = (c.firstName[0] + c.lastName[0]).toUpperCase();
    document.getElementById("profile-name").textContent = `${c.firstName} ${c.lastName}`;
    document.getElementById("profile-role").textContent = c.role;
    document.getElementById("profile-staff-id").textContent = c.staffId;
    document.getElementById("cert-role").textContent = c.role;

    const ratingTags = document.getElementById("rating-tags");
    c.aircraftRating.forEach((r) => {
      const tag = document.createElement("span");
      tag.className = "rating-tag";
      tag.textContent = r;
      ratingTags.appendChild(tag);
    });

    const pct = Math.round((c.dutyHoursThisWeek / c.dutyHoursLimit) * 100);
    document.getElementById("duty-value").textContent = `${c.dutyHoursThisWeek}h`;
    document.getElementById("duty-limit").textContent = `of ${c.dutyHoursLimit}h weekly limit`;

    const fill = document.getElementById("duty-bar-fill");
    fill.style.width = pct + "%";

    const note = document.getElementById("compliance-note");
    if (pct < 85) {
      fill.style.background = "var(--success)";
      note.className = "compliance-note ok";
      note.textContent = `✓ Within limits — ${c.dutyHoursLimit - c.dutyHoursThisWeek}h remaining this week.`;
    } else {
      fill.style.background = "var(--warn)";
      note.className = "compliance-note warn";
      note.textContent = `⚠ Approaching weekly duty limit — plan rest accordingly.`;
    }

    const logContainer = document.getElementById("flight-log");
    [...rosterFlights].reverse().forEach((f) => {
      const row = document.createElement("div");
      row.className = "log-row";
      row.innerHTML = `
        <span>${f.date} · ${f.origin} → ${f.destination}</span>
        <span class="flight-ref">${f.flightNumber}</span>
      `;
      logContainer.appendChild(row);
    });
  }, []);

  return (
    <>
      <style>{`
        :root {
          --paper: #FFFFFF; --ink: #1A1A1A; --ink-soft: #6B6B6B; --brass: #D70218;
          --brass-dark: #A5011A; --line: #E6E0DC; --navy: #1A2438; --success: #1F7A3F;
          --success-bg: #EAF6EE; --warn: #C98A00; --warn-bg: #FBF2E0; --danger: #A5011A; --danger-bg: #FCEBEC;
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
        main { max-width: 820px; margin: 0 auto; padding: 40px 24px 100px; }
        h1 { font-family: 'Fraunces', serif; font-weight: 500; font-size: 28px; margin: 0 0 4px; }
        .sub { color: var(--ink-soft); font-size: 14px; margin: 0 0 28px; }
        .profile-header { display: flex; align-items: center; gap: 20px; background: #fff; border: 1px solid var(--line); border-radius: 4px; padding: 24px; margin-bottom: 20px; }
        .avatar { width: 64px; height: 64px; border-radius: 50%; background: var(--navy); color: #fff; display: flex; align-items: center; justify-content: center; font-family: 'Fraunces', serif; font-size: 22px; flex-shrink: 0; }
        .profile-header h2 { font-family: 'Fraunces', serif; font-size: 20px; font-weight: 500; margin: 0 0 4px; }
        .profile-header .role-line { font-size: 13px; color: var(--ink-soft); }
        .profile-header .staff-id { margin-left: auto; font-size: 13px; color: var(--ink-soft); text-align: right; }
        .profile-header .staff-id strong { color: var(--ink); display: block; font-size: 14px; }
        .card { background: #fff; border: 1px solid var(--line); border-radius: 4px; padding: 24px; margin-bottom: 20px; }
        .card h2 { font-family: 'Fraunces', serif; font-size: 17px; font-weight: 500; margin: 0 0 18px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
        .info-item .label { font-size: 11px; color: var(--ink-soft); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
        .info-item .value { font-size: 15px; }
        .rating-tags { display: flex; gap: 8px; flex-wrap: wrap; }
        .rating-tag { font-size: 13px; font-weight: 600; background: var(--danger-bg); color: var(--brass-dark); padding: 5px 12px; border-radius: 3px; }
        .duty-summary { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 10px; }
        .duty-summary .value { font-family: 'Fraunces', serif; font-size: 26px; }
        .duty-summary .limit { font-size: 13px; color: var(--ink-soft); }
        .duty-bar { height: 8px; background: #F1EFEA; border-radius: 4px; overflow: hidden; margin-bottom: 10px; }
        .duty-bar-fill { height: 100%; }
        .compliance-note { font-size: 13px; display: flex; align-items: center; gap: 8px; padding: 10px 14px; border-radius: 4px; }
        .compliance-note.ok { background: var(--success-bg); color: var(--success); }
        .compliance-note.warn { background: var(--warn-bg); color: var(--warn); }
        .log-row { display: flex; justify-content: space-between; font-size: 14px; padding: 10px 0; border-bottom: 1px solid var(--line); }
        .log-row:last-child { border-bottom: none; }
        .log-row .flight-ref { color: var(--ink-soft); }
      `}</style>

      <header>
        <div className="logo">
          <img src="/assets/logo.png" alt="Tunisair logo" />
          <span className="portal-tag">Crew portal</span>
        </div>
        <nav>
          <Link to="/pilot/dashboard">Dashboard</Link>
          <Link to="/pilot/roster">My roster</Link>
          <Link to="/pilot/profile" className="active">Profile</Link>
          <Link to="/">Passenger site</Link>
        </nav>
      </header>

      <main>
        <h1>Profile & duty hours</h1>
        <p className="sub">Your certifications and rest-hour compliance.</p>

        <div className="profile-header">
          <div className="avatar" id="avatar-initials">—</div>
          <div>
            <h2 id="profile-name">—</h2>
            <div className="role-line" id="profile-role">—</div>
          </div>
          <div className="staff-id">
            Staff ID
            <strong id="profile-staff-id">—</strong>
          </div>
        </div>

        <div className="card">
          <h2>Certifications</h2>
          <div className="info-grid">
            <div className="info-item">
              <div className="label">Aircraft type ratings</div>
              <div className="rating-tags" id="rating-tags"></div>
            </div>
            <div className="info-item">
              <div className="label">Role</div>
              <div className="value" id="cert-role">—</div>
            </div>
          </div>
        </div>

        <div className="card">
          <h2>Duty hours this week</h2>
          <div className="duty-summary">
            <span className="value" id="duty-value">—</span>
            <span className="limit" id="duty-limit">—</span>
          </div>
          <div className="duty-bar"><div className="duty-bar-fill" id="duty-bar-fill"></div></div>
          <div className="compliance-note" id="compliance-note"></div>
        </div>

        <div className="card">
          <h2>Recent flight log</h2>
          <div id="flight-log"></div>
        </div>
      </main>
    </>
  );
}
