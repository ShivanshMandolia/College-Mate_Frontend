import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, Typography, Badge, Chip, Avatar, Button, Divider } from '@mui/material';
import { Bell, Calendar, Search, FileText, Briefcase, ChevronRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

// Mock data
const notifications = [
  { id: 1, type: 'lost', message: 'Someone found your lost water bottle', time: '2 hours ago', read: false },
  { id: 2, type: 'event', message: 'New tech fest event registration open', time: '1 day ago', read: true },
  { id: 3, type: 'placement', message: 'Google campus interview scheduled', time: '2 days ago', read: false },
];

const upcomingEvents = [
  { id: 1, name: 'Tech Workshop', date: '2023-10-15', time: '10:00 AM', location: 'Engineering Block' },
  { id: 2, name: 'Career Fair', date: '2023-10-20', time: '9:00 AM', location: 'Main Auditorium' },
];

const activeComplaints = [
  { id: 1, title: 'Wi-Fi issues in Library', status: 'In Progress', updatedAt: '1 day ago' },
];

const recentLostItems = [
  { id: 1, name: 'Blue Water Bottle', location: 'Cafeteria', reportedAt: '2 days ago', status: 'found' },
];

const placementUpdates = [
  { id: 1, company: 'Microsoft', role: 'Software Engineer', deadline: '2023-10-25', status: 'Open' },
  { id: 2, company: 'Amazon', role: 'Product Manager', deadline: '2023-10-30', status: 'Open' },
];

const DashboardPage = () => {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Calculate unread notifications
    const count = notifications.filter(notification => !notification.read).length;
    setUnreadCount(count);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
      case 'found':
        return 'success';
      case 'in progress':
        return 'warning';
      case 'closed':
      case 'lost':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Welcome, {user?.name || 'Student'}!
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Here's what's happening on campus
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button
              variant="contained"
              color="primary"
              startIcon={<Bell />}
            >
              <Badge badgeContent={unreadCount} color="error">
                Notifications
              </Badge>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Notifications */}
          <Card variant="outlined" className="bg-white dark:bg-gray-800 shadow-sm">
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <Typography variant="h6" className="font-semibold text-gray-900 dark:text-white">
                  Recent Notifications
                </Typography>
                <Link to="#" className="text-blue-600 dark:text-blue-400 text-sm hover:underline">
                  View all
                </Link>
              </div>
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg flex items-start ${
                      notification.read
                        ? 'bg-gray-50 dark:bg-gray-700'
                        : 'bg-blue-50 dark:bg-blue-900'
                    }`}
                  >
                    <div className="mr-3">
                      {notification.type === 'lost' ? (
                        <div className="p-2 bg-amber-100 dark:bg-amber-800 rounded-full">
                          <Search className="h-5 w-5 text-amber-600 dark:text-amber-300" />
                        </div>
                      ) : notification.type === 'event' ? (
                        <div className="p-2 bg-green-100 dark:bg-green-800 rounded-full">
                          <Calendar className="h-5 w-5 text-green-600 dark:text-green-300" />
                        </div>
                      ) : (
                        <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-full">
                          <Briefcase className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`text-gray-900 dark:text-white ${!notification.read && 'font-medium'}`}>
                        {notification.message}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                        {notification.time}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="ml-2 w-2 h-2 bg-blue-600 rounded-full"></div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card variant="outlined" className="bg-white dark:bg-gray-800 shadow-sm">
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <Typography variant="h6" className="font-semibold text-gray-900 dark:text-white">
                  Upcoming Events
                </Typography>
                <Link to="/events" className="text-blue-600 dark:text-blue-400 text-sm hover:underline">
                  View all events
                </Link>
              </div>
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {event.name}
                        </h3>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <span className="text-gray-600 dark:text-gray-300 text-sm flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {event.date}, {event.time}
                          </span>
                          <span className="text-gray-600 dark:text-gray-300 text-sm ml-3">
                            {event.location}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        className="mt-3 md:mt-0"
                      >
                        Register
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Placement Updates */}
          <Card variant="outlined" className="bg-white dark:bg-gray-800 shadow-sm">
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <Typography variant="h6" className="font-semibold text-gray-900 dark:text-white">
                  Placement Opportunities
                </Typography>
                <Link to="/placements" className="text-blue-600 dark:text-blue-400 text-sm hover:underline">
                  View all
                </Link>
              </div>
              <div className="space-y-4">
                {placementUpdates.map((placement) => (
                  <div key={placement.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {placement.company}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mt-1">
                          {placement.role}
                        </p>
                      </div>
                      <Chip
                        label={placement.status}
                        color={getStatusColor(placement.status) as "success" | "warning" | "error" | "default"}
                        size="small"
                      />
                    </div>
                    <Divider className="my-3" />
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300 text-sm">
                        Apply by: {placement.deadline}
                      </span>
                      <Button
                        variant="text"
                        color="primary"
                        endIcon={<ChevronRight className="h-4 w-4" />}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* User Profile Card */}
          <Card variant="outlined" className="bg-white dark:bg-gray-800 shadow-sm">
            <CardContent>
              <div className="flex flex-col items-center text-center">
                <Avatar
                  src={user?.profileImage}
                  alt={user?.name}
                  className="w-20 h-20 mb-4"
                >
                  {user?.name?.charAt(0).toUpperCase()}
                </Avatar>
                <Typography variant="h6" className="font-semibold text-gray-900 dark:text-white">
                  {user?.name}
                </Typography>
                <Typography variant="body2" className="text-gray-600 dark:text-gray-300">
                  {user?.email}
                </Typography>
                <div className="mt-4 w-full">
                  <Button
                    variant="outlined"
                    color="primary"
                    fullWidth
                    className="mt-2"
                  >
                    Edit Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lost and Found */}
          <Card variant="outlined" className="bg-white dark:bg-gray-800 shadow-sm">
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <Typography variant="h6" className="font-semibold text-gray-900 dark:text-white">
                  Lost & Found
                </Typography>
                <Link to="/lost-found" className="text-blue-600 dark:text-blue-400 text-sm hover:underline">
                  View all
                </Link>
              </div>
              {recentLostItems.length > 0 ? (
                <div className="space-y-4">
                  {recentLostItems.map((item) => (
                    <div key={item.id} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      <div className="flex justify-between">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {item.name}
                        </h3>
                        <Chip
                          label={item.status}
                          color={getStatusColor(item.status) as "success" | "warning" | "error" | "default"}
                          size="small"
                        />
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                        Location: {item.location}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 text-xs mt-2">
                        Reported {item.reportedAt}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 dark:text-gray-400">No active lost items</p>
                </div>
              )}
              <div className="mt-4">
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Report Lost Item
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Active Complaints */}
          <Card variant="outlined" className="bg-white dark:bg-gray-800 shadow-sm">
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <Typography variant="h6" className="font-semibold text-gray-900 dark:text-white">
                  Active Complaints
                </Typography>
                <Link to="/complaints" className="text-blue-600 dark:text-blue-400 text-sm hover:underline">
                  View all
                </Link>
              </div>
              {activeComplaints.length > 0 ? (
                <div className="space-y-4">
                  {activeComplaints.map((complaint) => (
                    <div key={complaint.id} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      <div className="flex justify-between">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {complaint.title}
                        </h3>
                        <Chip
                          label={complaint.status}
                          color={getStatusColor(complaint.status) as "success" | "warning" | "error" | "default"}
                          size="small"
                        />
                      </div>
                      <p className="text-gray-500 dark:text-gray-400 text-xs mt-2">
                        Updated {complaint.updatedAt}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 dark:text-gray-400">No active complaints</p>
                </div>
              )}
              <div className="mt-4">
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  File New Complaint
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;