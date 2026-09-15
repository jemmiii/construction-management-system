import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Workers from "./pages/Workers";
import Sites from "./pages/Sites";
import Assignments from "./pages/Assignments";
import Attendance from "./pages/Attendance";
import AttendanceHistory from "./pages/AttendanceHistory";
import AssignmentHistory from "./pages/AssignmentHistory";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/workers" element={<Workers />} />
        <Route path="/sites" element={<Sites />} />
        <Route path="/assignments" element={<Assignments />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route
  path="/attendance-history"
  element={<AttendanceHistory />}
/>
<Route
  path="/assignment-history"
  element={<AssignmentHistory />}
/>
      </Routes>
      
    </BrowserRouter>
  );
}

export default App;