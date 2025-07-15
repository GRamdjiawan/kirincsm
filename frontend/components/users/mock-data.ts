// Mock user data
export const users = [
  {
    id: "user1",
    name: "Admin User",
    email: "admin@example.com",
    role: "Administrator",
    avatar: "",
    isActive: true,
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    websites: ["Main Website", "Blog", "E-commerce Store", "Landing Page"],
  },
  {
    id: "user2",
    name: "John Editor",
    email: "john@example.com",
    role: "Editor",
    avatar: "",
    isActive: true,
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    websites: ["Main Website", "Blog"],
  },
  {
    id: "user3",
    name: "Sarah Author",
    email: "sarah@example.com",
    role: "Author",
    avatar: "",
    isActive: true,
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    websites: ["Blog"],
  },
  {
    id: "user4",
    name: "Mike Contributor",
    email: "mike@example.com",
    role: "Contributor",
    avatar: "",
    isActive: true,
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
    websites: ["E-commerce Store"],
  },
  {
    id: "user5",
    name: "Lisa Designer",
    email: "lisa@example.com",
    role: "Editor",
    avatar: "",
    isActive: false,
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 30 days ago
    websites: ["Landing Page"],
  },
]

// Mock websites data
export const websites = [
  { id: "site1", name: "Main Website", url: "main-website.com" },
  { id: "site2", name: "Blog", url: "blog.example.com" },
  { id: "site3", name: "E-commerce Store", url: "store.example.com" },
  { id: "site4", name: "Landing Page", url: "landing.example.com" },
  { id: "site5", name: "Documentation", url: "docs.example.com" },
  { id: "site6", name: "Support Portal", url: "support.example.com" },
]
