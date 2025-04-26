import { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import api from '../api';
import topicOptions from '../data/topicOptions.json';

export default function QuestionForm({ onSuccess, questionToEdit, setQuestionToEdit }) {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState({ A: '', B: '', C: '', D: '' });
  const [answer, setAnswer] = useState('A');
  const [explanation, setExplanation] = useState('');
  const [tags, setTags] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');
  const [image, setImage] = useState('');
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [subtopic, setSubtopic] = useState('');
  const [questionType, setQuestionType] = useState('Factual');
  const [format, setFormat] = useState('Single Liner');
  const [source, setSource] = useState('');



  useEffect(() => {
    if (questionToEdit) {
      setQuestion(questionToEdit.question_text || '');
      setOptions({
        A: questionToEdit.option_a || '',
        B: questionToEdit.option_b || '',
        C: questionToEdit.option_c || '',
        D: questionToEdit.option_d || ''
      });
      setAnswer(questionToEdit.correct_option || 'A');
      setExplanation(questionToEdit.explanation || '');
      setTags(questionToEdit.tags || '');
      setDifficulty(questionToEdit.difficulty || 'Easy');
      setImage(questionToEdit.image_url || '');
      setSubject(questionToEdit.subject || '');
      setTopic(questionToEdit.topic || '');
      setSubtopic(questionToEdit.subtopic || '');
      setQuestionType(questionToEdit.question_type || 'Factual');
      setFormat(questionToEdit.format || 'Single Liner');
      setSource(questionToEdit.source || '');
    }
  }, [questionToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      question_text: question,
      option_a: options.A,
      option_b: options.B,
      option_c: options.C,
      option_d: options.D,
      correct_option: answer,
      explanation,
      tags,
      difficulty,
      image_url: image,
      subject,
      topic,
      subtopic,
      question_type: questionType,
      format,
      source,
    };

    try {
      if (questionToEdit) {
        await api.put(`/questions/${questionToEdit.id}`, payload);
        alert('✅ Question updated!');
        setQuestionToEdit(null);
      } else {
        await api.post('/questions', payload);
        alert('✅ Question added!');
      }

      setQuestion('');
      setOptions({ A: '', B: '', C: '', D: '' });
      setAnswer('A');
      setExplanation('');
      setTags('');
      setDifficulty('Easy');
      setImage('');
      setSubject('');
      setTopic('');
      setSubtopic('');
      setQuestionType('Factual');
      setFormat('Single Liner');
      setSource('');
      onSuccess?.();
    } catch (error) {
      console.error('❌ Failed to submit:', error);
      alert('Failed to save question.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 max-w-2xl mx-auto border rounded shadow">

      <label className="block font-bold">Question</label>
      <ReactQuill value={question} onChange={setQuestion} />

      {['A', 'B', 'C', 'D'].map(opt => (
        <input
          key={opt}
          placeholder={`Option ${opt}`}
          value={options[opt]}
          onChange={(e) => setOptions({ ...options, [opt]: e.target.value })}
          className="block w-full border p-2 mt-2"
        />
      ))}

      <label className="block mt-4 font-bold">Correct Option</label>
      <select value={answer} onChange={e => setAnswer(e.target.value)} className="block w-full p-2 border">
        <option value="A">A</option><option value="B">B</option>
        <option value="C">C</option><option value="D">D</option>
      </select>

      <label className="block mt-4 font-bold">Explanation</label>
      <ReactQuill value={explanation} onChange={setExplanation} />

      <input
        placeholder="Tags (comma separated)"
        value={tags}
        onChange={e => setTags(e.target.value)}
        className="block w-full border p-2 mt-4"
      />

      <label className="block mt-4 font-bold">Difficulty</label>
      <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className="block w-full p-2 border">
        <option>Easy</option><option>Medium</option><option>Hard</option>
      </select>

      <input
        placeholder="Image URL"
        value={image}
        onChange={e => setImage(e.target.value)}
        className="block w-full border p-2 mt-4"
      />

      {/* Subject Dropdown */}
      <label className="block mt-4 font-bold">Subject</label>
      <select
        value={subject}
        onChange={e => {
          setSubject(e.target.value);
          setTopic('');
          setSubtopic('');
        }}
        className="block w-full p-2 border"
      >
        <option value="">Select a Subject</option>
        {Object.keys(topicOptions).map(sub => (
          <option key={sub} value={sub}>{sub}</option>
        ))}
      </select>

      {/* Topic Dropdown */}
      <label className="block mt-4 font-bold">Topic</label>
      <select
        value={topic}
        onChange={e => {
          setTopic(e.target.value);
          setSubtopic('');
        }}
        className="block w-full p-2 border"
        disabled={!subject}
      >
        <option value="">Select a Topic</option>
        {subject && Object.keys(topicOptions[subject]).map(tp => (
          <option key={tp} value={tp}>{tp}</option>
        ))}
      </select>

      {/* Subtopic Dropdown */}
      <label className="block mt-4 font-bold">Subtopic</label>
      <select
        value={subtopic}
        onChange={e => setSubtopic(e.target.value)}
        className="block w-full p-2 border"
        disabled={!topic}
      >
        <option value="">Select a Subtopic</option>
        {subject && topic && topicOptions[subject][topic]?.map(sub => (
          <option key={sub} value={sub}>{sub}</option>
        ))}
      </select>

      <label className="block mt-4 font-bold">Type</label>
      <select value={questionType} onChange={e => setQuestionType(e.target.value)} className="block w-full p-2 border">
        <option>Factual</option><option>Conceptual</option><option>Analytical</option>
      </select>

      <label className="block mt-4 font-bold">Format</label>
      <select value={format} onChange={e => setFormat(e.target.value)} className="block w-full p-2 border">
        <option>Single Liner</option><option>Two Statement</option><option>Three Statement</option>
        <option>More than Three Statements</option><option>Pairing</option><option>Assertion/Reason</option>
      </select>

      <input
        placeholder="Source (e.g., PYQ, Mock Test, Current Affairs)"
        value={source}
        onChange={e => setSource(e.target.value)}
        className="block w-full border p-2 mt-4"
      />

      <button type="submit" className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
        {questionToEdit ? 'Update Question' : 'Add Question'}
      </button>
    </form>
  );
}