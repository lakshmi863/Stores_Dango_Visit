// C:\Users\Lenovo\Desktop\React and Django\Frontend\src\App.js

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateActivity from "./pages/CreateActivity";
import PrivateRoute from "./components/PrivateRoute";
import TodaysTasks from "./pages/TodaysTasks"; // <-- 1. MAKE SURE THIS IMPORT IS HERE
import LiveMap from "./pages/LiveMap"; 

function App() {
  return (
    <Router>
      <div className="bg-gray-100 min-h-screen">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create-activity" element={<CreateActivity />} />
            {/* THIS IS THE MISSING LINE */}
            <Route path="/tasks" element={<TodaysTasks />} /> 
            
            <Route path="/live-map" element={<LiveMap />} />{/* <-- 2. ADD THIS LINE */}
          </Route>

        </Routes>
      </div>
    </Router>
  );
}

export default App;