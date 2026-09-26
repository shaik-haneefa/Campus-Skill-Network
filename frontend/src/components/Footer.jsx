import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Heart, Shield, Sparkles, MapPin, Mail, ArrowUpRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#050713] text-[#94A3B8] pt-16 pb-12 border-t border-white/10 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Brand Info */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 border border-white/15">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="font-extrabold text-xl text-[#F8FAFC] tracking-tight">
                Campus<span className="text-[#38BDF8]">Skill</span> Network
              </span>
            </Link>
            <p className="text-sm text-[#94A3B8] leading-relaxed max-w-sm mb-6">
              "Connect. Learn. Share. Grow." — A peer-to-peer micro-mentorship and skill exchange platform built specifically for college campuses.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#CBD5E1] bg-white/[0.04] px-3.5 py-2 rounded-xl border border-white/10 w-fit backdrop-blur-md">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Safe campus-verified student community</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC] mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/skills" className="hover:text-[#60A5FA] transition-colors">
                  Explore Skills
                </Link>
              </li>
              <li>
                <Link to="/mentors" className="hover:text-[#60A5FA] transition-colors">
                  Discover Mentors
                </Link>
              </li>
              <li>
                <a href="/#how-it-works" className="hover:text-[#60A5FA] transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <Link to="/register" className="hover:text-[#60A5FA] transition-colors flex items-center gap-1">
                  Become a Mentor <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources & Safety */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC] mb-4">
              Campus & Safety
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-1.5 text-[#94A3B8]">
                <MapPin className="w-3.5 h-3.5 text-[#60A5FA]" />
                <span>Verified Meeting Zones</span>
              </li>
              <li className="text-[#94A3B8]">
                Official College Email Verification
              </li>
              <li className="text-[#94A3B8]">
                Peer Review Guidelines
              </li>
              <li className="text-[#94A3B8]">
                Code of Conduct
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC] mb-4">
              Support
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-1.5 text-[#94A3B8]">
                <Mail className="w-3.5 h-3.5 text-[#60A5FA]" />
                <span>support@campusskill.edu</span>
              </li>
              <li className="text-[#94A3B8]">
                Student Help Desk
              </li>
              <li className="text-[#94A3B8]">
                FAQ & Guidelines
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright & Disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#94A3B8] gap-4">
          <p>© {new Date().getFullYear()} Campus Skill Network. Academic & Student Community Project.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-[#CBD5E1] cursor-pointer">Privacy Policy</span>
            <span className="hover:text-[#CBD5E1] cursor-pointer">Terms of Service</span>
            <span className="hover:text-[#CBD5E1] cursor-pointer">Campus Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
