import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  useGetLostItemByIdQuery,
  useDeleteLostItemMutation 
} from '../../features/lostFound/lostFoundApiSlice';
import { 
  Calendar, 
  MapPin, 
  Tag, 
  User, 
  Phone, 
  Mail, 
  Clock, 
  ChevronLeft, 
  Trash2,
  AlertCircle,
  AlertTriangle
} from 'lucide-react';

const LostItemDetailPage = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  
  const { 
    data: item, 
    isLoading, 
    isError, 
    error 
  } = useGetLostItemByIdQuery(itemId);
  
  const [deleteLostItem, { isLoading: isDeleting }] = useDeleteLostItemMutation();

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (dateString) => {
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleTimeString(undefined, options);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this lost item request? This action cannot be undone.')) {
      try {
        await deleteLostItem(itemId).unwrap();
        navigate('/student/my-lost-listings');
      } catch (error) {
        console.error('Failed to delete item:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div 
        className="min-h-screen flex justify-center items-center"
        style={{
          background: 'linear-gradient(135deg, #0f172a, #581c87, #0f172a)'
        }}
      >
        <div className="relative">
          <div 
            className="animate-spin rounded-full h-16 w-16 border-t-4 border-r-4 border-transparent"
            style={{
              borderTopColor: '#c084fc',
              borderRightColor: '#a855f7'
            }}
          ></div>
          <div className="absolute inset-0 rounded-full border-2 border-white/10"></div>
        </div>
      </div>
    );
  }

  if (isError || !item) {
    return (
      <div 
        className="min-h-screen px-4 md:px-8 py-8"
        style={{
          background: 'linear-gradient(135deg, #0f172a, #581c87, #0f172a)'
        }}
      >
        <div className="max-w-5xl mx-auto">
          <Link 
            to="/student/lost-found" 
            className="inline-flex items-center mb-8 px-6 py-3 rounded-2xl text-white/90 hover:text-white transition-all duration-300 group"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.10)'
            }}
          >
            <ChevronLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            Back to Lost and Found
          </Link>
          
          <div 
            className="text-center py-20 rounded-3xl border"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(16px)',
              borderColor: 'rgba(255, 255, 255, 0.10)'
            }}
          >
            <div 
              className="inline-flex rounded-full p-6 mb-6"
              style={{
                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 127, 0.1))'
              }}
            >
              <AlertCircle className="h-12 w-12 text-red-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Item not found</h3>
            <p className="text-slate-300 text-lg mb-8 max-w-md mx-auto">
              {error?.data?.message || "This lost item request might have been removed or doesn't exist."}
            </p>
            <Link 
              to="/student/lost-and-found"
              className="inline-block px-8 py-4 rounded-2xl text-white font-semibold transition-all duration-300 hover:scale-105 hover:-translate-y-1"
              style={{
                background: 'linear-gradient(90deg, #9333ea, #db2777, #4f46e5)',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)'
              }}
            >
              Go Back
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const lostItem = item.data;
  const isMyItem = lostItem.isOwner;

  return (
    <div 
      className="min-h-screen px-4 md:px-8 py-8"
      style={{
        background: 'linear-gradient(135deg, #0f172a, #581c87, #0f172a)'
      }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Link 
            to="/student/lost-found" 
            className="inline-flex items-center px-6 py-3 rounded-2xl text-white/90 hover:text-white transition-all duration-300 group"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.10)'
            }}
          >
            <ChevronLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            Back to Lost and Found
          </Link>
          
          {isMyItem && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center px-6 py-3 rounded-2xl text-white font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
              style={{
                background: 'linear-gradient(90deg, #dc2626, #ef4444)',
                boxShadow: '0 10px 25px -5px rgba(220, 38, 38, 0.3)'
              }}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {isDeleting ? 'Deleting...' : 'Delete Request'}
            </button>
          )}
        </div>

        {/* Main Content Card */}
        <div 
          className="rounded-3xl border overflow-hidden"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(16px)',
            borderColor: 'rgba(255, 255, 255, 0.10)'
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Image Section */}
            <div className="p-8">
              {lostItem.imageUrl ? (
                <div className="relative group">
                  <img
                    src={lostItem.imageUrl}
                    alt={lostItem.title}
                    className="w-full h-80 lg:h-96 object-cover rounded-2xl transition-transform duration-500 group-hover:scale-105"
                  />
                  <div 
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: 'linear-gradient(45deg, rgba(147, 51, 234, 0.1), rgba(79, 70, 229, 0.1))'
                    }}
                  ></div>
                </div>
              ) : (
                <div 
                  className="w-full h-80 lg:h-96 flex items-center justify-center rounded-2xl border-2 border-dashed"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderColor: 'rgba(255, 255, 255, 0.20)'
                  }}
                >
                  <div className="text-center">
                    <Tag className="h-16 w-16 text-white/30 mx-auto mb-4" />
                    <p className="text-white/50">No image available</p>
                  </div>
                </div>
              )}
            </div>

            {/* Details Section */}
            <div className="p-8 space-y-8">
              {/* Title and Status */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <h1 className="text-3xl lg:text-4xl font-bold text-white pr-4">{lostItem.title}</h1>
                  <span 
                    className="px-4 py-2 text-sm font-semibold rounded-full whitespace-nowrap"
                    style={{
                      background: 'linear-gradient(90deg, #dc2626, #ef4444)',
                      color: 'white'
                    }}
                  >
                    LOST
                  </span>
                </div>
                
                <div 
                  className="p-4 rounded-2xl border"
                  style={{
                    background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.1), rgba(79, 70, 229, 0.1))',
                    borderColor: 'rgba(147, 51, 234, 0.3)'
                  }}
                >
                  <p className="text-purple-300 flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-3 flex-shrink-0" />
                    Reported lost on {formatDate(lostItem.createdAt)} at {formatTime(lostItem.createdAt)}
                  </p>
                </div>
              </div>

              {/* Item Details */}
              <div className="space-y-6">
                <div className="flex items-start">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center mr-4 flex-shrink-0"
                    style={{
                      background: 'linear-gradient(135deg, #a855f7, #4f46e5)'
                    }}
                  >
                    <Tag className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-slate-300 text-sm mb-1">Item Name</p>
                    <p className="font-semibold text-white text-lg">{lostItem.name}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center mr-4 flex-shrink-0"
                    style={{
                      background: 'linear-gradient(135deg, #6366f1, #2563eb)'
                    }}
                  >
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-slate-300 text-sm mb-1">Lost Near</p>
                    <p className="font-semibold text-white text-lg">{lostItem.landmark}</p>
                  </div>
                </div>
                
                {lostItem.category && (
                  <div className="flex items-start">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center mr-4 flex-shrink-0"
                      style={{
                        background: 'linear-gradient(135deg, #3b82f6, #0891b2)'
                      }}
                    >
                      <Tag className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-slate-300 text-sm mb-1">Category</p>
                      <p className="font-semibold text-white text-lg capitalize">{lostItem.category}</p>
                    </div>
                  </div>
                )}

                {lostItem.lostDate && (
                  <div className="flex items-start">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center mr-4 flex-shrink-0"
                      style={{
                        background: 'linear-gradient(135deg, #8b5cf6, #a855f7)'
                      }}
                    >
                      <Calendar className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-slate-300 text-sm mb-1">Date Lost</p>
                      <p className="font-semibold text-white text-lg">{formatDate(lostItem.lostDate)}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div 
                className="p-6 rounded-2xl border"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderColor: 'rgba(255, 255, 255, 0.10)'
                }}
              >
                <h2 className="text-xl font-bold text-white mb-4">Description</h2>
                <p className="text-slate-300 leading-relaxed">{lostItem.description}</p>
              </div>

              {/* Contact Information */}
              <div 
                className="p-6 rounded-2xl border"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderColor: 'rgba(255, 255, 255, 0.10)'
                }}
              >
                <h2 className="text-xl font-bold text-white mb-6">Contact Information</h2>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0"
                      style={{
                        background: 'linear-gradient(135deg, #c084fc, #f472b6)'
                      }}
                    >
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-slate-300 text-sm mb-1">Posted By</p>
                      <p className="font-semibold text-white">{lostItem.postedBy?.name || "Anonymous"}</p>
                    </div>
                  </div>
                  
                  {lostItem.postedBy?.email && (
                    <div className="flex items-start">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0"
                        style={{
                          background: 'linear-gradient(135deg, #818cf8, #f472b6)'
                        }}
                      >
                        <Mail className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-slate-300 text-sm mb-1">Email</p>
                        <p className="font-semibold text-white break-all">{lostItem.postedBy.email}</p>
                      </div>
                    </div>
                  )}
                  
                  {lostItem.postedBy?.phone && (
                    <div className="flex items-start">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0"
                        style={{
                          background: 'linear-gradient(135deg, #60a5fa, #0891b2)'
                        }}
                      >
                        <Phone className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-slate-300 text-sm mb-1">Phone</p>
                        <p className="font-semibold text-white">{lostItem.postedBy.phone}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LostItemDetailPage;