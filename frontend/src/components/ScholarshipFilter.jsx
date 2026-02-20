import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

function ScholarshipFilter() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [degree, setDegree] = useState("");
  const [caste, setCaste] = useState("");
  const [gender, setGender] = useState("");

  const submitDetails = () => {
    if (!degree || !caste || !gender) {
      alert("Please select degree, caste, and gender");
      return;
    }

    navigate("/scholarships", {
      state: { name, degree, caste, gender }
    });
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h3>🎓 Find Suitable Scholarships</h3>

        <input
          className="form-control mb-3"
          placeholder="Your Name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <select
          className="form-control mb-3"
          value={degree}
          onChange={(e) => setDegree(e.target.value)}
        >
          <option value="">Select Degree</option>
          <option value="10th">10th</option>
          <option value="12th">12th</option>
          <option value="UG">UG</option>
          <option value="PG">PG</option>
        </select>

        <select
          className="form-control mb-4"
          value={caste}
          onChange={(e) => setCaste(e.target.value)}
        >
          <option value="">Select Caste</option>
          <option value="SC">SC</option>
          <option value="ST">ST</option>
          <option value="OBC">OBC</option>
          <option value="BC">BC</option>
          <option value="MBC">MBC</option>
          <option value="General">General</option>
        </select>
        
        <select
          className="form-control mb-4"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <button className="btn btn-success" onClick={submitDetails}>
          Find Scholarships
        </button>
      </div>
    </>
  );
}

export default ScholarshipFilter;
