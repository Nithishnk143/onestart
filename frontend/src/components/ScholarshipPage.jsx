import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "./Navbar";

function ScholarshipPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { name, degree, caste, gender } = state || {};

  const [scholarships, setScholarships] = useState([]);

  useEffect(() => {
    if (!degree || !caste || !gender) {
      navigate("/scholarship-filter");
      return;
    }

    API.post("/scholarships/filter", { degree })
      .then(res => setScholarships(res.data))
      .catch(err => console.log(err));
  }, [degree, caste, gender, navigate]);

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h3>
          🎓 Scholarships for {degree} ({caste}, {gender})
        </h3>

        {name && <p>Hello {name} 👋</p>}

        {scholarships.length === 0 && (
          <p>No matching scholarships found.</p>
        )}

        <div className="row">
          {scholarships.map((s) => (
            <div className="col-md-4 mb-4" key={s._id}>
              <div className="card shadow h-100">
                <div className="card-body">
                  <h5>{s.name}</h5>
                  <p><b>Eligibility:</b> {s.eligibility}</p>
                  <p><b>Amount:</b> {s.amount}</p>
                  <p>
                    <b>Deadline:</b>{" "}
                    {new Date(s.deadline).toDateString()}
                  </p>

                  <a
                    href={s.applyLink}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary btn-sm"
                  >
                    Apply Now
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default ScholarshipPage;
