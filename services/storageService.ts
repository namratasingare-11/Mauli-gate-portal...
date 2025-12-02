
import { ExamResult, SyllabusItem, UserStats, User, MaterialItem, Announcement, Role, Question, Feedback, TodoItem } from '../types';
import { INITIAL_SYLLABUS, MOCK_USER_STATS, INITIAL_MATERIALS, DEFAULT_ADMIN, DEFAULT_STUDENT, INITIAL_ANNOUNCEMENTS, INITIAL_QUESTIONS, APP_LOGO } from '../constants';

const KEYS = {
  RESULTS: 'gate_prep_results',
  SYLLABUS: 'gate_prep_syllabus',
  STATS: 'gate_prep_stats',
  USERS: 'gate_prep_users',
  CURRENT_USER: 'gate_prep_current_user',
  MATERIALS: 'gate_prep_materials',
  ANNOUNCEMENTS: 'gate_prep_announcements',
  QUESTIONS: 'gate_prep_questions',
  FEEDBACK: 'gate_prep_feedback',
  TODOS: 'gate_prep_todos',
  APP_LOGO: 'gate_prep_app_logo'
};

const safeParse = <T>(key: string, fallback: T): T => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (e) {
    console.error(`Error parsing data for key ${key}`, e);
    return fallback;
  }
};

const safeSet = (key: string, value: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving data to key ${key}`, e);
    // In a real app, we might fallback to memory storage or show a UI error
  }
};

export const storageService = {
  // --- Auth & Users ---
  init: () => {
    try {
      // Seed admin if not exists
      const users = safeParse<User[]>(KEYS.USERS, []);
      let usersUpdated = false;

      // Check if admin exists
      if (!users.find(u => u.email === DEFAULT_ADMIN.email)) {
        users.push(DEFAULT_ADMIN);
        usersUpdated = true;
      }
      
      // Check if student exists
      if (!users.find(u => u.email === DEFAULT_STUDENT.email)) {
        users.push(DEFAULT_STUDENT);
        usersUpdated = true;
      }

      if (usersUpdated) {
        safeSet(KEYS.USERS, users);
      }

      // Seed announcements if empty
      if (!localStorage.getItem(KEYS.ANNOUNCEMENTS)) {
        safeSet(KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
      }
      // Seed Initial Questions if empty
      if (!localStorage.getItem(KEYS.QUESTIONS)) {
        safeSet(KEYS.QUESTIONS, INITIAL_QUESTIONS);
      }
      
      // Update favicon on load
      storageService.updateFavicon(storageService.getAppLogo());
    } catch (e) {
      console.error("Storage initialization failed", e);
    }
  },

  getUsers: (): User[] => safeParse(KEYS.USERS, []),

  addUser: (user: User): void => {
    const users = storageService.getUsers();
    users.push(user);
    safeSet(KEYS.USERS, users);
  },

  updateUser: (updatedUser: User): void => {
    const users = storageService.getUsers();
    const index = users.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
      users[index] = updatedUser;
      safeSet(KEYS.USERS, users);
      
      // Also update current user session if it matches
      const currentUser = storageService.getCurrentUser();
      if (currentUser && currentUser.id === updatedUser.id) {
        storageService.setCurrentUser(updatedUser, true);
      }
    }
  },

  deleteUser: (userId: string): void => {
    let users = storageService.getUsers();
    users = users.filter(u => u.id !== userId);
    safeSet(KEYS.USERS, users);
  },

  findUserByEmail: (email: string): User | undefined => {
    const users = storageService.getUsers();
    return users.find(u => u.email === email);
  },

  getCurrentUser: (): User | null => {
    try {
      // Check localStorage (Remember Me)
      const local = localStorage.getItem(KEYS.CURRENT_USER);
      if (local) return JSON.parse(local);
      
      // Check sessionStorage (Session only)
      const session = sessionStorage.getItem(KEYS.CURRENT_USER);
      if (session) return JSON.parse(session);
    } catch (e) {
      return null;
    }
    return null;
  },

  setCurrentUser: (user: User, remember: boolean): void => {
    try {
      if (remember) {
        localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
      } else {
        sessionStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
      }
    } catch (e) {
      console.error("Failed to set current user", e);
    }
  },

  logout: (): void => {
    try {
      localStorage.removeItem(KEYS.CURRENT_USER);
      sessionStorage.removeItem(KEYS.CURRENT_USER);
    } catch(e) {
      console.error("Logout failed", e);
    }
  },

  // --- Questions (Admin) ---
  getQuestions: (): Question[] => safeParse(KEYS.QUESTIONS, INITIAL_QUESTIONS),

  addQuestion: (question: Question): void => {
    const questions = storageService.getQuestions();
    questions.push(question);
    safeSet(KEYS.QUESTIONS, questions);
  },

  // --- Announcements ---
  getAnnouncements: (): Announcement[] => safeParse(KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS),

  addAnnouncement: (announcement: Announcement): void => {
    const list = storageService.getAnnouncements();
    list.unshift(announcement); // Add to top
    safeSet(KEYS.ANNOUNCEMENTS, list);
  },

  // --- Materials ---
  getMaterials: (): MaterialItem[] => safeParse(KEYS.MATERIALS, INITIAL_MATERIALS),

  addMaterial: (material: MaterialItem): void => {
    const items = storageService.getMaterials();
    items.unshift(material);
    safeSet(KEYS.MATERIALS, items);
  },

  // --- Feedback ---
  getFeedback: (): Feedback[] => safeParse(KEYS.FEEDBACK, []),

  addFeedback: (feedback: Feedback): void => {
    const items = storageService.getFeedback();
    items.unshift(feedback);
    safeSet(KEYS.FEEDBACK, items);
  },

  // --- Todos ---
  getTodos: (): TodoItem[] => safeParse(KEYS.TODOS, []),

  addTodo: (text: string): TodoItem[] => {
    const todos = storageService.getTodos();
    const newTodo: TodoItem = {
      id: Date.now().toString(),
      text,
      completed: false
    };
    todos.unshift(newTodo);
    safeSet(KEYS.TODOS, todos);
    return todos;
  },

  toggleTodo: (id: string): TodoItem[] => {
    const todos = storageService.getTodos();
    const newTodos = todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    safeSet(KEYS.TODOS, newTodos);
    return newTodos;
  },

  deleteTodo: (id: string): TodoItem[] => {
    const todos = storageService.getTodos().filter(t => t.id !== id);
    safeSet(KEYS.TODOS, todos);
    return todos;
  },

  // --- Logo Management ---
  getAppLogo: (): string => {
    return localStorage.getItem(KEYS.APP_LOGO) || APP_LOGO;
  },

  setAppLogo: (url: string): void => {
    localStorage.setItem(KEYS.APP_LOGO, url);
    storageService.updateFavicon(url);
    // Dispatch event for components to react
    window.dispatchEvent(new Event('logo-change'));
  },

  resetAppLogo: (): void => {
    localStorage.removeItem(KEYS.APP_LOGO);
    storageService.updateFavicon(APP_LOGO);
    window.dispatchEvent(new Event('logo-change'));
  },

  updateFavicon: (url: string) => {
    const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    if (link) {
      link.href = url;
    } else {
      const newLink = document.createElement('link');
      newLink.rel = 'icon';
      newLink.href = url;
      document.head.appendChild(newLink);
    }
  },

  // --- Existing Methods ---
  getResults: (): ExamResult[] => safeParse(KEYS.RESULTS, []),

  saveResult: (result: ExamResult): void => {
    const results = storageService.getResults();
    results.push(result);
    safeSet(KEYS.RESULTS, results);
    
    // Update stats
    const stats = storageService.getStats();
    const newTotal = stats.testsTaken + 1;
    // Calculate new average
    const currentTotalScore = stats.averageScore * stats.testsTaken; 
    const newAvg = (currentTotalScore + result.score) / newTotal;
    
    storageService.saveStats({
      ...stats,
      testsTaken: newTotal,
      averageScore: parseFloat(newAvg.toFixed(2))
    });
  },

  getSyllabus: (): SyllabusItem[] => safeParse(KEYS.SYLLABUS, INITIAL_SYLLABUS),

  toggleSyllabusItem: (id: string): SyllabusItem[] => {
    const items = storageService.getSyllabus();
    const newItems = items.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    safeSet(KEYS.SYLLABUS, newItems);
    return newItems;
  },

  addSyllabusItem: (item: SyllabusItem): SyllabusItem[] => {
    const items = storageService.getSyllabus();
    items.push(item);
    safeSet(KEYS.SYLLABUS, items);
    return items;
  },

  getStats: (): UserStats => safeParse(KEYS.STATS, MOCK_USER_STATS),

  saveStats: (stats: UserStats): void => {
    safeSet(KEYS.STATS, stats);
  }
};

// Initialize on load
storageService.init();
