Sure! Here is a `README.md` for your GitHub repository:

```markdown
# Task Management System

This Task Management System is a full-stack web application designed to help users efficiently manage their tasks. It features user authentication, task creation, modification, deletion, and organization through a user-friendly interface.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Features
- Secure user authentication with JWT.
- Google OAuth 2.0 integration.
- Create, read, update, and delete (CRUD) tasks.
- Drag-and-drop interface for task organization.
- Search and filter tasks by title, description, and date range.
- Responsive design for both desktop and mobile devices.

## Tech Stack
### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Passport.js for Google OAuth 2.0

### Frontend
- React
- Chakra UI
- Axios for API requests
- @hello-pangea/dnd for drag-and-drop functionality

## Installation

### Backend
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/task-management-system.git
   ```
2. Navigate to the backend directory:
   ```bash
   cd task-management-system/backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up environment variables for MongoDB connection and Google OAuth credentials:
   - Create a `.env` file in the backend directory with the following content:
     ```env
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     GOOGLE_CLIENT_ID=your_google_client_id
     GOOGLE_CLIENT_SECRET=your_google_client_secret
     ```
5. Start the server:
   ```bash
   npm start
   ```

### Frontend
1. Navigate to the frontend directory:
   ```bash
   cd task-management-system/frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Usage
1. Open your browser and navigate to `http://localhost:3000`.
2. Register or log in to your account.
3. Create, view, edit, and manage your tasks through the user-friendly interface.

## Project Structure
```
task-management-system/
├── backend/
│   ├── models/
│   │   └── userModel.js
│   │   └── taskModel.js
│   ├── routes/
│   │   └── users.js
│   │   └── tasks.js
│   ├── middleware/
│   │   └── auth.js
│   └── server.js
├── frontend/
│   ├── components/
│   │   └── Navbar.js
│   │   └── TaskModals.js
│   ├── pages/
│   │   └── index.js
│   ├── lib/
│   │   └── apis/
│   │   │   └── tasks.js
│   │   └── utils/
│   │       └── dateFormatter.js
│   └── styles/
│       └── global.css
└── README.md
```

## API Endpoints
### User Routes
- `POST /register`: Register a new user.
- `POST /login`: Log in a user.
- `GET /google`: Initiate Google OAuth authentication.
- `GET /google/callback`: Handle Google OAuth callback.

### Task Routes
- `POST /tasks`: Create a new task.
- `GET /tasks`: Retrieve all tasks.
- `GET /tasks/:id`: Retrieve a specific task by ID.
- `PUT /tasks/:id`: Update a task by ID.
- `DELETE /tasks/:id`: Delete a task by ID.
- `GET /tasks/range/:range`: Retrieve tasks within a specific date range.

## Contributing
Contributions are welcome! Please fork the repository and create a pull request to add new features, fix bugs, or improve documentation.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
```

Feel free to adjust any sections as needed to better fit your project specifics.
