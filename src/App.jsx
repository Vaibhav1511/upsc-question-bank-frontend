import { useState } from "react";
import QuestionForm from "./components/QuestionForm";
import QuestionList from "./components/QuestionList";

export default function App() {
  const [questionToEdit, setQuestionToEdit] = useState(null);
  const [refreshQuestions, setRefreshQuestions] = useState(false);

  const handleSuccess = () => {
    setRefreshQuestions(prev => !prev); // Toggle to trigger refresh
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">UPSC Question Bank</h1>

      {/* Question Form Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <QuestionForm
          onSuccess={handleSuccess}
          questionToEdit={questionToEdit}
          setQuestionToEdit={setQuestionToEdit}
        />
      </div>

      {/* Saved Questions List Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <QuestionList
          refreshTrigger={refreshQuestions}
          setQuestionToEdit={setQuestionToEdit}
        />
      </div>
    </div>
  );
}