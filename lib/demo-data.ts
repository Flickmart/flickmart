type Message = {
  id: string;
  chatId: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
};

export const demoChats = [
  {
    id: '1',
    name: 'Alice Johnson',
    lastMessage: "Let me know when you're free",
    time: '10:42 AM',
    unread: 2,
    archived: false,
  },
  {
    id: '2',
    name: 'Bob Smith',
    lastMessage: 'Did you see the game last night?',
    time: 'Yesterday',
    unread: 0,
    archived: false,
  },
  {
    id: '3',
    name: 'Work Group',
    lastMessage: "Carol: I'll send the report soon",
    time: 'Yesterday',
    unread: 5,
    archived: false,
  },
  {
    id: '4',
    name: 'David Wilson',
    lastMessage: 'Thanks for your help!',
    time: 'Monday',
    unread: 0,
    archived: true,
  },
  {
    id: '5',
    name: 'Family Group',
    lastMessage: 'Mom: When are you coming home?',
    time: 'Monday',
    unread: 0,
    archived: true,
  },
];

export const demoMessages: Message[] = [
  // Alice's conversation
  {
    id: 'a1',
    chatId: '1',
    content: 'Hey, how are you doing?',
    role: 'user' as const,
    timestamp: new Date(Date.now() - 3_600_000 * 2),
  },
  {
    id: 'a2',
    chatId: '1',
    content: "I'm good! Just finished that project we talked about.",
    role: 'assistant' as const,
    timestamp: new Date(Date.now() - 3_600_000 * 1.9),
  },
  {
    id: 'a3',
    chatId: '1',
    content: "That's great! Want to grab coffee this weekend?",
    role: 'user',
    timestamp: new Date(Date.now() - 3_600_000 * 1.8),
  },
  {
    id: 'a4',
    chatId: '1',
    content: "Sure, I'm free on Saturday afternoon.",
    role: 'assistant',
    timestamp: new Date(Date.now() - 3_600_000 * 1.7),
  },
  {
    id: 'a5',
    chatId: '1',
    content: "Perfect! Let me know when you're free",
    role: 'user',
    timestamp: new Date(Date.now() - 3_600_000 * 1.6),
  },

  // Bob's conversation
  {
    id: 'b1',
    chatId: '2',
    content: 'Hey Bob, are you watching the game tonight?',
    role: 'user',
    timestamp: new Date(Date.now() - 3_600_000 * 24),
  },
  {
    id: 'b2',
    chatId: '2',
    content: "Yeah, I've got tickets! Going with some friends from work.",
    role: 'assistant',
    timestamp: new Date(Date.now() - 3_600_000 * 23.9),
  },
  {
    id: 'b3',
    chatId: '2',
    content: "That's awesome! Hope our team wins.",
    role: 'user',
    timestamp: new Date(Date.now() - 3_600_000 * 23.8),
  },
  {
    id: 'b4',
    chatId: '2',
    content: 'Did you see the game last night?',
    role: 'assistant',
    timestamp: new Date(Date.now() - 3_600_000 * 12),
  },

  // Work Group conversation
  {
    id: 'w1',
    chatId: '3',
    content: 'Team, please send your weekly reports by EOD.',
    role: 'assistant',
    timestamp: new Date(Date.now() - 3_600_000 * 30),
  },
  {
    id: 'w2',
    chatId: '3',
    content: "I've already submitted mine.",
    role: 'user',
    timestamp: new Date(Date.now() - 3_600_000 * 29),
  },
  {
    id: 'w3',
    chatId: '3',
    content: "Carol: I'm still working on mine, will send it soon.",
    role: 'assistant',
    timestamp: new Date(Date.now() - 3_600_000 * 25),
  },
  {
    id: 'w4',
    chatId: '3',
    content: 'Thanks for the reminder!',
    role: 'user',
    timestamp: new Date(Date.now() - 3_600_000 * 24),
  },
  {
    id: 'w5',
    chatId: '3',
    content: "Carol: I'll send the report soon",
    role: 'assistant',
    timestamp: new Date(Date.now() - 3_600_000 * 20),
  },

  // David's conversation
  {
    id: 'd1',
    chatId: '4',
    content: 'David, can you help me with this coding problem?',
    role: 'user',
    timestamp: new Date(Date.now() - 3_600_000 * 72),
  },
  {
    id: 'd2',
    chatId: '4',
    content: "Sure, what's the issue?",
    role: 'assistant',
    timestamp: new Date(Date.now() - 3_600_000 * 71),
  },
  {
    id: 'd3',
    chatId: '4',
    content: "I'm getting a weird error when I try to run the function.",
    role: 'user',
    timestamp: new Date(Date.now() - 3_600_000 * 70),
  },
  {
    id: 'd4',
    chatId: '4',
    content: "Can you share your code? I'll take a look.",
    role: 'assistant',
    timestamp: new Date(Date.now() - 3_600_000 * 69),
  },
  {
    id: 'd5',
    chatId: '4',
    content: 'Thanks for your help!',
    role: 'user',
    timestamp: new Date(Date.now() - 3_600_000 * 68),
  },

  // Family Group conversation
  {
    id: 'f1',
    chatId: '5',
    content: 'Mom: Has everyone decided what to bring for Thanksgiving?',
    role: 'assistant',
    timestamp: new Date(Date.now() - 3_600_000 * 96),
  },
  {
    id: 'f2',
    chatId: '5',
    content: "I'll bring the dessert!",
    role: 'user',
    timestamp: new Date(Date.now() - 3_600_000 * 95),
  },
  {
    id: 'f3',
    chatId: '5',
    content: "Dad: I'm in charge of the turkey as usual.",
    role: 'assistant',
    timestamp: new Date(Date.now() - 3_600_000 * 94),
  },
  {
    id: 'f4',
    chatId: '5',
    content: "Sister: I'll handle the sides.",
    role: 'assistant',
    timestamp: new Date(Date.now() - 3_600_000 * 93),
  },
  {
    id: 'f5',
    chatId: '5',
    content: 'Mom: When are you coming home?',
    role: 'assistant',
    timestamp: new Date(Date.now() - 3_600_000 * 72),
  },
];
