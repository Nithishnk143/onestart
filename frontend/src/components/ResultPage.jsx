import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import API from "../services/api";
import Navbar from "./Navbar";

import { Doughnut, Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler
);

/* 🔹 ICON MAP */
const getIcon = (text = "") => {
  const t = text.toLowerCase();
  if (t.includes("data")) return "bi-bar-chart-line";
  if (t.includes("software") || t.includes("engineer")) return "bi-laptop";
  if (t.includes("manager") || t.includes("management")) return "bi-people";
  if (t.includes("design") || t.includes("creative")) return "bi-palette";
  return "bi-lightbulb";
};

/* 🔹 SKILL SCORING */
const calculateScores = (answers = []) => {
  const scores = {
    Analytical: 0,
    Communication: 0,
    Leadership: 0,
    Creativity: 0,
    Technical: 0
  };

  answers.forEach(a => {
    if (!a) return;
    if (a.includes("Agree")) {
      scores.Analytical += 1;
      scores.Communication += 1;
      scores.Technical += 1;
    }
  });

  return scores;
};

function ResultPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const category = state?.category;
  const track = state?.track;
  const answersObj = state?.answers;

  const [recommendations, setRecommendations] = useState([]);
  const [scores, setScores] = useState(null);
  const [loading, setLoading] = useState(true);

  /* 🔒 SAFETY */
  useEffect(() => {
    if (!category || !answersObj) {
      navigate("/category");
    }
  }, [category, answersObj, navigate]);

  /* 🧠 AI CALL */
  useEffect(() => {
    const runAI = async () => {
      try {
        const answersArray = Object.values(answersObj);

        const res = await API.post("/ai/career", {
          category,
          track,
          answers: answersArray
        });

        // ✅ NEW JSON HANDLING
        setRecommendations(res.data.recommendations || []);
        setScores(calculateScores(answersArray));
      } catch (err) {
        console.error("AI error", err);
      } finally {
        setLoading(false);
      }
    };

    runAI();
  }, [answersObj, category, track]);


  /* 📄 PDF */
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("AI Career Guidance Report", 20, 20);

    let y = 40;
    recommendations.forEach((r, i) => {
      doc.setFontSize(12);
      doc.text(`${i + 1}. ${r.title}`, 20, y);
      y += 8;
      doc.setFontSize(10);
      doc.text(r.description, 22, y);
      y += 12;
    });

    doc.save("career_result.pdf");
  };

  if (loading || !scores) {
    return (
      <>
        <Navbar />
        <p className="text-center mt-5 generating-test-text">Generating test...</p>
      </>
    );
  }

  /* 📊 CHARTS */
  const chartData = {
    labels: Object.keys(scores),
    datasets: [
      {
        data: Object.values(scores),
        backgroundColor: [
          "#6366f1",
          "#22c55e",
          "#f59e0b",
          "#ec4899",
          "#0ea5e9"
        ]
      }
    ]
  };

  const radarData = {
    labels: Object.keys(scores),
    datasets: [
      {
        label: "Skill Strength",
        data: Object.values(scores),
        backgroundColor: "rgba(99,102,241,0.2)",
        borderColor: "#6366f1",
        borderWidth: 2
      }
    ]
  };

  return (
    <>
      <Navbar />

      <div className="container mt-5">
        <h2 className="text-center mb-4 top-recommend-title">
          🎯 Your Top 3 Recommendations
        </h2>

        {/* 🔝 TOP 3 */}
        {recommendations.length === 0 ? (
          <p className="text-center">No recommendations generated.</p>
        ) : (
          <div className="row justify-content-center">
            {recommendations.map((rec, index) => (
              <div className="col-md-4 mb-4" key={index}>
                <div className="card h-100 shadow text-center result-card">
                  <div className="card-body">
                    <i
                      className={`bi ${getIcon(rec.title)}`}
                      style={{ fontSize: "2.5rem" }}
                    ></i>
                    <h5 className="mt-3 rec-title-bold">{rec.title}</h5>
                    <p>{rec.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 📊 SKILLS */}
        <div className="row justify-content-center mt-5">
          <div className="col-md-8">
            <div className="card p-4 shadow">
              <h4 className="text-center mb-4">🧠 AI Skill Analysis</h4>
              <div className="row">
                <div className="col-md-6">
                  <Doughnut data={chartData} />
                </div>
                <div className="col-md-6">
                  <Radar data={radarData} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 🔘 ACTIONS */}
        <div className="text-center mt-4">
          <button
            className="btn btn-secondary me-3"
            onClick={() => navigate("/category")}
          >
            Retake Test
          </button>

          <button className="btn btn-success me-3" onClick={downloadPDF}>
            Download PDF
          </button>

          <button
            className="btn btn-primary"
            onClick={() =>
              navigate("/scholarships", { state: { category } })
            }
          >
            View Scholarships
          </button>
          
        </div>
      </div>
    </>
  );
}

export default ResultPage;
