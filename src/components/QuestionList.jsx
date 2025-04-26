import { useEffect, useState } from 'react';
import api from '../api';
import topicOptions from '../data/topicOptions.json';

export default function QuestionList({ onEdit }) {
  const [questions, setQuestions] = useState([]);
  const [filters, setFilters] = useState({
    subject: '',
    topic: '',
    subtopic: '',
    source: '',
    question_type: '',
    format: ''
  });
  const [selectedIds, setSelectedIds] = useState([]);

  const fetchQuestions = async () => {
    const params = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params[key] = value;
    });

    const res = await api.get('/questions', { params });
    setQuestions(res.data);
    setSelectedIds([]); // Clear selection after fresh fetch
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete?')) {
      await api.delete(`/questions/${id}`);
      fetchQuestions();
    }
  };

  const toggleSelection = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(q => q !== id) : [...prev, id]
    );
  };

  const handleExportSelected = async () => {
    if (selectedIds.length === 0) {
      alert("Please select questions to export.");
      return;
    }
    const res = await api.post('/questions/export', { ids: selectedIds }, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'selected-questions.pdf');
    document.body.appendChild(link);
    link.click();
  };

  const handleExportAll = async () => {
    const allIds = questions.map(q => q.id);
    if (allIds.length === 0) {
      alert("No questions to export.");
      return;
    }
    const res = await api.post('/questions/export', { ids: allIds }, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'all-filtered-questions.pdf');
    document.body.appendChild(link);
    link.click();
  };

  const applyFilters = () => {
    fetchQuestions();
  };

  const clearFilters = () => {
    setFilters({
      subject: '',
      topic: '',
      subtopic: '',
      source: '',
      question_type: '',
      format: ''
    });
    fetchQuestions();
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <div className="p-4">
      {/* Filter Section */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <select value={filters.subject} onChange={e => setFilters({ ...filters, subject: e.target.value, topic: '', subtopic: '' })}>
          <option value="">Select Subject</option>
          {Object.keys(topicOptions).map(sub => (
            <option key={sub} value={sub}>{sub}</option>
          ))}
        </select>

        {filters.subject && (
          <select value={filters.topic} onChange={e => setFilters({ ...filters, topic: e.target.value, subtopic: '' })}>
            <option value="">Select Topic</option>
            {Object.keys(topicOptions[filters.subject]).map(top => (
              <option key={top} value={top}>{top}</option>
            ))}
          </select>
        )}

        {filters.topic && (
          <select value={filters.subtopic} onChange={e => setFilters({ ...filters, subtopic: e.target.value })}>
            <option value="">Select Subtopic</option>
            {topicOptions[filters.subject][filters.topic].map(st => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        )}

        <input placeholder="Source" value={filters.source} onChange={e => setFilters({ ...filters, source: e.target.value })} />

        <select value={filters.question_type} onChange={e => setFilters({ ...filters, question_type: e.target.value })}>
          <option value="">Select Type</option>
          <option value="Factual">Factual</option>
          <option value="Conceptual">Conceptual</option>
          <option value="Analytical">Analytical</option>
        </select>

        <select value={filters.format} onChange={e => setFilters({ ...filters, format: e.target.value })}>
          <option value="">Select Format</option>
          <option value="Single Liner">Single Liner</option>
          <option value="Two Statement">Two Statement</option>
          <option value="Three Statement">Three Statement</option>
          <option value="More than Three Statements">More than Three Statements</option>
          <option value="Pairing">Pairing</option>
          <option value="Assertion/Reason">Assertion/Reason</option>
        </select>

        <div className="col-span-2 flex space-x-4">
          <button onClick={applyFilters} className="bg-green-600 text-white px-4 py-2 rounded">Apply Filters</button>
          <button onClick={clearFilters} className="bg-gray-600 text-white px-4 py-2 rounded">Clear Filters</button>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={handleExportSelected}
          disabled={selectedIds.length === 0}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Export Selected ({selectedIds.length})
        </button>

        <button
          onClick={handleExportAll}
          disabled={questions.length === 0}
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          Export All
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
                <td className="p-2 space-x-2">
                  <button
                    onClick={() => onEdit(q)}
                    className="bg-yellow-400 text-black px-2 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(q.id)}
                    className="bg-red-600 text-white px-2 py-1 rounded"
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