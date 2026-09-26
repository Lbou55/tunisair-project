// Placeholder crew + roster data.
// Later this comes from the Pilot, FlightCrew, and Flight tables via the API.

const currentCrewMember = {
  staffId: "TU-PLT-0412",
  firstName: "Amine",
  lastName: "Cherif",
  role: "Captain",
  aircraftRating: ["A320", "A319"],
  dutyHoursThisWeek: 18,
  dutyHoursLimit: 35
};

const rosterFlights = [
  {
    id: "TU101",
    flightNumber: "TU 101",
    origin: "TUN",
    destination: "CDG",
    date: "2026-09-18",
    depTime: "08:15",
    arrTime: "10:45",
    aircraft: "A320",
    status: "scheduled",
    gate: "B12",
    crew: [
      { name: "Amine Cherif", role: "Captain" },
      { name: "Salma Trabelsi", role: "First Officer" },
      { name: "Yosra Ben Salah", role: "Cabin Crew" },
      { name: "Karim Ayari", role: "Cabin Crew" }
    ],
    passengerCount: 142,
    capacity: 180
  },
  {
    id: "TU305",
    flightNumber: "TU 305",
    origin: "TUN",
    destination: "IST",
    date: "2026-09-19",
    depTime: "19:00",
    arrTime: "21:35",
    aircraft: "A319",
    status: "scheduled",
    gate: "A4",
    crew: [
      { name: "Amine Cherif", role: "Captain" },
      { name: "Nour Gharbi", role: "First Officer" },
      { name: "Rania Mejri", role: "Cabin Crew" }
    ],
    passengerCount: 98,
    capacity: 144
  },
  {
    id: "TU410",
    flightNumber: "TU 410",
    origin: "TUN",
    destination: "FCO",
    date: "2026-09-22",
    depTime: "06:00",
    arrTime: "07:40",
    aircraft: "A320",
    status: "scheduled",
    gate: "B7",
    crew: [
      { name: "Amine Cherif", role: "Captain" },
      { name: "Salma Trabelsi", role: "First Officer" },
      { name: "Yosra Ben Salah", role: "Cabin Crew" }
    ],
    passengerCount: 110,
    capacity: 180
  }
];
