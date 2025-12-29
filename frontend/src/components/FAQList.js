import React, { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../api";

const FAQList = () => {
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/faq`)
      .then(res => setFaqs(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>FAQ</h2>
      <ul>
        {faqs.map(f => (
          <li key={f.id}>
            <strong>{f.question}</strong>: {f.answer}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FAQList;
