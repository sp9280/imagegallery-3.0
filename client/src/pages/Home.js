// client/src/pages/Home.js
import React from "react";
import { motion } from "framer-motion";
import EnhancedHeader from "../components/layout/EnhancedHeader";
import EnhancedFooter from "../components/layout/EnhancedFooter";
import EnhancedGallery from "../components/gallery/EnhancedGallery";
import { pageTransition } from "../utils/animations";

const Home = () => {
  return (
    <motion.div
      className="home-page min-h-screen"
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <EnhancedHeader />
      <main className="pt-20">
        <EnhancedGallery />
      </main>
      <EnhancedFooter />
    </motion.div>
  );
};

export default Home;
