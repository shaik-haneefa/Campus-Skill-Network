import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Heart, Shield, Sparkles, MapPin, Mail, ArrowUpRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                Campus<span className="text-indigo-400">Skill</span> Network
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm mb-6">
              "Connect. Learn. Share. Grow." — A peer-to-peer micro-mentorship and skill exchange platform built specifically for college campuses.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-800/80 px-3.5 py-2 rounded-xl border border-slate-700/50 w-fit">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Safe campus-verified student community</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/skills" className="hover:text-indigo-400 transition-colors">
                  Explore Skills
                </Link>
              </li>
              <li>
                <Link to="/mentors" className="hover:text-indigo-400 transition-colors">
                  Discover Mentors
                </Link>
              </li>
              <li>
                <a href="/#how-it-works" className="hover:text-indigo-400 transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <Link to="/register" className="hover:text-indigo-400 transition-colors flex items-center gap-1">
                  Become a Mentor <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources & Safety */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Campus & Safety
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-1.5 text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                <span>Verified Meeting Zones</span>
              </li>
              <li className="text-slate-400">
                Official College Email Verification
              </li>
              <li className="text-slate-400">
                Peer Review Guidelines
              </li>
              <li className="text-slate-400">
                Code of Conduct
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Support
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-1.5 text-slate-400">
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                <span>support@campusskill.edu</span>
              </li>
              <li className="text-slate-400">
                Student Help Desk
              </li>
              <li className="text-slate-400">
                FAQ & Guidelines
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright & Disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Campus Skill Network. Academic & Student Community Project.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Campus Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
