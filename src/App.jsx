import QuestionForm from './components/QuestionForm';
import QuestionList from './components/QuestionList';

function App() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">UPSC Question Bank</h1>
      <QuestionForm onSuccess={() => window.location.reload()} />
      <QuestionList />
    </div>
  );
}

export default App;


console.log("✅ React App is Running");
