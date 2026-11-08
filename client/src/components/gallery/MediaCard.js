// client/src/components/gallery/MediaCard.js
import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import ImageModal from "./ImageModal";
import { EyeIcon, HeartIcon, ChatBubbleLeftIcon } from "@heroicons/react/24/solid";

const MediaCard = ({ item, onUpdate }) => {
  const { user } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);

  const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:4000/api";
  const BACKEND_BASE = API_BASE.replace('/api', '');
  const fullImageUrl = item.url?.startsWith('http') ? item.url : `${BACKEND_BASE}${item.url}`;
  const hidden = item.isHidden;

  return (
    <>
      <div
        className={`group relative bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${hidden ? 'opacity-50 grayscale' : ''}`}
      >
        <div
          className="relative aspect-[4/3] overflow-hidden cursor-pointer"
          onClick={() => setShowModal(true)}
        >
          <img
            src={fullImageUrl}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/320x250?text=Image+Not+Found';
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
            <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              <p className="text-white text-sm font-medium truncate">{item.title}</p>
              <div className="flex items-center gap-4 mt-2 text-white/90">
                <div className="flex items-center gap-1 text-xs">
                  <HeartIcon className="w-4 h-4" />
                  <span>{item.likes?.length || 0}</span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <ChatBubbleLeftIcon className="w-4 h-4" />
                  <span>{item.comments?.length || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {hidden && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full uppercase tracking-wider">
                Hidden
              </span>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <ImageModal
          item={item}
          onClose={() => setShowModal(false)}
          onUpdate={onUpdate}
        />
      )}
    </>
  );
};

export default MediaCard;
