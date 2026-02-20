import { useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="navbar px-4 shadow"
     style={{
       background: "linear-gradient(90deg, #11998e, #38ef7d)"
     }}>
      <span className="navbar-brand text-white fw-bold" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
        🎓 CareerAI
      </span>
      {token && (
        <div className="navbar-links">
          <button className="nav-link text-white" onClick={() => navigate("/category")}>
            Career Test
          </button>
          <button className="nav-link text-white" onClick={() => window.open("https://handsome-skill-path-go.base44.app", "_blank")}>
            Roadmap
          </button>
          <button className="nav-link text-white" onClick={() => navigate("/scholarships")}>
            Scholarships
          </button>
          <button className="btn btn-light btn-sm" onClick={logout}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
