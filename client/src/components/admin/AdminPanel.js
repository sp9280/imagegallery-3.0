import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../services/api";
import Spinner from "../common/Spinner";
import Alert from "../common/Alert";
import { 
  FiShield, FiUsers, FiImage, FiMessageSquare, 
  FiTrendingUp, FiActivity, FiSettings, FiBarChart2,
  FiDatabase, FiLayers
} from "react-icons/fi";

const AdminPanel = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
      return;
    }
    fetchStats();
  }, [user, navigate]);

  const fetchStats = async () => {
    try {
      const res = await api.get("/admin/dashboard");
      setStats(res.data.data);
    } catch (err) {
      setError("Failed to load admin stats");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;

  const statsCards = [
    {
      title: "Total Users",
      value: stats.totalUsers || 0,
      icon: FiUsers,
      gradient: "from-blue-500 to-blue-600",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-500"
    },
    {
      title: "Total Media",
      value: stats.totalMedia || 0,
      icon: FiImage,
      gradient: "from-purple-500 to-purple-600",
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-500"
    },
    {
      title: "Total Comments",
      value: stats.totalComments || 0,
      icon: FiMessageSquare,
      gradient: "from-cyan-500 to-cyan-600",
      iconBg: "bg-cyan-500/10",
      iconColor: "text-cyan-500"
    }
  ];

  const quickActions = [
    {
      title: "Manage Users",
      description: "View and manage all platform users",
      icon: FiUsers,
      route: "/admin/users",
      gradient: "from-blue-500 to-blue-600",
      hoverGradient: "hover:from-blue-600 hover:to-blue-700"
    },
    {
      title: "Manage Images",
      description: "Moderate, edit, and organize all uploaded media",
      icon: FiImage,
      route: "/admin/images",
      gradient: "from-pink-500 to-rose-600",
      hoverGradient: "hover:from-pink-600 hover:to-rose-700"
    },
    {
      title: "View Dashboard",
      description: "Analytics and platform insights",
      icon: FiBarChart2,
      route: "/admin/dashboard",
      gradient: "from-purple-500 to-purple-600",
      hoverGradient: "hover:from-purple-600 hover:to-purple-700"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-500 via-accent-600 to-secondary-500 p-8 md:p-12 shadow-2xl">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            
            <div className="relative flex flex-col md:flex-row items-center gap-6">
              {/* Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="relative"
              >
                <div className="absolute inset-0 bg-white rounded-2xl blur-xl opacity-50"></div>
                <div className="relative bg-white/20 backdrop-blur-sm p-6 rounded-2xl border border-white/30 shadow-xl">
                  <FiShield className="text-white" size={48} />
                </div>
              </motion.div>
              
              {/* Text */}
              <div className="text-center md:text-left flex-1">
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl md:text-5xl font-black text-white mb-3"
                >
                  Admin Control Panel
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-white/90 text-lg max-w-2xl"
                >
                  Manage users, monitor content, and oversee platform operations with powerful administrative tools
                </motion.p>
              </div>

              {/* Activity Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="hidden lg:flex flex-col items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-4 rounded-2xl border border-white/20"
              >
                <FiActivity className="text-white" size={32} />
                <span className="text-white font-bold text-sm">Live Status</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-white/90 text-xs">Active</span>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {error && <Alert message={error} type="error" onClose={() => setError("")} />}
        
        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {statsCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="relative group"
            >
              {/* Glow Effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500 rounded-2xl`}></div>
              
              {/* Card */}
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
                  <stat.icon size={128} />
                </div>
                
                <div className="relative flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                      {stat.title}
                    </p>
                    <p className="text-4xl font-black text-gray-900 dark:text-white mb-1">
                      {stat.value.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-1 text-green-500 text-sm font-semibold">
                      <FiTrendingUp size={14} />
                      <span>Active</span>
                    </div>
                  </div>
                  
                  {/* Icon */}
                  <div className={`${stat.iconBg} p-4 rounded-xl`}>
                    <stat.icon className={stat.iconColor} size={32} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-primary-500 to-accent-500 p-3 rounded-xl">
              <FiLayers className="text-white" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Quick Actions
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <motion.button
                key={action.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                onClick={() => navigate(action.route)}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="group relative overflow-hidden rounded-2xl"
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-r ${action.gradient} transition-all duration-300`}></div>
                <div className={`absolute inset-0 bg-gradient-to-r ${action.gradient} opacity-0 group-hover:opacity-100 transition-all duration-300 blur-sm`}></div>
                
                {/* Content */}
                <div className="relative px-6 py-8 flex items-center gap-4">
                  {/* Icon Container */}
                  <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl border border-white/30 group-hover:scale-110 transition-transform duration-300">
                    <action.icon className="text-white" size={32} />
                  </div>
                  
                  {/* Text */}
                  <div className="flex-1 text-left">
                    <h3 className="text-xl font-bold text-white mb-1">
                      {action.title}
                    </h3>
                    <p className="text-white/80 text-sm">
                      {action.description}
                    </p>
                  </div>
                  
                  {/* Arrow */}
                  <div className="text-white group-hover:translate-x-2 transition-transform duration-300">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* System Status Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-green-500 p-2 rounded-lg">
                <FiDatabase className="text-white" size={20} />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white">Database</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Connection Status</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-600 dark:text-green-400 font-semibold text-sm">Connected</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-blue-500 p-2 rounded-lg">
                <FiActivity className="text-white" size={20} />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white">Server</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Performance</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">Optimal</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-purple-500 p-2 rounded-lg">
                <FiSettings className="text-white" size={20} />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white">System</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Health Check</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span className="text-purple-600 dark:text-purple-400 font-semibold text-sm">All Systems Go</span>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default AdminPanel;