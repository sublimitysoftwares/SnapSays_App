export interface Option {
  value: string;
  label: string;
  optionId: number;
}

export interface Question {
  id: string;
  numericId: number;
  question: string;
  field: string;
  options: Option[];
}

export interface PageData {
  pageNumber: number;
  helperText: string;
  questions: Question[];
}

export const PAGES: PageData[] = [
  {
    pageNumber: 1,
    helperText: "Let's start with who you are ✨",
    questions: [
      {
        id: 'personalityType',
        numericId: 1,
        question: 'How would you describe your personality?',
        field: 'personalityType',
        options: [
          { value: 'calm', label: 'Calm and peaceful', optionId: 1 },
          { value: 'fun_loving', label: 'Fun-loving and energetic', optionId: 2 },
          { value: 'serious', label: 'Serious and focused', optionId: 3 },
          { value: 'emotional', label: 'Emotional and sensitive', optionId: 4 },
          { value: 'mix', label: 'A mix of everything', optionId: 5 },
        ],
      },
      {
        id: 'selfPerception',
        numericId: 2,
        question: 'How do you see yourself?',
        field: 'selfPerception',
        options: [
          { value: 'introvert', label: 'Introvert', optionId: 6 },
          { value: 'extrovert', label: 'Extrovert', optionId: 7 },
          { value: 'ambivert', label: 'Ambivert', optionId: 8 },
          { value: 'unknown', label: 'I’ve never really thought about it', optionId: 9 },
        ],
      },
    ],
  },
  {
    pageNumber: 2,
    helperText: 'Tell us about your connections 🤝',
    questions: [
      {
        id: 'peopleConnection',
        numericId: 3,
        question: 'What kind of people do you connect with most?',
        field: 'peopleConnection',
        options: [
          { value: 'mature', label: 'Calm and mature', optionId: 10 },
          { value: 'energetic', label: 'Fun and energetic', optionId: 11 },
          { value: 'thinkers', label: 'Intelligent and deep thinkers', optionId: 12 },
          { value: 'simple', label: 'Honest and simple', optionId: 13 },
          { value: 'adjust', label: 'I can adjust with anyone', optionId: 14 },
        ],
      },
      {
        id: 'comfortZone',
        numericId: 4,
        question: 'When do you feel most comfortable?',
        field: 'comfortZone',
        options: [
          { value: 'alone', label: 'Being alone', optionId: 15 },
          { value: 'small_group', label: 'With a small group', optionId: 16 },
          { value: 'large_groups', label: 'In large groups or crowds', optionId: 17 },
          { value: 'depends', label: 'Depends on the situation', optionId: 18 },
        ],
      },
    ],
  },
  {
    pageNumber: 3,
    helperText: 'Social style and free time ⚡',
    questions: [
      {
        id: 'socialApproach',
        numericId: 5,
        question: 'When you meet new people or visit a new place, you usually:',
        field: 'socialApproach',
        options: [
          { value: 'observe', label: 'Observe first', optionId: 19 },
          { value: 'take_time', label: 'Take time to open up', optionId: 20 },
          { value: 'start_conversations', label: 'Start conversations easily', optionId: 21 },
          { value: 'depends_mood', label: 'It depends on my mood', optionId: 22 },
        ],
      },
      {
        id: 'freeTime',
        numericId: 6,
        question: 'How do you prefer to spend your free time?',
        field: 'freeTime',
        options: [
          { value: 'relaxing', label: 'Relaxing at home', optionId: 23 },
          { value: 'traveling', label: 'Going out / traveling', optionId: 24 },
          { value: 'friends', label: 'Spending time with friends', optionId: 25 },
          { value: 'movies', label: 'Watching movies or series', optionId: 26 },
          { value: 'learning', label: 'Learning something new', optionId: 27 },
        ],
      },
    ],
  },
  {
    pageNumber: 4,
    helperText: 'Lifestyle and routines 🏔️',
    questions: [
      {
        id: 'favoritePlaces',
        numericId: 7,
        question: 'What kind of places do you enjoy visiting the most?',
        field: 'favoritePlaces',
        options: [
          { value: 'beaches', label: 'Beaches / seaside places', optionId: 28 },
          { value: 'mountains', label: 'Mountains / hill stations', optionId: 29 },
          { value: 'nightlife', label: 'Cities & nightlife', optionId: 30 },
          { value: 'historical', label: 'Historical or cultural places', optionId: 31 },
          { value: 'nature', label: 'Nature & peaceful locations', optionId: 32 },
          { value: 'no_travel', label: 'I’m not much into traveling', optionId: 33 },
        ],
      },
      {
        id: 'routinePreference',
        numericId: 8,
        question: 'How do you feel about routines?',
        field: 'routinePreference',
        options: [
          { value: 'fixed', label: 'I prefer a fixed routine', optionId: 34 },
          { value: 'balance', label: 'I like a balance of routine and freedom', optionId: 35 },
          { value: 'dislike', label: 'I dislike routines', optionId: 36 },
          { value: 'mood', label: 'Depends on my mood', optionId: 37 },
        ],
      },
    ],
  },
  {
    pageNumber: 5,
    helperText: 'Inner self and preferences 🍕',
    questions: [
      {
        id: 'stressManagement',
        numericId: 9,
        question: 'When you feel stressed, what do you usually do?',
        field: 'stressManagement',
        options: [
          { value: 'alone', label: 'Spend time alone', optionId: 38 },
          { value: 'talk', label: 'Talk to someone', optionId: 39 },
          { value: 'music_movies', label: 'Listen to music / watch something', optionId: 40 },
          { value: 'exercise', label: 'Exercise or go for a walk', optionId: 41 },
          { value: 'ignore', label: 'Ignore it and move on', optionId: 42 },
        ],
      },
      {
        id: 'foodPreference',
        numericId: 10,
        question: 'What type of food do you usually enjoy the most?',
        field: 'foodPreference',
        options: [
          { value: 'home_style', label: 'Home-style / traditional food', optionId: 43 },
          { value: 'street_food', label: 'Street food', optionId: 44 },
          { value: 'healthy', label: 'Healthy / diet food', optionId: 45 },
          { value: 'fast_food', label: 'Fast food', optionId: 46 },
          { value: 'all_kinds', label: 'I enjoy all kinds of food', optionId: 47 },
        ],
      },
    ],
  },
];
