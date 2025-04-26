import { useState } from 'react';
import QuestionForm from './components/QuestionForm';
import QuestionList from './components/QuestionList';

export default function App() {
  const [questionToEdit, setQuestionToEdit] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
console.log("✅ React App is Running");
  const handleSuccess = () => {
    setRefreshKey(oldKey => oldKey + 1); // force reload of QuestionList
    setQuestionToEdit(null); // clear the form after successful add/update
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-center p-6">UPSC Question Bank</h1>
      <div className="max-w-6xl mx-auto">
        <QuestionForm
          onSuccess={handleSuccess}
          questionToEdit={questionToEdit}
          setQuestionToEdit={setQuestionToEdit}
        />
        <QuestionList
          key={refreshKey} // reload when question added or updated
          setQuestionToEdit={setQuestionToEdit}
          onSuccess={handleSuccess}
        />
      </div>
    </div>
  );
}



