import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Results from "./pages/Results.jsx";
import Seats from "./pages/Seats.jsx";
import PassengerDetails from "./pages/PassengerDetails.jsx";
import Payment from "./pages/Payment.jsx";
import Confirmation from "./pages/Confirmation.jsx";
import PilotDashboard from "./pages/PilotDashboard.jsx";
import PilotRoster from "./pages/PilotRoster.jsx";
import PilotFlightDetail from "./pages/PilotFlightDetail.jsx";
import PilotProfile from "./pages/PilotProfile.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/results" element={<Results />} />
        <Route path="/seats" element={<Seats />} />
        <Route path="/passenger-details" element={<PassengerDetails />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/pilot/dashboard" element={<PilotDashboard />} />
        <Route path="/pilot/roster" element={<PilotRoster />} />
        <Route path="/pilot/flight" element={<PilotFlightDetail />} />
        <Route path="/pilot/profile" element={<PilotProfile />} />
      </Routes>
    </BrowserRouter>
  );
}
