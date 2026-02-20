import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

function UGChoice() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h3>What do you want to focus on?</h3>

        <button
          className="btn btn-primary mt-3 me-3"
          onClick={() =>
            navigate("/test", {
              state: { category: "UG", track: "upskill" }
            })
          }
        >
          Upskilling
        </button>

        <button
          className="btn btn-success mt-3"
          onClick={() =>
            navigate("/test", {
              state: { category: "UG", track: "career" }
            })
          }
        >
          Career Path
        </button>
      </div>
    </>
  );
}

export default UGChoice;
