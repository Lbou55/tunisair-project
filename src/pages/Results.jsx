import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { sampleFlights } from "../data/flightsData.js";

export default function Results() {
  const navigate = useNavigate();

  useEffect(() => {
    let flights = [...sampleFlights];

    const flightList = document.getElementById("flight-list");
    const resultCount = document.getElementById("result-count");
    const sortSelect = document.getElementById("sort-select");
    const summaryDetails = document.getElementById("summary-details");

    function formatDuration(minutes) {
      const h = Math.floor(minutes / 60);
      const m = minutes % 60;
      return `${h}h ${m.toString().padStart(2, "0")}m`;
    }
    function stopsLabel(stops) {
      if (stops === 0) return "Direct";
      if (stops === 1) return "1 stop";
      return `${stops} stops`;
    }

    function renderFlights(list) {
      flightList.innerHTML = "";

      if (list.length === 0) {
        flightList.innerHTML = `
          <div class="empty-state">
            <div class="icon">✈</div>
            <div>No flights found for this search.</div>
            <div>Try a different date or route.</div>
          </div>`;
        resultCount.innerHTML = `<strong>0</strong> flights found`;
        return;
      }

      resultCount.innerHTML = `<strong>${list.length}</strong> flight${list.length > 1 ? "s" : ""} found`;

      list.forEach((f) => {
        const card = document.createElement("div");
        card.className = "flight-card";
        card.innerHTML = `
          <div class="flight-times">
            <div class="time-block">
              <div class="time">${f.depTime}</div>
              <div class="code">${f.origin}</div>
            </div>
            <div class="flight-path">
              <div class="duration">${formatDuration(f.durationMinutes)}</div>
              <div class="line"></div>
              <div class="stops">${stopsLabel(f.stops)}</div>
            </div>
            <div class="time-block">
              <div class="time">${f.arrTime}</div>
              <div class="code">${f.destination}</div>
            </div>
          </div>
          <div class="flight-meta">
            <div class="airline">${f.airline} · ${f.flightNumber}</div>
            <div class="${f.seatsLeft <= 5 ? "seats-low" : ""}">${f.seatsLeft} seat${f.seatsLeft === 1 ? "" : "s"} left</div>
          </div>
          <div class="flight-price-col">
            <div class="flight-cabin">${f.cabin}</div>
            <div class="flight-price">$${f.price}</div>
            <button class="select-btn" data-flight-id="${f.id}">Select</button>
          </div>
        `;
        flightList.appendChild(card);
      });

      flightList.querySelectorAll(".select-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const flightId = btn.dataset.flightId;
          const flight = list.find((f) => f.id === flightId);

          const nextParams = new URLSearchParams(window.location.search);
          nextParams.set("flightId", flightId);
          nextParams.set("flight", flight.flightNumber);
          nextParams.set("cabin", flight.cabin);
          nextParams.set("subtotal", flight.price * (parseInt(nextParams.get("passengers")) || 1));

          navigate("/seats?" + nextParams.toString());
        });
      });
    }

    function sortFlights(criteria) {
      const sorted = [...flights];
      if (criteria === "price") {
        sorted.sort((a, b) => a.price - b.price);
      } else if (criteria === "duration") {
        sorted.sort((a, b) => a.durationMinutes - b.durationMinutes);
      }
      renderFlights(sorted);
    }

    function handleSortChange(e) {
      sortFlights(e.target.value);
    }
    sortSelect.addEventListener("change", handleSortChange);

    const params = new URLSearchParams(window.location.search);
    const origin = params.get("origin") || "TUN";
    const destination = params.get("destination") || "CDG";
    const date = params.get("departDate") || "";
    const passengers = params.get("passengers") || "1";
    const cabin = params.get("cabin") || "economy";

    document.getElementById("summary-route").textContent = `${origin} → ${destination}`;
    summaryDetails.textContent = `${date || "Any date"} · ${passengers} passenger${passengers > 1 ? "s" : ""} · ${cabin}`;

    sortFlights("price");

    return () => sortSelect.removeEventListener("change", handleSortChange);
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
        main { max-width: 820px; margin: 0 auto; padding: 40px 24px 100px; }
        .summary-bar { display: flex; align-items: center; justify-content: space-between; background: #FAFAFA; border: 1px solid var(--line); border-radius: 4px; padding: 16px 20px; margin-bottom: 32px; flex-wrap: wrap; gap: 12px; }
        .summary-route { font-family: 'Fraunces', serif; font-size: 19px; }
        .summary-details { color: var(--ink-soft); font-size: 13px; margin-top: 2px; }
        .edit-search { color: var(--brass-dark); text-decoration: none; font-size: 14px; font-weight: 600; border: 1px solid var(--brass-dark); padding: 8px 16px; border-radius: 3px; white-space: nowrap; }
        .edit-search:hover { background: var(--brass-dark); color: #fff; }
        .controls-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
        .result-count { font-size: 14px; color: var(--ink-soft); }
        .result-count strong { color: var(--ink); }
        .sort-control { display: flex; align-items: center; gap: 8px; font-size: 14px; color: var(--ink-soft); }
        .sort-control select { font-family: 'Inter', sans-serif; font-size: 14px; padding: 8px 10px; border: 1px solid var(--line); border-radius: 3px; background: #fff; color: var(--ink); }
        .sort-control select:focus { outline: none; border-color: var(--brass-dark); }
        #flight-list { display: flex; flex-direction: column; gap: 14px; }
        .flight-card { display: grid; grid-template-columns: 1fr auto auto; align-items: center; gap: 20px; background: #FFFFFF; border: 1px solid var(--line); border-radius: 4px; padding: 20px 24px; position: relative; overflow: hidden; }
        .flight-card::before { content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: var(--brass); }
        .flight-times { display: flex; align-items: center; gap: 16px; }
        .time-block { text-align: center; }
        .time-block .time { font-family: 'Fraunces', serif; font-size: 20px; }
        .time-block .code { font-size: 12px; color: var(--ink-soft); }
        .flight-path { display: flex; flex-direction: column; align-items: center; min-width: 90px; }
        .flight-path .duration { font-size: 12px; color: var(--ink-soft); margin-bottom: 4px; }
        .flight-path .line { width: 100%; height: 1px; background: var(--line); position: relative; }
        .flight-path .line::after { content: "✈"; position: absolute; right: -2px; top: -8px; font-size: 12px; color: var(--brass-dark); }
        .flight-path .stops { font-size: 11px; color: var(--ink-soft); margin-top: 4px; }
        .flight-meta { font-size: 12px; color: var(--ink-soft); }
        .flight-meta .airline { font-weight: 600; color: var(--ink); }
        .seats-low { color: var(--danger); font-weight: 600; }
        .flight-price-col { text-align: right; }
        .flight-price { font-family: 'Fraunces', serif; font-size: 24px; color: var(--brass-dark); }
        .flight-cabin { font-size: 12px; color: var(--ink-soft); text-transform: capitalize; margin-bottom: 6px; }
        .select-btn { margin-top: 8px; background: var(--brass); color: #fff; border: none; border-radius: 3px; padding: 9px 18px; font-family: 'Inter', sans-serif; font-weight: 600; font-size: 13px; cursor: pointer; }
        .select-btn:hover { background: var(--brass-dark); }
        .empty-state { text-align: center; padding: 60px 20px; color: var(--ink-soft); }
        .empty-state .icon { font-size: 32px; margin-bottom: 12px; }
        @media (max-width: 640px) {
          .flight-card { grid-template-columns: 1fr; text-align: left; }
          .flight-price-col { text-align: left; }
          .controls-row { flex-direction: column; align-items: flex-start; gap: 12px; }
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
        <div className="summary-bar">
          <div>
            <div className="summary-route" id="summary-route">TUN → CDG</div>
            <div className="summary-details" id="summary-details">Loading search details…</div>
          </div>
          <Link to="/" className="edit-search">Edit search</Link>
        </div>

        <div className="controls-row">
          <div className="result-count" id="result-count">Searching…</div>
          <div className="sort-control">
            <label htmlFor="sort-select">Sort by</label>
            <select id="sort-select">
              <option value="price">Price (lowest first)</option>
              <option value="duration">Duration (shortest first)</option>
            </select>
          </div>
        </div>

        <div id="flight-list"></div>
      </main>
    </>
  );
}
