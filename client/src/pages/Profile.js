import React, { useContext, useEffect, useState, useCallback } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import userService from "../services/userService";
import Spinner from "../components/common/Spinner";
import Alert from "../components/common/Alert";
import Layout from "../components/layout/Layout";
import MediaCard from "../components/gallery/MediaCard";

const Profile = () => {
  const { user, logout, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [userMedia, setUserMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    phoneNumber: "",
    secondaryEmail: "",
    nickname: "",
    yearOfStudy: "",
    stream: "",
  });

  const fetchUserMedia = useCallback(async () => {
    try {
      const res = await api.get("/media/user");
      // Response structure: {status: "success", message: "...", data: {items: [...]}}
      setUserMedia(res.data?.data?.items || []);
    } catch (err) {
      setError("Failed to load your media");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchUserMedia();
    // Initialize profile data
    setProfileData({
      phoneNumber: user.phoneNumber || "",
      secondaryEmail: user.secondaryEmail || "",
      nickname: user.nickname || "",
      yearOfStudy: user.yearOfStudy || "",
      stream: user.stream || "",
    });
  }, [user, navigate, fetchUserMedia]);

  const handleProfileUpdate = async () => {
    try {
      setError("");
      setSuccess("");
      const response = await userService.updateProfile(profileData);
      setSuccess("Profile updated successfully!");
      setIsEditing(false);
      // Update user context
      if (setUser && response.data?.user) {
        setUser(response.data.user);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    }
  };

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) return <Layout><Spinner /></Layout>;

  return (
    <Layout>
      <div className="profile-page p-6 max-w-6xl mx-auto">
        <div className="profile-header mb-8 text-center profile-card">
          <h1 className="text-5xl font-extrabold gradient-text mb-3 neon-text">
            My Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">Manage your account and view your uploads</p>
        </div>

        {error && <Alert message={error} type="error" onClose={() => setError("")} />}
        {success && <Alert message={success} type="success" onClose={() => setSuccess("")} />}
        
        <div className="glass-card p-8 mb-6 hover-lift">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold gradient-text">
              User Information
            </h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="btn-creative"
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>

          <div className="space-y-4 bg-white p-6 rounded-xl shadow-inner">
            <p className="text-lg flex justify-between border-b pb-2">
              <strong className="text-gray-700">Username:</strong> 
              <span className="text-orange-600 font-semibold">{user.username}</span>
            </p>
            <p className="text-lg flex justify-between border-b pb-2">
              <strong className="text-gray-700">Email:</strong> 
              <span className="text-orange-600 font-semibold">{user.email}</span>
            </p>
            <p className="text-lg flex justify-between border-b pb-2">
              <strong className="text-gray-700">Role:</strong> 
              <span className="capitalize text-orange-600 font-semibold">{user.role || 'user'}</span>
            </p>
            <p className="text-lg flex justify-between border-b pb-2">
              <strong className="text-gray-700">Joined:</strong> 
              <span className="text-orange-600 font-semibold">
                {user.joiningDate ? new Date(user.joiningDate).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                }) : (user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                }) : 'N/A')}
              </span>
            </p>
            
            {isEditing ? (
              <>
                <div className="mt-4 space-y-4 border-t pt-4">
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Phone Number:</label>
                    <input
                      type="tel"
                      value={profileData.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      className="input-creative"
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Secondary Email:</label>
                    <input
                      type="email"
                      value={profileData.secondaryEmail}
                      onChange={(e) => handleInputChange('secondaryEmail', e.target.value)}
                      className="input-creative"
                      placeholder="Enter secondary email"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Nickname:</label>
                    <input
                      type="text"
                      value={profileData.nickname}
                      onChange={(e) => handleInputChange('nickname', e.target.value)}
                      className="input-creative"
                      placeholder="Enter nickname"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Year of Study:</label>
                    <select
                      value={profileData.yearOfStudy}
                      onChange={(e) => handleInputChange('yearOfStudy', e.target.value)}
                      className="input-creative"
                    >
                      <option value="">Select Year</option>
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                      <option value="Graduate">Graduate</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Stream/Major:</label>
                    <input
                      type="text"
                      value={profileData.stream}
                      onChange={(e) => handleInputChange('stream', e.target.value)}
                      className="input-creative"
                      placeholder="e.g., Computer Science, Engineering"
                    />
                  </div>
                  <button
                    onClick={handleProfileUpdate}
                    className="btn-creative w-full"
                  >
                    Save Changes
                  </button>
                </div>
              </>
            ) : (
              <>
                {(user.phoneNumber || user.secondaryEmail || user.nickname || user.yearOfStudy || user.stream) && (
                  <div className="mt-4 space-y-2 border-t pt-4">
                    {user.phoneNumber && (
                      <p className="text-lg"><strong className="text-gray-700 dark:text-gray-300">Phone:</strong> <span className="gradient-text font-semibold">{user.phoneNumber}</span></p>
                    )}
                    {user.secondaryEmail && (
                      <p className="text-lg"><strong className="text-gray-700 dark:text-gray-300">Secondary Email:</strong> <span className="gradient-text font-semibold">{user.secondaryEmail}</span></p>
                    )}
                    {user.nickname && (
                      <p className="text-lg"><strong className="text-gray-700 dark:text-gray-300">Nickname:</strong> <span className="gradient-text font-semibold">{user.nickname}</span></p>
                    )}
                    {user.yearOfStudy && (
                      <p className="text-lg"><strong className="text-gray-700 dark:text-gray-300">Year:</strong> <span className="gradient-text font-semibold">{user.yearOfStudy}</span></p>
                    )}
                    {user.stream && (
                      <p className="text-lg"><strong className="text-gray-700 dark:text-gray-300">Stream:</strong> <span className="gradient-text font-semibold">{user.stream}</span></p>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        
        <div className="glass-card p-8 hover-lift">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold gradient-text">
              Your Media ({userMedia.length})
            </h2>
          </div>
          
          {userMedia.length > 0 ? (
            <div className="gallery-grid">
              {userMedia.map(item => (
                <MediaCard key={item._id} item={item} onUpdate={fetchUserMedia} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500 dark:text-gray-400 text-xl mb-6 font-semibold">You haven't uploaded any media yet.</p>
              <button
                onClick={() => navigate("/upload")}
                className="btn-creative"
              >
                Upload Your First Media
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
