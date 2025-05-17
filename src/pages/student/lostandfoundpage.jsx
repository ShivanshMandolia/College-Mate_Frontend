import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  useGetAllFoundItemsQuery,
  useGetAllLostRequestsQuery,
  useGetMyListingsQuery,
  useGetMyRequestsQuery,
  useCreateClaimedRequestMutation,
  useGetClaimsForMyItemMutation,
  useUpdateClaimStatusMutation
} from '../../features/lostFound/lostFoundApiSlice';

const LostAndFoundPage = () => {
  // State management
  const [activeTab, setActiveTab] = useState('found');
  const [selectedItem, setSelectedItem] = useState(null);
  const [claimDescription, setClaimDescription] = useState('');
  const [claimImage, setClaimImage] = useState(null);
  const [claimImagePreview, setClaimImagePreview] = useState(null);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [showClaimsListModal, setShowClaimsListModal] = useState(false);
  const [itemClaims, setItemClaims] = useState([]);

  // Redux queries and mutations
  const { data: foundItems, isLoading: isLoadingFound } = useGetAllFoundItemsQuery();
  const { data: lostRequests, isLoading: isLoadingLost } = useGetAllLostRequestsQuery();
  const { data: myListings, isLoading: isLoadingMyListings } = useGetMyListingsQuery();
  const { data: myRequests, isLoading: isLoadingMyRequests } = useGetMyRequestsQuery();
  
  const [createClaimRequest, { isLoading: isSubmittingClaim }] = useCreateClaimedRequestMutation();
  const [getClaimsForItem, { isLoading: isLoadingClaims }] = useGetClaimsForMyItemMutation();
  const [updateClaimStatus, { isLoading: isUpdatingClaim }] = useUpdateClaimStatusMutation();

  // Method to handle claim form submission
  const handleClaimSubmit = async (e) => {
    e.preventDefault();
    
    if (!claimDescription.trim()) {
      toast.error('Please provide a description of your claim');
      return;
    }

    try {
      const formData = {
        itemId: selectedItem._id,
        description: claimDescription,
        image: claimImage
      };

      await createClaimRequest(formData).unwrap();
      toast.success('Claim submitted successfully');
      setShowClaimModal(false);
      resetClaimForm();
    } catch (error) {
      console.error('Error submitting claim:', error);
      toast.error(error?.data?.message || 'Failed to submit claim');
    }
  };

  // Method to handle viewing claims for an item
  const handleViewClaims = async (item) => {
    setSelectedItem(item);
    try {
      const result = await getClaimsForItem(item._id).unwrap();
      setItemClaims(result.data || []);
      setShowClaimsListModal(true);
    } catch (error) {
      console.error('Error fetching claims:', error);
      toast.error('Failed to fetch claims for this item');
    }
  };

  // Method to handle approving or rejecting a claim
  const handleClaimAction = async (userId, status) => {
    try {
      await updateClaimStatus({
        itemId: selectedItem._id,
        userId,
        status
      }).unwrap();
      
      toast.success(`Claim ${status} successfully`);
      setShowClaimsListModal(false);
      
      // Refresh the listings data
      setTimeout(() => {
        myListings.refetch();
      }, 1000);
    } catch (error) {
      console.error('Error updating claim status:', error);
      toast.error('Failed to update claim status');
    }
  };

  // Helper method to reset claim form
  const resetClaimForm = () => {
    setClaimDescription('');
    setClaimImage(null);
    setClaimImagePreview(null);
    setSelectedItem(null);
  };

  // Handler for claim image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setClaimImage(file);
      
      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setClaimImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Format date string for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Render loading state
  const renderLoading = () => (
    <div className="flex justify-center items-center h-40">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  // Render found items list
  const renderFoundItems = () => {
    if (isLoadingFound) return renderLoading();
    
    const items = foundItems?.data || [];
    
    if (items.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          <p>No found items have been reported yet.</p>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(item => (
          <div key={item._id} className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
              <span className={`px-2 py-1 text-xs rounded-full ${
                item.status === 'claimed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {item.status === 'claimed' ? 'Claimed' : 'Available'}
              </span>
            </div>
            {item.imageUrl && (
              <div className="mb-3 h-48 overflow-hidden rounded">
                <img 
                  src={item.imageUrl} 
                  alt={item.title}
                  className="w-full h-full object-cover" 
                />
              </div>
            )}
            <p className="text-sm text-gray-600 mb-2"><span className="font-medium">Item Name:</span> {item.name}</p>
            <p className="text-sm text-gray-600 mb-2"><span className="font-medium">Description:</span> {item.description}</p>
            <p className="text-sm text-gray-600 mb-2"><span className="font-medium">Found Near:</span> {item.landmark}</p>
            <p className="text-sm text-gray-600 mb-1"><span className="font-medium">Date:</span> {formatDate(item.createdAt)}</p>
            
            {item.status !== 'claimed' && (
              <button
                onClick={() => {
                  setSelectedItem(item);
                  setShowClaimModal(true);
                }}
                className="mt-3 w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Claim This Item
              </button>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Render lost item requests
  const renderLostRequests = () => {
    if (isLoadingLost) return renderLoading();
    
    const requests = lostRequests?.data || [];
    
    if (requests.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          <p>No lost item requests have been posted yet.</p>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {requests.map(request => (
          <div key={request._id} className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{request.title}</h3>
            {request.imageUrl && (
              <div className="mb-3 h-48 overflow-hidden rounded">
                <img 
                  src={request.imageUrl} 
                  alt={request.title}
                  className="w-full h-full object-cover" 
                />
              </div>
            )}
            <p className="text-sm text-gray-600 mb-2"><span className="font-medium">Item Name:</span> {request.name}</p>
            <p className="text-sm text-gray-600 mb-2"><span className="font-medium">Description:</span> {request.description}</p>
            <p className="text-sm text-gray-600 mb-2"><span className="font-medium">Last Seen Near:</span> {request.landmark}</p>
            <p className="text-sm text-gray-600 mb-1"><span className="font-medium">Date Reported:</span> {formatDate(request.createdAt)}</p>
            
            <div className="mt-3 text-sm text-gray-500 italic">
              If you found this item, please report it under the "Report Found Item" section.
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Render my listings (items I've reported as found)
  const renderMyListings = () => {
    if (isLoadingMyListings) return renderLoading();
    
    const listings = myListings?.data || [];
    
    if (listings.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          <p>You haven't reported any found items yet.</p>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {listings.map(item => (
          <div key={item._id} className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
              <span className={`px-2 py-1 text-xs rounded-full ${
                item.status === 'claimed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {item.status === 'claimed' ? 'Claimed' : 'Available'}
              </span>
            </div>
            {item.imageUrl && (
              <div className="mb-3 h-40 overflow-hidden rounded">
                <img 
                  src={item.imageUrl} 
                  alt={item.title}
                  className="w-full h-full object-cover" 
                />
              </div>
            )}
            <p className="text-sm text-gray-600 mb-2"><span className="font-medium">Item Name:</span> {item.name}</p>
            <p className="text-sm text-gray-600 mb-2"><span className="font-medium">Description:</span> {item.description}</p>
            <p className="text-sm text-gray-600 mb-1"><span className="font-medium">Date Reported:</span> {formatDate(item.createdAt)}</p>
            
            <button
              onClick={() => handleViewClaims(item)}
              className="mt-3 w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
            >
              View Claims
            </button>
          </div>
        ))}
      </div>
    );
  };

  // Render my claims
  const renderMyClaims = () => {
    if (isLoadingMyRequests) return renderLoading();
    
    const claims = myRequests?.data || [];
    
    if (claims.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          <p>You haven't claimed any items yet.</p>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {claims.map(claim => (
          <div key={claim._id} className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-gray-800">
                {claim.itemId?.title || 'Item Details Not Available'}
              </h3>
              <span className={`px-2 py-1 text-xs rounded-full ${
                claim.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                claim.status === 'approved' ? 'bg-green-100 text-green-800' : 
                'bg-red-100 text-red-800'
              }`}>
                {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
              </span>
            </div>
            
            {claim.proofImage && (
              <div className="mb-3 h-40 overflow-hidden rounded">
                <img 
                  src={claim.proofImage} 
                  alt="Proof of ownership"
                  className="w-full h-full object-cover" 
                />
              </div>
            )}
            
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-medium">Claim Description:</span> {claim.description}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-medium">Date Claimed:</span> {formatDate(claim.createdAt)}
            </p>
            
            {claim.status === 'approved' && (
              <div className="mt-3 p-2 bg-green-50 text-green-700 text-sm rounded">
                Your claim has been approved! Please contact the finder to arrange pickup.
              </div>
            )}
            
            {claim.status === 'rejected' && (
              <div className="mt-3 p-2 bg-red-50 text-red-700 text-sm rounded">
                Your claim was not approved. The item may have been claimed by someone else or insufficient proof was provided.
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Lost and Found</h1>
          <p className="text-gray-600 mt-1">Report, find, and claim lost items around campus</p>
          
          <div className="mt-4 flex flex-wrap gap-2">
            <Link 
              to="/student/post-found-item" 
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Report Found Item
            </Link>
            <Link 
              to="/student/post-lost-item" 
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
            >
              Report Lost Item
            </Link>
          </div>
        </div>
        
        {/* Tabs Navigation */}
        <div className="bg-white rounded-lg shadow-sm p-1 mb-6">
          <div className="flex overflow-x-auto">
            <button 
              onClick={() => setActiveTab('found')}
              className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap ${
                activeTab === 'found' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Found Items
            </button>
            <button 
              onClick={() => setActiveTab('lost')}
              className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap ${
                activeTab === 'lost' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Lost Item Requests
            </button>
            <button 
              onClick={() => setActiveTab('myListings')}
              className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap ${
                activeTab === 'myListings' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              My Listings
            </button>
            <button 
              onClick={() => setActiveTab('myClaims')}
              className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap ${
                activeTab === 'myClaims' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              My Claims
            </button>
          </div>
        </div>
        
        {/* Content based on active tab */}
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
          {activeTab === 'found' && renderFoundItems()}
          {activeTab === 'lost' && renderLostRequests()}
          {activeTab === 'myListings' && renderMyListings()}
          {activeTab === 'myClaims' && renderMyClaims()}
        </div>
      </div>
      
      {/* Claim Modal */}
      {showClaimModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Claim Item: {selectedItem.title}</h3>
            
            <form onSubmit={handleClaimSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Description of Ownership Claim:
                </label>
                <textarea
                  value={claimDescription}
                  onChange={(e) => setClaimDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  rows="4"
                  placeholder="Describe specific details about the item that only the owner would know..."
                  required
                ></textarea>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Proof Image (Optional):
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full"
                />
                {claimImagePreview && (
                  <div className="mt-2 h-32 overflow-hidden rounded border">
                    <img 
                      src={claimImagePreview} 
                      alt="Proof preview"
                      className="w-full h-full object-cover" 
                    />
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Upload an image showing proof of ownership (e.g., photos with the item, receipt, etc.)
                </p>
              </div>
              
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowClaimModal(false);
                    resetClaimForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingClaim || !claimDescription.trim()}
                  className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${
                    isSubmittingClaim || !claimDescription.trim() ? 'opacity-60 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmittingClaim ? 'Submitting...' : 'Submit Claim'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Claims List Modal */}
      {showClaimsListModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6">
            <h3 className="text-xl font-bold mb-2">Claims for: {selectedItem.title}</h3>
            <p className="text-sm text-gray-600 mb-4">Review and manage claims for your item</p>
            
            {isLoadingClaims ? (
              <div className="py-8 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : itemClaims.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                <p>No claims have been submitted for this item yet.</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {itemClaims.map(claim => (
                  <div key={claim._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{claim.userId?.firstName} {claim.userId?.lastName}</p>
                        <p className="text-sm text-gray-600">{claim.userId?.email}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        claim.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        claim.status === 'approved' ? 'bg-green-100 text-green-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                      </span>
                    </div>
                    
                    <p className="text-sm mt-2"><span className="font-medium">Claim:</span> {claim.description}</p>
                    
                    {claim.proofImage && (
                      <div className="mt-2 h-24 w-32 overflow-hidden rounded border">
                        <img 
                          src={claim.proofImage} 
                          alt="Proof of ownership"
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    )}
                    
                    {claim.status === 'pending' && (
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => handleClaimAction(claim.userId._id, 'approved')}
                          disabled={isUpdatingClaim}
                          className={`px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors ${
                            isUpdatingClaim ? 'opacity-60 cursor-not-allowed' : ''
                          }`}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleClaimAction(claim.userId._id, 'rejected')}
                          disabled={isUpdatingClaim}
                          className={`px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors ${
                            isUpdatingClaim ? 'opacity-60 cursor-not-allowed' : ''
                          }`}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowClaimsListModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LostAndFoundPage;