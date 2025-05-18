import React from 'react';
import { useGetMyRequestsQuery } from '../../features/lostFound/lostFoundApiSlice';
import { Calendar, MapPin, Tag, AlertCircle, Clock, CheckCircle, XCircle } from 'lucide-react';

const MyRequests = () => {
  const { data: requests, isLoading, error } = useGetMyRequestsQuery();

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return {
          color: 'bg-green-100 text-green-800',
          icon: <CheckCircle className="h-4 w-4 mr-1" />,
          text: 'Approved'
        };
      case 'rejected':
        return {
          color: 'bg-red-100 text-red-800',
          icon: <XCircle className="h-4 w-4 mr-1" />,
          text: 'Rejected'
        };
      default:
        return {
          color: 'bg-yellow-100 text-yellow-800',
          icon: <Clock className="h-4 w-4 mr-1" />,
          text: 'Pending'
        };
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">Error loading your requests</h3>
        <p className="text-gray-500">Please try again later</p>
      </div>
    );
  }

  if (!requests?.length) {
    return (
      <div className="text-center py-12">
        <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">No claim requests yet</h3>
        <p className="text-gray-500">You haven't made any claims on found items</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Claim Requests</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {requests.map((request) => {
          const statusBadge = getStatusBadge(request.status);
          const item = request.itemId;

          return (
            <div key={request._id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
              <div className="relative">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                    <Tag className="h-12 w-12 text-gray-300" />
                  </div>
                )}
                <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium flex items-center ${statusBadge.color}`}>
                  {statusBadge.icon}
                  {statusBadge.text}
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-800 line-clamp-1">{item.title}</h3>

                <div className="mt-2 space-y-2">
                  <div className="flex items-start">
                    <Tag className="h-4 w-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                    <p className="text-sm text-gray-600 line-clamp-1">{item.name}</p>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                    <p className="text-sm text-gray-600 line-clamp-1">{item.landmark}</p>
                  </div>
                  <div className="flex items-start">
                    <Calendar className="h-4 w-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                    <p className="text-sm text-gray-600">Claimed on: {formatDate(request.createdAt)}</p>
                  </div>
                </div>

                <div className="mt-3">
                  <h4 className="text-sm font-medium text-gray-700">Your Claim Description:</h4>
                  <p className="text-sm text-gray-600 line-clamp-2">{request.description}</p>
                </div>

                {request.proofImage && (
                  <div className="mt-3">
                    <h4 className="text-sm font-medium text-gray-700">Proof Image:</h4>
                    <img
                      src={request.proofImage}
                      alt="Proof"
                      className="mt-2 rounded-lg w-full h-32 object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyRequests;