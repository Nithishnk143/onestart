import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/signup", { name, email, password });
      navigate("/");
    } catch {
      alert("Signup failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card shadow-lg">
        {/* LEFT IMAGE */}
        <div className="auth-image">
          <img
            src="https://www.shutterstock.com/image-vector/reaching-success-people-logo-icon-600nw-2617607515.jpg"
            alt="signup"
          />
        </div>

        {/* RIGHT FORM */}
        <div className="auth-form">
          <h3 className="fw-bold mb-3">Create Account 🚀</h3>
          <p className="text-muted mb-4">
            Join CareerAI and discover your future path
          </p>

          <form onSubmit={handleSignup}>
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              type="email"
              className="form-control mb-3"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              className="form-control mb-4"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button className="btn btn-success w-100">
              Sign Up
            </button>
          </form>

          <p className="text-center mt-3">
            Already have an account?{" "}
            <Link to="/">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
