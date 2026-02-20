import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "./Navbar";

function TestPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { category, track } = state || {};

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);

  // 🔒 Safety check
  useEffect(() => {
    if (!category) {
      navigate("/category");
      return;
    }

    API.post("/questions", {
      category,
      track
    })
      .then(res => {
        setQuestions(res.data);
      })
      .catch(() => {
        alert("Failed to load questions");
      });
  }, [category, track, navigate]);

  // 🟡 Loading state
  if (!questions.length) {
    return (
      <>
        <Navbar />
        <p className="text-center mt-5">Loading questions...</p>
      </>
    );
  }

  const currentQuestion = questions[currentIndex];

  // 🟢 Select answer
  const selectOption = (option) => {
    setSelected(option);
  };

  // ➡️ Next / Submit
  const handleNext = () => {
    if (!selected) {
      alert("Please select an answer");
      return;
    }

    const updatedAnswers = {
      ...answers,
      [currentIndex]: selected
    };

    setAnswers(updatedAnswers);
    setSelected(null);

    // 🛑 LAST QUESTION → RESULT
    if (currentIndex === questions.length - 1) {
      navigate("/result", {
        state: {
          category,
          track,
          answers: updatedAnswers
        }
      });
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <>
      <Navbar />

      <div className="test-page-container">
        <h4 className="mb-3">
          Question {currentIndex + 1} / {questions.length}
        </h4>

        {/* 🧠 SAFE RENDER */}
        {currentQuestion && (
          <>
            <h5 className="mb-4">{currentQuestion.question}</h5>

            {currentQuestion.options.map((opt, idx) => (
              <div
                key={idx}
                className={`option-box ${
                  selected === opt ? "option-selected" : ""
                }`}
                onClick={() => selectOption(opt)}
              >
                {opt}
              </div>
            ))}
          </>
        )}

        <div className="text-end mt-4">
          <button className="btn btn-primary" onClick={handleNext}>
            {currentIndex === questions.length - 1
              ? "Submit Test"
              : "Next"}
          </button>
        </div>
      </div>
    </>
  );
}

export default TestPage;
