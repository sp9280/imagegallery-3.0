import React, { useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";
import api from "../../services/api";
import Spinner from "../common/Spinner";
import Alert from "../common/Alert";
import Layout from "../layout/Layout";
import { 
  FiUsers, FiUserPlus, FiX, FiCheck, FiShield, 
  FiUserCheck, FiUserX, FiTrash2, FiInfo, FiEdit2 
} from "react-icons/fi";

const ManageUsers = () => {
  const { user: currentUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    role: "user"
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/users");
      setUsers(res.data.data);
    } catch (err) {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      await api.patch(`/admin/users/${userId}`, { active: !currentStatus });
      setUsers(users.map(user =>
        user._id === userId ? { ...user, active: !currentStatus } : user
      ));
      setSuccess("User status updated successfully");
    } catch (err) {
      setError("Failed to update user status");
    }
  };

  const changeUserRole = async (userId, newRole) => {
    try {
      await api.patch(`/admin/users/${userId}`, { role: newRole });
      setUsers(users.map(user =>
        user._id === userId ? { ...user, role: newRole } : user
      ));
      setSuccess(`User role updated to ${newRole}`);
    } catch (err) {
      setError("Failed to update user role");
    }
  };

  const deleteUser = async (userId, username) => {
    if (!window.confirm(`Are you sure you want to delete user "${username}"? This will also delete all their media. This action cannot be undone.`)) {
      return;
    }

    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers(users.filter(user => user._id !== userId));
      setSuccess("User deleted successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete user");
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    
    if (!newUser.username || !newUser.email || !newUser.password) {
      setError("All fields are required");
      return;
    }

    try {
      const res = await api.post("/admin/users", newUser);
      setUsers([res.data.data.user, ...users]);
      setSuccess("User created successfully");
      setShowAddUser(false);
      setNewUser({ username: "", email: "", password: "", role: "user" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create user");
    }
  };

  if (loading) return <Layout><Spinner /></Layout>;

  return (
    <Layout>
      <div className="manage-users px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-primary-500 to-accent-500 p-3 rounded-xl shadow-lg">
              <FiUsers className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900 dark:text-white">
                Manage Users
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {users.length} total users
              </p>
            </div>
          </div>
          
          <motion.button
            onClick={() => setShowAddUser(!showAddUser)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold shadow-lg transition-all ${
              showAddUser
                ? "bg-gray-500 hover:bg-gray-600 text-white"
                : "bg-gradient-to-r from-primary-500 to-accent-600 hover:from-primary-600 hover:to-accent-700 text-white"
            }`}
          >
            {showAddUser ? (
              <>
                <FiX size={18} />
                <span>Cancel</span>
              </>
            ) : (
              <>
                <FiUserPlus size={18} />
                <span>Add New User</span>
              </>
            )}
          </motion.button>
        </motion.div>

        {error && <Alert message={error} type="error" onClose={() => setError("")} />}
        {success && <Alert message={success} type="success" onClose={() => setSuccess("")} />}

        {/* Add User Form */}
        {showAddUser && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8 border border-primary-200 dark:border-primary-800"
          >
            <div className="flex items-center gap-2 mb-6">
              <FiUserPlus className="text-primary-600" size={24} />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Create New User
              </h2>
            </div>
            
            <form onSubmit={handleAddUser} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Username *
                  </label>
                  <input
                    type="text"
                    value={newUser.username}
                    onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:border-primary-500 dark:focus:border-primary-400 focus:outline-none transition-all"
                    required
                    placeholder="Enter username"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:border-primary-500 dark:focus:border-primary-400 focus:outline-none transition-all"
                    required
                    placeholder="Enter email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:border-primary-500 dark:focus:border-primary-400 focus:outline-none transition-all"
                    required
                    placeholder="Enter password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Role
                  </label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:border-primary-500 dark:focus:border-primary-400 focus:outline-none transition-all cursor-pointer"
                  >
                    <option value="user">User</option>
                    <option value="coadmin">Co-Admin</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-success-500 to-success-600 hover:from-success-600 hover:to-success-700 text-white px-6 py-4 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <FiCheck size={20} />
                <span>Create User</span>
              </button>
            </form>
          </motion.div>
        )}

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-primary-500 to-accent-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-bold">Username</th>
                  <th className="px-6 py-4 text-left font-bold">Email</th>
                  <th className="px-6 py-4 text-left font-bold">Role</th>
                  <th className="px-6 py-4 text-left font-bold">Status</th>
                  <th className="px-6 py-4 text-left font-bold">Joined</th>
                  <th className="px-6 py-4 text-center font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <motion.tr
                    key={user._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`border-t border-gray-200 dark:border-gray-700 transition-colors ${
                      index % 2 === 0 
                        ? 'bg-gray-50 dark:bg-gray-900/50' 
                        : 'bg-white dark:bg-gray-800'
                    } hover:bg-primary-50 dark:hover:bg-primary-900/20`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {user.username}
                        </span>
                        {user._id === currentUser?._id && (
                          <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full font-bold">
                            You
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                      {user.email}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={user.role}
                        onChange={(e) => changeUserRole(user._id, e.target.value)}
                        disabled={user._id === currentUser?._id}
                        className={`px-3 py-2 rounded-lg font-semibold border-2 focus:outline-none transition-all ${
                          user.role === 'admin' 
                            ? 'bg-danger-100 dark:bg-danger-900/30 text-danger-800 dark:text-danger-200 border-danger-300 dark:border-danger-700' 
                            : user.role === 'coadmin' 
                              ? 'bg-accent-100 dark:bg-accent-900/30 text-accent-800 dark:text-accent-200 border-accent-300 dark:border-accent-700' 
                              : 'bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200 border-primary-300 dark:border-primary-700'
                        } ${user._id === currentUser?._id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-md'}`}
                      >
                        <option value="user">User</option>
                        <option value="coadmin">Co-Admin</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold ${
                        user.active 
                          ? 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-200' 
                          : 'bg-danger-100 dark:bg-danger-900/30 text-danger-700 dark:text-danger-200'
                      }`}>
                        {user.active ? (
                          <>
                            <FiCheck size={14} />
                            Active
                          </>
                        ) : (
                          <>
                            <FiX size={14} />
                            Inactive
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => toggleUserStatus(user._id, user.active)}
                          disabled={user._id === currentUser?._id}
                          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-1.5 ${
                            user._id === currentUser?._id 
                              ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed' 
                              : user.active
                                ? "bg-warning-500 hover:bg-warning-600 text-white shadow-md hover:shadow-lg"
                                : "bg-success-500 hover:bg-success-600 text-white shadow-md hover:shadow-lg"
                          }`}
                          title={user.active ? "Deactivate User" : "Activate User"}
                        >
                          {user.active ? (
                            <>
                              <FiUserX size={16} />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <FiUserCheck size={16} />
                              Activate
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => deleteUser(user._id, user.username)}
                          disabled={user._id === currentUser?._id}
                          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-1.5 ${
                            user._id === currentUser?._id
                              ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                              : 'bg-danger-500 hover:bg-danger-600 text-white shadow-md hover:shadow-lg'
                          }`}
                          title="Delete User"
                        >
                          <FiTrash2 size={16} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {users.length === 0 && (
            <div className="text-center py-16">
              <div className="inline-block mb-4 p-6 bg-gray-200 dark:bg-gray-700 rounded-2xl">
                <FiUsers className="text-gray-400 dark:text-gray-500" size={64} />
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
                No users found
              </p>
            </div>
          )}
        </motion.div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-l-4 border-primary-500 p-6 rounded-xl shadow-lg"
        >
          <div className="flex items-start gap-3">
            <div className="bg-primary-500 p-2 rounded-lg mt-0.5">
              <FiInfo className="text-white" size={20} />
            </div>
            <div>
              <h3 className="font-bold text-primary-800 dark:text-primary-200 mb-3 text-lg">
                Role Permissions
              </h3>
              <ul className="text-sm text-primary-700 dark:text-primary-300 space-y-2">
                <li className="flex items-start gap-2">
                  <FiCheck className="text-primary-600 dark:text-primary-400 mt-0.5" size={16} />
                  <span><strong>User:</strong> Can upload and manage their own media</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheck className="text-primary-600 dark:text-primary-400 mt-0.5" size={16} />
                  <span><strong>Co-Admin:</strong> Can moderate content and manage comments</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheck className="text-primary-600 dark:text-primary-400 mt-0.5" size={16} />
                  <span><strong>Admin:</strong> Full access to all features including user management</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default ManageUsers;