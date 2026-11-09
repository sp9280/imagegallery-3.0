import React from "react";
import { Link } from "react-router-dom";
import {
  DocumentTextIcon,
  ShieldCheckIcon,
  ArrowLeftIcon,
  ChevronRightIcon
} from "@heroicons/react/24/outline";

const Terms = () => {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      body: "By accessing and using ImageGallery 3.0, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use our services.",
    },
    {
      title: "2. Use License",
      body: "Permission is granted to temporarily download one copy of the materials on ImageGallery's website for personal, non-commercial transitory viewing only. This constitutes the grant of a license, not a transfer of title.",
    },
    {
      title: "3. User Content",
      body: "Users are responsible for the content they upload. You retain ownership of your content, but grant ImageGallery a license to use, display, and distribute it within the platform. All uploads are subject to our content guidelines.",
    },
    {
      title: "4. Prohibited Uses",
      body: "You may not use our services for any illegal or unauthorized purpose. You must not upload content that violates copyright, trademark, or other intellectual property rights, or content that is harmful, threatening, or offensive.",
    },
    {
      title: "5. Termination",
      body: "We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. All provisions of the Terms which by their nature should survive termination shall survive termination.",
    },
    {
      title: "6. Disclaimer",
      body: "The materials on ImageGallery's website are provided on an 'as is' basis. ImageGallery makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability.",
    },
    {
      title: "7. Limitations",
      body: "In no event shall ImageGallery or its suppliers be liable for any damages arising out of the use or inability to use the materials on ImageGallery's website, even if ImageGallery or an authorized representative has been notified orally or in writing of the possibility of such damage.",
    },
    {
      title: "8. Revisions & Errata",
      body: "The materials appearing on ImageGallery's website could include technical, typographical, or photographic errors. ImageGallery does not warrant that any of the materials on its website are accurate, complete, or current. ImageGallery may make changes to the materials at any time without notice.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-10 space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#070913] via-[#0e1222] to-[#080b18] text-white p-8 sm:p-12 border border-white/10 shadow-2xl">
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-cyan-500/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-purple-600/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-300 hover:text-white transition-colors"
          >
            <ArrowLeftIcon className="w-3.5 h-3.5" />
            <span>Back to Gallery</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-400 via-violet-500 to-pink-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <DocumentTextIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                Terms of Service
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Last updated: {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </p>
            </div>
          </div>
          <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
            Welcome to ImageGallery 3.0. These terms govern your use of our visual sanctuary platform. Please read them carefully before engaging with our creative community.
          </p>
        </div>
      </div>

      {/* Content Sections */}
      <div className="space-y-4">
        {sections.map((section, index) => (
          <div
            key={index}
            className="group bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-white/10 p-6 shadow-sm hover:shadow-lg hover:border-cyan-400/30 transition-all duration-300"
          >
            <div className="flex items-start gap-3">
              <ChevronRightIcon className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5 group-hover:translate-x-1 transition-transform" />
              <div className="space-y-2">
                <h2 className="text-base font-bold text-slate-800 dark:text-white">
                  {section.title}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {section.body}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Contact Footer */}
      <div className="text-center py-6 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 rounded-2xl border border-slate-200 dark:border-white/10">
        <div className="inline-flex items-center gap-2 text-xs font-bold text-cyan-400 mb-2">
          <ShieldCheckIcon className="w-4 h-4" />
          <span>Questions about these terms?</span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Contact us at{" "}
          <a href="mailto:legal@imagegallery.com" className="text-cyan-500 hover:underline font-semibold">
            legal@imagegallery.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default Terms;
