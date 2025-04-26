import { useEffect, useState } from "react";
import api from "../api";
import topicOptions from "../data/topicOptions.json"; // For dynamic filter dropdowns

export default function QuestionList({ onEdit }) {
  const [filters, setFilters] = useState({
    subject: "",
    topic: "",
    subtopic: "",
    source: "",
    question_type: "",
    format: ""
  });
  const [questions, setQuestions] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  const fetchQuestions = async () => {
    const params = {};
    Object.keys(filters).forEach((key) => {
      if (filters[key]) params[key] = filters[key];
    });

    const res = await api.get("/questions", { params });
    setQuestions(res.data);
    setSelectedIds([]); // reset selections on new filter
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this question?")) {
      await api.delete(`/questions/${id}`);
      fetchQuestions();
    }
  };

  const handleExport = async (all = false) => {
    const idsToExport = all ? questions.map(q => q.id) : selectedIds;
    if (idsToExport.length === 0) {
      alert("No questions selected to export.");
      return;
    }

    const res = await api.post(
      "/questions/export",
      { ids: idsToExport },
      { responseType: "blob" }
    );
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "questions.pdf");
    document.body.appendChild(link);
    link.click();
  };

  const toggleSelection = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((q) => q !== id) : [...prev, id]
    );
  };

  const clearFilters = () => {
    setFilters({
      subject: "",
      topic: "",
      subtopic: "",
      source: "",
      question_type: "",
      format: ""
    });
    setQuestions([]);
    setSelectedIds([]);
  };

  useEffect(() => {
    // Initially do not load everything
  }, []);

  return (
    <div className="p-4 mt-6">
      <h2 className="text-xl font-bold mb-4">Saved Questions</h2>

      {/* Filter section */}
      <div className="flex flex-wrap gap-2 mb-4">
        <select value={filters.subject} onChange={e => setFilters({ ...filters, subject: e.target.value, topic: "", subtopic: "" })} className="p-2 border">
          <option value="">Subject</option>
          {Object.keys(topicOptions).map((subject) => (
            <option key={subject} value={subject}>{subject}</option>
          ))}
        </select>

        <select value={filters.topic} onChange={e => setFilters({ ...filters, topic: e.target.value, subtopic: "" })} className="p-2 border" disabled={!filters.subject}>
          <option value="">Topic</option>
          {filters.subject && topicOptions[filters.subject] &&
            Object.keys(topicOptions[filters.subject]).map((topic) => (
              <option key={topic} value={topic}>{topic}</option>
            ))
          }
        </select>

        <select value={filters.subtopic} onChange={e => setFilters({ ...filters, subtopic: e.target.value })} className="p-2 border" disabled={!filters.topic}>
          <option value="">Subtopic</option>
          {filters.subject && filters.topic &&
            topicOptions[filters.subject]?.[filters.topic]?.map((sub) => (
              <option key={sub} value={sub}>{sub}</option>
            ))
          }
        </select>

        <input placeholder="Source" value={filters.source} onChange={e => setFilters({ ...filters, source: e.target.value })} className="p-2 border" />

        <select value={filters.question_type} onChange={e => setFilters({ ...filters, question_type: e.target.value })} className="p-2 border">
          <option value="">Type</option>
          <option>Factual</option>
          <option>Conceptual</option>
          <option>Analytical</option>
        </select>

        <select value={filters.format} onChange={e => setFilters({ ...filters, format: e.target.value })} className="p-2 border">
          <option value="">Format</option>
          <option>Single Liner</option>
          <option>Two Statement</option>
          <option>Three Statement</option>
          <option>More than Three Statements</option>
          <option>Pairing</option>
          <option>Assertion/Reason</option>
        </select>

        <button onClick={fetchQuestions} className="bg-blue-500 text-white px-3 py-1 rounded">Apply Filters</button>
        <button onClick={clearFilters} className="bg-gray-400 text-white px-3 py-1 rounded">Clear Filters</button>
      </div>

      {/* Export Buttons */}
      {questions.length > 0 && (
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => handleExport(false)}
            disabled={selectedIds.length === 0}
            className="bg-green-600 text-white px-3 py-1 rounded"
          >
            Export Selected ({selectedIds.length})
          </button>
          <button
            onClick={() => handleExport(true)}
            className="bg-purple-600 text-white px-3 py-1 rounded"
          >
            Export All ({questions.length})
          </button>
        </div>
      )}

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
              <th className="p-2">Type</th>
              <th className="p-2">Format</th>
              <th className="p-2">Difficulty</th>
              <th className="p-2">Source</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q) => (
              <tr key={q.id} className="border-t">
                <td className="p-2 text-center">
                  <input type="checkbox" checked={selectedIds.includes(q.id)} onChange={() => toggleSelection(q.id)} />
                </td>
                <td className="p-2" dangerouslySetInnerHTML={{ __html: q.question_text }} />
                <td className="p-2">{q.subject}</td>
                <td className="p-2">{q.topic}</td>
                <td className="p-2">{q.subtopic}</td>
                <td className="p-2">{q.question_type}</td>
                <td className="p-2">{q.format}</td>
                <td className="p-2">{q.difficulty}</td>
                <td className="p-2">{q.source}</td>
                <td className="p-2 space-x-2">
                  <button onClick={() => onEdit(q)} className="bg-yellow-400 text-white px-2 py-1 rounded">Edit</button>
                  <button onClick={() => handleDelete(q.id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}