import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import Spinner from "../components/common/Spinner";
import MediaCard from "../components/gallery/MediaCard";

const Categories = () => {
  const { category } = useParams();
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMediaByCategory = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/media/category/${category}`);
      // Response structure: {status: "success", message: "...", data: {items: [...]}}
      setMedia(res.data?.data?.items || []);
    } catch (err) {
      setError("Failed to load media for this category");
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchMediaByCategory();
  }, [fetchMediaByCategory]);

  if (loading) return <Spinner />;

  return (
    <div className="categories-page p-6">
      <h1 className="text-2xl font-bold mb-6 capitalize">{category} Category</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="gallery-grid">
        {media.length > 0 ? (
          media.map((item) => <MediaCard key={item._id} item={item} />)
        ) : (
          <p className="no-media-text">No media found in this category.</p>
        )}
      </div>
    </div>
  );
};

export default Categories;
