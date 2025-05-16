import { useNavigate } from 'react-router-dom';
import { Search, FileText, Briefcase, Calendar } from 'lucide-react';
import { Button } from '@mui/material';
import { useAuth } from '../hooks/useAuth';

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: Search,
      title: 'Lost & Found',
      description: 'Report lost items or find what others have lost on campus.',
      path: '/lost-found',
    },
    {
      icon: FileText,
      title: 'Complaint Management',
      description: 'Submit and track complaints about campus facilities and services.',
      path: '/complaints',
    },
    {
      icon: Briefcase,
      title: 'Placement Portal',
      description: 'Access job listings, apply for positions, and track your applications.',
      path: '/placements',
    },
    {
      icon: Calendar,
      title: 'Event Management',
      description: 'Stay updated with campus events and register for participation.',
      path: '/events',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-800 to-blue-600 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 md:pr-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Your College Life, <span className="text-amber-400">Simplified</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Manage everything from lost items to job placements in one convenient platform.
            </p>
            {isAuthenticated ? (
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/dashboard')}
                className="px-8 py-3 text-lg font-medium bg-amber-500 hover:bg-amber-600 text-white rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                Go to Dashboard
              </Button>
            ) : (
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate('/register')}
                  className="px-8 py-3 text-lg font-medium bg-amber-500 hover:bg-amber-600 text-white rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                  Get Started
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/login')}
                  className="px-8 py-3 text-lg font-medium border-2 border-white text-white hover:bg-white hover:text-blue-700 rounded-lg transition-all duration-200"
                >
                  Login
                </Button>
              </div>
            )}
          </div>
          <div className="md:w-1/2 mt-12 md:mt-0">
            <img
              src="https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt="College students using the app"
              className="rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need in One Place
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              CollegeMate brings together all the essential services to make your college experience seamless.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-700 p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
                >
                  <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-full inline-block mb-4">
                    <Icon className="h-8 w-8 text-blue-600 dark:text-blue-300" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {feature.description}
                  </p>
                  <Button
                    variant="text"
                    color="primary"
                    onClick={() => navigate(feature.path)}
                    className="text-blue-600 dark:text-blue-400 font-medium hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    Learn More →
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What Students Say
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Hear from students who've transformed their college experience with CollegeMate.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="p-8 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-md"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={`https://i.pravatar.cc/150?img=${item + 10}`}
                    alt="Student"
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">
                      {['Alex Johnson', 'Sarah Parker', 'Mike Chen'][item - 1]}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {['Computer Science', 'Business Admin', 'Engineering'][item - 1]}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 italic">
                  {[
                    "I found my lost laptop through the app within hours! The Lost & Found feature is a lifesaver for forgetful students like me.",
                    "The placement portal helped me land an internship at my dream company. All the job listings and application tracking in one place made the process so much easier.",
                    "Keeping track of campus events used to be a hassle until I started using CollegeMate. Now I never miss important workshops or fun activities!"
                  ][item - 1]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your College Experience?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join thousands of students who've simplified their college life with CollegeMate.
          </p>
          {!isAuthenticated && (
            <Button
              variant="contained"
              onClick={() => navigate('/register')}
              className="px-8 py-3 text-lg font-medium bg-amber-500 hover:bg-amber-600 text-white rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              Get Started for Free
            </Button>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;