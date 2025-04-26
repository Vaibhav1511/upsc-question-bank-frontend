import { useEffect, useState } from "react";
import api from "../api";

export default function QuestionList() {
  const [questionToEdit, setQuestionToEdit] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [subtopic, setSubtopic] = useState('');
  const [source, setSource] = useState('');
  const [type, setType] = useState('');
  const [format, setFormat] = useState('');

  const fetchQuestions = async () => {
    const params = {};

    if (subject) params.subject = subject;
    if (topic) params.topic = topic;
    if (subtopic) params.subtopic = subtopic;
    if (source) params.source = source;
    if (type) params.question_type = type;
    if (format) params.format = format;

    const res = await api.get("/questions", { params });
    setQuestions(res.data);
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

  const clearFilters = () => {
    setSubject('');
    setTopic('');
    setSubtopic('');
    setSource('');
    setType('');
    setFormat('');
  };

  useEffect(() => {
    fetchQuestions();
  }, [subject, topic, subtopic, source, type, format]);

  return (
    <div className="p-4 mt-6">
      <h2 className="text-xl font-bold mb-4">Saved Questions</h2>

      {/* FILTER BAR */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        <select value={subject} onChange={e => setSubject(e.target.value)} className="border p-2 rounded">
          <option value="">All Subjects</option>
          <option>Polity</option>
          <option>Economy</option>
          <option>Geography</option>
          <option>Environment</option>
          <option>Ancient History</option>
          <option>Medieval History</option>
          <option>Modern History</option>
          <option>Post Independence</option>
          <option>Science and Technology</option>
          <option>Sport & Awards</option>
          <option>Miscellaneous</option>
        </select>

        <input
          placeholder="Topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          placeholder="Subtopic"
          value={subtopic}
          onChange={(e) => setSubtopic(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          placeholder="Source"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="border p-2 rounded"
        />

        <select value={type} onChange={e => setType(e.target.value)} className="border p-2 rounded">
          <option value="">All Types</option>
          <option>Factual</option>
          <option>Conceptual</option>
          <option>Analytical</option>
        </select>

        <select value={format} onChange={e => setFormat(e.target.value)} className="border p-2 rounded">
          <option value="">All Formats</option>
          <option>Single Liner</option>
          <option>Two Statement</option>
          <option>Three Statement</option>
          <option>More than Three Statements</option>
          <option>Pairing</option>
          <option>Assertion/Reason</option>
        </select>
      </div>

      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handleExport}
          disabled={selectedIds.length === 0}
          className="bg-green-600 text-white px-3 py-1 rounded"
        >
          Export Selected ({selectedIds.length})
        </button>

        <button onClick={clearFilters} className="text-sm underline text-blue-600">Clear All Filters</button>
      </div>

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
              <th className="p-2">Tags</th>
              <th className="p-2">Source</th>
              <th className="p-2">Image</th>
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
                <td className="p-2">{q.tags}</td>
                <td className="p-2">{q.source || '—'}</td>
                <td className="p-2">
                  {q.image_url ? (
                    <img src={q.image_url} alt="Question" className="h-12 w-auto" />
                  ) : (
                    '—'
                  )}
                </td>
                <td className="p-2 space-x-2">
                  <button onClick={() => setQuestionToEdit(q)} className="bg-blue-500 text-white px-2 py-1 rounded">Edit</button>
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
