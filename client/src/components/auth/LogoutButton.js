import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";

const LogoutButton = ({ onLogout = null, className = "", showIcon = true }) => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <button
      onClick={handleLogout}
      className={
        className ||
        "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-slate-200 dark:border-slate-700 hover:border-rose-200 dark:hover:border-rose-800 transition-all"
      }
      title="Sign out"
    >
      {showIcon && <ArrowRightOnRectangleIcon className="w-3.5 h-3.5" />}
      <span>Sign out</span>
    </button>
  );
};

export default LogoutButton;
