import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "./Navbar";

function AdminScholarshipEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    API.get(`/scholarships/admin/all`)
      .then(res => {
        const found = res.data.find(s => s._id === id);
        setData(found);
      })
      .catch(() => alert("Failed to load scholarship"));
  }, [id]);

  const saveChanges = async () => {
    try {
      await API.put(`/scholarships/${id}`, data);
      alert("Scholarship updated");
      navigate("/admin/scholarships");
    } catch {
      alert("Update failed");
    }
  };

  if (!data) return <p className="text-center mt-5">Loading...</p>;

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h3 className="mb-4">✏️ Edit Scholarship</h3>

        <div className="card p-4 shadow">
          <div className="row">
            <div className="col-md-6">
              <label>Name</label>
              <input
                className="form-control mb-3"
                value={data.name}
                onChange={e => setData({ ...data, name: e.target.value })}
              />

              <label>Eligibility</label>
              <textarea
                className="form-control mb-3"
                rows="4"
                value={data.eligibility}
                onChange={e => setData({ ...data, eligibility: e.target.value })}
              />

              <label>Amount</label>
              <input
                className="form-control mb-3"
                value={data.amount}
                onChange={e => setData({ ...data, amount: e.target.value })}
              />

              <label>Apply Link</label>
              <input
                className="form-control mb-3"
                value={data.applyLink}
                onChange={e => setData({ ...data, applyLink: e.target.value })}
              />
            </div>

            <div className="col-md-6">
              <label>Deadline</label>
              <input
                type="date"
                className="form-control mb-3"
                value={data.deadline?.slice(0, 10)}
                onChange={e => setData({ ...data, deadline: e.target.value })}
              />

              <label>Eligible Gender</label>
              <select
                className="form-control mb-3"
                value={data.eligibleGender}
                onChange={e =>
                  setData({ ...data, eligibleGender: e.target.value })
                }
              >
                <option>All</option>
                <option>Male</option>
                <option>Female</option>
              </select>

              <label>Eligible Degrees</label>
              <input
                className="form-control mb-3"
                value={data.eligibleDegrees.join(", ")}
                onChange={e =>
                  setData({
                    ...data,
                    eligibleDegrees: e.target.value.split(",").map(d => d.trim())
                  })
                }
              />

              <label>Eligible Castes</label>
              <input
                className="form-control mb-3"
                value={data.eligibleCastes.join(", ")}
                onChange={e =>
                  setData({
                    ...data,
                    eligibleCastes: e.target.value.split(",").map(c => c.trim())
                  })
                }
              />

              <div className="form-check mt-3">
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={data.isPublished}
                  onChange={e =>
                    setData({ ...data, isPublished: e.target.checked })
                  }
                />
                <label className="form-check-label">
                  Publish Scholarship
                </label>
              </div>
            </div>
          </div>

          <div className="text-end mt-4">
            <button
              className="btn btn-secondary me-2"
              onClick={() => navigate("/admin/scholarships")}
            >
              Cancel
            </button>
            <button className="btn btn-success" onClick={saveChanges}>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminScholarshipEdit;
