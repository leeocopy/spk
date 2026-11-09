const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Data directory for persistence
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
const CONTACTS_FILE = path.join(DATA_DIR, 'contacts.json');
if (!fs.existsSync(CONTACTS_FILE)) {
  fs.writeFileSync(CONTACTS_FILE, JSON.stringify([], null, 2));
}

// Custom MIME Types and Static File Handling
express.static.mime.define({
  'image/avif': ['avif'],
  'image/webp': ['webp'],
  'font/woff2': ['woff2'],
  'font/ttf': ['ttf'],
  'video/mp4': ['mp4'],
  'application/json': ['json', 'txt']
});

// Serve static assets
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/fonts', express.static(path.join(__dirname, 'fonts')));
app.use('/videos', express.static(path.join(__dirname, 'videos')));
app.use('/libs', express.static(path.join(__dirname, 'libs')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.get('/robots.txt', (req, res) => res.sendFile(path.join(__dirname, 'robots.txt')));
app.get('/sitemap.xml', (req, res) => res.type('application/xml').sendFile(path.join(__dirname, 'sitemap.xml')));

// Projects & Solutions Catalog API
const projects = [
  {
    id: "coaching",
    title: "Executive 1:1 Coaching",
    category: "Bespoke & Executive",
    format: "Accompagnement individuel et confidentiel",
    target: "Dirigeants, décideurs, managers",
    video: "/videos/Vergnani Clip Casa Compressed-1.mp4",
    thumbnail: "/images/HP-Design.jpg.webp"
  },
  {
    id: "workshops",
    title: "Corporate Workshops",
    category: "Interactive Team Practice",
    format: "Ateliers collectifs sur cas réels",
    target: "Équipes, managers, collaborateurs",
    video: "/videos/Jesuisvir Showreel-1-1.mp4",
    thumbnail: "/images/Screenshot-2026-07-15-144422.webp"
  },
  {
    id: "events",
    title: "Speak Events",
    category: "Keynotes & Networking",
    format: "Rencontres et learning experiences",
    target: "Professionnels et leaders d'affaires",
    video: "/videos/Luca Maglierie Showreel-1-1.mp4",
    thumbnail: "/images/img20230227_17424584.webp"
  },
  {
    id: "organisations",
    title: "Solutions Organisations",
    category: "B2B Corporate Programs",
    format: "Programmes d'entreprise sur mesure",
    target: "Directions RH & L&D, équipes multiculturelles",
    video: "/videos/Team App Showreel-1.mp4",
    thumbnail: "/images/R-mockups-MacBook-Air-15-inch-small.webp"
  }
];

// Backend API Endpoints
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    brand: 'SPEAK',
    tagline: 'English for the way business moves.',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.get('/api/projects', (req, res) => {
  res.json({
    success: true,
    count: projects.length,
    data: projects
  });
});

// Contact Form Submission API
app.post('/api/contact', (req, res) => {
  try {
    const { name, email, message, service, budget } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        error: 'Un indirizzo email valido è obbligatorio.'
      });
    }

    const newContact = {
      id: Date.now().toString(),
      name: name || 'Anonimo',
      email: email.trim(),
      message: message || '',
      service: service || 'Web Design',
      budget: budget || 'Non specificato',
      createdAt: new Date().toISOString()
    };

    const contacts = JSON.parse(fs.readFileSync(CONTACTS_FILE, 'utf-8'));
    contacts.push(newContact);
    fs.writeFileSync(CONTACTS_FILE, JSON.stringify(contacts, null, 2));

    console.log(`[CONTACT RECEIVED] From: ${newContact.name} <${newContact.email}>`);
    res.status(201).json({
      success: true,
      message: 'Richiesta di contatto ricevuta con successo!',
      data: newContact
    });
  } catch (err) {
    console.error('Error saving contact:', err);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.get('/api/contact', (req, res) => {
  try {
    const contacts = JSON.parse(fs.readFileSync(CONTACTS_FILE, 'utf-8'));
    res.json({ success: true, count: contacts.length, data: contacts });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Could not load contacts' });
  }
});

// Frontend Page Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/en', (req, res) => {
  res.sendFile(path.join(__dirname, 'en', 'index.html'));
});

app.get('/en/', (req, res) => {
  res.sendFile(path.join(__dirname, 'en', 'index.html'));
});

app.get('/it', (req, res) => {
  res.redirect('/');
});

app.get('/igloo-loader', (req, res) => {
  res.sendFile(path.join(__dirname, 'igloo-loader.html'));
});

// 404 Handler
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(` SPEAK Corporate English Server is running!`);
  console.log(` Main Version (FR): http://localhost:${PORT}/`);
  console.log(` English Version:   http://localhost:${PORT}/en`);
  console.log(` Solutions API:     http://localhost:${PORT}/api/projects`);
  console.log(` Health Check:      http://localhost:${PORT}/api/health`);
  console.log(`===================================================`);
});
