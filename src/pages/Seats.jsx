import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Seats() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const seatsNeeded = parseInt(params.get("passengers")) || 1;
    document.getElementById("needed-note").textContent =
      `Select ${seatsNeeded} seat${seatsNeeded > 1 ? "s" : ""} to continue.`;

    const businessRows = [1, 2];
    const economyRows = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
    const businessLetters = ["A", "C", "D", "F"];
    const economyLetters = ["A", "B", "C", "D", "E", "F"];

    const occupiedSeats = new Set([
      "1A", "2D", "5C", "6A", "6B", "8F", "9D", "11A", "11B", "11C", "13E"
    ]);

    const businessPrice = 610;
    const economyPrice = 245;

    const cabinMap = document.getElementById("cabin-map");
    const selected = new Set();

    function seatPrice(seatId) {
      return businessRows.includes(parseInt(seatId)) ? businessPrice : economyPrice;
    }

    function buildRow(rowNum, letters, isBusiness) {
      const row = document.createElement("div");
      row.className = "row" + (isBusiness ? " business" : "");

      const rowLabel = document.createElement("div");
      rowLabel.className = "row-number";
      rowLabel.textContent = rowNum;
      row.appendChild(rowLabel);

      letters.forEach((letter, i) => {
        const seatId = `${rowNum}${letter}`;
        const seat = document.createElement("div");
        seat.className = "seat";
        seat.textContent = letter;
        seat.dataset.seatId = seatId;

        if (occupiedSeats.has(seatId)) {
          seat.classList.add("occupied");
        } else {
          seat.addEventListener("click", () => toggleSeat(seat, seatId));
        }

        row.appendChild(seat);

        const aisleAfter = isBusiness ? 2 : 3;
        if (i === aisleAfter - 1) {
          const gap = document.createElement("div");
          gap.className = "aisle-gap";
          row.appendChild(gap);
        }
      });

      return row;
    }

    function renderCabin() {
      cabinMap.innerHTML = "";

      const bizLabel = document.createElement("div");
      bizLabel.className = "cabin-section-label";
      bizLabel.textContent = "Business";
      cabinMap.appendChild(bizLabel);
      businessRows.forEach((r) => cabinMap.appendChild(buildRow(r, businessLetters, true)));

      const ecoLabel = document.createElement("div");
      ecoLabel.className = "cabin-section-label";
      ecoLabel.textContent = "Economy";
      cabinMap.appendChild(ecoLabel);
      economyRows.forEach((r) => cabinMap.appendChild(buildRow(r, economyLetters, false)));
    }

    function toggleSeat(seatEl, seatId) {
      if (selected.has(seatId)) {
        selected.delete(seatId);
        seatEl.classList.remove("selected");
      } else {
        if (selected.size >= seatsNeeded) {
          const [oldest] = selected;
          selected.delete(oldest);
          document.querySelector(`.seat[data-seat-id="${oldest}"]`)?.classList.remove("selected");
        }
        selected.add(seatId);
        seatEl.classList.add("selected");
      }
      updateSummary();
    }

    function updateSummary() {
      const list = document.getElementById("selected-list");
      const totalEl = document.getElementById("total-price");
      const continueBtn = document.getElementById("continue-btn");

      if (selected.size === 0) {
        list.innerHTML = '<div class="empty">No seats selected yet</div>';
      } else {
        list.innerHTML = "";
        [...selected].sort().forEach((seatId) => {
          const row = document.createElement("div");
          row.className = "selected-row";
          row.innerHTML = `<span class="seat-id">Seat ${seatId}</span><span class="seat-price">$${seatPrice(seatId)}</span>`;
          list.appendChild(row);
        });
      }

      const total = [...selected].reduce((sum, id) => sum + seatPrice(id), 0);
      totalEl.textContent = `$${total}`;
      continueBtn.disabled = selected.size !== seatsNeeded;
    }

    function handleContinue() {
      const nextParams = new URLSearchParams(window.location.search);
      nextParams.set("seats", [...selected].join(","));
      navigate("/passenger-details?" + nextParams.toString());
    }
    document.getElementById("continue-btn").addEventListener("click", handleContinue);

    renderCabin();

    return () => {
      document.getElementById("continue-btn")?.removeEventListener("click", handleContinue);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <style>{`
        :root {
          --paper: #FFFFFF; --ink: #1A1A1A; --ink-soft: #6B6B6B; --brass: #D70218;
          --brass-dark: #A5011A; --line: #E6E0DC; --occupied: #D8D3CC; --business-bg: #FCEBEC;
        }
        * { box-sizing: border-box; }
        body { margin: 0; background: var(--paper); color: var(--ink); font-family: 'Inter', sans-serif; line-height: 1.5; }
        header { padding: 28px 40px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--line); }
        .logo img { height: 60px; width: auto; }
        nav a { color: var(--ink-soft); text-decoration: none; font-size: 14px; margin-left: 28px; }
        main { max-width: 900px; margin: 0 auto; padding: 40px 24px 120px; }
        h1 { font-family: 'Fraunces', serif; font-weight: 500; font-size: 30px; margin: 0 0 4px; }
        .sub { color: var(--ink-soft); font-size: 14px; margin: 0 0 32px; }
        .layout { display: grid; grid-template-columns: 1fr 280px; gap: 32px; align-items: start; }
        .cabin { border: 1px solid var(--line); border-radius: 24px 24px 8px 8px; padding: 24px 24px 32px; position: relative; }
        .cabin-nose { text-align: center; font-size: 11px; color: var(--ink-soft); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 20px; padding-bottom: 12px; border-bottom: 1px dashed var(--line); }
        .cabin-section-label { font-size: 12px; color: var(--brass-dark); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin: 20px 0 10px; }
        .cabin-section-label:first-of-type { margin-top: 0; }
        .row { display: grid; grid-template-columns: 24px 36px 36px 36px 16px 36px 36px 36px; gap: 8px; align-items: center; margin-bottom: 8px; }
        .row.business { grid-template-columns: 24px 44px 44px 16px 44px 44px; }
        .row-number { font-size: 11px; color: var(--ink-soft); text-align: right; }
        .aisle-gap { width: 100%; }
        .seat { width: 36px; height: 36px; border-radius: 6px 6px 10px 10px; border: 1px solid var(--line); background: #FAFAFA; display: flex; align-items: center; justify-content: center; font-size: 11px; color: var(--ink-soft); cursor: pointer; transition: all 0.12s ease; }
        .row.business .seat { width: 44px; height: 40px; background: var(--business-bg); }
        .seat:hover:not(.occupied):not(.selected) { border-color: var(--brass-dark); color: var(--brass-dark); }
        .seat.occupied { background: var(--occupied); color: #A8A29B; cursor: not-allowed; border-color: var(--occupied); }
        .seat.selected { background: var(--brass); border-color: var(--brass-dark); color: #fff; }
        .summary-panel { border: 1px solid var(--line); border-radius: 4px; padding: 24px; position: sticky; top: 24px; }
        .summary-panel h2 { font-family: 'Fraunces', serif; font-size: 18px; font-weight: 500; margin: 0 0 16px; }
        .legend { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; font-size: 13px; color: var(--ink-soft); }
        .legend-item { display: flex; align-items: center; gap: 10px; }
        .legend-swatch { width: 18px; height: 18px; border-radius: 4px 4px 6px 6px; border: 1px solid var(--line); }
        .legend-swatch.available { background: #FAFAFA; }
        .legend-swatch.occupied { background: var(--occupied); border-color: var(--occupied); }
        .legend-swatch.selected { background: var(--brass); border-color: var(--brass-dark); }
        .selected-list { border-top: 1px solid var(--line); padding-top: 16px; margin-bottom: 16px; min-height: 24px; }
        .selected-list .empty { font-size: 13px; color: var(--ink-soft); }
        .selected-row { display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 8px; }
        .selected-row .seat-id { font-weight: 600; }
        .selected-row .seat-price { color: var(--ink-soft); }
        .total-row { display: flex; justify-content: space-between; align-items: baseline; border-top: 1px solid var(--line); padding-top: 14px; margin-bottom: 20px; }
        .total-row .label { font-size: 13px; color: var(--ink-soft); }
        .total-row .value { font-family: 'Fraunces', serif; font-size: 24px; color: var(--brass-dark); }
        .needed-note { font-size: 12px; color: var(--ink-soft); margin-bottom: 16px; }
        .continue-btn { width: 100%; background: var(--brass); color: #fff; border: none; border-radius: 3px; padding: 14px; font-family: 'Inter', sans-serif; font-weight: 600; font-size: 15px; cursor: pointer; }
        .continue-btn:disabled { background: var(--occupied); color: #A8A29B; cursor: not-allowed; }
        .continue-btn:not(:disabled):hover { background: var(--brass-dark); }
        @media (max-width: 720px) {
          .layout { grid-template-columns: 1fr; }
          .summary-panel { position: static; }
          .row { grid-template-columns: 20px 30px 30px 30px 14px 30px 30px 30px; gap: 6px; }
          .row.business { grid-template-columns: 20px 38px 38px 14px 38px 38px; }
          .seat { width: 30px; height: 30px; font-size: 10px; }
          .row.business .seat { width: 38px; height: 34px; }
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
        <h1>Choose your seats</h1>
        <p className="sub" id="flight-sub">Flight TU 101 · TUN → CDG</p>

        <div className="layout">
          <div className="cabin">
            <div className="cabin-nose">Front of aircraft</div>
            <div id="cabin-map"></div>
          </div>

          <div className="summary-panel">
            <h2>Your selection</h2>

            <div className="legend">
              <div className="legend-item"><span className="legend-swatch available"></span> Available</div>
              <div className="legend-item"><span className="legend-swatch selected"></span> Selected</div>
              <div className="legend-item"><span className="legend-swatch occupied"></span> Occupied</div>
            </div>

            <p className="needed-note" id="needed-note"></p>

            <div className="selected-list" id="selected-list">
              <div className="empty">No seats selected yet</div>
            </div>

            <div className="total-row">
              <span className="label">Total</span>
              <span className="value" id="total-price">$0</span>
            </div>

            <button className="continue-btn" id="continue-btn" disabled>Continue</button>
          </div>
        </div>
      </main>
    </>
  );
}
