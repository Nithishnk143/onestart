import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.user._id);
      localStorage.setItem("role", res.data.user.role);
      navigate("/category");
    } catch {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card shadow-lg">
        {/* LEFT IMAGE */}
        <div className="auth-image">
          <img
            src="https://thumbs.dreamstime.com/b/education-compass-guiding-your-academic-journey-career-path-symbolic-design-representing-guidance-combining-graduation-cap-375951988.jpg"
            alt="login"
          />
        </div>

        {/* RIGHT FORM */}
        <div className="auth-form">
          <h3 className="fw-bold mb-3">Welcome Back 👋</h3>
          <p className="text-muted mb-4">
            Login to continue your AI-powered career journey
          </p>

          <form onSubmit={handleLogin}>
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

            <button className="btn btn-primary w-100">
              Login
            </button>
          </form>

          <p className="text-center mt-3">
            Don’t have an account?{" "}
            <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
