import { useEffect, useState } from "react";
import api from "../api";
import topicOptions from "../data/topicOptions.json";

export default function QuestionList() {
  const [questions, setQuestions] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [subtopic, setSubtopic] = useState("");
  const [source, setSource] = useState("");
  const [questionType, setQuestionType] = useState("");
  const [format, setFormat] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchQuestions = async (isLoadMore = false) => {
    const params = {
      page,
      limit: 20,
    };
    if (subject) params.subject = subject;
    if (topic) params.topic = topic;
    if (subtopic) params.subtopic = subtopic;
    if (source) params.source = source;
    if (questionType) params.question_type = questionType;
    if (format) params.format = format;

    const res = await api.get("/questions", { params });
    const fetched = res.data;

    if (isLoadMore) {
      setQuestions(prev => [...prev, ...fetched]);
    } else {
      setQuestions(fetched);
    }

    if (fetched.length < 20) {
      setHasMore(false); // No more questions to load
    } else {
      setHasMore(true);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchQuestions();
  }, [subject, topic, subtopic, source, questionType, format]);

  const handleApplyFilters = () => {
    setPage(1);
    fetchQuestions();
  };

  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  useEffect(() => {
    if (page > 1) {
      fetchQuestions(true);
    }
  }, [page]);

  const clearFilters = () => {
    setSubject("");
    setTopic("");
    setSubtopic("");
    setSource("");
    setQuestionType("");
    setFormat("");
    setPage(1);
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

  return (
    <div className="p-4 mt-6">
      <h2 className="text-xl font-bold mb-4">Saved Questions</h2>

      {/* Filters */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        <select value={subject} onChange={e => { setSubject(e.target.value); setTopic(''); setSubtopic(''); }} className="p-2 border">
          <option value="">Filter by Subject</option>
          {Object.keys(topicOptions).map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select value={topic} onChange={e => { setTopic(e.target.value); setSubtopic(''); }} className="p-2 border" disabled={!subject}>
          <option value="">Filter by Topic</option>
          {subject && topicOptions[subject] && Object.keys(topicOptions[subject]).map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <select value={subtopic} onChange={e => setSubtopic(e.target.value)} className="p-2 border" disabled={!topic}>
          <option value="">Filter by Subtopic</option>
          {subject && topic && topicOptions[subject][topic]?.map(st => (
            <option key={st} value={st}>{st}</option>
          ))}
        </select>

        <input placeholder="Source" value={source} onChange={e => setSource(e.target.value)} className="p-2 border" />

        <select value={questionType} onChange={e => setQuestionType(e.target.value)} className="p-2 border">
          <option value="">Filter by Type</option>
          <option value="Factual">Factual</option>
          <option value="Conceptual">Conceptual</option>
          <option value="Analytical">Analytical</option>
        </select>

        <select value={format} onChange={e => setFormat(e.target.value)} className="p-2 border">
          <option value="">Filter by Format</option>
          <option value="Single Liner">Single Liner</option>
          <option value="Two Statement">Two Statement</option>
          <option value="Three Statement">Three Statement</option>
          <option value="More than Three Statements">More than Three Statements</option>
          <option value="Pairing">Pairing</option>
          <option value="Assertion/Reason">Assertion/Reason</option>
        </select>

        <div className="col-span-2 md:col-span-3 flex gap-2">
          <button onClick={handleApplyFilters} className="bg-blue-500 text-white px-4 py-2 rounded">Apply Filters</button>
          <button onClick={clearFilters} className="bg-gray-500 text-white px-4 py-2 rounded">Clear Filters</button>
        </div>
      </div>

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
                <td className="p-2">{q.source}</td>
                <td className="p-2 space-x-2">
                  <button onClick={() => handleDelete(q.id)} className="bg-red-500 text-white px-2 py-1 rounded">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {hasMore && (
        <div className="flex justify-center mt-4">
          <button onClick={loadMore} className="bg-green-500 text-white px-6 py-2 rounded">
            Load More
          </button>
        </div>
      )}
    </div>
  );
}