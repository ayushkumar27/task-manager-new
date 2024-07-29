Project Overview: Task Management System
This Task Management System is a full-stack web application designed to help users efficiently manage their tasks. It features user authentication, task creation, modification, deletion, and organization through a user-friendly interface. The project leverages modern web technologies including Express.js, MongoDB, JWT, Google OAuth 2.0, React, and Chakra UI to deliver a seamless experience.

Project Components
Backend: Built with Express.js, the backend handles user authentication, task management, and serves as the API provider.

User Authentication:
JWT Authentication: Users can register and log in using email and password. Passwords are securely hashed, and JWT tokens are issued for session management.
Google OAuth 2.0: Integration with Google OAuth allows users to authenticate using their Google accounts.
Task Management:
CRUD operations for tasks.
Endpoints to retrieve tasks based on different criteria (e.g., by date range).
Database: MongoDB is used to store user and task data, with Mongoose for object data modeling.
Frontend: Developed using React and Chakra UI for a responsive and visually appealing user interface.

Pages and Components:
Home Page: Displays all tasks with search and filter functionalities.
Task Modals: Modals for adding, viewing, and editing tasks.
Drag-and-Drop Interface: Users can drag and drop tasks to change their status.
State Management: React's useState and useEffect hooks manage the application state.
API Integration: Axios is used for making API requests to the backend.
Routing and Middleware:

Express.js Routes: Routes for user registration, login, and task management.
Middleware: Middleware for JWT authentication to protect routes and ensure secure access.
Technical Stack
Backend:

Node.js
Express.js
MongoDB with Mongoose
JWT for authentication
Passport.js for Google OAuth 2.0
Frontend:

React
Chakra UI
Axios for API requests
@hello-pangea/dnd for drag-and-drop functionality
Key Features
User Authentication:

Secure user registration and login using JWT.
Google OAuth 2.0 integration for seamless authentication.
Task Management:

CRUD operations for tasks.
Drag-and-drop interface for task organization.
Search and filter tasks by title, description, and date range.
Responsive Design:

Uses Chakra UI for a responsive and accessible user interface.
Optimized for both desktop and mobile devices.
Project Structure
Backend:

models/: Contains Mongoose models for users and tasks.
routes/: Defines API endpoints for user and task management.
middleware/: Includes authentication middleware.
server.js: Entry point for the Express.js server.
Frontend:

components/: Reusable UI components (e.g., Navbar, TaskModals).
pages/: Page components for different views.
lib/apis/: API utility functions for interacting with the backend.
lib/utils/: Utility functions (e.g., date formatting).
Installation and Setup
Backend:

Install dependencies: npm install
Set up environment variables for MongoDB connection and Google OAuth credentials.
Start the server: npm start
Frontend:

Navigate to the frontend directory.
Install dependencies: npm install
Start the development server: npm run dev
Conclusion
This Task Management System provides a robust solution for managing tasks with features like secure user authentication, intuitive drag-and-drop task organization, and a responsive design. The integration of modern technologies ensures a smooth user experience and a scalable architecture for future enhancements.
