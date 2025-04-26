import { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import api from '../api';

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

  const topicOptions = {
    Polity: {
      "INTRODUCTION TO THE CONSTITUTION": ["Historical Background & Colonial rule", "Constituent Assembly", "Salient Features/ Schedules/Parts of the Constitution", "Preamble", "Union and its territory", "Citizenship"],
      "FOUNDATIONS OF THE CONSTITUTION": ["Amendment to the Constitution", "Basic Structure", "Fundamental Rights", "Directives Principles of State Policy (DPSP)", "Fundamental Duties", "Cooperatives", "Emergency Provisions"],
      "SYSTEM OF GOVERNMENT": ["Parliamentary System", "Federal System", "Centre-State/Federal Relations", "Inter- State Relations"],
      "JUDICIARY": ["The Supreme Court", "High Courts", "Lower Judiciary and Tribunals", "Judicial Activism", "Important Judgments"],
      "CENTRE AND STATE EXECUTIVES": ["Union Executive", "State Executive"],
      "UNION AND STATE LEGISLATURE": ["The Parliament", "State Legislature"],
      "LOCAL GOVERNMENT - UNION TERRITORIES - SPECIAL STATUS AREAS": ["Local Governments/PRI", "Union Territories/ Special Areas"],
      "CONSTITUTIONAL AND NON-CONSTITUTIONAL BODIES": ["Constitutional Bodies", "Non-Constitutional Bodies"],
      "MISCELLANEOUS": ["Election", "Anti-Defection Law", "Other Constitutional Dimension"]
    },
    Economy: {
      "BASICS OF ECONOMICS": ["Core Economics and Growth", "National Income", "Planning in India"],
      "PUBLIC FINANCE IN INDIA": ["Fiscal Policy in India", "Taxation in India"],
      "MONEY AND CAPITAL MARKET": ["Monetary Policy and Banking", "Inflation", "Money Market and Capital Market"],
      "DEVELOPMENTAL ECONOMICS": ["Poverty, Health and Unemployment", "Government Schemes"],
      "SECTORS OF ECONOMY": ["Infrastructure and Industries", "Insurance Sector"],
      "EXTERNAL SECTOR AND INTERNATIONAL INSTITUTIONS": ["External Sector", "International Institutions"],
      "AGRICULTURE": ["Agriculture Inputs", "Crops, Cropping Patterns and Sustainable Practices", "Food Processing", "Government Initiatives and International Agreements"]
    }
  };

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
      source
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
      {/* All form fields same as you wrote, no changes needed in JSX structure */}
      <button type="submit" className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
        {questionToEdit ? 'Update Question' : 'Add Question'}
      </button>
    </form>
  );
}