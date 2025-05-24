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
      
      if (diffHours < 0) return { text: 'Past Event', color: 'bg-slate-600/20 text-slate-300 border-slate-400/30' };
      if (diffHours < 24) return { text: 'Today', color: 'bg-pink-600/20 text-pink-400 border-pink-400/30' };
      if (diffHours < 72) return { text: 'Coming Soon', color: 'bg-yellow-400/20 text-yellow-400 border-yellow-400/30' };
      return { text: 'Upcoming', color: 'bg-purple-600/20 text-purple-400 border-purple-400/30' };
    };

    const eventStatus = getEventStatus(event.date);

    return (
      <div className="group relative">
        {/* Card Container with Glass Effect */}
        <div className="bg-slate-800/80 backdrop-blur-[16px] border border-purple-500/30 rounded-3xl overflow-hidden transition-all duration-500 ease-smooth hover:bg-slate-700/90 hover:border-purple-400/60 hover:shadow-[0_25px_50px_-12px_rgba(147,51,234,0.25)] hover:-translate-y-2 hover:scale-[1.02]">
          
          {/* Image with Gradient Overlay */}
          <div className="relative overflow-hidden">
            <img
              src={event.image || defaultEventImage}
              alt={event.title}
              className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
            
            {/* Status Badge */}
            <div className="absolute top-4 right-4">
              <span className={`px-3 py-1 rounded-2xl text-xs font-semibold backdrop-blur-md border ${eventStatus.color}`}>
                {eventStatus.text}
              </span>
            </div>
          </div>
          
          <div className="p-6">
            {/* Header with Title and Expand Button */}
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-white flex-1 mr-3 bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
                {event.title}
              </h3>
              <button
                onClick={() => handleExpandClick(event._id)}
                className={`p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-400/50 transition-all duration-300 ${
                  expanded ? 'rotate-180 border-purple-400/50 bg-purple-600/20' : ''
                }`}
              >
                <ChevronDown size={18} className="text-purple-400" />
              </button>
            </div>

            {/* Date and Time Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-slate-300">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center mr-3 shadow-lg">
                  <Calendar size={16} className="text-white" />
                </div>
                <span className="text-sm font-medium">{formatDate(event.date)}</span>
              </div>
              
              <div className="flex items-center text-slate-300">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center mr-3 shadow-lg">
                  <Clock size={16} className="text-white" />
                </div>
                <span className="text-sm font-medium">{formatTime(event.date)}</span>
              </div>
            </div>

            {/* Expanded Content */}
            {expanded && (
              <div className="border-t border-white/10 pt-6 mt-6 animate-fadeIn">
                <p className="text-slate-300 mb-6 leading-relaxed text-sm">
                  {event.description}
                </p>
                
                {/* Event Details Card */}
                <div className="bg-slate-700/60 backdrop-blur-md border border-purple-400/20 rounded-2xl p-4 mb-6">
                  <h4 className="font-semibold text-purple-400 mb-4 text-sm">Event Details</h4>
                  
                  <div className="space-y-3">
                    {event.location && (
                      <div className="flex items-center text-slate-300">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-pink-600 to-purple-600 flex items-center justify-center mr-3">
                          <MapPin size={14} className="text-white" />
                        </div>
                        <span className="text-sm">{event.location}</span>
                      </div>
                    )}
                    
                    {event.expectedAttendees && (
                      <div className="flex items-center text-slate-300">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center mr-3">
                          <Users size={14} className="text-white" />
                        </div>
                        <span className="text-sm">Expected: {event.expectedAttendees}+ attendees</span>
                      </div>
                    )}
                    
                    {event.organizer && (
                      <div className="flex items-center text-slate-300">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mr-3">
                          <Calendar size={14} className="text-white" />
                        </div>
                        <span className="text-sm">Organized by: {event.organizer}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={() => navigate(`/admin/events/update/${event._id}`)}
                className="flex-1 bg-slate-700/70 hover:bg-slate-600/80 border border-blue-400/30 hover:border-blue-400/60 text-blue-400 px-4 py-3 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-2 backdrop-blur-md hover:shadow-[0_10px_25px_-5px_rgba(59,130,246,0.3)] hover:-translate-y-1"
              >
                <Edit size={16} />
                <span className="font-medium">Edit</span>
              </button>
              <button
                onClick={() => setDeleteDialog({ open: true, eventId: event._id })}
                className="flex-1 bg-slate-700/70 hover:bg-slate-600/80 border border-pink-400/30 hover:border-pink-400/60 text-pink-400 px-4 py-3 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-2 backdrop-blur-md hover:shadow-[0_10px_25px_-5px_rgba(244,114,182,0.3)] hover:-translate-y-1"
              >
                <Trash2 size={16} />
                <span className="font-medium">Delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 rounded-full"></div>
            <div className="absolute inset-2 bg-slate-900 rounded-full"></div>
          </div>
          <h3 className="text-xl font-semibold text-white mt-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Loading events...
          </h3>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-600/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-indigo-600/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-pink-600/10 rounded-full blur-xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 space-y-6 lg:space-y-0">
            <div>
              <h1 className="text-5xl lg:text-7xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
                Events Management
              </h1>
              <p className="text-xl text-slate-300">Manage all your events from here</p>
            </div>
            <button
              onClick={() => navigate('/admin/events/create')}
              className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 px-8 py-4 text-white rounded-2xl shadow-[0_20px_25px_-5px_rgba(0,0,0,0.3)] transition-all duration-300 flex items-center space-x-3 hover:scale-105 hover:-translate-y-1 hover:shadow-[0_25px_50px_-12px_rgba(147,51,234,0.25)]"
            >
              <Plus size={22} />
              <span className="font-semibold">Create New Event</span>
            </button>
          </div>

          {/* Notification */}
          {notification.show && (
            <div className={`fixed top-6 right-6 z-50 p-4 rounded-2xl shadow-2xl backdrop-blur-md border flex items-center space-x-3 animate-slideIn ${
              notification.type === 'success' 
                ? 'bg-purple-600/20 border-purple-400/30 text-purple-400' 
                : 'bg-pink-600/20 border-pink-400/30 text-pink-400'
            }`}>
              <span className="font-medium">{notification.message}</span>
              <button 
                onClick={() => setNotification({ show: false, message: '', type: 'success' })}
                className="p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Content Area */}
          {events.length === 0 ? (
            <div className="text-center py-20">
              <div className="bg-slate-800/80 backdrop-blur-[16px] border border-purple-500/30 rounded-3xl p-12 max-w-lg mx-auto">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <Calendar size={32} className="text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                  No events found
                </h2>
                <p className="text-slate-300 mb-8 text-lg">Start by creating your first event</p>
                <button
                  onClick={() => navigate('/admin/events/create')}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-4 rounded-2xl transition-all duration-300 flex items-center space-x-3 mx-auto hover:scale-105 hover:-translate-y-1 shadow-xl"
                >
                  <Plus size={20} />
                  <span className="font-semibold">Create Event</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          )}

          {/* Delete Confirmation Dialog */}
          {deleteDialog.open && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-slate-800/90 backdrop-blur-[20px] border border-purple-500/40 rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl">
                <h3 className="text-2xl font-bold text-white mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                  Confirm Delete
                </h3>
                <p className="text-slate-300 mb-8 leading-relaxed">
                  Are you sure you want to delete this event? This action cannot be undone.
                </p>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setDeleteDialog({ open: false, eventId: null })}
                    className="flex-1 px-6 py-3 bg-slate-700/70 hover:bg-slate-600/80 border border-slate-500/40 hover:border-slate-400/60 text-white rounded-2xl transition-all duration-300 font-medium backdrop-blur-md"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700 text-white rounded-2xl transition-all duration-300 font-medium shadow-xl hover:scale-105 hover:-translate-y-1"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(100%); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .animate-slideIn {
          animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .ease-smooth {
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.3);
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #9333ea, #db2777);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #7c3aed, #be185d);
        }
      `}</style>
    </div>
  );
};

export default EventsMainPage;