import { useEffect, useState } from "react";
import api from "../api";
import topicOptions from "../data/topicOptions.json";

export default function QuestionList({ onEdit }) {
  const [questions, setQuestions] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [filters, setFilters] = useState({
    subject: "",
    topic: "",
    subtopic: "",
    difficulty: "",
    question_type: "",
    format: "",
    source: "",
  });
  const [page, setPage] = useState(1);
  const [questionsPerPage] = useState(10);

  const fetchQuestions = async () => {
    const params = {};

    if (filters.subject) params.subject = filters.subject;
    if (filters.topic) params.topic = filters.topic;
    if (filters.subtopic) params.subtopic = filters.subtopic;
    if (filters.difficulty) params.difficulty = filters.difficulty;
    if (filters.question_type) params.question_type = filters.question_type;
    if (filters.format) params.format = filters.format;
    if (filters.source) params.source = filters.source;

    const res = await api.get("/questions", { params });
    setQuestions(res.data);
    setPage(1);
    setSelectedIds([]); // Clear previous selections
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Delete this question?")) {
      await api.delete(`/questions/${id}`);
      fetchQuestions();
    }
  };

  const handleExportSelected = async () => {
    const res = await api.post(
      "/questions/export",
      { ids: selectedIds },
      { responseType: "blob" }
    );
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "selected-questions.pdf");
    document.body.appendChild(link);
    link.click();
  };

  const handleExportAll = async () => {
    const allIds = questions.map((q) => q.id);
    const res = await api.post(
      "/questions/export",
      { ids: allIds },
      { responseType: "blob" }
    );
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "all-filtered-questions.pdf");
    document.body.appendChild(link);
    link.click();
  };

  const toggleSelection = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((q) => q !== id) : [...prev, id]
    );
  };

  const startIdx = (page - 1) * questionsPerPage;
  const displayedQuestions = questions.slice(startIdx, startIdx + questionsPerPage);
  const totalPages = Math.ceil(questions.length / questionsPerPage);

  return (
    <div className="p-4 mt-6">
      <h2 className="text-xl font-bold mb-4">Saved Questions</h2>

      {/* Filters */}
      <div className="border rounded p-4 mb-6 bg-gray-50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {/* Subject Dropdown */}
          <select
            value={filters.subject}
            onChange={(e) => {
              setFilters({ ...filters, subject: e.target.value, topic: "", subtopic: "" });
            }}
            className="border p-2"
          >
            <option value="">Select Subject</option>
            {Object.keys(topicOptions).map((subject) => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>

          {/* Topic Dropdown */}
          <select
            value={filters.topic}
            onChange={(e) => {
              setFilters({ ...filters, topic: e.target.value, subtopic: "" });
            }}
            className="border p-2"
            disabled={!filters.subject}
          >
            <option value="">Select Topic</option>
            {filters.subject && topicOptions[filters.subject] &&
              Object.keys(topicOptions[filters.subject]).map((topic) => (
                <option key={topic} value={topic}>{topic}</option>
              ))
            }
          </select>

          {/* Subtopic Dropdown */}
          <select
            value={filters.subtopic}
            onChange={(e) => setFilters({ ...filters, subtopic: e.target.value })}
            className="border p-2"
            disabled={!filters.topic}
          >
            <option value="">Select Subtopic</option>
            {filters.subject && filters.topic && topicOptions[filters.subject]?.[filters.topic]?.map((subtopic) => (
              <option key={subtopic} value={subtopic}>{subtopic}</option>
            ))}
          </select>

          {/* Difficulty Dropdown */}
          <select
            value={filters.difficulty}
            onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
            className="border p-2"
          >
            <option value="">Select Difficulty</option>
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>

          {/* Type Dropdown */}
          <select
            value={filters.question_type}
            onChange={(e) => setFilters({ ...filters, question_type: e.target.value })}
            className="border p-2"
          >
            <option value="">Select Type</option>
            <option>Factual</option>
            <option>Conceptual</option>
            <option>Analytical</option>
          </select>

          {/* Format Dropdown */}
          <select
            value={filters.format}
            onChange={(e) => setFilters({ ...filters, format: e.target.value })}
            className="border p-2"
          >
            <option value="">Select Format</option>
            <option>Single Liner</option>
            <option>Two Statement</option>
            <option>Three Statement</option>
            <option>More than Three Statements</option>
            <option>Pairing</option>
            <option>Assertion/Reason</option>
          </select>

          {/* Source Input */}
          <input
            placeholder="Source"
            value={filters.source}
            onChange={(e) => setFilters({ ...filters, source: e.target.value })}
            className="border p-2"
          />
        </div>

        <div className="space-x-2">
          <button
            onClick={fetchQuestions}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Apply Filter
          </button>

          <button
            onClick={() => {
              setFilters({
                subject: "",
                topic: "",
                subtopic: "",
                difficulty: "",
                question_type: "",
                format: "",
                source: "",
              });
              fetchQuestions();
            }}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Clear Filter
          </button>
        </div>
      </div>

      {/* Export buttons */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <button
            onClick={handleExportSelected}
            disabled={selectedIds.length === 0}
            className="bg-green-600 text-white px-3 py-2 rounded mr-2"
          >
            Export Selected ({selectedIds.length})
          </button>

          <button
            onClick={handleExportAll}
            disabled={questions.length === 0}
            className="bg-green-700 text-white px-3 py-2 rounded"
          >
            Export All Filtered ({questions.length})
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-auto">
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">✔️</th>
              <th className="p-2">Question</th>
              <th className="p-2">Subject</th>
              <th className="p-2">Topic</th>
              <th className="p-2">Subtopic</th>
              <th className="p-2">Difficulty</th>
              <th className="p-2">Type</th>
              <th className="p-2">Format</th>
              <th className="p-2">Source</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedQuestions.map((q) => (
              <tr key={q.id} className="border-t">
                <td className="p-2 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(q.id)}
                    onChange={() => toggleSelection(q.id)}
                  />
                </td>
                <td className="p-2" dangerouslySetInnerHTML={{ __html: q.question_text }} />
                <td className="p-2">{q.subject}</td>
                <td className="p-2">{q.topic}</td>
                <td className="p-2">{q.subtopic}</td>
                <td className="p-2">{q.difficulty}</td>
                <td className="p-2">{q.question_type}</td>
                <td className="p-2">{q.format}</td>
                <td className="p-2">{q.source}</td>
                <td className="p-2">
                  <button
                    onClick={() => onEdit(q)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 space-x-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            className={`px-3 py-1 border rounded ${page === i + 1 ? "bg-blue-500 text-white" : ""}`}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}