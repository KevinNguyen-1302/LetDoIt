import { Mail, Heart, ExternalLink, GitFork } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full mt-16 border-t-4 border-black bg-[#fdfcf7] text-black">
      {/* Upper part of footer */}
      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
        {/* Brand & Description (taking about 40-50% width on large screens) */}
        <div className="flex-1 md:max-w-md space-y-4">
          <div className="inline-block">
            <span className="font-black text-2xl bg-[#eff759] text-black px-4 py-1.5 rounded-lg border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              Let's DoIt
            </span>
          </div>
          <p className="text-gray-700 text-sm md:text-base leading-relaxed">
            Your ultimate neo-brutalist workspace. Organize tasks, manage team
            collaborations, and track progress in real-time. Built for creators,
            developers, and doers.
          </p>

          {/* Social Links */}
          <div className="flex gap-3 pt-2">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-white border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all flex items-center justify-center"
              aria-label="GitHub"
            >
              <GitFork size={20} />
            </a>
            <a
              href="mailto:contact@letdoit.com"
              className="w-10 h-10 bg-white border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all flex items-center justify-center"
              aria-label="Email"
            >
              <Mail size={20} />
            </a>
          </div>
        </div>

        {/* Links Navigation */}
        <div className="flex flex-wrap gap-12 md:gap-16">
          <div className="space-y-3">
            <h3 className="font-black text-lg uppercase tracking-wider text-black">
              Navigation
            </h3>
            <ul className="space-y-2 font-bold text-gray-700">
              <li>
                <Link
                  to="/home"
                  className="hover:text-black hover:underline flex items-center gap-1"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-black hover:underline">
                  Sign In
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="hover:text-black hover:underline"
                >
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-black text-lg uppercase tracking-wider text-black">
              Resources
            </h3>
            <ul className="space-y-2 font-bold text-gray-700">
              <li>
                <a
                  href="#"
                  className="hover:text-black hover:underline flex items-center gap-1"
                >
                  Documentation <ExternalLink size={14} />
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black hover:underline">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black hover:underline">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Mascot image section (25% width of container) */}
        <div className="w-full md:w-[15%] flex justify-center md:justify-end">
          <img
            src="/Gemini_Generated_Image_yf4qg9yf4qg9yf4q.png"
            alt="Mascot"
            className="tilt-image w-full max-w-[180px] md:max-w-full object-contain border-4 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-white p-2"
          />
        </div>
      </div>

      {/* Footer bottom bar */}
      <div className="border-t-2 border-black bg-white py-6">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-bold text-sm text-gray-800">
            &copy; {new Date().getFullYear()} Let's DoIt. All rights reserved.
          </p>
          <p className="font-bold text-sm text-gray-800 flex items-center gap-1">
            Made with{" "}
            <Heart
              size={16}
              className="text-red-500 fill-red-500 animate-pulse"
            />{" "}
            by Nguyen Khang.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
