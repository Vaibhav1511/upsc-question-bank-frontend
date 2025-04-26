import { useEffect, useState } from "react";
import api from "../api";
import topicOptions from '../data/topicOptions.json';

export default function QuestionList({ setQuestionToEdit }) {
  const [questions, setQuestions] = useState([]);
  const [filters, setFilters] = useState({
    subject: '',
    topic: '',
    subtopic: '',
    source: '',
    difficulty: '',
    question_type: '',
    format: ''
  });
  const [selectedIds, setSelectedIds] = useState([]);


  const fetchQuestions = async () => {
    try {
      const params = {};
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params[key] = filters[key];
        }
      });

      const res = await api.get("/questions", { params });
      setQuestions(res.data);
    } catch (error) {
      console.error("❌ Failed to fetch questions:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this question?")) {
      await api.delete(`/questions/${id}`);
      fetchQuestions();
    }
  };

  const handleExport = async () => {
    const res = await api.post(
      "/questions/export",
      { ids: selectedIds },
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

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      ...(key === 'subject' ? { topic: '', subtopic: '' } : {}),
      ...(key === 'topic' ? { subtopic: '' } : {})
    }));
  };

  const clearFilters = () => {
    setFilters({
      subject: '',
      topic: '',
      subtopic: '',
      source: '',
      difficulty: '',
      question_type: '',
      format: ''
    });
    fetchQuestions();
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <div className="p-4 mt-6">
      <h2 className="text-xl font-bold mb-4">Saved Questions</h2>

      {/* Filters */}
      <div className="mb-6 space-y-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <select
          value={filters.subject}
          onChange={e => handleFilterChange('subject', e.target.value)}
          className="border p-2 w-full"
        >
          <option value="">Filter by Subject</option>
          {Object.keys(topicOptions).map(subject => (
            <option key={subject} value={subject}>{subject}</option>
          ))}
        </select>

        <select
          value={filters.topic}
          onChange={e => handleFilterChange('topic', e.target.value)}
          className="border p-2 w-full"
          disabled={!filters.subject}
        >
          <option value="">Filter by Topic</option>
          {filters.subject && Object.keys(topicOptions[filters.subject]).map(topic => (
            <option key={topic} value={topic}>{topic}</option>
          ))}
        </select>

        <select
          value={filters.subtopic}
          onChange={e => handleFilterChange('subtopic', e.target.value)}
          className="border p-2 w-full"
          disabled={!filters.topic}
        >
          <option value="">Filter by Subtopic</option>
          {filters.subject && filters.topic && topicOptions[filters.subject][filters.topic]?.map(sub => (
            <option key={sub} value={sub}>{sub}</option>
          ))}
        </select>

        <input
          placeholder="Filter by Source"
          value={filters.source}
          onChange={e => handleFilterChange('source', e.target.value)}
          className="border p-2 w-full"
        />

        <select
          value={filters.difficulty}
          onChange={e => handleFilterChange('difficulty', e.target.value)}
          className="border p-2 w-full"
        >
          <option value="">Filter by Difficulty</option>
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>

        <select
          value={filters.question_type}
          onChange={e => handleFilterChange('question_type', e.target.value)}
          className="border p-2 w-full"
        >
          <option value="">Filter by Type</option>
          <option>Factual</option>
          <option>Conceptual</option>
          <option>Analytical</option>
        </select>

        <select
          value={filters.format}
          onChange={e => handleFilterChange('format', e.target.value)}
          className="border p-2 w-full"
        >
          <option value="">Filter by Format</option>
          <option>Single Liner</option>
          <option>Two Statement</option>
          <option>Three Statement</option>
          <option>More than Three Statements</option>
          <option>Pairing</option>
          <option>Assertion/Reason</option>
        </select>

        <div className="space-x-2 mt-2">
          <button
            onClick={fetchQuestions}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Apply Filter
          </button>
          <button
            onClick={clearFilters}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Clear Filter
          </button>
        </div>
      </div>

      {/* Export Button */}
      <button
        onClick={handleExport}
        disabled={selectedIds.length === 0}
        className="mb-4 bg-green-600 text-white px-3 py-1 rounded"
      >
        Export Selected ({selectedIds.length})
      </button>

      {/* Questions Table */}
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
                <td className="p-2">{q.question_type}</td>
                <td className="p-2">{q.format}</td>
                <td className="p-2">{q.difficulty}</td>
                <td className="p-2">{q.source}</td>
                <td className="p-2 space-x-2">
                  <button
                    onClick={() => setQuestionToEdit(q)}
                    className="bg-yellow-400 px-2 py-1 rounded"
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
      </div>
    </div>
  );
}