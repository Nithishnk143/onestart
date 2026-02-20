import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "./Navbar";

function AdminScholarship() {
  const [link, setLink] = useState("");
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Load all scholarships (admin view)
  const loadScholarships = async () => {
    try {
      const res = await API.get("/scholarships/admin/all");
      setScholarships(res.data);
    } catch {
      alert("Failed to load scholarships");
    }
  };

  useEffect(() => {
    loadScholarships();
  }, []);

  // Extract scholarship from link
  const extractScholarship = async () => {
    if (!link) return alert("Paste scholarship link");

    try {
      setLoading(true);
      await API.post("/scholarships/extract", { url: link });
      setLink("");
      loadScholarships();
    } catch {
      alert("Scholarship extraction failed");
    } finally {
      setLoading(false);
    }
  };

  // Delete scholarship
  const deleteScholarship = async (id) => {
    if (!window.confirm("Are you sure you want to delete this scholarship?")) return;

    try {
      await API.delete(`/scholarships/${id}`);
      loadScholarships();
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <>
      <Navbar />

      <div className="container mt-5">
        <h3 className="mb-4">🧑‍💼 Admin Scholarship Panel</h3>

        {/* 🔗 EXTRACT SECTION */}
        <div className="card p-4 mb-4 shadow">
          <h5 className="mb-3">Extract Scholarship from Link</h5>
          <input
            className="form-control mb-3"
            placeholder="Paste scholarship link (Buddy4Study / Govt site)"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
          <button
            className="btn btn-success"
            onClick={extractScholarship}
            disabled={loading}
          >
            {loading ? "Extracting..." : "Extract Scholarship"}
          </button>
        </div>

        {/* 📋 SCHOLARSHIP LIST */}
        {scholarships.map((s) => (
          <div key={s._id} className="card mb-3 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <h5>{s.name}</h5>
                <span
                  className={`badge ${
                    s.isPublished ? "bg-success" : "bg-secondary"
                  }`}
                >
                  {s.isPublished ? "Published" : "Draft"}
                </span>
              </div>

              <p className="mb-1">
                <b>Eligibility:</b> {s.eligibility}
              </p>
              <p className="mb-1">
                <b>Amount:</b> {s.amount}
              </p>
              <p className="mb-2">
                <b>Deadline:</b>{" "}
                {s.deadline ? new Date(s.deadline).toDateString() : "Ongoing"}
              </p>

              <button
                className="btn btn-primary btn-sm me-2"
                onClick={() =>
                  navigate(`/admin/scholarships/edit/${s._id}`)
                }
              >
                Edit
              </button>

              <button
                className="btn btn-danger btn-sm"
                onClick={() => deleteScholarship(s._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default AdminScholarship;
