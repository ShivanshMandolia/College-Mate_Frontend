import { TrendingUp, UserCheck, Calendar, Search } from 'lucide-react';

const StatsCards = () => {
  // Mock stats data
  const stats = [
    {
      id: 1,
      title: 'Attendance',
      value: '92%',
      change: '+2.5%',
      status: 'increase',
      icon: <UserCheck className="h-5 w-5" />,
      color: 'blue'
    },
    {
      id: 2,
      title: 'GPA',
      value: '3.7',
      change: '+0.2',
      status: 'increase',
      icon: <TrendingUp className="h-5 w-5" />,
      color: 'green'
    },
    {
      id: 3,
      title: 'Upcoming Events',
      value: '3',
      change: 'Next: Tech Fest',
      status: 'neutral',
      icon: <Calendar className="h-5 w-5" />,
      color: 'purple'
    },
    {
      id: 4,
      title: 'Lost & Found Items',
      value: '12',
      change: '7 new this week',
      status: 'neutral',
      icon: <Search className="h-5 w-5" />,
      color: 'amber'
    }
  ];

  // Function to get status color
  const getStatusColors = (status, color) => {
    const colors = {
      increase: {
        text: 'text-green-600 dark:text-green-400',
        bg: 'bg-green-100 dark:bg-green-900/20'
      },
      decrease: {
        text: 'text-red-600 dark:text-red-400',
        bg: 'bg-red-100 dark:bg-red-900/20'
      },
      neutral: {
        text: `text-${color}-600 dark:text-${color}-400`,
        bg: `bg-${color}-100 dark:bg-${color}-900/20`
      }
    };
    return colors[status] || colors.neutral;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const statusColors = getStatusColors(stat.status, stat.color);
        return (
          <div key={stat.id} className="dashboard-card hover:translate-y-[-5px]">
            <div className="p-5">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</h3>
                <div className={`p-2 rounded-full ${`bg-${stat.color}-100 dark:bg-${stat.color}-900/20`}`}>
                  <div className={`text-${stat.color}-600 dark:text-${stat.color}-400`}>
                    {stat.icon}
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</span>
                <span className={`text-xs mt-1 ${statusColors.text}`}>
                  {stat.change}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;