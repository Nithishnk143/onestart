import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const categories = [
  { name: "10th", icon: "bi-book" },
  { name: "12th", icon: "bi-journal-text" },
  { name: "UG", icon: "bi-mortarboard" },
  { name: "PG", icon: "bi-award" },
  { name: "Working Professional", icon: "bi-briefcase" }
];

function CategorySelect() {
  const navigate = useNavigate();

  const selectCategory = (cat) => {
    if (cat === "UG") {
      navigate("/ug-choice");
    } else {
      navigate("/test", { state: { category: cat } });
    }
  };

  return (
    <>
      <Navbar />

      <div className="container mt-5">
        {/* 🏠 HOME INTRO */}
        <div className="text-center mb-5">
          <h1 className="fw-bold text-white">🎓 CareerAI</h1>
          <p className="lead text-white mt-3">
            An <b>AI-Driven Personalized Career Guidance Platform</b> that helps
            students and professionals discover the right course, skills, and
            career path based on psychometric analysis.
          </p>
        </div>

        {/* 🎯 CATEGORY CARDS */}
        <div className="row justify-content-center">
          {categories.map((cat) => (
            <div key={cat.name} className="col-md-4 col-lg-3 mb-4">
              <div
                className="card category-card text-center p-4 h-100"
                onClick={() => selectCategory(cat.name)}
              >
                <i
                  className={`bi ${cat.icon} mb-3`}
                  style={{ fontSize: "3rem" }}
                ></i>
                <h5 className="fw-bold">{cat.name}</h5>
                <p className="small mt-2">
                  Explore personalized guidance for {cat.name} level
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default CategorySelect;
