*******************
*FRONT-END-STARTER*
*******************

This file provides the directives on how to use this starter and includes the files hierarchy.

Technologies:
ReactJS, Vite, Tailwindcss and shadcn UI. 


├──node_modules/ #List of all the installed modules
|
├── public/
│ ├── assets/
│ │ └── images/ # Static images or assets
│ └── favicon.ico # Favicon or static resources
├── src/
│ ├── assets/ # Static assets (fonts, images, etc.) imported by components
│ ├── components/ # Reusable UI components
│ │ ├── layout/ # Layout components (Header, Footer, Sidebar, etc.)
│ │ ├── forms/ # Form components (Input, Button)
│ │ ├── modals/ # Modal components
│ │ ├── ui/ # Contains all the Shadcn components
│ │ └── ... # Other reusable components
│ ├── config/ # Configuration files for environment variables, routes, etc.
│ ├── schemas/ # Contains all the schemas for the forms.
│ ├── contexts/ # React Context for global state management
│ ├── hooks/ # Custom hooks for logic reuse
│ ├── pages/ # Pages or views in the app (could include containers for large views)
│ │ ├── Home.jsx # Example page
│ │ ├── About.jsx # Example page
│ │ └── ... # Other page views
│ ├── index.css
│ ├── utils/ # Utility functions (helpers, formatters, constants, etc.)
│ ├── App.jsx # Main app component
│ └── main.jsx # Entry point of the application
├── .env # Environment variables
├── .gitignore # Files to ignore in version control
├── package.json # Project dependencies and scripts
├── package-lock.json
├── postcss.config.js # Files to ignore in version control
├── tailwind.config.js # Project dependencies and scripts
├── vite.config.js # Vite configuration
└── README.md