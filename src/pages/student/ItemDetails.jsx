import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useGetItemDetailsQuery } from '../../features/lostFound/lostFoundApiSlice';
import { Calendar, MapPin, Tag, AlertCircle, ArrowLeft, Eye } from 'lucide-react';

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: item, isLoading } = useGetItemDetailsQuery(id);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">Item not found</h3>
        <p className="text-gray-500">The item you're looking for doesn't exist</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back
      </button>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="relative">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-96 object-cover"
            />
          ) : (
            <div className="w-full h-96 bg-gray-100 flex items-center justify-center">
              <Tag className="h-20 w-20 text-gray-300" />
            </div>
          )}
          <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium ${
            item.status === 'claimed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
          }`}>
            {item.status === 'claimed' ? 'Claimed' : 'Available'}
          </span>
        </div>

        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">{item.title}</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start">
                <Tag className="h-5 w-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-700">Item Name</p>
                  <p className="text-gray-600">{item.name}</p>
                </div>
              </div>

              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-700">Location Found</p>
                  <p className="text-gray-600">{item.landmark}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-700">Date Found</p>
                  <p className="text-gray-600">{formatDate(item.createdAt)}</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-medium text-gray-700 mb-3">Description</h2>
              <p className="text-gray-600">{item.description}</p>
            </div>
          </div>

          {item.status !== 'claimed' && (
            <div className="mt-8 flex justify-end">
              <Link
                to={`/student/claim-item/${item._id}`}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Eye className="h-5 w-5 mr-2" />
                Claim This Item
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;