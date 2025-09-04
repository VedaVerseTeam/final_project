Vedaverse: A Digital Scripture Portal
Vedaverse is a full-stack web application designed as a digital portal for Hindu scriptures. It provides an interactive and seamless experience for users to explore and understand various sacred texts.

The application allows users to browse through every verse of a selected scripture, view its original Sanskrit text (shloka), and read its meaning. A key feature is the integrated AI chatbot, powered by the Gemini API, which allows users to ask questions and gain a deeper understanding of the texts.

✨ Features
Dynamic Verse Browser: Navigate effortlessly through chapters and verses of different scriptures stored in the database.

Intuitive Navigation: A collapsible sidebar with a full chapter-and-verse index for quick access.

AI-Powered Chatbot: An integrated chatbot that answers user questions about the scriptures, providing context and clarity powered by Google's Gemini API.

Multi-Scripture Support: The backend is designed to handle multiple scriptures by referencing the scrip_name column in the database.

Responsive Design: A clean, user-friendly interface that works on both desktop and mobile devices.

🚀 Tech Stack
Frontend
HTML5 & CSS3: For the core structure and styling.

JavaScript (ES6+): For all dynamic functionality, API calls, and UI interactions.

Bootstrap 5: For responsive and consistent UI components.

Backend
Python: The core language for the backend.

Flask: A lightweight web framework for building the API endpoints.

Flask-CORS: To handle Cross-Origin Resource Sharing.

MySQL Connector/Python: To connect to and query the MySQL database.

python-dotenv: To manage environment variables and secure API keys.

Requests: For making API calls to the Gemini AI.

Database
MySQL: A relational database to store various scriptures, each identified by a unique scrip_name.

AI
Google Gemini API: Provides the conversational intelligence for the Veda AI chatbot.

⚙️ Installation & Setup
Follow these steps to get a local copy of the project up and running.

1. Clone the Repository
```
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

2. Set Up the Backend
Create a Python virtual environment to manage dependencies:
```
python -m venv venv
```
Activate the virtual environment:

On Windows (Command Prompt):
```
venv\Scripts\activate
```
On macOS/Linux (or Git Bash on Windows):
```
source venv/bin/activate
```
 Configure Environment Variables
Create a file named .env in the root directory of your project and add your credentials:

API_KEY="YOUR_GEMINI_API_KEY"
DB_HOST="YOUR_DATABASE_HOST"
DB_USER="YOUR_DATABASE_USER"
DB_PASSWORD="YOUR_DATABASE_PASSWORD"
DB_NAME="YOUR_DATABASE_NAME"

 Database Setup
Ensure you have a MySQL database with a table for your scriptures. The app.py is configured to query a table named scripture with columns including scrip_name, chapter, verse, shloka, and shlok_meaning. You can modify the queries in app.py if your table or column names are different.

5. Run the Application
First, start the Flask backend server from your terminal:
```
python app.py
```
You should see output indicating the server is running on http://127.0.0.1:5000.

Next, open the frontend by double-clicking index.html in your file explorer, or use a live server extension in your code editor.

Project Structure

├── .vscode/                 # VS Code specific settings
├── venv/                    # Python virtual environment
├── .env                     # Environment variables (IGNORED)
├── .gitignore               # Specifies files to ignore
├── README.md                # This file
├── app.py                   # The Flask backend application
├── index.html               # The main frontend HTML file
├── scriptures.css           # The stylesheet for the application
├── scriptures.js            # The frontend JavaScript logic
└── images/                  # Directory for project images (logo, background)

📜 License
This project is licensed under the MIT License. See the LICENSE file for details.

Made with ❤️ and passion for everyone.
