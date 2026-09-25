require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const Skill = require('./models/Skill');
const Location = require('./models/Location');
const MentorshipRequest = require('./models/MentorshipRequest');
const Availability = require('./models/Availability');
const Session = require('./models/Session');
const Feedback = require('./models/Feedback');
const Notification = require('./models/Notification');
const Message = require('./models/Message');

const sampleSkills = [
  { name: 'Python', category: 'Programming', description: 'Core Python, scripting, OOP, automation, and backend development.' },
  { name: 'Java', category: 'Programming', description: 'Java SE, object-oriented concepts, multithreading, and enterprise fundamentals.' },
  { name: 'Data Structures & Algorithms', category: 'Programming', description: 'Arrays, Linked Lists, Trees, Graphs, Dynamic Programming, and interview problem solving.' },
  { name: 'Web Development', category: 'Web Development', description: 'Full stack web development using modern HTML, CSS, JavaScript, React, and Node.js.' },
  { name: 'Machine Learning', category: 'AI/ML', description: 'Scikit-learn, regression, classification, clustering, model evaluation.' },
  { name: 'Aptitude & Logical Reasoning', category: 'Aptitude', description: 'Quantitative aptitude, logical reasoning, and campus placement prep.' },
  { name: 'Public Speaking', category: 'Communication', description: 'Overcoming stage fear, presentation delivery, vocal variety, and storytelling.' },
  { name: 'Business Communication', category: 'Communication', description: 'Professional email writing, GD (Group Discussion) skills, and resume crafting.' },
  { name: 'Badminton', category: 'Sports', description: 'Footwork drills, smashing techniques, doubles coordination, and fitness.' },
  { name: 'Acoustic Guitar', category: 'Music', description: 'Chords, strumming patterns, fingerpicking, and popular song playthroughs.' },
  { name: 'Digital Photography', category: 'Arts', description: 'Manual camera settings, framing, golden hour lighting, and Adobe Lightroom editing.' },
  { name: 'UI/UX Design', category: 'Web Development', description: 'Figma wireframing, design systems, visual hierarchy, and usability testing.' },
];

const sampleLocations = [
  {
    name: 'Central Library — 2nd Floor Study Commons',
    building: 'Main Library Building',
    description: 'Quiet collaborative zone with whiteboards, large study desks, and power outlets.',
    isActive: true,
  },
  {
    name: 'Student Canteen — Discussion Hub',
    building: 'Student Activity Centre (SAC)',
    description: 'Vibrant casual area with coffee, booths, and open seating for informal peer learning.',
    isActive: true,
  },
  {
    name: 'Computer Science Block — Lab 304',
    building: 'Turing Technology Complex',
    description: 'Dedicated tech lab equipped with dual-boot systems, fast Wi-Fi, and projector access.',
    isActive: true,
  },
  {
    name: 'Sports Complex — Pavilion Lounge',
    building: 'Indoor Athletics Pavilion',
    description: 'Spacious airy lounge overlooking sports courts with ample benches and water stations.',
    isActive: true,
  },
  {
    name: 'Seminar Hall — Room 102 Foyer',
    building: 'Academic Block A',
    description: 'Well-lit foyer with comfortable seating clusters suitable for communication and aptitude practice.',
    isActive: true,
  },
];

const seedDB = async () => {
  try {
    const connUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/campus-skill-network';
    await mongoose.connect(connUri);
    console.log(`Connected to MongoDB for seeding: ${connUri}`);

    // Clear existing collections
    await User.deleteMany({});
    await Skill.deleteMany({});
    await Location.deleteMany({});
    await MentorshipRequest.deleteMany({});
    await Availability.deleteMany({});
    await Session.deleteMany({});
    await Feedback.deleteMany({});
    await Notification.deleteMany({});
    await Message.deleteMany({});

    console.log('🧹 Old data wiped clean.');

    // 1. Seed Skills
    const createdSkills = await Skill.insertMany(sampleSkills);
    console.log(`✅ Seeded ${createdSkills.length} skills into catalog.`);

    // 2. Seed Campus Locations
    const createdLocations = await Location.insertMany(sampleLocations);
    console.log(`✅ Seeded ${createdLocations.length} approved campus locations.`);

    // 3. Seed Students and Admin (passwords will be hashed)
    const salt = await bcrypt.genSalt(10);
    const sharedPassword = await bcrypt.hash('password123', salt);

    const studentUsers = [
      {
        name: 'Aarav Sharma',
        email: 'student1@college.edu',
        password: sharedPassword,
        studentId: 'CS2023-014',
        department: 'Computer Science & Engineering',
        year: '3rd Year',
        college: 'Campus University of Technology',
        bio: 'Passionate full-stack developer and competitive programmer. Love helping juniors crack DSA and web dev concepts!',
        profileImage: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
        skills: [
          { name: 'Data Structures & Algorithms', category: 'Programming', level: 'Advanced', description: 'Solved 450+ problems on LeetCode. Strong in Trees, Graphs, DP.' },
          { name: 'Web Development', category: 'Web Development', level: 'Expert', description: 'Built React & Node.js apps. Can help with frontend & REST APIs.' },
          { name: 'Python', category: 'Programming', level: 'Intermediate', description: 'Scripting, web scraping, and automation bots.' },
        ],
        interests: ['Machine Learning', 'Public Speaking'],
        role: 'student',
        isVerified: true,
        rating: 4.9,
        ratingsCount: 8,
        sessionsCompleted: 12,
        isActive: true,
      },
      {
        name: 'Priya Patel',
        email: 'student2@college.edu',
        password: sharedPassword,
        studentId: 'EC2023-088',
        department: 'Electronics & Communication',
        year: '3rd Year',
        college: 'Campus University of Technology',
        bio: 'Core member of Campus Debating Society and placement cell coordinator. Here to share public speaking & aptitude tricks.',
        profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
        skills: [
          { name: 'Public Speaking', category: 'Communication', level: 'Expert', description: 'National level debate finalist. Master confident presentation skills.' },
          { name: 'Aptitude & Logical Reasoning', category: 'Aptitude', level: 'Advanced', description: 'Placement speed-math shortcuts and non-verbal reasoning.' },
          { name: 'Badminton', category: 'Sports', level: 'Intermediate', description: 'Inter-college badminton singles quarter-finalist.' },
        ],
        interests: ['Python', 'Web Development'],
        role: 'student',
        isVerified: true,
        rating: 4.8,
        ratingsCount: 6,
        sessionsCompleted: 9,
        isActive: true,
      },
      {
        name: 'Rohan Verma',
        email: 'student3@college.edu',
        password: sharedPassword,
        studentId: 'IT2024-042',
        department: 'Information Technology',
        year: '2nd Year',
        college: 'Campus University of Technology',
        bio: 'Guitar player and ML enthusiast. Want to learn DSA while teaching acoustic guitar and Python basics.',
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
        skills: [
          { name: 'Acoustic Guitar', category: 'Music', level: 'Advanced', description: 'Rhythm strumming, bar chords, and playing your favorite songs.' },
          { name: 'Python', category: 'Programming', level: 'Intermediate', description: 'Python fundamentals, data structures, and mini projects.' },
        ],
        interests: ['Data Structures & Algorithms', 'UI/UX Design'],
        role: 'student',
        isVerified: true,
        rating: 4.7,
        ratingsCount: 4,
        sessionsCompleted: 5,
        isActive: true,
      },
      {
        name: 'Sneha Kulkarni',
        email: 'student4@college.edu',
        password: sharedPassword,
        studentId: 'DS2022-009',
        department: 'Data Science & AI',
        year: '4th Year',
        college: 'Campus University of Technology',
        bio: 'Senior year Data Science student. Interned as an ML engineer. Open to mentoring on machine learning projects.',
        profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        skills: [
          { name: 'Machine Learning', category: 'AI/ML', level: 'Expert', description: 'Supervised & unsupervised learning, model tuning, Pandas & Scikit-learn.' },
          { name: 'Python', category: 'Programming', level: 'Advanced', description: 'NumPy, Pandas, Matplotlib, and clean Pythonic code.' },
          { name: 'Digital Photography', category: 'Arts', level: 'Intermediate', description: 'Street and portrait photography tips on DSLRs and smartphones.' },
        ],
        interests: ['Badminton', 'Business Communication'],
        role: 'student',
        isVerified: true,
        rating: 5.0,
        ratingsCount: 11,
        sessionsCompleted: 15,
        isActive: true,
      },
      {
        name: 'Campus Administrator',
        email: 'admin@college.edu',
        password: sharedPassword,
        studentId: 'ADMIN-001',
        department: 'Campus Administration & Student Affairs',
        year: 'Postgraduate',
        college: 'Campus University of Technology',
        bio: 'Official Administrator of Campus Skill Network. Managing safe peer-to-peer micro-mentorship across departments.',
        profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
        skills: [
          { name: 'Business Communication', category: 'Communication', level: 'Expert', description: 'Leadership mentoring & conflict resolution.' }
        ],
        interests: [],
        role: 'admin',
        isVerified: true,
        rating: 5.0,
        ratingsCount: 2,
        sessionsCompleted: 4,
        isActive: true,
      }
    ];

    const users = await User.insertMany(studentUsers);
    console.log(`✅ Seeded ${users.length} student/admin accounts.`);

    const [aarav, priya, rohan, sneha, admin] = users;

    // 4. Seed Mentor Availability
    const availabilitySlots = [
      { mentor: aarav._id, date: '2026-09-28', startTime: '10:00 AM', endTime: '11:00 AM', isBooked: false },
      { mentor: aarav._id, date: '2026-09-28', startTime: '02:00 PM', endTime: '03:00 PM', isBooked: false },
      { mentor: aarav._id, date: '2026-09-29', startTime: '04:00 PM', endTime: '05:00 PM', isBooked: true },
      { mentor: priya._id, date: '2026-09-27', startTime: '11:00 AM', endTime: '12:00 PM', isBooked: false },
      { mentor: priya._id, date: '2026-09-28', startTime: '03:30 PM', endTime: '04:30 PM', isBooked: false },
      { mentor: rohan._id, date: '2026-09-29', startTime: '05:00 PM', endTime: '06:00 PM', isBooked: false },
      { mentor: sneha._id, date: '2026-09-28', startTime: '01:00 PM', endTime: '02:00 PM', isBooked: false },
      { mentor: sneha._id, date: '2026-09-30', startTime: '10:00 AM', endTime: '11:00 AM', isBooked: false },
    ];
    await Availability.insertMany(availabilitySlots);
    console.log(`✅ Seeded mentor availability time slots.`);

    // 5. Seed Mentorship Requests
    const req1 = await MentorshipRequest.create({
      learner: rohan._id,
      mentor: aarav._id,
      skill: 'Data Structures & Algorithms',
      message: 'Hi Aarav! I am struggling with Binary Search Trees and recursion. Would really appreciate a 1-on-1 session to walk through problem-solving approaches.',
      preferredDate: '2026-09-29',
      preferredTime: '04:00 PM',
      status: 'accepted',
    });

    const req2 = await MentorshipRequest.create({
      learner: aarav._id,
      mentor: priya._id,
      skill: 'Public Speaking',
      message: 'Hey Priya, I have an upcoming technical symposium presentation and feel anxious about audience Q&A. Can you give me feedback on my delivery?',
      preferredDate: '2026-09-28',
      preferredTime: '03:30 PM',
      status: 'pending',
    });

    const req3 = await MentorshipRequest.create({
      learner: priya._id,
      mentor: sneha._id,
      skill: 'Python',
      message: 'Hello Sneha, I want to learn basic Python for data analysis in our IoT lab projects. Would love your guidance!',
      preferredDate: '2026-09-30',
      preferredTime: '10:00 AM',
      status: 'pending',
    });

    console.log(`✅ Seeded mentorship requests.`);

    // 6. Seed Sample Scheduled and Completed Sessions
    const scheduledSession = await Session.create({
      learner: rohan._id,
      mentor: aarav._id,
      skill: 'Data Structures & Algorithms',
      date: '2026-09-29',
      startTime: '04:00 PM',
      endTime: '05:00 PM',
      location: 'Central Library — 2nd Floor Study Commons',
      notes: 'Bring laptop and pencil for tree diagrams.',
      mentorshipRequestId: req1._id,
      status: 'scheduled',
    });

    const completedSession = await Session.create({
      learner: priya._id,
      mentor: aarav._id,
      skill: 'Web Development',
      date: '2026-09-22',
      startTime: '02:00 PM',
      endTime: '03:00 PM',
      location: 'Computer Science Block — Lab 304',
      notes: 'Covered HTML5 semantic tags, flexbox layout, and Git basics.',
      status: 'completed',
    });

    console.log(`✅ Seeded scheduled and completed sessions.`);

    // 7. Seed Feedback for the completed session
    await Feedback.create({
      session: completedSession._id,
      learner: priya._id,
      mentor: aarav._id,
      rating: 5,
      comment: 'Aarav is an awesome mentor! He explained flexbox layout with clear diagrams and hands-on examples. Super patient with all my beginner questions.',
    });

    // 8. Seed Notifications
    await Notification.insertMany([
      {
        user: aarav._id,
        title: 'New Mentorship Request',
        message: 'Priya Patel sent you a mentorship request for Public Speaking.',
        type: 'request',
        link: '/requests',
        isRead: false,
      },
      {
        user: rohan._id,
        title: 'Request Accepted! 🎉',
        message: 'Aarav Sharma accepted your request for Data Structures & Algorithms.',
        type: 'request',
        link: '/sessions',
        isRead: false,
      },
      {
        user: priya._id,
        title: 'Session Completed! Rate Your Experience ⭐',
        message: 'Your Web Development session with Aarav Sharma is complete.',
        type: 'feedback',
        link: `/feedback/${completedSession._id}`,
        isRead: true,
      }
    ]);

    // 9. Seed Sample Conversation Messages between Aarav and Rohan
    const convId = Message.getConversationId(aarav._id, rohan._id);
    await Message.insertMany([
      {
        sender: rohan._id,
        receiver: aarav._id,
        message: 'Hi Aarav! Looking forward to our DSA session on Tuesday at the Central Library.',
        conversationId: convId,
        read: true,
      },
      {
        sender: aarav._id,
        receiver: rohan._id,
        message: 'Hey Rohan! Sounds great. Make sure to review basic recursion before we meet so we can dive straight into Tree traversals!',
        conversationId: convId,
        read: true,
      },
      {
        sender: rohan._id,
        receiver: aarav._id,
        message: 'Will do! Thanks for the tip.',
        conversationId: convId,
        read: false,
      }
    ]);

    console.log(`✅ Seeded chat messages and notifications.`);
    console.log(`\n🎉 SEEDING COMPLETED SUCCESSFULLY!`);
    console.log(`--------------------------------------------------`);
    console.log(`Demo Student 1: student1@college.edu / password123`);
    console.log(`Demo Student 2: student2@college.edu / password123`);
    console.log(`Demo Student 3: student3@college.edu / password123`);
    console.log(`Demo Student 4: student4@college.edu / password123`);
    console.log(`Demo Admin:     admin@college.edu    / password123`);
    console.log(`--------------------------------------------------`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDB();
