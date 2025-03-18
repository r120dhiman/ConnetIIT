import { Header } from '../components/layout/Header';
import { toast } from 'react-toastify';

const Home = () => {
  const handleToast = () => {
    toast.success('Button clicked! Welcome to Connect IT!');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <Header />
        <h1 className="text-4xl font-bold text-center text-blue-600 mt-4">Welcome to Connect IT</h1>
        <button 
          onClick={handleToast} 
          className="mt-4 bg-blue-500 text-white rounded-md py-2 px-4 hover:bg-blue-600"
        >
          Show Toast
        </button>
    </div>
  )
}

export default Home;
