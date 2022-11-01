const SkillTreeShowFlag = {
  ChooseCategory: true,
  ChooseSubcategory: true,
  ChooseFocusArea: true,
  ChoosePriorities: true,
  ChooseSalary: true,
};

const priorities = {
  title: "Let me get your priorities straight!",
  description: "Distribute the 100 points based on what you value most.",
  priorities: {
    Experience: {
      description: "Can they be a novice or do they need to be a champ?",
      initialValue: "20",
    },
    Accountability: {
      description: "Do they need to have a proven track-record of reliability?",
      initialValue: "20",
    },
    "Skill Match": {
      description: "How precise does the skill match need to be?",
      initialValue: "20",
    },
    Availability: {
      description: "Are you flexible on time?",
      initialValue: "20",
    },
  },
};

const proposedSalary = {
  title: "Salary range",
  description:
    "Give us an indication of the salary range you were thinking about",
  minSalary: "1/hour",
  maxSarary: "500/hour",
};

const SkillTree = {
  Design: {
    subCategories: {
      content: [
        "UX/UI",
        "Graphic Design",
        "Web Design",
        "Game Design",
        "Animation",
        "General Design support from A-Z",
        "NFT Design",
        "Brand Design",
        "Other",
      ],
    },
    "Niche Skills": {
      content: [
        "Design Thinking",
        "User-Centered Design",
        "Agile",
        "Style Guides",
        "Creative Brief",
        "VR Design",
        "AR Design",
        "Character Design",
        "Other",
      ],
    },
    "Knowledge of specific tools": {
      content: [
        "Figma",
        "Sketch",
        "Figma",
        "Adobe Photoshop",
        "Adobe Illustrator",
        "3D Design Software",
        "Canva",
        "CorelDraw",
        "GIMP",
        "Affinity Designer",
        "Infinite Design",
        "Inkscape",
        "Other",
      ],
    },
    "Values & Culture": {
      content: [
        "Growth Mindset",
        "Self-starter",
        "First Principles Thinker",
        "Teamwork",
        "Integrity",
        "Entrepreneurial",
        "Boldness",
        "Trust",
        "Accountability",
        "Passion",
        "Reliability",
        "Fun",
        "Honesty",
        "Other",
      ],
    },
  },
  "Frontend Developer": {
    subCategories: {
      content: [
        "UI Implementation",
        "Frontend Architecture",
        "General Frontend Support",
        "Web Development",
        "App Development",
        "Other",
      ],
    },
    "Niche Skills": {
      content: [
        "Typescript",
        "Javascript",
        "React",
        "Angular",
        "Other specific languages",
        "Other specific skills",
      ],
    },
    "Knowledge of specific tools": {
      content: [
        "Issue Tracking Tools",
        "Specific IDE's",
        "Database Editors",
        "API Management Tools",
        "Specific Libraries",
        "Version Control",
        "Other",
      ],
    },
    "Values & Culture": {
      content: [
        "Growth mindset",
        "Self-starter",
        "First Principles",
        "Teamwork",
        "Integrity",
        "Entrepreneurial",
        "Boldness",
        "Trust",
        "Accountability",
        "Passion",
        "Reliability",
        "Fun",
        "Honesty",
        "Other",
      ],
    },
  },
  "Backend Developer": {
    subCategories: {
      content: [
        "Architecture of your app",
        "Hard CS Stuff like Algo Dev & Data Structures",
        "AI & Data Science",
        "Blockchain & Smart Contract Stuff",
        "Other",
      ],
    },
    "Niche Skills": {
      content: [
        "Typescript",
        "Java",
        "MySQL",
        "Node.js",
        "Ruby",
        "Python",
        "Rust/C++",
        "GO",
        "Javascript",
        "Other Languages",
        "Other Tools",
      ],
    },
    "Knowledge of specific tools": {
      content: [
        "Issue Tracking Tools",
        "Specific IDE's",
        "Database Editors",
        "API Management Tools",
        "Specific Libraries",
        "Version Control",
        "Other",
      ],
    },
    "Values & Culture": {
      content: [
        "Growth mindset",
        "Self-starter",
        "First Principles Thinker",
        "Teamwork",
        "Integrity",
        "Entrepreneurial",
        "Boldness",
        "Trust",
        "Accountability",
        "Passion",
        "Reliability",
        "Fun",
        "Honesty",
        "Other",
      ],
    },
  },
  "Blockchain Developer": {
    subCategories: {
      content: [
        "Smart Contract Development",
        "Smart Contract Auditing",
        "Blockchain Architecture & Design",
        "Lead a Technical Team",
        "General Blockchain Support",
        "Other",
      ],
    },
    "Niche Skills": {
      content: [
        "Solidity",
        "GO",
        "MOVE",
        "C++",
        "Rust",
        "Other Languages",
        "Other Niche Skills",
      ],
    },
    "Knowledge of specific tools": {
      content: [
        "Polygon",
        "Polkadot",
        "Celo",
        "Avalanche",
        "Ethereum",
        "Solana",
        "Cardano",
        "Binance Smart Chain",
        "Bitcoin",
        "Cosmos",
        "Other",
      ],
    },
    "Values & Culture": {
      content: [
        "Growth mindset",
        "Self-starter",
        "First Principles Thinker",
        "Teamwork",
        "Integrity",
        "Entrepreneurial",
        "Boldness",
        "Trust",
        "Accountability",
        "Passion",
        "Reliability",
        "Fun",
        "Honesty",
        "Other",
      ],
    },
  },
  Product: {
    subCategories: {
      content: [
        "User Research",
        "Market Research",
        "Technical Team Coordination",
        "Design Team Coordination",
        "Ideation",
        "Interviews",
        "UX/UI",
        "General PM Support building your product from A-Z",
        "Other",
      ],
    },
    "Niche Skills": {
      content: [
        "Quantitative Analysis",
        "Qualitative Analysis",
        "Report Creation",
        "Statistical Analysis",
        "A/B Testing",
        "Feature Discovery Techniques",
        "Agile",
        "Waterfall",
        "Spec Writing",
        "User Journey Mapping",
        "Persona Development",
        "User Stories",
        "Technical Spec Writing",
        "Product OKR Development",
        "Other",
      ],
    },
    "Knowledge of specific tools": {
      content: [
        "Figma",
        "Loom",
        "Zoom",
        "Illustrator",
        "Photoshop",
        "Canva",
        "Infinite Design",
        "Trello",
        "Jira",
        "Asana",
        "Other",
      ],
    },
    "Values & Culture": {
      content: [
        "Growth mindset",
        "Self-starter",
        "First Principles Thinker",
        "Teamwork",
        "Integrity",
        "Entrepreneurial",
        "Boldness",
        "Trust",
        "Accountability",
        "Passion",
        "Reliability",
        "Fun",
        "Honesty",
        "Other",
      ],
    },
  },
};

const ResultCardShowFlag = {
  type: "User", // Project,Bounty,DAO,User,discordChannel
  picture: true,
  description: true,
  skills: true,
  generalTags: true,
  champion: true,
  persentage: true,
  persentageButton: true,
};

const ResultPopUpShowFlag = {
  type: "User", // Project,Bounty,DAO,User,discordChannel
  picture: true,
  description: true,
  skills: true,
  generalTags: true,
  champion: true,
  persentage: true,
  persentageButton: true,
};

const Result = {
  1: {
    description:
      "Have been programming since I was 12 years old. During the day I work at Google as a Frontend Engineer on Google Maps, at night I want to be working on the next Google. Hit me up for help with cool startup projects. I'm obsessed with Frontend because it literally has the power to shape the way we interact with eachother & the world around us.",
    percentage: "85%",
    picture:
      "https://cdn.discordapp.com/avatars/875582358940684388/69f7bcd77f145dd282e2abeb47717cf8.webp",
    name: "BluePanda",
    nameDescription: "Frontend Developer",
    Descrimator: "1234",
    Skills: [
      "Typescript",
      "Javascript",
      "React",
      "Angular",
      "Jira",
      "Self-Starter",
      "Growth Mindset",
      "Accountability",
      "UX/UI",
      "Graphic Design",
      "Web Design",
      "UI Implementation",
      "Frontend Architecture",
      "General Frontend Support",
      "Web Development",
      "App Development",
    ],
    socials: [
      {
        name: "Discord",
        link: "https://discord.gg/2cF6hup",
        icon: "https://i.imgur.com/1Q9Z1Zm.png",
      },
      {
        name: "Twitter",
        link: "https://twitter.com/BluePandaDAO",
        icon: "https://i.imgur.com/1Q9Z1Zm.png",
      },
    ],
    availability: "10",
  },
  2: {
    description:
      "I was employee no1 at Dropbox where I basically helped scope out v1 of the product's backend. I'm looking for a challenging project to spend my nights & weekends on and potentially even join down the line.",
    percentage: "79%",
    picture:
      "https://cdn.discordapp.com/avatars/879166443512545311/feb30747504d86519aee3a54fac0b932.webp",
    name: "Waxy",
    nameDescription: "Backend Developer",
    Descrimator: "1234",
    Skills: [
      "Architecture of your app",
      "Hard CS Stuff like Algo Dev & Data Structures",
      "Blockchain & Smart Contract Stuff",
      "Typescript",
      "Java",
      "MySQL",
      "Node.js",
      "Ruby",
      "Python",
      "Rust/C++",
      "GO",
      "Javascript",
    ],
    socials: [
      {
        name: "Discord",
        link: "https://discord.gg/2cF6hup",
        icon: "https://i.imgur.com/1Q9Z1Zm.png",
      },
      {
        name: "Twitter",
        link: "https://twitter.com/BluePandaDAO",
        icon: "https://i.imgur.com/1Q9Z1Zm.png",
      },
    ],
    availability: "15",
  },
  3: {
    description:
      "I'm currently a PM at Airbnb - absolutely obsessed with learning & want to work on something completely unrelated to hospitality.",
    percentage: "88%",
    picture:
      "https://cdn.discordapp.com/avatars/385833013692334080/3fcaa397c193dc2f9c6316e79ce75b8d.webp",
    name: "Impactbilli",
    nameDescription: "Product",
    Descrimator: "1234",
    Skills: [
      "User Research",
      "Market Research",
      "Technical Team Coordination",
      "Design Team Coordination",
      "Ideation",
      "Interviews",
      "UX/UI",
      "Spec Writing",
      "User Journey Mapping",
      "Persona Development",
      "User Stories",
      "Technical Spec Writing",
      "Product OKR Development",
    ],
    socials: [
      {
        name: "Discord",
        link: "https://discord.gg/2cF6hup",
        icon: "https://i.imgur.com/1Q9Z1Zm.png",
      },
      {
        name: "Twitter",
        link: "https://twitter.com/BluePandaDAO",
        icon: "https://i.imgur.com/1Q9Z1Zm.png",
      },
    ],
    availability: "10",
  },
  4: {
    description:
      "I've been designing since 3 - my drawings then were already exquisite. Currently designing at Apple. Looking to help projects that want to fight climate change.",
    percentage: "78%",
    picture:
      "https://cdn.discordapp.com/avatars/175735303489847296/fe70f8879d7d8979dd4a32690806f7f3.webp",
    name: "XYZ",
    nameDescription: "Product",
    Descrimator: "1234",
    Skills: [
      "UX/UI",
      "Graphic Design",
      "Web Design",
      "Game Design",
      "Animation",
      "General Design support from A-Z",
      "NFT Design",
      "Brand Design",
    ],
    socials: [
      {
        name: "Discord",
        link: "https://discord.gg/2cF6hup",
        icon: "https://i.imgur.com/1Q9Z1Zm.png",
      },
      {
        name: "Twitter",
        link: "https://twitter.com/BluePandaDAO",
        icon: "https://i.imgur.com/1Q9Z1Zm.png",
      },
    ],
    availability: "10",
  },
  5: {
    description:
      "Product OBSESSED! Pretty new as a PM tho - have a more technical background, but discovered a deep love for solving customer problems.",
    percentage: "70%",
    picture:
      "https://cdn.discordapp.com/avatars/562160161951711243/2ae783853c88a288db9ed8b691076ad2.webp",
    name: "Impactbilli",
    nameDescription: "Product",
    Descrimator: "1234",
    Skills: [
      "User Research",
      "Market Research",
      "Technical Team Coordination",
      "Design Team Coordination",
      "Ideation",
      "Interviews",
      "UX/UI",
      "Spec Writing",
      "User Journey Mapping",
      "Persona Development",
      "User Stories",
      "Technical Spec Writing",
      "Product OKR Development",
    ],
    socials: [
      {
        name: "Discord",
        link: "https://discord.gg/2cF6hup",
        icon: "https://i.imgur.com/1Q9Z1Zm.png",
      },
      {
        name: "Twitter",
        link: "https://twitter.com/BluePandaDAO",
        icon: "https://i.imgur.com/1Q9Z1Zm.png",
      },
    ],
    availability: "10",
  },
  6: {
    description: "I'm vitalik. ",
    percentage: "100%",
    picture:
      "https://cdn.discordapp.com/avatars/677988313319211037/ff9cda5e0e8fbe62caea07fb7eb3de23.webp",
    name: "notVitalik",
    nameDescription: "Blockchain Developer",
    Descrimator: "1234",
    Skills: [
      "Smart Contract Development",
      "Smart Contract Auditing",
      "Blockchain Architecture & Design",
      "Lead a Technical Team",
      "General Blockchain Support",
      "Solidity",
      "GO",
      "MOVE",
      "C++",
      "Rust",
      "Ethereum",
    ],
    socials: [
      {
        name: "Discord",
        link: "https://discord.gg/2cF6hup",
        icon: "https://i.imgur.com/1Q9Z1Zm.png",
      },
      {
        name: "Twitter",
        link: "https://twitter.com/BluePandaDAO",
        icon: "https://i.imgur.com/1Q9Z1Zm.png",
      },
    ],
    availability: "10",
  },
  7: {
    description:
      "I am a relationship-focused, organized, and detail-oriented product manager. I am enthusiastic about the work that I do, and I am passionate about technology. Working with teams to design and build products that meet customer needs is what I do best. My communication skills allow me to collaborate well with both technical and non-technical individuals. ",
    percentage: "89%",
    picture:
      "https://cdn.discordapp.com/avatars/857323639854465046/d2553a2d1960750914906aea6999279c.webp",
    name: "daodaoism",
    nameDescription: "Product Manager",
    Descrimator: "9605",
    Skills: ["Digital Product Management", "Agile Project Management"],
    socials: [
      {
        name: "Discord",
        link: "https://discord.gg/2cF6hup",
        icon: "https://i.imgur.com/1Q9Z1Zm.png",
      },
      {
        name: "Twitter",
        link: "https://twitter.com/BluePandaDAO",
        icon: "https://i.imgur.com/1Q9Z1Zm.png",
      },
    ],
    availability: "20",
  },
  8: {
    description:
      "I am a passionate software developer with over 10 years of experience working with robots. Over the past year I've been working to transfer my passion of programming into a becoming full stack software developer. I have experience developing full stack web sites with JavaScript, React, Express, Flask, PostgreSQL and HTML/CSS through projects done at App Academy. I enjoy the entire process of building apps from designing and building a road map of were I want to go to being able to hit those goals and have a product I'm proud of. When I'm not programming I'm either watching a fantasy show with my wife or winning games as a top 500 Overwatch support. ",
    percentage: "92%",
    picture:
      "https://cdn.discordapp.com/avatars/451587147808636929/a_872037e1cc253eff29f26b918c1d595d.webp",
    name: "Flolight",
    nameDescription: "Fullstack Engineer",
    Descrimator: "9605",
    Skills: [
      "Python (Programming Language",
      "JavaScript (Programming Language)",
      "Angular (Web Framework)",
      "Cloud Security Applications",
      "Applications Architecture",
      "AWS SDK",
    ],
    socials: [
      {
        name: "Discord",
        link: "https://discord.gg/2cF6hup",
        icon: "https://i.imgur.com/1Q9Z1Zm.png",
      },
      {
        name: "Twitter",
        link: "https://twitter.com/BluePandaDAO",
        icon: "https://i.imgur.com/1Q9Z1Zm.png",
      },
    ],
    availability: "25",
  },
  9: {
    description: "Backend engineer passionate about crypto/web3/blockchain ",
    percentage: "97%",
    picture:
      "https://cdn.discordapp.com/avatars/453089755924791317/a_febc3c7ca14702c46aec9ccaff7deb36.webp",
    name: "TheDarkFury",
    nameDescription: "Backend Engineer",
    Descrimator: "2068",
    Skills: ["Solidity", "Rust", "JavaScript (Programming Language)"],
    socials: [
      {
        name: "Discord",
        link: "https://discord.gg/2cF6hup",
        icon: "https://i.imgur.com/1Q9Z1Zm.png",
      },
      {
        name: "Twitter",
        link: "https://twitter.com/BluePandaDAO",
        icon: "https://i.imgur.com/1Q9Z1Zm.png",
      },
    ],
    availability: "12",
  },
  10: {
    description:
      "Passionate analytical thinker who thrives in high-energy web3 enviroments. ",
    percentage: "79%",
    picture:
      "https://cdn.discordapp.com/avatars/486268049259757580/c9c4370157fffb42ae9446203719a403.webp",
    name: "Sunk8.eth",
    nameDescription: "Community Manager",
    Descrimator: "5319",
    Skills: ["Community Planning", "Content Marketing"],
    socials: [
      {
        name: "Discord",
        link: "https://discord.gg/2cF6hup",
        icon: "https://i.imgur.com/1Q9Z1Zm.png",
      },
      {
        name: "Twitter",
        link: "https://twitter.com/BluePandaDAO",
        icon: "https://i.imgur.com/1Q9Z1Zm.png",
      },
    ],
    availability: "32",
  },
  11: {
    description: "Blockchain, Smart Contracts, Mathematics, Ethereum. ",
    percentage: "78%",
    picture:
      "https://cdn.discordapp.com/avatars/493465532423602176/a56c1e883d732ce7420ecf3439374021.webp",
    name: "danomite",
    nameDescription: "Blockchain Developer",
    Descrimator: "9894",
    Skills: [
      "Solidity",
      "Product Strategy",
      "JavaScript (Programming Language)",
      "React.js",
    ],
    socials: [
      {
        name: "Discord",
        link: "https://discord.gg/2cF6hup",
        icon: "https://i.imgur.com/1Q9Z1Zm.png",
      },
      {
        name: "Twitter",
        link: "https://twitter.com/BluePandaDAO",
        icon: "https://i.imgur.com/1Q9Z1Zm.png",
      },
    ],
    availability: "22",
  },

  12: {
    description:
      "Extensive experience in product management, strategy, and marketing functions Deep knowledge of Systems, Solutions, Semiconductors for the Edge Cross-Functional leadership and track record of successful product planning and execution ",
    percentage: "88%",
    picture:
      "https://cdn.discordapp.com/avatars/403298435689611264/78fa1d482c932b5c26c505e1cd8c5ab4.webp",
    name: "Samoshi",
    nameDescription: "Product Strategist",
    Descrimator: "1288",
    Skills: [
      "Product Roadmaps",
      "Product Lifecycle",
      "Product Management",
      "Commercial Development",
      "Commercialization",
    ],
    socials: [
      {
        name: "Discord",
        link: "https://discord.gg/2cF6hup",
        icon: "https://i.imgur.com/1Q9Z1Zm.png",
      },
      {
        name: "Twitter",
        link: "https://twitter.com/BluePandaDAO",
        icon: "https://i.imgur.com/1Q9Z1Zm.png",
      },
    ],
    availability: "25",
  },
  13: {
    description:
      "I lead through standardization and a bias for action. Using vulnerable trust I create teams that feel comfortable to weigh-in while pursuing the highest standards. I am a senior engineer with experience developing cloud architecture, but I am also a leader of people and ideas. I value constructive conflict, and I value the resolve and commitment that follows. I want to be around others who are equally as passionate about the pursuit of a great product.",
    percentage: "81%",
    picture:
      "https://cdn.discordapp.com/avatars/369700858742571008/5d2cf4cdbbb5e741a889c4982e7e13d2.webp",
    name: "distorted",
    nameDescription: "Backend Developer",
    Descrimator: "7777",
    Skills: [
      "Python (Programming Language)",
      "Solidity",
      "Cloud Computing Security",
      "AWS Lambda",
    ],
    socials: [
      {
        name: "Discord",
        link: "https://discord.gg/2cF6hup",
        icon: "https://i.imgur.com/1Q9Z1Zm.png",
      },
      {
        name: "Twitter",
        link: "https://twitter.com/BluePandaDAO",
        icon: "https://i.imgur.com/1Q9Z1Zm.png",
      },
    ],
    availability: "35",
  },
  14: {
    description:
      "I'm a software developer with a passion for building from the ground up. I aspire to keep up with developing computer technologies and new coding languages. I'm a graduate of the Software Engineering program at Thinkful. I'm a strong media and communication professional with a Bachelor's Degree focused in Design Studies from Arizona State University. ",
    percentage: "86%",
    picture:
      "https://cdn.discordapp.com/avatars/879166443512545311/feb30747504d86519aee3a54fac0b932.webp",
    name: "Sriram Kasyap | sriramkasyap.eth",
    nameDescription: "FrontEnd Developer",
    Descrimator: "8136",
    Skills: [
      "Responsive Web Design",
      "Node.js",
      "React.js",
      "Cascading Style Sheets (CSS)",
      "Solidity",
    ],
    socials: [
      {
        name: "Discord",
        link: "https://discord.gg/2cF6hup",
        icon: "https://i.imgur.com/1Q9Z1Zm.png",
      },
      {
        name: "Twitter",
        link: "https://twitter.com/BluePandaDAO",
        icon: "https://i.imgur.com/1Q9Z1Zm.png",
      },
    ],
    availability: "15",
  },
  15: {
    description:
      " love interdisciplinary learning. Taking the best concepts from different fields and applying it to the software I write.",
    percentage: "68%",
    picture:
      "https://cdn.discordapp.com/avatars/385833013692334080/3fcaa397c193dc2f9c6316e79ce75b8d.webp",
    name: "Flolight",
    nameDescription: "Cloud Developer",
    Descrimator: "5146",
    Skills: [
      "AWS CloudFormation",
      "Cloud Security Applications",
      "Machine Learning",
      "Cascading Style Sheets (CSS)",
      "Aplications Architecture",
    ],
    socials: [
      {
        name: "Discord",
        link: "https://discord.gg/2cF6hup",
        icon: "https://i.imgur.com/1Q9Z1Zm.png",
      },
      {
        name: "Twitter",
        link: "https://twitter.com/BluePandaDAO",
        icon: "https://i.imgur.com/1Q9Z1Zm.png",
      },
    ],
    availability: "50",
  },
};

const resultsOnChoice = {
  Design: [
    {
      result: "4",
      percentage: "80%",
    },
    {
      result: "5",
      percentage: "60%",
    },
    {
      result: "1",
      percentage: "50%",
    },
    {
      result: "12",
      percentage: "71%",
    },
    {
      result: "",
      percentage: "%",
    },
    {
      result: "",
      percentage: "%",
    },
  ],
  "Frontend Developer": [
    {
      result: "1",
      percentage: "80%",
    },
    {
      result: "4",
      percentage: "60%",
    },
    {
      result: "3",
      percentage: "50%",
    },
    {
      result: "8",
      percentage: "69%",
    },
    {
      result: "14",
      percentage: "95%",
    },
    {
      result: "11",
      percentage: "81%",
    },
    {
      result: "9",
      percentage: "45%",
    },
    {
      result: "14",
      percentage: "85%",
    },
    {
      result: "15",
      percentage: "32%",
    },
  ],
  "Backend Developer": [
    {
      result: "2",
      percentage: "80%",
    },
    {
      result: "1",
      percentage: "60%",
    },
    {
      result: "3",
      percentage: "50%",
    },
    {
      result: "8",
      percentage: "87%",
    },
    {
      result: "9",
      percentage: "97%",
    },
    {
      result: "11",
      percentage: "83%",
    },
    {
      result: "13",
      percentage: "88%",
    },
    {
      result: "14",
      percentage: "77%",
    },
    {
      result: "15",
      percentage: "62%",
    },
  ],
  "Blockchain Developer": [
    {
      result: "6",
      percentage: "100%",
    },
    {
      result: "9",
      percentage: "72%",
    },
    {
      result: "1",
      percentage: "76%",
    },
    {
      result: "14",
      percentage: "71%",
    },
    {
      result: "11",
      percentage: "79%",
    },
    {
      result: "13",
      percentage: "77%",
    },
  ],
  Product: [
    {
      result: "3",
      percentage: "80%",
    },
    {
      result: "5",
      percentage: "60%",
    },
    {
      result: "4",
      percentage: "50%",
    },
    {
      result: "7",
      percentage: "98%",
    },
    {
      result: "10",
      percentage: "72%",
    },
    {
      result: "12",
      percentage: "88%",
    },
    {
      result: "15",
      percentage: "22%",
    },
  ],
};

const USER_MOCK = {
  SkillTreeShowFlag: SkillTreeShowFlag,
  priorities: priorities,
  proposedSalary: proposedSalary,
  SkillTree: SkillTree,
  ResultCardShowFlag: ResultCardShowFlag,
  ResultPopUpShowFlag: ResultPopUpShowFlag,
  Result: Result,
  resultsOnChoice: resultsOnChoice,
};

export default USER_MOCK;
