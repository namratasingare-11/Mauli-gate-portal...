
import { Subject, Difficulty, Question, SyllabusItem, MaterialItem, MaterialType, User, Role, Announcement } from './types';
import { IMAGES } from './assets';

// --- CONFIGURATION ---
export const APP_LOGO = IMAGES.LOGO;

// Manual Topic Lists per Branch for Selection
export const BRANCH_TOPICS: Record<Subject, string[]> = {
  [Subject.CSE]: ['Full Syllabus', 'Algorithms', 'Operating Systems', 'Computer Networks', 'DBMS', 'Digital Logic', 'Theory of Computation'],
  [Subject.IT]: ['Full Syllabus', 'Web Technologies', 'Information Systems', 'Software Engineering', 'Data Structures'],
  [Subject.MECH]: ['Full Syllabus', 'Thermodynamics', 'Fluid Mechanics', 'Strength of Materials', 'Theory of Machines', 'Heat Transfer'],
  [Subject.ELECTRICAL]: ['Full Syllabus', 'Power Systems', 'Electrical Machines', 'Control Systems', 'Circuit Theory', 'Fields'],
  [Subject.ENTC]: ['Full Syllabus', 'Signals & Systems', 'Analog Circuits', 'Communication', 'Electromagnetics'],
  [Subject.CIVIL]: ['Full Syllabus', 'Structural Analysis', 'Geotechnical Engg', 'Fluid Mechanics', 'Transportation'],
  [Subject.GEN]: ['Full Syllabus', 'Numerical Ability', 'Verbal Ability']
};

export const INITIAL_QUESTIONS: Question[] = [
  // --- CSE Questions ---
  {
    id: 'cse_q1',
    text: 'Which of the following is NOT a stable sorting algorithm?',
    options: ['Merge Sort', 'Insertion Sort', 'Quick Sort', 'Bubble Sort'],
    correctAnswer: 2,
    explanation: 'Quick Sort is not a stable sorting algorithm because it swaps non-adjacent elements.',
    subject: Subject.CSE,
    topic: 'Algorithms',
    difficulty: Difficulty.MEDIUM
  },
  {
    id: 'cse_q2',
    text: 'What is the time complexity of searching in a balanced BST?',
    options: ['O(n)', 'O(log n)', 'O(1)', 'O(n log n)'],
    correctAnswer: 1,
    explanation: 'In a balanced Binary Search Tree, the height is log(n), so searching takes O(log n).',
    subject: Subject.CSE,
    topic: 'Algorithms',
    difficulty: Difficulty.EASY
  },
  {
    id: 'cse_q3',
    text: 'In TCP, which flag is used to initiate a connection?',
    options: ['FIN', 'SYN', 'ACK', 'RST'],
    correctAnswer: 1,
    explanation: 'The SYN (Synchronize) flag is used to initiate a connection during the TCP 3-way handshake.',
    subject: Subject.CSE,
    topic: 'Computer Networks',
    difficulty: Difficulty.EASY
  },
  {
    id: 'cse_q4',
    text: 'Which layer of OSI model is responsible for encryption?',
    options: ['Application', 'Presentation', 'Session', 'Transport'],
    correctAnswer: 1,
    explanation: 'The Presentation layer handles encryption, compression, and translation.',
    subject: Subject.CSE,
    topic: 'Computer Networks',
    difficulty: Difficulty.MEDIUM
  },
  {
    id: 'cse_q5',
    text: 'In DBMS, which normal form deals with multi-valued dependencies?',
    options: ['2NF', '3NF', 'BCNF', '4NF'],
    correctAnswer: 3,
    explanation: '4NF (Fourth Normal Form) handles multi-valued dependencies.',
    subject: Subject.CSE,
    topic: 'DBMS',
    difficulty: Difficulty.HARD
  },

  // --- MECH Questions ---
  {
    id: 'mech_q1',
    text: 'What is the efficiency of the Otto cycle depending on?',
    options: ['Temperature limits', 'Pressure ratio', 'Compression ratio', 'Cut-off ratio'],
    correctAnswer: 2,
    explanation: 'The efficiency of the Otto cycle depends only on the compression ratio.',
    subject: Subject.MECH,
    topic: 'Thermodynamics',
    difficulty: Difficulty.MEDIUM
  },
  {
    id: 'mech_q2',
    text: 'Bernoullis equation is applicable for:',
    options: ['Viscous flow', 'Compressible flow', 'Inviscid, incompressible flow', 'Unsteady flow'],
    correctAnswer: 2,
    explanation: 'Bernoullis equation is valid for steady, inviscid, incompressible, and irrotational flow along a streamline.',
    subject: Subject.MECH,
    topic: 'Fluid Mechanics',
    difficulty: Difficulty.MEDIUM
  },
  {
    id: 'mech_q3',
    text: 'The ability of a material to absorb energy within the elastic range is called:',
    options: ['Toughness', 'Resilience', 'Hardness', 'Stiffness'],
    correctAnswer: 1,
    explanation: 'Resilience is the ability to absorb energy in the elastic limit. Toughness is up to fracture.',
    subject: Subject.MECH,
    topic: 'Strength of Materials',
    difficulty: Difficulty.EASY
  },

  // --- ELECTRICAL Questions ---
  {
    id: 'ee_q1',
    text: 'For a 2-port network, the reciprocity condition in terms of Z-parameters is:',
    options: ['Z11 = Z22', 'Z12 = Z21', 'Z12 = -Z21', 'Z11 * Z22 = 1'],
    correctAnswer: 1,
    explanation: 'A network is reciprocal if Z12 = Z21.',
    subject: Subject.ELECTRICAL,
    topic: 'Circuit Theory',
    difficulty: Difficulty.MEDIUM
  },
  {
    id: 'ee_q2',
    text: 'The function of a commutator in a DC generator is:',
    options: ['To reduce friction', 'To convert AC to DC', 'To convert DC to AC', 'To improve cooling'],
    correctAnswer: 1,
    explanation: 'A commutator acts as a mechanical rectifier, converting the internal AC induced in the armature to DC output.',
    subject: Subject.ELECTRICAL,
    topic: 'Electrical Machines',
    difficulty: Difficulty.EASY
  },

  // --- ENTC Questions ---
  {
    id: 'entc_q1',
    text: 'Which diode is used as a voltage regulator?',
    options: ['Tunnel Diode', 'Zener Diode', 'Varactor Diode', 'PIN Diode'],
    correctAnswer: 1,
    explanation: 'Zener diodes are designed to operate in the reverse breakdown region, making them suitable for voltage regulation.',
    subject: Subject.ENTC,
    topic: 'Analog Circuits',
    difficulty: Difficulty.EASY
  },

  // --- CIVIL Questions ---
  {
    id: 'civil_q1',
    text: 'The slenderness ratio of a column is defined as the ratio of its effective length to its:',
    options: ['Least radius of gyration', 'Least lateral dimension', 'Maximum radius of gyration', 'Area of cross-section'],
    correctAnswer: 0,
    explanation: 'Slenderness ratio = Effective Length / Least Radius of Gyration.',
    subject: Subject.CIVIL,
    topic: 'Structural Analysis',
    difficulty: Difficulty.MEDIUM
  },
  {
    id: 'civil_q2',
    text: 'Reynolds number is the ratio of inertial force to:',
    options: ['Gravity force', 'Viscous force', 'Elastic force', 'Pressure force'],
    correctAnswer: 1,
    explanation: 'Reynolds Number = Inertial Force / Viscous Force.',
    subject: Subject.CIVIL,
    topic: 'Fluid Mechanics',
    difficulty: Difficulty.EASY
  }
];

export const INITIAL_SYLLABUS: SyllabusItem[] = [
  { id: 's1', subject: Subject.CSE, topic: 'Graph Theory', completed: false },
  { id: 's2', subject: Subject.CSE, topic: 'Operating Systems - Paging', completed: true },
  { id: 's3', subject: Subject.CSE, topic: 'Database Normalization', completed: false },
  { id: 's4', subject: Subject.MECH, topic: 'Thermodynamics Laws', completed: true },
  { id: 's5', subject: Subject.ELECTRICAL, topic: 'Power Systems', completed: false },
];

export const MOCK_USER_STATS = {
  testsTaken: 12,
  averageScore: 68.5,
  hoursStudied: 45,
  streakDays: 5
};

export const INITIAL_MATERIALS: MaterialItem[] = [
  // --- NOTES (3 Samples) ---
  {
    id: 'note_1',
    title: 'Advanced Data Structures & Algorithms Handouts',
    subject: Subject.CSE,
    type: MaterialType.NOTE,
    url: '#',
    description: 'Comprehensive handwritten notes covering AVL Trees, Red-Black Trees, and Graph Algorithms (Dijkstra, Prim). Prepared by Prof. Sharma.'
  },
  {
    id: 'note_2',
    title: 'Thermodynamics Module 1-4 Complete Notes',
    subject: Subject.MECH,
    type: MaterialType.NOTE,
    url: '#',
    description: 'Module 1-4 Complete Notes including Entropy, Enthalpy, and Gas Power Cycles. Mauli College Mechanical Dept.'
  },
  {
    id: 'note_3',
    title: 'Power Systems Stability Analysis Lecture Notes',
    subject: Subject.ELECTRICAL,
    type: MaterialType.NOTE,
    url: '#',
    description: 'Detailed lecture notes on Transient Stability, Swing Equation, and Equal Area Criterion.'
  },

  // --- VIDEOS (3 Samples) ---
  {
    id: 'video_1',
    title: 'Structural Analysis: Moment Distribution Method',
    subject: Subject.CIVIL,
    type: MaterialType.VIDEO,
    url: 'https://www.youtube.com',
    description: 'Video lecture explaining the Hardy Cross method for indeterminate beams with solved examples.'
  },
  {
    id: 'video_2',
    title: 'Digital Signal Processing: Z-Transform Explained',
    subject: Subject.ENTC,
    type: MaterialType.VIDEO,
    url: 'https://www.youtube.com',
    description: 'Deep dive into ROC, Pole-Zero plot, and Inverse Z-Transform techniques.'
  },
  {
    id: 'video_3',
    title: 'Cloud Computing Architectures - AWS vs Azure',
    subject: Subject.IT,
    type: MaterialType.VIDEO,
    url: 'https://www.youtube.com',
    description: 'Comparison of IaaS, PaaS, SaaS models and introduction to AWS services.'
  },

  // --- PAPERS (3 Samples) ---
  {
    id: 'paper_1',
    title: 'GATE 2024 CSE Question Paper with Key',
    subject: Subject.CSE,
    type: MaterialType.PAPER,
    url: '#',
    year: 2024,
    description: 'Official IIT IISc Question Paper for Computer Science with detailed answer key.'
  },
  {
    id: 'paper_2',
    title: 'GATE 2023 ME Question Paper Solved',
    subject: Subject.MECH,
    type: MaterialType.PAPER,
    url: '#',
    year: 2023,
    description: 'Previous year paper for Mechanical Engineering including General Aptitude section.'
  },
  {
    id: 'paper_3',
    title: 'GATE 2022 EE Official Paper',
    subject: Subject.ELECTRICAL,
    type: MaterialType.PAPER,
    url: '#',
    year: 2022,
    description: 'Full length question paper for Electrical Engineering practice.'
  },

  // --- MIND MAPS (3 Samples) ---
  {
    id: 'map_1',
    title: 'Operating Systems Memory Management Map',
    subject: Subject.CSE,
    type: MaterialType.MIND_MAP,
    url: '#',
    description: 'Visual hierarchy connecting Paging, Segmentation, Virtual Memory, and Thrashing concepts.'
  },
  {
    id: 'map_2',
    title: 'Electromagnetic Spectrum & Antenna Types',
    subject: Subject.ENTC,
    type: MaterialType.MIND_MAP,
    url: '#',
    description: 'Mind map detailing antenna types (Dipole, Yagi-Uda) and their frequency applications.'
  },
  {
    id: 'map_3',
    title: 'Soil Mechanics Classification Chart',
    subject: Subject.CIVIL,
    type: MaterialType.MIND_MAP,
    url: '#',
    description: 'Chart for Unified Soil Classification System (USCS) and soil properties relationships.'
  },

  // --- FLOW CHARTS (3 Samples) ---
  {
    id: 'chart_1',
    title: 'Software Development Life Cycle (SDLC)',
    subject: Subject.IT,
    type: MaterialType.FLOW_CHART,
    url: '#',
    description: 'Process flow comparison between Waterfall, Agile, and Spiral models.'
  },
  {
    id: 'chart_2',
    title: 'Rankine Cycle Process Flow',
    subject: Subject.MECH,
    type: MaterialType.FLOW_CHART,
    url: '#',
    description: 'Step-by-step thermodynamic process flow for Steam Power Plants.'
  },
  {
    id: 'chart_3',
    title: 'Grid Synchronization Process Flow',
    subject: Subject.ELECTRICAL,
    type: MaterialType.FLOW_CHART,
    url: '#',
    description: 'Flowchart depicting the conditions and steps for synchronizing an alternator to the infinite bus.'
  }
];

export const DEFAULT_ADMIN: User = {
  id: 'admin-001',
  name: 'MCOET Admin',
  email: 'admin@mcoet.mauligroup.org',
  password: 'admin', 
  role: Role.ADMIN,
  joinedDate: new Date().toISOString()
};

export const DEFAULT_STUDENT: User = {
  id: 'student-001',
  name: 'Rahul Student',
  email: 'student@mcoet.mauligroup.org',
  password: 'pass123',
  role: Role.USER,
  branch: 'Computer Science & Engg',
  phone: '9876543210',
  joinedDate: new Date().toISOString()
};

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'a1',
    title: 'Welcome to Mauli GATE Portal',
    message: 'Welcome to the official GATE preparation portal for MCOET students. Please complete your profile.',
    date: new Date().toISOString(),
    type: 'success'
  },
  {
    id: 'a2',
    title: 'GATE 2025 Registration',
    message: 'Registration for GATE 2025 closes next week. Contact the exam cell for assistance.',
    date: new Date(Date.now() - 86400000).toISOString(),
    type: 'alert'
  },
  {
    id: 'a3',
    title: 'New Mind Maps Added',
    message: 'Check the Digital Library for new mind maps on Data Structures and Thermodynamics.',
    date: new Date(Date.now() - 172800000).toISOString(),
    type: 'info'
  }
];
