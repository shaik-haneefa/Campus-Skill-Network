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
  Compass,
} from 'lucide-react';
import Button from '../components/Button';
import SkillCard from '../components/SkillCard';
import Hero3DVisual from '../components/Hero3DVisual';
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
      color: 'from-blue-500 to-indigo-600',
    },
    {
      step: '02',
      title: 'Discover Talented Peers',
      desc: 'Browse across technical, creative, and aptitude domains to find fellow students ready to mentor.',
      icon: Search,
      color: 'from-indigo-500 to-purple-600',
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
      color: 'from-blue-600 to-teal-500',
    },
    {
      step: '05',
      title: 'Learn, Share & Review',
      desc: 'Collaborate face-to-face, exchange peer feedback, and build your recognized campus reputation.',
      icon: Award,
      color: 'from-purple-500 to-pink-600',
    },
  ];

  const features = [
    {
      title: 'Verified Campus Students',
      desc: 'Every member is an active college peer with verified student credentials, ensuring a trusted network.',
      icon: ShieldCheck,
      tag: 'Trust & Safety',
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    },
    {
      title: 'Dual Peer Learning Role',
      desc: 'Every student can learn and mentor simultaneously. Teach Python while learning Acoustic Guitar!',
      icon: BookOpen,
      tag: 'Dual Exchange',
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    },
    {
      title: 'Safe Campus Meeting Zones',
      desc: 'Official safe meeting spots pre-approved across college libraries, cafeterias, and departments.',
      icon: MapPin,
      tag: 'On-Campus',
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    },
    {
      title: 'Flexible Slot Scheduling',
      desc: 'Mentors set free academic slots. Learners book around classes and exams without scheduling friction.',
      icon: Calendar,
      tag: 'Zero Friction',
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#050713] text-[#F8FAFC] selection:bg-blue-600 selection:text-white">
      {/* 1. HERO SECTION WITH 3D VISUAL & LAYERED GLOWS */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32 bg-[#050713]">
        {/* Layered Atmospheric Glows */}
        <div className="absolute top-0 left-0 w-[650px] h-[650px] bg-[#1D4ED8]/18 rounded-full blur-[140px] pointer-events-none -translate-x-1/3 -translate-y-1/3" />
        <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-[#7C3AED]/14 rounded-full blur-[140px] pointer-events-none translate-x-1/3" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#38BDF8]/10 rounded-full blur-[120px] pointer-events-none" />

        {/* 3D Visualizer Canvas (Positioned primarily across the hero background with workstation on the right) */}
        <Hero3DVisual />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[560px]">
            {/* Left Content (Desktop: 7 Cols) */}
            <div className="lg:col-span-7 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-xs font-bold text-[#60A5FA] mb-6 backdrop-blur-md shadow-lg shadow-blue-500/5">
                <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>Next-Gen Campus Peer-to-Peer Micro-Mentorship</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#F8FAFC] tracking-tight leading-[1.15] mb-6">
                Connect. Learn.{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#60A5FA] via-[#38BDF8] to-[#A78BFA]">
                  Share. Grow.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-[#94A3B8] leading-relaxed max-w-2xl mb-8 mx-auto lg:mx-0">
                Discover talented students on your campus, learn new skills directly from your peers, and share what you know. From Data Structures and Python to Public Speaking and Music.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-3.5 justify-center lg:justify-start mb-10">
                <Link to="/skills" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    icon={Search}
                    className="w-full sm:w-auto shadow-lg shadow-blue-600/30 !bg-gradient-to-r !from-blue-600 !via-indigo-600 !to-purple-600 hover:!from-blue-500 hover:!to-purple-500 !border-0 text-white font-bold"
                  >
                    Explore Skills
                  </Button>
                </Link>
                <Link to="/register" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="lg"
                    icon={ArrowRight}
                    className="w-full sm:w-auto !bg-white/[0.04] !border-white/15 !text-[#F8FAFC] hover:!bg-white/10 hover:!border-blue-400/40 backdrop-blur-md font-semibold"
                  >
                    Join the Network
                  </Button>
                </Link>
              </div>

              {/* Campus Trust Stats */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 max-w-md mx-auto lg:mx-0 text-left">
                <div>
                  <div className="text-2xl font-black text-[#F8FAFC]">100%</div>
                  <div className="text-xs text-[#94A3B8] font-medium">Campus Verified</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-[#60A5FA]">Free</div>
                  <div className="text-xs text-[#94A3B8] font-medium">Peer Exchange</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-[#38BDF8]">Safe</div>
                  <div className="text-xs text-[#94A3B8] font-medium">Campus Locations</div>
                </div>
              </div>
            </div>

            {/* Right Interactive Hero Showcase Glass Card (Desktop: 5 Cols) */}
            <div className="lg:col-span-5 relative mt-6 lg:mt-0">
              <div className="relative mx-auto max-w-md bg-[#080B18]/70 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl border border-white/10 hover:border-blue-500/30 transition-all duration-300">
                {/* Subtle internal glow */}
                <div className="absolute top-0 right-0 w-44 h-44 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

                <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4 relative z-10">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400/50" />
                    <span className="text-xs font-bold text-[#F8FAFC] uppercase tracking-wider">Live Campus Match</span>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-[#60A5FA] border border-blue-500/30">
                    1-on-1 Session
                  </span>
                </div>

                {/* Simulated Peer Connection Box */}
                <div className="space-y-4 relative z-10">
                  <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#0B1024]/80 border border-white/10">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-md shadow-blue-600/30">
                      AS
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-[#60A5FA] uppercase tracking-wide">Mentor</div>
                      <div className="text-sm font-bold text-[#F8FAFC] truncate">Aarav Sharma • 3rd Year</div>
                      <div className="text-xs text-[#94A3B8]">Offers: DSA, Python, Web Dev</div>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-1 rounded-lg border border-amber-400/20">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      4.9
                    </div>
                  </div>

                  {/* Flow Badge */}
                  <div className="flex justify-center -my-1">
                    <div className="px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-[11px] font-bold text-[#94A3B8] flex items-center gap-1.5 backdrop-blur-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" />
                      <span>Matched for Tree Algorithms</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#15102B]/80 border border-purple-500/20">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-600 to-violet-600 text-white font-bold flex items-center justify-center text-sm shadow-md shadow-purple-600/30">
                      RV
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-[#A78BFA] uppercase tracking-wide">Learner</div>
                      <div className="text-sm font-bold text-[#F8FAFC] truncate">Rohan Verma • 2nd Year</div>
                      <div className="text-xs text-[#94A3B8]">Scheduled: Central Library</div>
                    </div>
                    <span className="px-2 py-1 text-[11px] font-semibold rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Confirmed
                    </span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-[#94A3B8] relative z-10">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    <span className="text-[#E2E8F0]">Library Commons, Zone 2</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-medium text-[#60A5FA]">
                    <Calendar className="w-4 h-4 text-[#60A5FA]" />
                    <span>Tomorrow, 4:00 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS (5-STEP EXPERIENCE) */}
      <section id="how-it-works" className="py-24 bg-[#080B18]/50 border-y border-white/5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-black uppercase tracking-widest text-[#60A5FA] block mb-2">
              Simple 5-Step Experience
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#F8FAFC] tracking-tight">
              How Campus Skill Network Works
            </h2>
            <p className="mt-3 text-[#94A3B8] text-base">
              Peer mentorship designed around genuine campus student schedules and safe academic spaces.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {steps.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div
                  key={idx}
                  className="relative p-6 rounded-2xl bg-[#0B1024]/60 backdrop-blur-md border border-white/10 hover:bg-[#0F172A]/80 hover:border-blue-500/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between shadow-xl"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${item.color} text-white flex items-center justify-center shadow-md shadow-blue-500/20`}>
                        <IconComp className="w-5 h-5" />
                      </div>
                      <span className="text-xl font-black text-white/20">
                        {item.step}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-[#F8FAFC] mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#94A3B8] leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. POPULAR SKILLS SHOWCASE */}
      <section className="py-24 bg-[#050713]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-[#60A5FA] block mb-1">
                Explore The Catalog
              </span>
              <h2 className="text-3xl font-black text-[#F8FAFC] tracking-tight">
                Popular Campus Skills
              </h2>
            </div>
            <Link to="/skills">
              <Button
                variant="outline"
                size="sm"
                icon={ArrowRight}
                className="!bg-white/[0.04] !border-white/15 !text-[#F8FAFC] hover:!bg-white/10 hover:!border-blue-400/40 backdrop-blur-md"
              >
                View All Skills
              </Button>
            </Link>
          </div>

          {loadingSkills ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-44 rounded-2xl animate-pulse p-5 bg-[#0B1024]/60 border border-white/10"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularSkills.map((sk) => (
                <SkillCard key={sk._id} skill={sk} dark />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. WHY CAMPUS SKILL NETWORK (FEATURES) */}
      <section className="py-24 bg-[#080B18]/60 border-y border-white/5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-black uppercase tracking-widest text-[#60A5FA] block mb-2">
              Built For College Life
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#F8FAFC] tracking-tight">
              Why Campus Skill Network?
            </h2>
            <p className="mt-3 text-[#94A3B8] text-base">
              The easiest way to bridge the knowledge gap between seniors, juniors, and cross-department peers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feat, i) => {
              const IconComp = feat.icon;
              return (
                <div
                  key={i}
                  className="p-6 rounded-2xl bg-[#0B1024]/70 backdrop-blur-md border border-white/10 shadow-xl hover:border-blue-500/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${feat.color}`}>
                        <IconComp className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/10 text-[#94A3B8]">
                        {feat.tag}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-[#F8FAFC] mb-2">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-[#94A3B8] leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION BANNER */}
      <section className="py-24 bg-gradient-to-r from-[#050713] via-[#0B1024] to-[#15102B] text-white relative overflow-hidden border-t border-white/10">
        {/* Glowing Decorative Backgrounds */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/10 text-xs font-bold uppercase tracking-widest text-[#60A5FA] mb-6 backdrop-blur-md">
            <GraduationCap className="w-4 h-4 text-[#38BDF8]" />
            <span>Every Student Is Both A Learner & Mentor</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-6 leading-tight text-[#F8FAFC]">
            Ready to share your skills and grow together?
          </h2>

          <p className="text-base sm:text-lg text-[#94A3B8] max-w-2xl mx-auto mb-10 leading-relaxed">
            Join hundreds of fellow students sharing programming, AI engineering, aptitude, design, and creative crafts right here on campus.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto !bg-gradient-to-r !from-blue-600 !via-indigo-600 !to-purple-600 hover:!from-blue-500 hover:!to-purple-500 text-white font-bold shadow-xl shadow-blue-600/25 !border-0 px-8 py-3.5"
              >
                Join Campus Skill Network
              </Button>
            </Link>
            <Link to="/mentors" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto !bg-white/[0.04] !border-white/15 !text-[#F8FAFC] hover:!bg-white/10 hover:!border-blue-400/40 backdrop-blur-md px-8 py-3.5"
              >
                <Compass className="w-5 h-5 mr-2 text-[#38BDF8]" />
                <span>Explore Mentors First</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
