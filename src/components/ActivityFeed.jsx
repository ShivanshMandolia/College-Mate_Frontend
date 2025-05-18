import { Clock, User, BookOpen, Info } from 'lucide-react';

const ActivityFeed = () => {
  // Mock activity data
  const activities = [
    {
      id: 1,
      type: 'notification',
      title: 'New Placement Opportunity',
      message: 'Amazon is recruiting for software engineering internships.',
      time: '2 hours ago',
      icon: <BookOpen className="h-4 w-4 text-purple-500" />
    },
    {
      id: 2,
      type: 'event',
      title: 'Campus Tech Fest',
      message: 'Register for the upcoming tech fest by May.20.',
      time: '1 day ago',
      icon: <Info className="h-4 w-4 text-blue-500" />
    },
    {
      id: 3,
      type: 'update',
      title: 'Lost Item Found',
      message: 'A blue backpack was found in the library.',
      time: '3 days ago',
      icon: <Clock className="h-4 w-4 text-green-500" />
    },
    {
      id: 4,
      type: 'message',
      title: 'Message from Admin',
      message: 'Please complete your profile information.',
      time: '1 week ago',
      icon: <User className="h-4 w-4 text-red-500" />
    }
  ];

  return (
    <div className="dashboard-card overflow-hidden">
      <div className="card-header">
        <h3 className="text-lg font-semibold">Recent Activity</h3>
      </div>
      <div className="divide-y divide-gray-100 dark:divide-gray-700">
        {activities.map((activity) => (
          <div key={activity.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
            <div className="flex items-start">
              <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 mr-3">
                {activity.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {activity.title}
                  </p>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-1">
                    {activity.time}
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {activity.message}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="card-footer text-center">
        <button className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
          View All Activity
        </button>
      </div>
    </div>
  );
};

export default ActivityFeed;