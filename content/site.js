// Everything the website says lives in this file: edit the text, save, and push to GitHub.
// Vercel rebuilds the site automatically. Pictures go in public/images/ and are referenced as
// '/images/your-file.jpg'. See the README for step-by-step instructions.

export const site = {
  brand: {
    name: 'Robotics Club',
    campus: 'BITS Pilani Dubai Campus',
    shortCampus: 'BITS Pilani Dubai',
    logoText: 'RC', // shown in a small badge when logoImage is empty
    logoImage: '/images/bits-dubai-campus-logo.webp',
  },

  // Header links, in order. Anything starting with /members shows the Council / Faculty menu.
  navigation: [
    { label: 'Home', href: '/' },
    { label: 'Members', href: '/members/council' },
    { label: 'News', href: '/news' },
    { label: 'Lab Facilities', href: '/lab-facilities' },
    { label: 'Contact', href: '/contact' },
  ],

  home: {
    heading: 'Where ideas become machines.',
    description: 'A student-driven space to build, test and explore robotics at BITS Pilani Dubai Campus.',
    primaryLabel: 'Explore the lab',
    primaryHref: '/lab-facilities',
    secondaryLabel: 'Meet the club',
    secondaryHref: '/members/council',
    showcaseLabel: 'Inside the lab',
    newsHeading: 'News & updates',
    newsEmptyTitle: 'No announcements yet.',
    newsEmptyText: 'Club updates will appear here when published.',
  },

  // The rotating pictures on the homepage.
  robots: [
    { id: 'arm', title: 'Robotic Arm Workstation', type: 'Manipulation', description: 'Explore precision movement, control and pick-and-place tasks.', image: '/images/robot-arm.jpg', imageAlt: 'Illustrative image of a robotic arm in a lab', imageNote: 'Illustrative concept image' },
    { id: 'mobile', title: 'Mobile Robotics Platform', type: 'Autonomy', description: 'A platform for navigation, mapping and control experiments.', image: '/images/mobile-robot.jpg', imageAlt: 'Illustrative image of a wheeled robot in a lab', imageNote: 'Illustrative concept image' },
    { id: 'vision', title: 'Vision & Sensing Station', type: 'Perception', description: 'Cameras and depth sensors for perception and object detection.', image: '/images/vision-station.jpg', imageAlt: 'Illustrative image of a vision sensing station', imageNote: 'Illustrative concept image' },
  ],

  // Announcements. Newest first is not required: they are sorted by date. To add one, copy the
  // example below. Set published to false to keep a draft out of the site.
  news: [
    // {
    //   id: 'orientation-2026',            // any unique text, no spaces
    //   title: 'Orientation workshop for new members',
    //   date: '2026-09-15',                // YYYY-MM-DD
    //   category: 'Event',
    //   summary: 'One or two sentences shown in the list.',
    //   body: 'Optional longer text, shown under "Read more". Blank lines start a new paragraph.',
    //   image: '',                         // optional, e.g. '/images/orientation.jpg'
    //   published: true,
    // },
  ],

  facilities: [
    { id: 'mobile-facility', name: 'Mobile Robotics Platform', category: 'Navigation', description: 'A wheeled platform for navigation, mapping and control experiments.', image: '/images/mobile-robot.jpg', imageNote: 'Illustrative concept image' },
    { id: 'arm-facility', name: 'Robotic Arm Workstation', category: 'Manipulation', description: 'A multi-axis robotic arm for manipulation and pick-and-place tasks.', image: '/images/robot-arm.jpg', imageNote: 'Illustrative concept image' },
    { id: 'autonomous-facility', name: 'Autonomous Systems Kit', category: 'Prototyping', description: 'Sensors, microcontrollers and boards for building autonomous behaviours.', image: '', imageNote: '' },
    { id: 'vision-facility', name: 'Vision and Sensing Station', category: 'Perception', description: 'Cameras and depth sensors for perception and object detection work.', image: '/images/vision-station.jpg', imageNote: 'Illustrative concept image' },
  ],

  // Council and faculty profiles. To add a person, copy the example below.
  members: [
    // {
    //   id: 'jane-doe',
    //   name: 'Jane Doe',
    //   role: 'President',
    //   group: 'council',                  // 'council' or 'faculty'
    //   image: '',                         // optional portrait, e.g. '/images/jane-doe.jpg'
    //   bio: 'One or two sentences.',
    //   layout: 'side',                    // optional: 'side' (photo beside text), 'top' or 'center'
    //   order: 1,                          // optional: lower numbers appear first
    //   showNumber: false,                 // optional: show 01, 02, ... on the card
    // },
  ],

  pages: {
    news: { heading: 'News', description: 'Updates and activities from the Robotics Club.' },
    lab: { heading: 'Lab Facilities', description: 'Explore the equipment and areas featured by the Robotics Club.' },
    faculty: { heading: 'Faculty', description: 'The faculty guiding the Robotics Club at BITS Pilani Dubai Campus.' },
    council: { heading: 'Council', description: 'The student council leading the Robotics Club at BITS Pilani Dubai Campus.' },
    contact: { heading: 'Contact', description: 'Get in touch with the Robotics Club at BITS Pilani Dubai Campus.' },
  },

  contact: {
    // Add the club's real address and the message form appears on the Contact page. The form
    // opens the visitor's email app with their message ready to send to this address.
    email: '',
    location: 'BITS Pilani Dubai Campus, Dubai, UAE',
    formHeading: 'Send a message',
    formButton: 'Send message',
    successText: 'Your email app should open with your message ready to send.',
    // Example: { label: 'Instagram', url: 'https://instagram.com/your-club' }
    social: [],
  },

  footer: { text: 'BITS Pilani Dubai Campus', note: 'A student-led space to build, test and learn.' },

  // Page title and description for search engines and link previews.
  seo: { title: 'Robotics Club | BITS Pilani Dubai Campus', description: 'The student-driven robotics community at BITS Pilani Dubai Campus.' },

  // Main colour for buttons, links and highlights. Pick a fairly dark colour so text stays readable.
  theme: { accent: '#426c50' },

  // Smaller labels and empty-state messages used across the site.
  ui: {
    headerTagline: 'Build · Test · Learn', homeKicker: 'BITS Pilani Dubai Campus', newsKicker: 'Club news',
    newsReadMore: 'Read more', newsPageEmptyTitle: 'No announcements yet.', newsAllLabel: 'View all updates',
    showcaseEmptyText: 'Lab showcase coming soon.', councilTab: 'Student Council', facultyTab: 'Faculty',
    membersEmptyTitle: 'Meet the people behind the projects.', membersEmptyText: 'Names and profiles will appear here once the club publishes them.',
    labEmptyText: 'Lab details coming soon.', contactDetailsHeading: 'Find us', contactNoEmail: 'Contact details coming soon',
    contactLocationLabel: 'Location', contactEmailLabel: 'Email', contactSocialLabel: 'Follow the club',
    contactNameLabel: 'Name', contactFormEmailLabel: 'Your email', contactMessageLabel: 'Message',
  },
};
