import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';

export default function Quiz() {
  const { id } = useParams();
  const [set, setSet] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api
      .get(`/questions/sets/${id}`)
      .then((r) => setSet(r.data.questionSet))
      .catch(() => setError('Question set not found'));
  }, [id]);

  const select = (questionId, selectedAnswer) => {
    setAnswers((prev) => ({ ...prev, [questionId]: selectedAnswer }));
  };

  const submit = async () => {
    setSubmitting(true);
    setError('');
    try {
      const payload = {
        answers: Object.entries(answers).map(([questionId, selectedAnswer]) => ({
          questionId: Number(questionId),
          selectedAnswer,
        })),
      };
      const { data } = await api.post(`/questions/sets/${id}/submit`, payload);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Submit failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (error && !set) return <p>{error}</p>;
  if (!set) return <p>Loading quiz...</p>;

  if (result) {
    return (
      <div style={{ maxWidth: 700, margin: '40px auto', padding: 20 }}>
        <h1>Results</h1>
        <p style={{ fontSize: 24 }}>
          Score: <strong>{result.score}%</strong> ({result.correct}/{result.total})
        </p>
        <ul>
          {result.details.map((d) => (
            <li key={d.questionId} style={{ marginBottom: 12 }}>
              <div>{d.questionText}</div>
              <div style={{ color: d.correct ? 'green' : 'crimson' }}>
                Your answer: {d.selectedAnswer} {d.correct ? '✓' : `✗ (correct: ${d.correctAnswer})`}
              </div>
              {d.explanation && <small>{d.explanation}</small>}
            </li>
          ))}
        </ul>
        <Link to="/dashboard">Back to dashboard</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', padding: 20 }}>
      <Link to="/dashboard">← Dashboard</Link>
      <h1>{set.title}</h1>
      <p>
        {set.difficulty} · {set.questions.length} questions
      </p>
      {error && <p style={{ color: 'crimson' }}>{error}</p>}

      {set.questions.map((q, i) => (
        <div key={q.id} style={{ marginBottom: 24, padding: 16, border: '1px solid #eee', borderRadius: 8 }}>
          <p>
            <strong>
              {i + 1}. {q.questionText}
            </strong>
          </p>
          {['A', 'B', 'C', 'D'].map((opt) => (
            <label key={opt} style={{ display: 'block', marginBottom: 6 }}>
              <input
                type="radio"
                name={`q-${q.id}`}
                checked={answers[q.id] === opt}
                onChange={() => select(q.id, opt)}
              />{' '}
              {opt}. {q[`option${opt}`]}
            </label>
          ))}
        </div>
      ))}

      <button
        onClick={submit}
        disabled={submitting || Object.keys(answers).length < set.questions.length}
      >
        {submitting ? 'Submitting...' : 'Submit quiz'}
      </button>
    </div>
  );
}