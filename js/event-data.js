/**
 * Event Dataset for SPEAK & TEDxPortland Retrospective Showcase
 * Comprehensive data for past and upcoming events:
 * - Upcoming (Year 15): Venue, dates, program, what to expect, how to attend, booking form.
 * - Past (Years 14 - 5): Recap showreel video, what happened, highlights, metrics, gallery.
 */

window.SPEAK_EVENTS = {
  "15": {
    year: "15",
    theme: "Horizons of Clarity",
    isUpcoming: true,
    statusText: "Upcoming Summit • Registration Open",
    date: "Saturday, May 29, 2027",
    doorsOpen: "08:30 AM CET",
    location: "Grand Palais Éphémère & Virtual Executive Stream",
    city: "Paris & Global Broadcast",
    heroVideo: "./images/tedx/year15-video.mp4",
    heroPoster: "./images/tedx/year15-poster.webp",
    headline: "Where Corporate Vision Meets Irreversible Alignment",
    tagline: "The 15th annual international gathering of founders, corporate leaders, and executive communicators.",
    overview: "Year 15 marks a pivotal milestone: fifteen years of empowering executives, international teams, and global enterprises to speak with absolute clarity, command room attention, and negotiate across cultural boundaries without friction.",
    
    // What to expect
    highlights: [
      { num: "1,200", label: "Executive Seats" },
      { num: "16", label: "Global Keynotes" },
      { num: "8", label: "Live Simulation Labs" },
      { num: "45+", label: "Countries Represented" }
    ],

    // Agenda / Tracks preview
    tracks: [
      {
        time: "09:00 - 11:30 AM",
        title: "Track 1: High-Stakes Boardroom Persuasion",
        desc: "Mastering executive brevity, structuring complex financial arguments, and defending strategic initiatives before demanding boards."
      },
      {
        time: "11:45 - 01:15 PM",
        title: "Track 2: Storytelling Under Pressure",
        desc: "Live teardowns of real corporate scenarios: turn dry data decks into memorable narratives that disarm skepticism."
      },
      {
        time: "02:30 - 05:00 PM",
        title: "Track 3: Cross-Cultural Negotiation Architecture",
        desc: "Nuance, tactical empathy, and linguistic precision when leading global M&A, cross-border alliances, and high-impact partnerships."
      }
    ],

    // How to attend (Ach khasek dir bach thedr)
    howToAttend: {
      title: "How to Attend Year 15",
      subtitle: "Attendance is limited to 1,200 verified corporate leaders and executive delegations.",
      steps: [
        {
          step: "01",
          title: "Select Your Pass Tier",
          desc: "Choose between Executive Individual Pass, Corporate Delegation (5+ seats), or Private Masterclass Access."
        },
        {
          step: "02",
          title: "Submit Professional Verification",
          desc: "Provide your corporate email and current leadership role. Applications are reviewed within 48 business hours."
        },
        {
          step: "03",
          title: "Receive Briefing & Credentials",
          desc: "Once confirmed, you will receive personalized preparatory materials, venue badges, and invitation to the private executive networking reception."
        }
      ]
    }
  },

  "14": {
    year: "14",
    theme: "Homecoming",
    isUpcoming: false,
    statusText: "Past Event • Archive & Recap",
    date: "April 11, 2026",
    location: "Keller Auditorium, Portland & Global Broadcast",
    city: "Portland, Oregon",
    heroImage: "./images/tedx/year14-bg.webp",
    logoSvg: "./images/tedx/year14-homecoming.svg",
    videoSrc: "./videos/Luca Maglierie Showreel-1-1.mp4",
    videoPoster: "./images/tedx/year14-bg.webp",
    headline: "Returning to Core Roots: The Essence of Authentic Leadership",
    tagline: "A masterclass in navigating corporate change while honoring organizational DNA.",
    overview: "Year 14 explored 'Homecoming'—what it means for global organizations to return to fundamental clarity after periods of rapid expansion, organizational restructuring, and market volatility.",
    
    // What happened (Ach tra fiha)
    recapStory: "Over 3,100 leaders gathered to witness 14 high-impact talks and live tactical coaching demonstrations. Key moments included real-time breakdown of executive crisis communication, turning complex restructuring plans into inspiring team narratives, and establishing psychological safety across hybrid multinational workforces.",
    
    highlights: [
      { num: "3,150", label: "Leaders in Attendance" },
      { num: "14", label: "Executive Talks" },
      { num: "98.8%", label: "Satisfaction Rating" },
      { num: "38", label: "Sponsor Partners" }
    ],

    takeaways: [
      "Clarity beats complexity: Why the most influential memos are written in plain, compelling English.",
      "Re-anchoring team purpose: Practical frameworks for aligning disparate departments behind a single story.",
      "The vocabulary of trust: How executive language shapes investor confidence during turnaround periods."
    ]
  },

  "13": {
    year: "13",
    theme: "CONTINUUM",
    isUpcoming: false,
    statusText: "Past Event • Archive & Recap",
    date: "April 26, 2025",
    location: "Moda Center & Live Virtual Stage",
    city: "Portland, Oregon",
    heroImage: "./images/tedx/year13-bg.webp",
    logoSvg: "./images/tedx/year13-continuum.svg",
    videoSrc: "./videos/Jesuisvir Showreel-1-1.mp4",
    videoPoster: "./images/tedx/year13-bg.webp",
    headline: "Unbroken Momentum in an Age of Relentless Disruption",
    tagline: "Building resilient communication rhythms that sustain high-performing corporate cultures.",
    overview: "CONTINUUM challenged corporate leaders to break free from reactive crisis mode and establish enduring, proactive communication cadences that withstand continuous industry disruption.",
    
    recapStory: "With 3,400 leaders convened under one roof, Year 13 delivered an immersive masterclass on corporate narrative stamina. Speakers demonstrated how leaders who maintain clear, transparent communication through turbulent quarters achieve 3.4x higher team retention and faster strategic execution.",
    
    highlights: [
      { num: "3,400+", label: "Attendees" },
      { num: "15", label: "Keynotes Delivered" },
      { num: "6", label: "Interactive Labs" },
      { num: "52", label: "Countries Connected" }
    ],

    takeaways: [
      "Sustaining momentum through quarterly turbulence with predictable executive messaging.",
      "Overcoming communication fatigue in fast-scaling international organizations.",
      "The role of candid vulnerability in building unshakeable executive presence."
    ]
  },

  "12": {
    year: "12",
    theme: "Alchemy",
    isUpcoming: false,
    statusText: "Past Event • Archive & Recap",
    date: "April 27, 2024",
    location: "Arlene Schnitzer Concert Hall",
    city: "Portland, Oregon",
    heroImage: "./images/tedx/year12-bg.webp",
    logoSvg: "./images/tedx/year12-alchemy.svg",
    videoSrc: "./videos/Vergnani Clip Casa Compressed-1.mp4",
    videoPoster: "./images/tedx/year12-bg.webp",
    headline: "Transmuting Raw Data into Irresistible Influence",
    tagline: "The art and science of turning spreadsheets into boardroom conviction.",
    overview: "Year 12: Alchemy investigated the magical intersection of rigorous analytical data and human emotional engagement. It provided actionable tools to translate cold balance sheets into vivid strategic stories.",
    
    recapStory: "Year 12 set a benchmark for analytical storytelling. Attendees worked through live case studies where complex financial engineering and regulatory filings were distilled into compelling investor pitches and executive all-hands addresses.",
    
    highlights: [
      { num: "2,900", label: "Attendees" },
      { num: "12", label: "Keynote Speakers" },
      { num: "99.2%", label: "Positive Impact" },
      { num: "30+", label: "Industry Leaders" }
    ],

    takeaways: [
      "The 3-act structure for financial and operational presentations.",
      "Eliminating corporate jargon without losing intellectual gravitas.",
      "How CFOs and technical founders win over non-technical stakeholders."
    ]
  },

  "11": {
    year: "11",
    theme: "Confluence",
    isUpcoming: false,
    statusText: "Past Event • Archive & Recap",
    date: "May 20, 2023",
    location: "Moda Center Arena",
    city: "Portland, Oregon",
    heroImage: "./images/tedx/year11-bg.webp",
    logoSvg: "./images/tedx/year11-confluence.svg",
    videoSrc: "./videos/Team App Showreel-1.mp4",
    videoPoster: "./images/tedx/year11-bg.webp",
    headline: "Where Diverse Streams of Thought Converge into Unified Action",
    tagline: "Aligning multidisciplinary teams, cross-functional units, and international cultures.",
    overview: "Confluence addressed the single biggest friction in modern multinational organizations: cross-functional silos. The event unpacked proven communication protocols that unite product, engineering, legal, and sales under one voice.",
    
    recapStory: "Over 3,000 corporate professionals experienced hands-on demonstrations of cross-silo negotiation. From conflict resolution between engineering and commercial teams to leading multinational summits, Confluence provided the universal language of alignment.",
    
    highlights: [
      { num: "3,000+", label: "Participants" },
      { num: "14", label: "Featured Talks" },
      { num: "99.0%", label: "Actionable Rating" },
      { num: "42", label: "Corporate Delegations" }
    ],

    takeaways: [
      "Building shared mental models across engineering, finance, and creative teams.",
      "Negotiating without zero-sum thinking in cross-departmental allocations.",
      "Framing joint accountability that sticks across international offices."
    ]
  },

  "10": {
    year: "10",
    theme: "Audacious",
    isUpcoming: false,
    statusText: "Past Event • Archive & Recap",
    date: "May 22, 2022",
    location: "Moda Center Arena",
    city: "Portland, Oregon",
    heroImage: "./images/tedx/year10-bg.webp",
    logoSvg: "./images/tedx/year10-audacious.svg",
    videoSrc: "./videos/Luca Maglierie Showreel-1-1.mp4",
    videoPoster: "./images/tedx/year10-bg.webp",
    headline: "Daring to Articulate Uncomfortable, Game-Changing Ambitions",
    tagline: "Celebrating a decade of transformative ideas and courageous public speaking.",
    overview: "The 10th anniversary edition was a bold celebration of audacity in corporate strategy, social innovation, and leadership communication. It challenged delegates to discard safe, lukewarm messaging in favor of daring clarity.",
    
    recapStory: "A record-breaking assembly of 3,500 executives witnessed 16 groundbreaking talks that redefined what audacious communication looks like in the modern economy.",
    
    highlights: [
      { num: "3,500", label: "Delegates" },
      { num: "16", label: "Milestone Talks" },
      { num: "10", label: "Years Celebrated" },
      { num: "100%", label: "Sold Out Edition" }
    ],

    takeaways: [
      "The courage to say what everyone in the boardroom is thinking but afraid to voice.",
      "Crafting bold vision statements that rally top-tier talent to your mission.",
      "Standing resolute under high-stakes media and investor scrutiny."
    ]
  }
};

