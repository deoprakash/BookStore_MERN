import { BookOpen, Award, Users, Home, Info, Package, Mail, Star } from "lucide-react"
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa"

import Book7 from "../assets/Book7.png"
import Book8 from "../assets/Book8.png"

import L from "../assets/London.jpg"
import N from "../assets/New York.jpg"


export const books = [
  {
    id: 1,
    title: "Le Tour Do Monde",
    author: "Perkin Didot",
    price: "599",
    description: "A portrait of the Jazz Age in all of its decadence and excess...",
    image: null,
  },
  {
    id: 2,
    title: "The Poems Of Byron",
    author: "Houghton Mifflin Co",
    price: "450",
    description: "A powerful story of racial injustice and the loss of innocence...",
    image: null,
  },
  {
    id: 3,
    title: "Aloe",
    author: "Subman",
    price: "399",
    description: "A dystopian novel about totalitarianism and mass surveillance...",
    image: null,
  },
  {
    id: 4,
    title: "The Castle in the Forest",
    author: "Norman Mailer",
    price: "349",
    description: "A romantic novel of manners set in early 19th century England...",
    image: null,
  },
  {
    id: 5,
    title: "Lyttkens Och Wulff",
    author: "Svenska Sprikets",
    price: "425",
    description: "A story of teenage alienation and loss of innocence...",
    image: null,
  },
  {
    id: 6,
    title: "Dostoevskij",
    author: "L'idiota",
    price: "549",
    description: "The epic tale of Captain Ahab's obsession with a white whale...",
    image: null,
  },
  {
    id: 7,
    title: "War and Peace",
    author: "Leo Tolstoy",
    price: "699",
    description: "A monumental work set during the Napoleonic invasion of Russia...",
    image: null,
  },
  {
    id: 8,
    title: "The Odyssey",
    author: "David Lodge",
    price: "299",
    description: "The epic journey of Odysseus as he tries to return home...",
    image: null,
  },
  {
    id: 9,
    title: "The Design Of Books",
    author: "Debbie Bern",
    price: "379",
    description: "A Gothic tale of science gone wrong and its consequences...",
    image: null,
  },
  {
    id: 10,
    title: "The Crossing",
    author: "Jason Mott",
    price: "425",
    description: "A psychological exploration of guilt and redemption...",
    image: null,
  },
  {
    id: 11,
    title: "The Phoenix Of Destiny",
    author: "Geronimo Stilton",
    price: "499",
    description: "A fantasy adventure through Middle-earth...",
    image: null,
  },
  {
    id: 12,
    title: "The Author",
    author: "Raj Siddhi",
    price: "399",
    description: "A dystopian vision of a scientifically engineered society...",
    image: null,
  },
  {
    id: 13,
    title: "The Doctor",
    author: "Oscar Patton",
    price: "549",
    description: "An epic journey through Hell, Purgatory, and Paradise...",
    image: null,
  },
  {
    id: 14,
    title: "Darkness Gathers",
    author: "Emma Elliot",
    price: "325",
    description: "A turbulent story of passion and revenge on the Yorkshire moors...",
    image: null,
  },
  {
    id: 15,
    title: "Gitanjali",
    author: "RabindraNath Tagore",
    price: "449",
    description: "The epic poem about the Trojan War and Achilles' rage...",
    image: null,
  },
  {
    id: 16,
    title: "The Unwilling",
    author: "John Hart",
    price: "399",
    description: "The adventures of a nobleman who imagines himself a knight...",
    image: null,
  },
];

export const branches = [
  {
    city: "Kurunegala",
    address: "123 Bookworm Lane",
    contact: "037-123-4567",
    services: ["Curated Collections", "Author Events", "Reading Nooks", "Café"]
  },
  {
    city: "Kandy",
    address: "456 Novelty Road",
    contact: "081-234-5678",
    services: ["Writing Workshops", "Book Clubs", "Rare Editions", "Garden Reading Area"]
  },
  {
    city: "Colombo",
    address: "789 Prose Parkway",
    contact: "011-345-6789",
    services: ["24/7 Access", "Digital Library", "Conference Rooms", "Audio Books"]
  },
  {
    city: "Galle",
    address: "321 Chapter Street",
    contact: "091-456-7890",
    services: ["Beachside Reading", "Children's Corner", "Book Launches", "Art Gallery"]
  }
];

export const teamMembers = [
  {
    name: "Sarah Bookman",
    role: "Chief Story Curator",
    bio: "Decade-long journey in literary curation. Lover of magical realism",
    social: { facebook: "https://facebook.com/", twitter: "https://twitter.com/" },
    img: null },
  {
    name: "James PageTurner",
    role: "Literary Architect",
    bio: "Sci-fi & fantasy specialist. Building worlds one book at a time",
    social: { facebook: "https://facebook.com/", twitter: "https://twitter.com/" },
    img: null },
  {
    name: "Lily Novelight",
    role: "Poetry Alchemist",
    bio: "Transforming words into emotional journeys. National Poetry Award winner",
    social: { facebook: "https://facebook.com/", twitter: "https://twitter.com/" },
    img: null }
];

export const stats = [
  { icon: "FaHeart", title: "Happy Readers", value: "500K+" },
  { icon: "FaUsers", title: "Community Members", value: "50K+" },
  { icon: "FaAward", title: "Awards Won", value: "12" }
];


// OURBESTSELLER.JSX
export const bgColors = [
  "from-[#fce3ec] to-[#ffe8d4]",
  "from-[#e2f0cb] to-[#ffe6e6]",
  "from-[#d0e6f6] to-[#f3e5f5]",
  "from-[#fff1c1] to-[#ffd3b4]",
  "from-[#e1f7d5] to-[#ffccbc]",
  "from-[#f0f4c3] to-[#b2dfdb]",
  "from-[#ede7f6] to-[#e1bee7]",
  "from-[#dcedc8] to-[#fff9c4]",
]
export const obsbooks = [
  { id: 1, image: null, title: "The World Versus Everything Beyond", author: "Like & Michael Cahn", price: 250.20 },
  { id: 2, image: null, title: "The World Versus Everything Beyond", author: "Like & Michael Cahn", price: 350.20 },
  { id: 3, image: null, title: "Twilight Fortress", author: "Oregory Barrett", price: 190.99 },
  { id: 4, image: null, title: "The Silent Echo", author: "Sarah Mitchell", price: 220.99 },
  { id: 5, image: null, title: "Mystic River", author: "Dennis Lehane", price: 182.99 },
  { id: 6, image: null, title: "The Alchemist", author: "Paulo Coelho", price: 166.00 },
  { id: 7, image: Book7, title: "Atomic Habits", author: "James Clear", price: 209.00 },
  { id: 8, image: Book8, title: "Thinking, Fast and Slow", author: "Daniel Kahneman", price: 218.00 },
]

// HBBOOKS
export const hbbooks = [
  { id: 101, title: 'Harry Potter', author: 'J.K. Rowling', price: 255.2, rating: 3, image: null },
  { id: 102, title: 'Hygge', author: 'Meik Wiking', price: 289.2, rating: 4, image: null },
  { id: 103, title: 'Fifty Shades Darker', author: 'E. L. James', price: 325.2, rating: 5, image: null },
  { id: 104, title: 'The Two Towers', author: 'J.R.R. Tolkien', price: 425.2, rating: 4, image: null },
]


// HA DUMMY DATA
export const hastats = [
  { icon: BookOpen, value: "1K+", label: "Books Collection" },
  { icon: Users, value: "10K+", label: "Happy Readers" },
  { icon: Award, value: "5+", label: "Industry Awards" },
]

export const featuredBooks = [
  {
    image: null,
    title: "The Midnight Library",
    author: "Matt Haig",
    description: "Between life and death there is a library, and within that library, the shelves go on forever.",
  },
  {
    image: null,
    title: "Ancient Chronicles",
    author: "Lirael Morningstar",
    description: "Discover the secrets of ancient civilizations through their own words.",
  },
  {
    image: null,
    title: "Coffee & Pages",
    author: "Evelyn Pagewright",
    description: "A collection of short stories perfect for your morning coffee ritual.",
  },
]

// FOOTER
export const socialLinks = [
  { Icon: FaFacebook, url: "https://facebook.com/" },
  { Icon: FaTwitter, url: "https://twitter.com/" },
  { Icon: FaInstagram, url: "https://instagram.com/" },
  { Icon: FaYoutube, url: "https://youtube.com/" },
]

export const quickLinks = [
  { title: "Home", url: "/" },
  { title: "About", url: "/about" },
  { title: "Books", url: "/books" },
  { title: "Contact", url: "/contact" },
]

// NAVBAR
export const navItems = [
  { name: "Home", path: "/", icon: Home, color: "from-cyan-400 to-blue-500" },
  { name: "About", path: "/about", icon: Info, color: "from-purple-400 to-indigo-500" },
  { name: "Books", path: "/books", icon: BookOpen, color: "from-emerald-400 to-teal-500" },
  { name: "Publish", path: "/publish", icon: Award, color: "from-orange-400 to-amber-600" },
  { name: "Authors", path: "/authors", icon: Users, color: "from-blue-400 to-indigo-600" },
  { name: "Contact", path: "/contact", icon: Mail, color: "from-rose-400 to-pink-600" },
  // Add My Orders directly to navItems
  { 
    name: "My Orders", 
    path: "/orders", 
    icon: Package, 
    color: "from-violet-500 to-purple-600" 
  }
];

// BANNER
export const words = ["Narratives", "Perspectives", "Universes", "Visions", "Horizons"];
export const apstats = [
  { icon: Award, value: "25K+", label: "Awards Won" },
  { icon: Users, value: "1M+", label: "Active Readers" },
  { icon: BookOpen, value: "100K+", label: "Books Available" },
  { icon: Star, value: "4.9", label: "Average Rating" }
]

export const apteamMembers = [
  { 
    id: 1, 
    name: "Sarah Johnson", 
    position: "CEO & Founder", 
    image: null,
    about: "Visionary leader with 15+ years in publishing. Sarah founded the company with a mission to revolutionize digital storytelling and connect authors with global audiences."
  },
  { 
    id: 2, 
    name: "Michael Chen", 
    position: "CTO", 
    image: null,
    about: "Tech innovator specializing in scalable digital platforms. Michael leads our technical team in building cutting-edge solutions for modern publishing needs."
  },
  { 
    id: 3, 
    name: "Emma Williams", 
    position: "Head Editor", 
    image: null,
    about: "Award-winning editor with expertise in fiction and non-fiction. Emma ensures every publication meets our high standards of quality and storytelling excellence."
  }
]

export const apbranches = [
  { location: "New York", hours: "9AM - 9PM", image: N },
  { location: "London", hours: "8AM - 8PM", image: L },
  { location: "Tokyo", hours: "10AM - 10PM", image: null },
  { location: "Sydney", hours: "8AM - 8PM", image: null }
]