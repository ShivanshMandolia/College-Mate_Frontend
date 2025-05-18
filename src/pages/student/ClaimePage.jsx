import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetItemDetailsQuery, useCreateClaimRequestMutation } from '../../features/lostFound/lostFoundApiSlice';
import { Calendar, MapPin, Tag, AlertCircle, Upload, ArrowLeft } from 'lucide-react';

const ClaimPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [description, setDescription] = useState('');
  const [proofImage, setProofImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const { data: item, isLoading: itemLoading } = useGetItemDetailsQuery(id);
  const [createClaim, { isLoading: claimLoading }] = useCreateClaimRequestMutation();

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProofImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('itemId', id);
      formData.append('description', description);
      if (proofImage) {
        formData.append('image', proofImage);
      }

      await createClaim(formData).unwrap();
      navigate('/student/my-requests');
    } catch (err) {
      console.error('Failed to submit claim:', err);
    }
  };

  if (itemLoading) {
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Item Details */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="relative">
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-64 object-cover"
              />
            ) : (
              <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
                <Tag className="h-16 w-16 text-gray-300" />
              </div>
            )}
          </div>

          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h2>

            <div className="space-y-4">
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

            <div className="mt-6">
              <h3 className="font-medium text-gray-700 mb-2">Description</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          </div>
        </div>

        {/* Claim Form */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Submit Your Claim</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Describe why this item belongs to you
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Provide specific details about the item that only the owner would know..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Proof (Optional)
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                      <span>Upload a file</span>
                      <input
                        type="file"
                        className="sr-only"
                        onChange={handleImageChange}
                        accept="image/*"
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
              {imagePreview && (
                <div className="mt-4">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-32 w-auto rounded-lg"
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={claimLoading}
              className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                claimLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {claimLoading ? 'Submitting...' : 'Submit Claim'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClaimPage;