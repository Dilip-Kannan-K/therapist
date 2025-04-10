
import Dashboard from "@/components/dashboard/Dashboard";

const Home = () => {
  return (
    <div className="min-h-screen bg-lilac">
      <div className="container mx-auto py-2">
        <h2 className="text-center text-lg text-gray-600 font-display">
          A safe place to learn and grow
        </h2>
        <Dashboard />
      </div>
    </div>
  );
};

export default Home;
