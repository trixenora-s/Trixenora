server/
├── models/
│   ├── User.js           # User schema
│   ├── Game.js           # Game schema
│   └── AITool.js         # AI Tool schema
├── routes/
│   ├── auth.js           # Authentication endpoints
│   ├── games.js          # Game CRUD endpoints
│   ├── aiTools.js        # AI Tool CRUD endpoints
│   ├── users.js          # User profile endpoints
│   └── dashboard.js      # Dashboard & stats endpoints
├── middleware/
│   ├── auth.js           # JWT authentication middleware
│   └── upload.js         # File upload middleware
├── uploads/              # Storage for uploaded files
├── server.js             # Main server setup
├── package.json          # Dependencies
├── .env                  # Environment variables
├── .env.example          # Example env file
└── Dockerfile            # Docker configuration

client/
├── public/
│   ├── index.html        # HTML entry point
│   └── favicon.ico
├── src/
│   ├── components/
│   │   └── Navbar.js     # Top navigation component
│   ├── pages/
│   │   ├── HomePage.js               # Home page
│   │   ├── GamesPage.js              # Games listing
│   │   ├── AIToolsPage.js            # AI Tools listing
│   │   ├── GameDetail.js             # Game details & reviews
│   │   ├── ToolDetail.js             # Tool details & reviews
│   │   ├── Upload.js                 # Upload content form
│   │   ├── Dashboard.js              # User dashboard
│   │   ├── ProfilePage.js            # User profile
│   │   └── AuthPage.js               # Login/Register
│   ├── styles/
│   │   ├── index.css                 # Global styles
│   │   ├── Navbar.css                # Navbar styles
│   │   ├── HomePage.css              # Home page styles
│   │   ├── GamesPage.css             # Games page styles
│   │   ├── AIToolsPage.css           # AI tools page styles
│   │   ├── AuthPage.css              # Auth page styles
│   │   ├── Upload.css                # Upload form styles
│   │   ├── Dashboard.css             # Dashboard styles
│   │   ├── Detail.css                # Detail pages styles
│   │   ├── ProfilePage.css           # Profile styles
│   │   └── App.css                   # App component styles
│   ├── App.js            # Root component with routing
│   ├── index.js          # React app entry point
│   └── package.json      # Dependencies
└── package-lock.json

Root Directory/
├── docker-compose.yml    # Docker services configuration
├── README.md             # Project documentation
├── QUICKSTART.md         # Quick start guide
├── API.md                # API documentation
├── DEVELOPMENT.md        # Development guide
├── SETUP.md              # Setup instructions
├── install.sh            # Installation script
├── dev-setup.sh          # Development setup script
├── package.json          # Root package.json
└── .gitignore            # Git ignore rules
