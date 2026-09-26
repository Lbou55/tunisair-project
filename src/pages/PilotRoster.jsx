import { useEffect } from "react";
import { Link } from "react-router-dom";
import { currentCrewMember, rosterFlights } from "../data/crewData.js";

export default function PilotRoster() {
  useEffect(() => {
    const rosterList = document.getElementById("roster-list");

    function monthAbbrev(dateStr) {
      const d = new Date(dateStr + "T00:00:00");
      return d.toLocaleString("en-US", { month: "short" }).toUpperCase();
    }
    function dayNum(dateStr) {
      return new Date(dateStr + "T00:00:00").getDate();
    }
    function myRoleOn(flight) {
      const entry = flight.crew.find(
        (c) => c.name === `${currentCrewMember.firstName} ${currentCrewMember.lastName}`
      );
      return entry ? entry.role : currentCrewMember.role;
    }

    function render(filter) {
      rosterList.innerHTML = "";
      const flights = filter === "all" ? rosterFlights : rosterFlights.filter((f) => f.status === filter);

      if (flights.length === 0) {
        rosterList.innerHTML = `<div class="empty-state">No flights in this category.</div>`;
        return;
      }

      flights.forEach((f) => {
        const card = document.createElement("a");
        card.href = `/pilot/flight?id=${f.id}`;
        card.className = "roster-card";
        card.innerHTML = `
          <div class="rc-date">
            <div class="day">${dayNum(f.date)}</div>
            <div class="month">${monthAbbrev(f.date)}</div>
          </div>
          <div>
            <div class="rc-route">${f.origin} → ${f.destination}</div>
            <div class="rc-meta">${f.flightNumber} · ${f.aircraft} · Dep ${f.depTime} · Gate ${f.gate}</div>
          </div>
          <div class="rc-role">${myRoleOn(f)}</div>
          <div class="status-pill ${f.status}">${f.status}</div>
        `;
        rosterList.appendChild(card);
      });
    }

    function handleFilterClick(e) {
      const pill = e.target.closest(".filter-pill");
      if (!pill) return;
      document.querySelectorAll(".filter-pill").forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      render(pill.dataset.filter);
    }
    const filterRow = document.getElementById("filter-row");
    filterRow.addEventListener("click", handleFilterClick);

    render("all");

    return () => filterRow.removeEventListener("click", handleFilterClick);
  }, []);

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
        h1 { font-family: 'Fraunces', serif; font-weight: 500; font-size: 28px; margin: 0 0 4px; }
        .sub { color: var(--ink-soft); font-size: 14px; margin: 0 0 28px; }
        .filter-row { display: flex; gap: 10px; margin-bottom: 20px; }
        .filter-pill { border: 1px solid var(--line); background: #fff; border-radius: 20px; padding: 7px 16px; font-size: 13px; color: var(--ink-soft); cursor: pointer; }
        .filter-pill.active { background: var(--navy); border-color: var(--navy); color: #fff; font-weight: 600; }
        .roster-list { display: flex; flex-direction: column; gap: 12px; }
        .roster-card { background: #fff; border: 1px solid var(--line); border-radius: 4px; padding: 20px 24px; display: grid; grid-template-columns: 90px 1fr auto auto; align-items: center; gap: 20px; text-decoration: none; color: var(--ink); transition: border-color 0.12s ease; }
        .roster-card:hover { border-color: var(--navy); }
        .rc-date .day { font-family: 'Fraunces', serif; font-size: 20px; }
        .rc-date .month { font-size: 11px; color: var(--ink-soft); text-transform: uppercase; }
        .rc-route { font-weight: 600; font-size: 16px; margin-bottom: 4px; }
        .rc-meta { font-size: 13px; color: var(--ink-soft); }
        .rc-role { font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 3px; background: #FCEBEC; color: var(--brass-dark); white-space: nowrap; }
        .status-pill { display: inline-block; font-size: 11px; font-weight: 600; padding: 4px 12px; border-radius: 10px; white-space: nowrap; }
        .status-pill.scheduled { background: var(--success-bg); color: var(--success); }
        .status-pill.delayed { background: var(--warn-bg); color: var(--warn); }
        .status-pill.departed { background: var(--muted-bg); color: var(--ink-soft); }
        .empty-state { text-align: center; padding: 60px 20px; color: var(--ink-soft); }
        @media (max-width: 640px) {
          .roster-card { grid-template-columns: 60px 1fr; }
          .rc-role, .status-pill { grid-column: 2; justify-self: start; margin-top: 6px; }
        }
      `}</style>

      <header>
        <div className="logo">
          <img src="/assets/logo.png" alt="Tunisair logo" />
          <span className="portal-tag">Crew portal</span>
        </div>
        <nav>
          <Link to="/pilot/dashboard">Dashboard</Link>
          <Link to="/pilot/roster" className="active">My roster</Link>
          <Link to="/pilot/profile">Profile</Link>
          <Link to="/">Passenger site</Link>
        </nav>
      </header>

      <main>
        <h1>My roster</h1>
        <p className="sub">All flights you're currently assigned to.</p>

        <div className="filter-row" id="filter-row">
          <div className="filter-pill active" data-filter="all">All</div>
          <div className="filter-pill" data-filter="scheduled">Scheduled</div>
          <div className="filter-pill" data-filter="delayed">Delayed</div>
          <div className="filter-pill" data-filter="departed">Departed</div>
        </div>

        <div className="roster-list" id="roster-list"></div>
      </main>
    </>
  );
}
