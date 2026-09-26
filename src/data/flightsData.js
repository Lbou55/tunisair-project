// Placeholder flight data.
// Replace this array later with data fetched from /api/v1/flights/search.
// Each flight object shape is what Results.jsx expects — keep this shape
// when you wire up the real API.

export const sampleFlights = [
  {
    id: "TU101",
    airline: "Tunisair",
    flightNumber: "TU 101",
    origin: "TUN",
    destination: "CDG",
    depTime: "08:15",
    arrTime: "10:45",
    durationMinutes: 150,
    stops: 0,
    cabin: "economy",
    price: 245,
    seatsLeft: 4
  },
  {
    id: "TU203",
    airline: "Tunisair",
    flightNumber: "TU 203",
    origin: "TUN",
    destination: "CDG",
    depTime: "13:30",
    arrTime: "17:20",
    durationMinutes: 230,
    stops: 1,
    cabin: "economy",
    price: 189,
    seatsLeft: 11
  },
  {
    id: "TU305",
    airline: "Tunisair",
    flightNumber: "TU 305",
    origin: "TUN",
    destination: "CDG",
    depTime: "19:00",
    arrTime: "21:35",
    durationMinutes: 155,
    stops: 0,
    cabin: "business",
    price: 610,
    seatsLeft: 2
  },
  {
    id: "TU410",
    airline: "Tunisair",
    flightNumber: "TU 410",
    origin: "TUN",
    destination: "CDG",
    depTime: "06:00",
    arrTime: "11:10",
    durationMinutes: 310,
    stops: 1,
    cabin: "economy",
    price: 165,
    seatsLeft: 22
  }
];
