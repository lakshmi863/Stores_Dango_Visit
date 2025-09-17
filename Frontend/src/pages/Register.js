import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
 // const [role, setRole] = useState("employee"); // default role
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      // THIS URL IS NOW CORRECTED
      await axios.post("https://stores-dango-visit-backend.onrender.com/accounts/register/", {
        name,
        email,
        password,
        
      });
      setSuccess("Registration successful! Redirecting to login...");
      // Redirect to the login page after a short delay
      setTimeout(() => navigate("/login"), 2000); 
    } catch (error) {
      // Provide better feedback on failure
      const errorMessage = error.response?.data?.email?.[0] || "Registration failed. Please check your details.";
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-extrabold text-center text-gray-900">Create a New Account</h2>
        
        <form onSubmit={handleRegister} className="space-y-6">
          {error && <p className="text-sm text-center text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
          {success && <p className="text-sm text-center text-green-600 bg-green-100 p-3 rounded-md">{success}</p>}
          
          <div>
            <label className="text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700">Role</label>
            <select disabled className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm bg-gray-100">
              <option value="employee">Employee</option>
            </select>
          </div>
          
          <button type="submit" className="w-full py-2 px-4 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors">
            Register
          </button>
        </form>
         <p className="text-sm text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;