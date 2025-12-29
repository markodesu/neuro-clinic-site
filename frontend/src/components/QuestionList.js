import React, { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../api";

const QuestionsList = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchQuestions = () => {
    setLoading(true);
    setError(null);
    const url = API_URL ? `${API_URL}/questions` : "/questions";
    axios.get(url)
      .then(res => {
        setQuestions(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching questions:", err);
        console.error("API_URL:", API_URL);
        console.error("Full URL:", url);
        console.error("Error details:", err.response?.data || err.message);
        setError(err.response?.data?.error || err.message || "Ошибка загрузки вопросов");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const saveAnswer = (id) => {
    const answer = answers[id];
    if (!answer) return;

    const url = API_URL ? `${API_URL}/questions/${id}/answer` : `/questions/${id}/answer`;
    axios.patch(url, { answer })
      .then(() => fetchQuestions())
      .catch(err => {
        console.error("Error saving answer:", err);
        console.error("Error details:", err.response?.data || err.message);
        alert("Ошибка при сохранении ответа: " + (err.response?.data?.error || err.message));
      });
  };

  return (
    <div>
      <h2>Вопросы пациентов</h2>
      {loading && <p>Загрузка...</p>}
      {error && <p style={{ color: "red" }}>Ошибка: {error}</p>}
      {!loading && !error && questions.length === 0 && <p>Нет вопросов</p>}
      <ul>
        {questions.map(q => (
          <li key={q.id} style={{ marginBottom: "1rem" }}>
            <strong>Вопрос:</strong> {q.text}<br />
            <strong>Ответ:</strong> {q.answer || "—"}<br />
            {!q.answer && (
              <>
                <input
                  type="text"
                  value={answers[q.id] || ""}
                  onChange={e => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                  placeholder="Введите ответ"
                />
                <button onClick={() => saveAnswer(q.id)}>Сохранить ответ</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuestionsList;
