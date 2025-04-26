import { useState, useEffect } from "react";
import api from "../api";

export default function QuestionList({ setQuestionToEdit, onSuccess }) {
  const [questions, setQuestions] = useState([]);
  const [filters, setFilters] = useState({
    subject: "",
    topic: "",
    subtopic: "",
    difficulty: "",
    question_type: "",
    format: "",
    source: "",
  });

  const fetchQuestions = async () => {
    try {
      const params = {};
      Object.keys(filters).forEach((key) => {
        if (filters[key]) {
          params[key] = filters[key];
        }
      });

      const res = await api.get("/questions", { params });
      setQuestions(res.data);
    } catch (error) {
      console.error("❌ Failed to fetch questions:", error);
      setQuestions([]);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this question?")) {
      await api.delete(`/questions/${id}`);
      fetchQuestions();
      onSuccess?.();
    }
  };

  const handleExport = async () => {
    const res = await api.post(
      "/questions/export",
      { ids: questions.map((q) => q.id) },
      { responseType: "blob" }
    );
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "questions.pdf");
    document.body.appendChild(link);
    link.click();
  };

  const handleClearFilters = () => {
    setFilters({
      subject: "",
      topic: "",
      subtopic: "",
      difficulty: "",
      question_type: "",
      format: "",
      source: "",
    });
    setQuestions([]);
  };

  return (
    <div className="p-4 mt-6">
      <h2 className="text-xl font-bold mb-4">Saved Questions</h2>

      {/* Filters Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <select
          value={filters.subject}
          onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
          className="p-2 border rounded"
        >
          <option value="">Subject</option>
          <option>Polity</option>
          <option>Economy</option>
          <option>Ancient History</option>
          <option>Medieval History</option>
          <option>Modern History</option>
          <option>Post Independence</option>
          <option>Geography</option>
          <option>Science and Technology</option>
          <option>Environment</option>
          <option>Sport & Awards</option>
          <option>Miscellaneous</option>
        </select>

        <input
          type="text"
          placeholder="Topic"
          value={filters.topic}
          onChange={(e) => setFilters({ ...filters, topic: e.target.value })}
          className="p-2 border rounded"
        />

        <input
          type="text"
          placeholder="Subtopic"
          value={filters.subtopic}
          onChange={(e) => setFilters({ ...filters, subtopic: e.target.value })}
          className="p-2 border rounded"
        />

        <select
          value={filters.difficulty}
          onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
          className="p-2 border rounded"
        >
          <option value="">Difficulty</option>
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>

        <select
          value={filters.question_type}
          onChange={(e) => setFilters({ ...filters, question_type: e.target.value })}
          className="p-2 border rounded"
        >
          <option value="">Type</option>
          <option>Factual</option>
          <option>Conceptual</option>
          <option>Analytical</option>
        </select>

        <select
          value={filters.format}
          onChange={(e) => setFilters({ ...filters, format: e.target.value })}
          className="p-2 border rounded"
        >
          <option value="">Format</option>
          <option>Single Liner</option>
          <option>Two Statement</option>
          <option>Three Statement</option>
          <option>More than Three Statements</option>
          <option>Pairing</option>
          <option>Assertion/Reason</option>
        </select>

        <input
          type="text"
          placeholder="Source"
          value={filters.source}
          onChange={(e) => setFilters({ ...filters, source: e.target.value })}
          className="p-2 border rounded"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={fetchQuestions}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Apply Filters
        </button>

        <button
          onClick={handleClearFilters}
          className="bg-gray-400 text-white px-4 py-2 rounded"
        >
          Clear Filters
        </button>

        {questions.length > 0 && (
          <button
            onClick={handleExport}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Export All ({questions.length})
          </button>
        )}
      </div>

      {/* Questions Table */}
      <div className="overflow-auto">
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Question</th>
              <th className="p-2">Subject</th>
              <th className="p-2">Topic</th>
              <th className="p-2">Subtopic</th>
              <th className="p-2">Type</th>
              <th className="p-2">Format</th>
              <th className="p-2">Difficulty</th>
              <th className="p-2">Tags</th>
              <th className="p-2">Source</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q) => (
              <tr key={q.id} className="border-t">
                <td className="p-2" dangerouslySetInnerHTML={{ __html: q.question_text }} />
                <td className="p-2">{q.subject}</td>
                <td className="p-2">{q.topic}</td>
                <td className="p-2">{q.subtopic}</td>
                <td className="p-2">{q.question_type}</td>
                <td className="p-2">{q.format}</td>
                <td className="p-2">{q.difficulty}</td>
                <td className="p-2">{q.tags}</td>
                <td className="p-2">{q.source}</td>
                <td className="p-2 space-x-2">
                  <button
                    onClick={() => setQuestionToEdit(q)}
                    className="bg-yellow-400 text-black px-2 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(q.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {questions.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No questions found. Apply filters above to fetch data.
          </div>
        )}
      </div>
    </div>
  );
}