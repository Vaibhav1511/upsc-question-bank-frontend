import { useEffect, useState } from "react";
import api from "../api";
import topicOptions from "../data/topicOptions.json"; // Your topic-subtopic JSON

export default function QuestionList() {
  const [questions, setQuestions] = useState([]);
  const [filters, setFilters] = useState({
    subject: '',
    topic: '',
    subtopic: '',
    source: '',
    question_type: '',
    format: ''
  });
  const [page, setPage] = useState(1);

  const fetchQuestions = async () => {
    try {
      const params = { ...filters, page, limit: 20 };
      const res = await api.get("/questions", { params });
      setQuestions(res.data);
    } catch (error) {
      console.error("Failed to fetch questions:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this question?")) {
      await api.delete(`/questions/${id}`);
      fetchQuestions();
    }
  };

  const handleExport = async () => {
    const selectedIds = questions.map(q => q.id);
    if (selectedIds.length === 0) return;

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

  const handleApplyFilters = () => {
    setPage(1);
    fetchQuestions();
  };

  const handleClearFilters = () => {
    setFilters({
      subject: '',
      topic: '',
      subtopic: '',
      source: '',
      question_type: '',
      format: ''
    });
    setPage(1);
    setQuestions([]); // Clear results
  };

  useEffect(() => {
    // Do not fetch automatically at mount
  }, []);

  return (
    <div className="p-4 mt-6">
      <h2 className="text-xl font-bold mb-4">Saved Questions</h2>

      {/* Filter Controls */}
      <div className="flex flex-wrap gap-2 mb-4">
        <select
          value={filters.subject}
          onChange={e => setFilters({ ...filters, subject: e.target.value, topic: '', subtopic: '' })}
          className="p-2 border rounded"
        >
          <option value="">Select Subject</option>
          {Object.keys(topicOptions).map(subject => (
            <option key={subject} value={subject}>{subject}</option>
          ))}
        </select>

        <select
          value={filters.topic}
          onChange={e => setFilters({ ...filters, topic: e.target.value, subtopic: '' })}
          className="p-2 border rounded"
          disabled={!filters.subject}
        >
          <option value="">Select Topic</option>
          {filters.subject && topicOptions[filters.subject] &&
            Object.keys(topicOptions[filters.subject]).map(topic => (
              <option key={topic} value={topic}>{topic}</option>
            ))
          }
        </select>

        <select
          value={filters.subtopic}
          onChange={e => setFilters({ ...filters, subtopic: e.target.value })}
          className="p-2 border rounded"
          disabled={!filters.topic}
        >
          <option value="">Select Subtopic</option>
          {filters.subject && filters.topic && topicOptions[filters.subject]?.[filters.topic]?.map(subtopic => (
            <option key={subtopic} value={subtopic}>{subtopic}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Source"
          value={filters.source}
          onChange={e => setFilters({ ...filters, source: e.target.value })}
          className="p-2 border rounded"
        />

        <select
          value={filters.question_type}
          onChange={e => setFilters({ ...filters, question_type: e.target.value })}
          className="p-2 border rounded"
        >
          <option value="">Select Type</option>
          <option value="Factual">Factual</option>
          <option value="Conceptual">Conceptual</option>
          <option value="Analytical">Analytical</option>
        </select>

        <select
          value={filters.format}
          onChange={e => setFilters({ ...filters, format: e.target.value })}
          className="p-2 border rounded"
        >
          <option value="">Select Format</option>
          <option value="Single Liner">Single Liner</option>
          <option value="Two Statement">Two Statement</option>
          <option value="Three Statement">Three Statement</option>
          <option value="More than Three Statements">More than Three Statements</option>
          <option value="Pairing">Pairing</option>
          <option value="Assertion/Reason">Assertion/Reason</option>
        </select>

        <button onClick={handleApplyFilters} className="bg-blue-600 text-white p-2 rounded">
          Apply Filters
        </button>
        <button onClick={handleClearFilters} className="bg-gray-400 text-white p-2 rounded">
          Clear Filters
        </button>
      </div>

      {/* Export Button */}
      {questions.length > 0 && (
        <button onClick={handleExport} className="mb-4 bg-green-600 text-white px-3 py-1 rounded">
          Export All ({questions.length})
        </button>
      )}

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
                <td className="p-2">
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

        {/* Pagination buttons */}
        {questions.length > 0 && (
          <div className="flex justify-center items-center mt-4 gap-4">
            {page > 1 && (
              <button onClick={() => setPage(page - 1)} className="px-4 py-2 bg-blue-500 text-white rounded">
                Previous
              </button>
            )}
            <button onClick={() => setPage(page + 1)} className="px-4 py-2 bg-blue-500 text-white rounded">
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}