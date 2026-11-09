import React from "react";
import { Link } from "react-router-dom";
import {
  LockClosedIcon,
  ShieldCheckIcon,
  ArrowLeftIcon,
  ChevronRightIcon
} from "@heroicons/react/24/outline";

const Privacy = () => {
  const sections = [
    {
      title: "1. Information We Collect",
      body: "We collect information you provide directly to us, such as when you create an account, upload content, or contact us for support. This includes your username, email address, profile details, and any media you choose to share.",
    },
    {
      title: "2. How We Use Your Information",
      body: "We use the information we collect to provide, maintain, and improve our services, process transactions, communicate with you about updates, and provide technical support. We also use analytics to understand how users interact with our platform.",
    },
    {
      title: "3. Information Sharing",
      body: "We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy. We may share information with service providers who assist us in operating our platform.",
    },
    {
      title: "4. Data Security",
      body: "We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include encryption, access controls, and regular security audits.",
    },
    {
      title: "5. Cookies & Tracking",
      body: "We use cookies and similar technologies to enhance your experience on our site, remember your preferences, and analyze site traffic. You can control cookie settings through your browser settings at any time.",
    },
    {
      title: "6. Third-Party Services",
      body: "Our service may contain links to third-party websites or services that are not owned or controlled by us. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites.",
    },
    {
      title: "7. Children's Privacy",
      body: "Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe we have collected such information, please contact us immediately for removal.",
    },
    {
      title: "8. Changes to This Policy",
      body: "We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the 'last updated' date. You are advised to review this page periodically.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-10 space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#070913] via-[#0e1222] to-[#080b18] text-white p-8 sm:p-12 border border-white/10 shadow-2xl">
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-purple-600/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-pink-500/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-300 hover:text-white transition-colors"
          >
            <ArrowLeftIcon className="w-3.5 h-3.5" />
            <span>Back to Gallery</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-400 via-violet-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <LockClosedIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                Privacy Policy
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Last updated: {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </p>
            </div>
          </div>
          <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
            Your privacy is paramount to us. This policy explains how we collect, use, and protect your personal information when you use ImageGallery 3.0's visual sanctuary platform.
          </p>
        </div>
      </div>

      {/* Quick Summary Card */}
      <div className="flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-r from-cyan-500/5 via-violet-500/5 to-pink-500/5 border border-cyan-400/20">
        <ShieldCheckIcon className="w-8 h-8 text-cyan-400 shrink-0" />
        <div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-white">
            Your Data is Protected
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            We use industry-standard encryption and never sell your personal data to third parties.
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
      <div className="text-center py-6 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-2xl border border-slate-200 dark:border-white/10">
        <div className="inline-flex items-center gap-2 text-xs font-bold text-purple-400 mb-2">
          <ShieldCheckIcon className="w-4 h-4" />
          <span>Privacy concerns?</span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Contact us at{" "}
          <a href="mailto:privacy@imagegallery.com" className="text-purple-500 hover:underline font-semibold">
            privacy@imagegallery.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default Privacy;
