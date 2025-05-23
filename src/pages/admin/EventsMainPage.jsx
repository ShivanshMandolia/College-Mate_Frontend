import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronDown, 
  Edit, 
  Trash2, 
  Plus, 
  Calendar,
  X,
  MapPin,
  Users,
  Clock
} from 'lucide-react';
import { 
  useGetAllEventsQuery, 
  useDeleteEventMutation
} from '../../features/events/eventsApiSlice';

const EventsMainPage = () => {
  const navigate = useNavigate();
  const [expandedCards, setExpandedCards] = useState({});
  const [deleteDialog, setDeleteDialog] = useState({ open: false, eventId: null });
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  const { data: eventsResponse, isLoading, error } = useGetAllEventsQuery();
  const [deleteEvent] = useDeleteEventMutation();
  const events = eventsResponse?.data || [];
  const defaultEventImage = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=200&fit=crop';

  const handleExpandClick = (eventId) => {
    setExpandedCards(prev => ({ ...prev, [eventId]: !prev[eventId] }));
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteEvent(deleteDialog.eventId).unwrap();
      setNotification({ show: true, message: 'Event deleted successfully!', type: 'success' });
      setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
    } catch (error) {
      setNotification({ show: true, message: 'Failed to delete event', type: 'error' });
      setTimeout(() => setNotification({ show: false, message: '', type: 'error' }), 3000);
    }
    setDeleteDialog({ open: false, eventId: null });
  };

  const EventCard = ({ event }) => {
    const expanded = expandedCards[event._id] || false;

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
      });
    };

    const formatTime = (dateString) => {
      return new Date(dateString).toLocaleTimeString('en-US', {
        hour: '2-digit', minute: '2-digit', hour12: true
      });
    };

    const getEventStatus = (dateString) => {
      const eventDate = new Date(dateString);
      const now = new Date();
      const diffHours = (eventDate - now) / (1000 * 60 * 60);
      
      if (diffHours < 0) return { text: 'Past Event', color: 'bg-gray-100 text-gray-600' };
      if (diffHours < 24) return { text: 'Today', color: 'bg-red-100 text-red-600' };
      if (diffHours < 72) return { text: 'Coming Soon', color: 'bg-yellow-100 text-yellow-600' };
      return { text: 'Upcoming', color: 'bg-green-100 text-green-600' };
    };

    const eventStatus = getEventStatus(event.date);

    return (
      <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
        <img
          src={event.image || defaultEventImage}
          alt={event.title}
          className="w-full h-48 object-cover"
        />
        
        <div className="p-4">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-semibold text-gray-800 flex-1 mr-2">
              {event.title}
            </h3>
            <button
              onClick={() => handleExpandClick(event._id)}
              className={`p-1 rounded-full hover:bg-gray-100 transition-all duration-200 ${
                expanded ? 'rotate-180' : ''
              }`}
            >
              <ChevronDown size={20} />
            </button>
          </div>

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center text-gray-600">
              <Calendar size={16} className="mr-2" />
              <span className="text-sm">{formatDate(event.date)}</span>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${eventStatus.color}`}>
              {eventStatus.text}
            </span>
          </div>

          <div className="flex items-center text-gray-600 mb-4">
            <Clock size={16} className="mr-2" />
            <span className="text-sm">{formatTime(event.date)}</span>
          </div>

          {expanded && (
            <div className="border-t pt-4 mt-4 animate-fadeIn">
              <p className="text-gray-700 mb-4 leading-relaxed">
                {event.description}
              </p>
              
              <div className="bg-gray-50 p-3 rounded-lg mb-4 space-y-3">
                <h4 className="font-semibold text-sm text-gray-800">Event Details:</h4>
                
                {event.location && (
                  <div className="flex items-center text-gray-600">
                    <MapPin size={16} className="mr-2 flex-shrink-0" />
                    <span className="text-sm">{event.location}</span>
                  </div>
                )}
                
                {event.expectedAttendees && (
                  <div className="flex items-center text-gray-600">
                    <Users size={16} className="mr-2 flex-shrink-0" />
                    <span className="text-sm">Expected: {event.expectedAttendees}+ attendees</span>
                  </div>
                )}
                
                {event.organizer && (
                  <div className="flex items-center text-gray-600">
                    <Calendar size={16} className="mr-2 flex-shrink-0" />
                    <span className="text-sm">Organized by: {event.organizer}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex space-x-2 mt-4">
            <button
              onClick={() => navigate(`/admin/events/update/${event._id}`)}
              className="flex-1 bg-blue-50 text-blue-600 border border-blue-300 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors duration-200 flex items-center justify-center space-x-1"
            >
              <Edit size={16} />
              <span>Edit</span>
            </button>
            <button
              onClick={() => setDeleteDialog({ open: true, eventId: event._id })}
              className="flex-1 bg-red-50 text-red-600 border border-red-300 px-3 py-2 rounded-lg hover:bg-red-100 transition-colors duration-200 flex items-center justify-center space-x-1"
            >
              <Trash2 size={16} />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-medium text-gray-600">Loading events...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Events Management</h1>
            <p className="text-lg text-gray-600">Manage all your events from here</p>
          </div>
          <button
            onClick={() => navigate('/admin/events/create')}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 text-white rounded-lg shadow-lg transition-colors duration-200 flex items-center space-x-2"
          >
            <Plus size={20} />
            <span className="font-medium">Create New Event</span>
          </button>
        </div>

        {notification.show && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
            notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white flex items-center space-x-2`}>
            <span>{notification.message}</span>
            <button onClick={() => setNotification({ show: false, message: '', type: 'success' })}>
              <X size={16} />
            </button>
          </div>
        )}

        {events.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
              <h2 className="text-2xl font-semibold text-gray-500 mb-4">No events found</h2>
              <p className="text-gray-400 mb-6">Start by creating your first event</p>
              <button
                onClick={() => navigate('/admin/events/create')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 flex items-center space-x-2 mx-auto"
              >
                <Plus size={20} />
                <span>Create Event</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}

        {deleteDialog.open && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
              <p className="text-gray-600 mb-6">Are you sure you want to delete this event? This action cannot be undone.</p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setDeleteDialog({ open: false, eventId: null })}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default EventsMainPage;