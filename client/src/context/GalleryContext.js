// client/src/context/GalleryContext.js
import React, { createContext, useState, useEffect, useCallback } from "react";
import api from "../services/api";
import {
  socket,
  subscribeToNewMedia,
  subscribeToLike,
  subscribeToComment,
} from "../services/socket";

export const GalleryContext = createContext();

/**
 * Provides global gallery state (media list, filters, likes, etc.)
 * Automatically updates via socket events for real-time sync.
 */
export const GalleryProvider = ({ children }) => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState(null);

  // Fetch all public media
  const fetchMedia = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/media/list");
      // Response structure: {status: "success", message: "...", data: {items: [...], pagination: {...}}}
      if (res.data?.data?.items) setMedia(res.data.data.items);
    } catch (err) {
      console.error("Error fetching media:", err);
      setError("Failed to load media");
    } finally {
      setLoading(false);
    }
  }, []);

  // Like media
  const likeMedia = async (id) => {
    try {
      const res = await api.post(`/media/interaction/${id}/like`);
      const newLikes = res.data?.data?.likes ?? res.data?.likes;
      if (newLikes !== undefined) {
        setMedia((prev) =>
          prev.map((item) =>
            item._id === id
              ? { ...item, likes: newLikes }
              : item
          )
        );
      }
    } catch (err) {
      console.error("Like failed:", err);
    }
  };

  // Add comment
  const addComment = async (id, name, text) => {
    try {
      const res = await api.post(`/media/${id}/comment`, { name, text });
      if (res.data?.data?.comment) {
        setMedia((prev) =>
          prev.map((item) =>
            item._id === id
              ? {
                  ...item,
                  comments: [...(item.comments || []), res.data.data.comment],
                }
              : item
          )
        );
      }
    } catch (err) {
      console.error("Comment failed:", err);
    }
  };

  // Upload media
  const uploadMedia = async (formData) => {
    try {
      const res = await api.post("/media/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data?.media) {
        setMedia((prev) => [res.data.media, ...prev]);
      }
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  // Socket listeners
  useEffect(() => {
    fetchMedia();

    // New upload
    subscribeToNewMedia((newItem) => {
      console.log("🆕 New media received:", newItem);
      setMedia((prev) => [newItem, ...prev]);
    });

    // Like event
    subscribeToLike(({ mediaId, totalLikes }) => {
      setMedia((prev) =>
        prev.map((item) =>
          item._id === mediaId ? { ...item, likes: Array(totalLikes).fill(1) } : item
        )
      );
    });

    // Comment event
    subscribeToComment(({ mediaId, comment }) => {
      setMedia((prev) =>
        prev.map((item) =>
          item._id === mediaId
            ? { ...item, comments: [...(item.comments || []), comment] }
            : item
        )
      );
    });

    return () => {
      socket.off("new_media");
      socket.off("media_liked");
      socket.off("media_commented");
    };
  }, [fetchMedia]);

  return (
    <GalleryContext.Provider
      value={{
        media,
        loading,
        error,
        selectedMedia,
        setSelectedMedia,
        fetchMedia,
        uploadMedia,
        likeMedia,
        addComment,
      }}
    >
      {children}
    </GalleryContext.Provider>
  );
};
