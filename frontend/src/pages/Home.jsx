import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Sparkles,
  Search,
  Users,
  Calendar,
  MapPin,
  ShieldCheck,
  Star,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  MessageSquare,
  Award,
} from 'lucide-react';
import Button from '../components/Button';
import SkillCard from '../components/SkillCard';
import skillService from '../services/skillService';

const Home = () => {
  const [popularSkills, setPopularSkills] = useState([]);
  const [loadingSkills, setLoadingSkills] = useState(true);

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const data = await skillService.getSkills();
        setPopularSkills(data.slice(0, 8));
      } catch (err) {
        console.error('Error fetching popular skills:', err);
      } finally {
        setLoadingSkills(false);
      }
    };
    fetchPopular();
  }, []);

  const steps = [
    {
      step: '01',
      title: 'Create Your Student Profile',
      desc: 'Sign up with your official college email. Add the skills you know and the skills you wish to learn.',
      icon: Users,
      color: 'from-indigo-500 to-indigo-600',
    },
    {
      step: '02',
      title: 'Discover Talented Peers',
      desc: 'Browse across technical, creative, and aptitude domains to find fellow students ready to mentor.',
      icon: Search,
      color: 'from-violet-500 to-purple-600',
    },
    {
      step: '03',
      title: 'Request a Mentorship',
      desc: 'Send a personalized 1-on-1 request detailing what you need help with and preferred timings.',
      icon: MessageSquare,
      color: 'from-cyan-500 to-blue-600',
    },
    {
      step: '04',
      title: 'Schedule at Safe Locations',
      desc: 'Select an approved on-campus zone like the Library Commons, Tech Labs, or Student Center.',
      icon: MapPin,
      color: 'from-emerald-500 to-teal-600',
    },
    {
      step: '05',
      title: 'Learn, Share & Review',
      desc: 'Collaborate face-to-face, exchange peer feedback, and build your recognized campus reputation.',
      icon: Award,
      color: 'from-amber-500 to-orange-600',
    },
  ];

  const features = [
    {
      title: 'Verified Campus Students',
      desc: 'Every member is an active college peer with verified student credentials, ensuring a trusted network.',
      icon: ShieldCheck,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    },
    {
      title: 'Dual Peer Learning Role',
      desc: 'Every student can learn and mentor simultaneously. Teach Python while learning Acoustic Guitar!',
      icon: BookOpen,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    },
    {
      title: 'Safe Campus Meeting Zones',
      desc: 'Official safe meeting spots pre-approved across college libraries, cafeterias, and departments.',
      icon: MapPin,
      color: 'text-cyan-600 bg-cyan-50 border-cyan-100',
    },
    {
      title: 'Flexible Slot Scheduling',
      desc: 'Mentors set free academic slots. Learners book around classes and exams without scheduling friction.',
      icon: Calendar,
      color: 'text-amber-600 bg-amber-50 border-amber-100',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-indigo-50/50 via-white to-slate-50">
        {/* Decorative background glow */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-indigo-300/30 to-purple-300/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100/70 border border-indigo-200/80 text-xs font-bold text-indigo-700 mb-6 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Next-Gen Campus Peer-to-Peer Micro-Mentorship</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-6">
                Connect. Learn.{' '}
                <span className="text-gradient">Share. Grow.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mb-8 mx-auto lg:mx-0">
                Discover talented students on your campus, learn new skills directly from your peers, and share what you know. From Data Structures and Python to Public Speaking and Music.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-3.5 justify-center lg:justify-start mb-10">
                <Link to="/skills">
                  <Button size="lg" icon={Search} className="w-full sm:w-auto shadow-md">
                    Explore Skills
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="secondary" size="lg" icon={ArrowRight} className="w-full sm:w-auto">
                    Join the Network
                  </Button>
                </Link>
              </div>

              {/* Campus Trust Stats */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200/70 max-w-md mx-auto lg:mx-0 text-left">
                <div>
                  <div className="text-2xl font-extrabold text-slate-900">100%</div>
                  <div className="text-xs text-slate-500 font-medium">Campus Verified</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-indigo-600">Free</div>
                  <div className="text-xs text-slate-500 font-medium">Peer Exchange</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-emerald-600">Safe</div>
                  <div className="text-xs text-slate-500 font-medium">Campus Locations</div>
                </div>
              </div>
            </div>

            {/* Right Interactive Hero Showcase Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200/80">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Live Campus Match</span>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">1-on-1 Session</span>
                </div>

                {/* Simulated Peer Connection Box */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-indigo-50/50 border border-indigo-100">
                    <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                      AS
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">Mentor</div>
                      <div className="text-sm font-bold text-slate-900 truncate">Aarav Sharma • 3rd Year</div>
                      <div className="text-xs text-slate-500">Offers: DSA, Python, Web Dev</div>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      4.9
                    </div>
                  </div>

                  {/* Flow Arrow */}
                  <div className="flex justify-center -my-1">
                    <div className="px-3 py-1 rounded-full bg-slate-100 text-[11px] font-bold text-slate-600 flex items-center gap-1">
                      <span>Matched for Tree Algorithms</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-violet-50/50 border border-violet-100">
                    <div className="w-12 h-12 rounded-xl bg-violet-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                      RV
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-violet-600 uppercase tracking-wide">Learner</div>
                      <div className="text-sm font-bold text-slate-900 truncate">Rohan Verma • 2nd Year</div>
                      <div className="text-xs text-slate-500">Scheduled: Central Library</div>
                    </div>
                    <span className="px-2 py-1 text-[11px] font-semibold rounded-lg bg-emerald-100 text-emerald-800">
                      Confirmed
                    </span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-emerald-500" />
                    <span>Library Commons, Zone 2</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-medium text-slate-700">
                    <Calendar className="w-4 h-4 text-indigo-500" />
                    <span>Tomorrow, 4:00 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 block mb-2">
              Simple 5-Step Experience
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              How Campus Skill Network Works
            </h2>
            <p className="mt-4 text-slate-600 text-base">
              Peer mentorship designed around genuine campus student schedules and safe academic spaces.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {steps.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div
                  key={idx}
                  className="relative p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-white hover:shadow-soft-lg hover:border-indigo-200 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${item.color} text-white flex items-center justify-center shadow-sm`}>
                        <IconComp className="w-5 h-5" />
                      </div>
                      <span className="text-xl font-black text-slate-300">
                        {item.step}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* POPULAR SKILLS SHOWCASE */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 block mb-1">
                Explore The Catalog
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Popular Campus Skills
              </h2>
            </div>
            <Link to="/skills">
              <Button variant="outline" size="sm" icon={ArrowRight}>
                View All Skills
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularSkills.map((sk) => (
              <SkillCard key={sk._id} skill={sk} />
            ))}
          </div>
        </div>
      </section>

      {/* WHY CAMPUS SKILL NETWORK */}
      <section className="py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 block mb-2">
              Built For College Life
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Why Campus Skill Network?
            </h2>
            <p className="mt-4 text-slate-600 text-base">
              The easiest way to bridge the knowledge gap between seniors, juniors, and cross-department peers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feat, i) => {
              const IconComp = feat.icon;
              return (
                <div key={i} className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-card hover:shadow-soft transition-all duration-200">
                  <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center mb-5 ${feat.color}`}>
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-20 bg-gradient-to-r from-indigo-900 via-indigo-800 to-violet-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-300 block mb-3">
            Every Student Is Both A Learner & Mentor
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-6">
            Ready to share your skills and grow together?
          </h2>
          <p className="text-base sm:text-lg text-indigo-100 max-w-2xl mx-auto mb-8 leading-relaxed">
            Join hundreds of fellow students sharing programming, aptitude, sports, and creative crafts right here on campus.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="bg-white text-indigo-900 hover:bg-slate-100 focus:ring-white shadow-xl">
                Join Campus Skill Network
              </Button>
            </Link>
            <Link to="/mentors">
              <Button variant="outline" size="lg" className="border-indigo-400 text-white bg-transparent hover:bg-indigo-800/40">
                Explore Mentors First
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
