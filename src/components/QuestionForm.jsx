import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import api from '../api'; // ✅ Use centralized API config

export default function QuestionForm({ onSuccess }) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("🚀 Submitting question...");

      await api.post('/questions', {
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
      });

      alert('✅ Question added!');
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
      onSuccess?.();
    } catch (error) {
      console.error('❌ Failed to submit:', error);
      alert('Failed to add question.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 max-w-2xl mx-auto border rounded shadow">
      <label className="block
