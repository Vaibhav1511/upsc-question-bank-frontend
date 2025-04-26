import { useEffect, useState } from "react";
import api from "../api";

export default function QuestionList({ refreshTrigger, setQuestionToEdit }) {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [filters, setFilters] = useState({
    subject: "",
    topic: "",
    subtopic: "",
    difficulty: "",
    question_type: "",
    format: "",
    source: ""
  });

  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 10;

  const fetchQuestions = async () => {
    try {
      const res = await api.get("/questions", { params: filters });
      setQuestions(res.data);
      setFilteredQuestions(res.data);
      setSelectedIds([]); // Reset selection on new filter
      setCurrentPage(1); // Reset to page 1
    } catch (err) {
      console.error("Failed to fetch questions", err);
    }
  };

  useEffect(() => {
    fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTrigger]);

  const handleApplyFilter = () => {
    fetchQuestions();
  };

  const handleClearFilter = () => {
    setFilters({
      subject: "",
      topic: "",
      subtopic: "",
      difficulty: "",
      question_type: "",
      format: "",
      source: ""
    });
    setSelectedIds([]);
    setCurrentPage(1);
    fetchQuestions();
  };

  const toggleSelection = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((q) => q !== id) : [...prev, id]
    );
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this question?")) {
      await api.delete(`/questions/${id}`);
      fetchQuestions();
    }
  };

  const handleExportSelected = async () => {
    if (selectedIds.length === 0) {
      alert("Please select at least one question to export.");
      return;
    }
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

  const handleExportAllFiltered = async () => {
    if (filteredQuestions.length === 0) {
      alert("No filtered questions to export.");
      return;
    }
    const allIds = filteredQuestions.map(q => q.id);
    const res = await api.post(
      "/questions/export",
      { ids: allIds },
      { responseType: "blob" }
    );
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "filtered-questions.pdf");
    document.body.appendChild(link);
    link.click();
  };

  // Pagination logic
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = filteredQuestions.slice(indexOfFirstQuestion, indexOfLastQuestion);
  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-4 mt-6">
      <h2 className="text-xl font-bold mb-4">Saved Questions</h2>

      {/* Filters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <input
          placeholder="Subject"
          value={filters.subject}
          onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
          className="border p-2"
        />
        <input
          placeholder="Topic"
          value={filters.topic}
          onChange={(e) => setFilters({ ...filters, topic: e.target.value })}
          className="border p-2"
        />
        <input
          placeholder="Subtopic"
          value={filters.subtopic}
          onChange={(e) => setFilters({ ...filters, subtopic: e.target.value })}
          className="border p-2"
        />
        <input
          placeholder="Difficulty"
          value={filters.difficulty}
          onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
          className="border p-2"
        />
        <input
          placeholder="Type"
          value={filters.question_type}
          onChange={(e) => setFilters({ ...filters, question_type: e.target.value })}
          className="border p-2"
        />
        <input
          placeholder="Format"
          value={filters.format}
          onChange={(e) => setFilters({ ...filters, format: e.target.value })}
          className="border p-2"
        />
        <input
          placeholder="Source"
          value={filters.source}
          onChange={(e) => setFilters({ ...filters, source: e.target.value })}
          className="border p-2"
        />
      </div>

      <div className="space-x-2 mb-6">
        <button onClick={handleApplyFilter} className="bg-blue-600 text-white px-4 py-2 rounded">Apply Filter</button>
        <button onClick={handleClearFilter} className="bg-gray-500 text-white px-4 py-2 rounded">Clear Filter</button>
        <button onClick={handleExportSelected} className="bg-green-600 text-white px-4 py-2 rounded" disabled={selectedIds.length === 0}>
          Export Selected ({selectedIds.length})
        </button>
        <button onClick={handleExportAllFiltered} className="bg-purple-600 text-white px-4 py-2 rounded">
          Export All Filtered ({filteredQuestions.length})
        </button>
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
              <th className="p-2">Type</th>
              <th className="p-2">Format</th>
              <th className="p-2">Difficulty</th>
              <th className="p-2">Source</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentQuestions.map((q) => (
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
                    onClick={() => handleDelete(q.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setQuestionToEdit(q)}
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
      <div className="mt-4 flex justify-center">
        {Array.from({ length: totalPages }, (_, idx) => (
          <button
            key={idx + 1}
            onClick={() => paginate(idx + 1)}
            className={`mx-1 px-3 py-1 rounded ${currentPage === idx + 1 ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
}