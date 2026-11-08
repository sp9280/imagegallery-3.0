import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../services/api";
import Spinner from "../common/Spinner";
import Alert from "../common/Alert";
import { 
  FiUsers, FiImage, FiMessageSquare, FiHeart, 
  FiBarChart2, FiClock, FiTrendingUp, FiActivity,
  FiInbox
} from "react-icons/fi";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await api.get("/admin/dashboard");
      setDashboardData(res.data.data);
    } catch (err) {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;

  const statsCards = [
    {
      title: "Total Users",
      value: dashboardData.totalUsers || 0,
      icon: FiUsers,
      gradient: "from-blue-500 to-blue-600",
      desc: "Registered accounts"
    },
    {
      title: "Total Media",
      value: dashboardData.totalMedia || 0,
      icon: FiImage,
      gradient: "from-purple-500 to-purple-600",
      desc: "Uploaded files"
    },
    {
      title: "Total Comments",
      value: dashboardData.totalComments || 0,
      icon: FiMessageSquare,
      gradient: "from-cyan-500 to-cyan-600",
      desc: "User interactions"
    },
    {
      title: "Total Likes",
      value: dashboardData.totalLikes || 0,
      icon: FiHeart,
      gradient: "from-pink-500 to-pink-600",
      desc: "Community engagement"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
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
                  <FiBarChart2 className="text-white" size={48} />
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
                  Analytics Dashboard
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-white/90 text-lg"
                >
                  Real-time platform statistics and activity monitoring
                </motion.p>
              </div>

              {/* Live Indicator */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="hidden lg:flex flex-col items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-4 rounded-2xl border border-white/20"
              >
                <FiActivity className="text-white" size={32} />
                <span className="text-white font-bold text-sm">Real-time</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-white/90 text-xs">Live</span>
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
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
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-20 group-hover:opacity-40 blur-xl transition-all duration-500 rounded-2xl`}></div>
              
              {/* Card */}
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
                  <stat.icon size={128} />
                </div>
                
                <div className="relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`bg-gradient-to-br ${stat.gradient} p-3 rounded-xl shadow-lg`}>
                      <stat.icon className="text-white" size={24} />
                    </div>
                    <div className="flex items-center gap-1.5 text-green-500 text-xs font-bold">
                      <FiTrendingUp size={14} />
                      <span>Active</span>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      {stat.title}
                    </p>
                    <p className="text-4xl font-black text-gray-900 dark:text-white mb-1">
                      {stat.value.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {stat.desc}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Recent Activity Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-primary-500 to-accent-500 p-3 rounded-xl">
              <FiClock className="text-white" size={24} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Recent Activity
            </h3>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-6">
            {dashboardData.recentActivity && dashboardData.recentActivity.length > 0 ? (
              <ul className="space-y-3">
                {dashboardData.recentActivity.map((activity, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="group relative bg-white dark:bg-gray-800 border-l-4 border-primary-500 pl-4 pr-4 py-4 rounded-r-xl hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                          {activity.description}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
                          <FiClock size={14} />
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-primary-100 dark:bg-primary-900/30 p-2 rounded-lg">
                        <FiActivity className="text-primary-600 dark:text-primary-400" size={16} />
                      </div>
                    </div>
                  </motion.li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-16">
                <div className="inline-block mb-4 p-6 bg-gray-200 dark:bg-gray-700 rounded-2xl">
                  <FiInbox className="text-gray-400 dark:text-gray-500" size={64} />
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
                  No recent activity to display
                </p>
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                  Activity will appear here once users start interacting with the platform
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;