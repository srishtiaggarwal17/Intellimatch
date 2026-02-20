# IntelliMatch 🎯

An AI-powered resume matching and rewriting system that analyzes resumes against job descriptions to provide compatibility scores and insights.

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Architecture](#️-architecture)
- [Tech Stack](#️-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#️-configuration)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [Development Commands](#-development-commands)
- [Deployment](#-deployment)
- [Security Features](#-security-features)
- [Author](#-author)
- [Acknowledgments](#-acknowledgments)

## 🌟 Overview

IntelliMatch is a full-stack web application that helps job seekers optimize their resumes by comparing them against job descriptions. The system uses AI-powered analysis to provide matching scores and detailed feedback, helping users understand how well their resume aligns with specific job requirements.

## ✨ Features

- **Resume Upload & Analysis**: Upload resumes in PDF or DOCX format
- **Job Description Matching**: Compare resumes against job descriptions
- **AI-Powered Scoring**: Get detailed compatibility scores and insights
- **Automatic Analysis**: Asynchronous processing of matches via NLP API integration
- **User Authentication**: Secure user registration and login system
- **Match History**: Track and view previous resume-job matches with detailed results
- **File Storage**: Secure cloud storage for uploaded documents via Cloudinary 
- **Responsive Design**: Modern, mobile-friendly interface
- **Real-time Dashboard**: View all matches and their scores

## 🏗️ Architecture

IntelliMatch follows a microservices architecture with three main components:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│   Frontend      │◄──►│    Backend      │◄──►│   NLP Service   │
│   (React.js)    │    │   (Node.js)     │    │   (Python)      │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                 │                       
                                 │                       
                                 ▼                       
                       ┌─────────────────┐               
                       │                 │               
                       │    MongoDB      │               
                       │   + Cloudinary  │               
                       │                 │               
                       └─────────────────┘               
```

### Automatic Analysis Flow

1. User uploads resume and job description via the frontend
2. Backend saves files to Cloudinary and creates a ResumeMatch record
3. Backend asynchronously calls the NLP service API with file URLs
4. NLP service analyzes the documents and returns match results
5. Backend saves the MatchResult and updates the ResumeMatch
6. Frontend displays the analysis results in the user's dashboard

## 🧠 NLP Service Architecture

The NLP service is built with Flask and uses Google Gemini AI for intelligent document analysis. Here's how it works:

### Document Processing Pipeline

```
File URLs → Download → Text Extraction → AI Analysis → Structured Results
     ↓            ↓           ↓             ↓              ↓
  Cloudinary URLs    Temp Files   Raw Text    Gemini API    JSON Response
```

### Key Components

#### **1. Text Extraction (`text_extractor.py`)**
- **PDF Processing**: Uses PDFPlumber for accurate text extraction
- **DOCX Processing**: Uses python-docx for Word document parsing
- **Format Detection**: Automatically detects file type from URLs
- **Error Handling**: Graceful fallback for corrupted files

#### **2. AI Processing (`gemini.py`)**
- **Resume Analysis**: Extracts structured data (skills, experience, education, projects)
- **Job Description Analysis**: Identifies requirements and qualifications  
- **Match Analysis**: Compares resume against job requirements
- **Scoring Algorithm**: Generates ATS compatibility scores (0-100)

#### **3. API Endpoints (`app.py`)**
- **Health Check**: `/api/health` - Service status and configuration validation
- **Document Analysis**: `/api/analyze` - Main processing endpoint
- **CORS Support**: Enables cross-origin requests from frontend
- **Error Handling**: Comprehensive error responses with debugging info

### Analysis Workflow

1. **File Download**: Fetches files securely from Cloudinary
2. **Text Extraction**: Converts PDF/DOCX to plain text
3. **Resume Parsing**: AI extracts:
   - Contact information
   - Work experience
   - Education details
   - Technical and soft skills
   - Projects and achievements

4. **Job Description Parsing**: AI identifies:
   - Required qualifications
   - Preferred skills
   - Responsibilities
   - Experience requirements

5. **Match Analysis**: AI generates:
   - ATS compatibility score
   - Detailed match explanations
   - Missing skill recommendations
   - Improvement suggestions

### Response Format

```json
{
  "ats_score_percent": 85,
  "summary": "Strong technical match with excellent Python and cloud experience...",
  "what_matched": [
    {
      "item": "Python Programming",
      "reason": "5+ years experience aligns with senior role requirements"
    },
    {
      "item": "AWS Cloud Services", 
      "reason": "Extensive cloud architecture experience matches job needs"
    }
  ],
  "what_is_missing": [
    {
      "item": "Kubernetes Experience",
      "recommendation": "Consider adding container orchestration projects"
    },
    {
      "item": "Leadership Experience",
      "recommendation": "Highlight any team lead or mentoring responsibilities"
    }
  ]
}
```

## 🛠️ Tech Stack

### Frontend (`intellimatch-frontend`)
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI based)
- **State Management**: React Hooks
- **Charts & Visualization**: Chart.js, Recharts 
- **Build Tool**: Vite

### Backend (`intellimatch-backend`)
- **Framework**: Node.js
- **Language**: JavaScript
- **Database**: MongoDB
- **File Storage**: Cloudinary
- **Authentication**: Cookie-based sessions
- **Additional Libraries**:
  - Express.js
  - Mongoose (MongoDB ODM)
  - Multer (file upload handling)
  - Cloudinary SDK
  - JSON Web Token (JWT)
  - bcrypt (password hashing)
  - dotenv (environment variables)
  - CORS

### NLP Service (`intellimatch-nlp`)
- **Framework**: Flask (Python)
- **Language**: Python 3.8+
- **AI/ML**: Google Gemini 1.5 Flash
- **Document Processing**: 
  - PDFPlumber (PDF extraction)
  - python-docx (DOCX extraction)
- **API**: RESTful endpoints with JSON responses
- **Additional Libraries**:
  - Flask-CORS
  - Google Generative AI
  - Requests
  - python-dotenv

### Infrastructure
- **Database**: MongoDB Atlas
- **File Storage**: Cloudinary
- **Deployment**: Ready for containerization

## 📋 Prerequisites

- Node.js 18 or higher
- npm or yarn
- Python 3.8 or higher
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account (API keys)
- Google Gemini API key

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd intellimatch
```

### 2. Backend Setup

```bash
cd intellimatch-backend

# Install dependencies and build
npm install

# Run the application
npm run dev
```

The backend will start on `http://localhost:4000`

### 3. Frontend Setup

```bash
cd intellimatch-frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

The frontend will start on `http://localhost:5173`

### 4. NLP Service Setup

```bash
cd intellimatch-nlp

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file with your API key
echo "GEMINI_API_KEY=your_gemini_api_key_here" > .env

# Run the Flask application
python app.py
```

The NLP service will start on `http://localhost:5001`

## ⚙️ Configuration

### Backend Configuration

Create a `.env` file in `intellimatch-backend/`:

```env
# Server Configuration
PORT=4000

# MongoDB
MONGO_URI=your_mongodb_connection_string

# Auth
SECRET_KEY=your_secret_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# NLP API
NLP_API_URL=http://127.0.0.1:5001/api/analyze

```

### NLP Service Configuration

Create a `.env` file in `intellimatch-nlp/`:

```env
# Google Gemini API Configuration
GEMINI_API_KEY=your_gemini_api_key_here
```

**Note**: Get your Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

### Frontend Configuration

The frontend automatically connects to the backend API. Ensure the backend is running on port 4000.

## 📘 Usage

### 1. User Registration/Login
- Navigate to the application
- Register with email and password
- Login to access features

### 2. Upload Resume and Job Description
- Go to the Upload page
- Select your resume (PDF or DOCX, max 5MB)
- Select the job description file
- Click upload to process

### 3. View Results
- Access your dashboard to see all matches
- View detailed match information
- Track your matching history

### 4. Match History
- All uploaded matches are saved to your profile
- View past matches and scores
- Analyze trends in your applications

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/user/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phoneNumber": "1234567890"
}
```

#### Login User
```http
POST /api/user/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Logout User
```http
POST /api/user/logout
```

### File Upload Endpoints

#### Upload Resume and Job Description
```http
POST /api/upload
Content-Type: multipart/form-data

resume: <file>
jobDescription: <file>
```

**Note**: After uploading files, the system automatically triggers an asynchronous analysis via the NLP API (http://127.0.0.1:5001/api/analyze) to generate match results.

### User Data Endpoints

#### Get User History
```http
GET /api/user/history
```

Returns an array of MatchHistoryDTO objects containing resume match data and analysis results.

#### Get User Details
```http
GET /api/user/get/
```

#### Get Match Details
```http
GET /api/user/match/{matchId}
```

Returns detailed match information including full analysis results for a specific match.

### NLP Service Endpoints

#### Health Check
```http
GET /api/health
```

Returns the health status of the NLP service and configuration validation.

#### Analyze Documents
```http
POST /api/analyze
Content-Type: application/json

{
  "resumeUrl": "https://res.cloudinary.com/your_cloud/raw/upload/resumes/resume.pdf",
  "jobDescriptionUrl": "https://res.cloudinary.com/your_cloud/raw/upload/job-descriptions/jd.pdf"
}
```

**Response Format:**
```json
{
  "ats_score_percent": 85,
  "summary": "Strong match with excellent technical skills alignment...",
  "what_matched": [
    {
      "item": "Python Programming",
      "reason": "5+ years experience matches required expertise"
    }
  ],
  "what_is_missing": [
    {
      "item": "Docker Experience",
      "recommendation": "Consider adding containerization projects to your portfolio"
    }
  ]
}
```

### Configuration

#### NLP API Configuration
The system can be configured to use a different NLP service endpoint:
```properties
nlp.api.url=${NLP_API_URL:http://127.0.0.1:5001/api/analyze}
```

## 📁 Project Structure

```
intellimatch/
├── intellimatch-backend/          # Node.js + Express backend
│   ├── controllers/               # Route controllers
│   ├── models/                    # Mongoose models
│   ├── routes/                    # API route definitions
│   ├── middleware/                # Authentication & error middleware
│   ├── services/                  # Business logic (file upload, NLP call)
│   ├── utils/                     # Helper functions
│   ├── config/                    # Cloudinary & DB config
│   ├── .env                       # Environment variables
│   ├── server.js                  # Entry point
│   └── package.json               # Backend dependencies
│
├── intellimatch-frontend/         # React.js frontend (Vite)
│   ├── src/
│   │   ├── components/            # Reusable UI components
│   │   ├── pages/                 # Dashboard, Upload, MatchDetail
│   │   ├── services/              # API calls (Axios)
│   │   ├── hooks/                 # Custom hooks
│   │   ├── lib/                   
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/                    # Static assets
│   ├── index.html
│   └── package.json               # Frontend dependencies
│
├── intellimatch-nlp/              # Python NLP service (Flask)
│   ├── app.py                     # Flask API entry point
│   ├── gemini.py                  # Gemini AI integration
│   ├── text_extractor.py          # PDF/DOCX text extraction
│   ├── requirements.txt           # Python dependencies
│   ├── .env                       # GEMINI_API_KEY
│   └── temp_files/                # Temporary processing files
│   └── __pycache__/               # Python cache files
│
└── README.md                      # Project documentation
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style and conventions
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

## 🔧 Development Commands


### NLP
```bash
# Activate virtual environment first
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run development server
python app.py

# Run with production server (Gunicorn)
gunicorn -w 4 -b 0.0.0.0:5001 app:app

# Health check
curl http://localhost:5001/api/health

# Test analysis endpoint
curl -X POST http://localhost:5001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"resumeUrl": "url_to_resume", "jobDescriptionUrl": "url_to_jd"}'
```

### Backend
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run production server
npm start
```

### Frontend
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🚀 Deployment

### Backend Deployment
The Node.js backend can be deployed on:
- Render
- Railway
- AWS EC2
- DigitalOcean
- Docker container

### Frontend Deployment
The React.js application can be deployed on:
- Vercel (recommended)
- Netlify
- AWS Amplify
- Custom server

### NLP Service Deployment
The Flask application can be deployed using:
- **Gunicorn**: `gunicorn -w 4 -b 0.0.0.0:5001 app:app`
- **Docker**: Create Dockerfile with Python runtime
- **Cloud platforms**: 
  - AWS EC2/ECS
  - Google Cloud Run
  - Azure Container Instances
  - Heroku

**Environment Variables for Production:**
```env
GEMINI_API_KEY=your_production_gemini_key
FLASK_ENV=production
```

## 🔒 Security Features

- Password hashing using bcrypt
- HTTP-only cookies for session management
- CORS configuration for cross-origin requests
- File type validation for uploads
- File size limits (5MB max)
- Input validation for file uploads
- Secure API key management for Gemini AI

## 🛠️ NLP Service Details

### Dependencies

The NLP service uses several key libraries:

- **Flask**: Web framework for API endpoints
- **Flask-CORS**: Cross-origin resource sharing support
- **google-generativeai**: Google Gemini AI integration
- **pdfplumber**: Advanced PDF text extraction
- **python-docx**: Microsoft Word document processing
- **requests**: HTTP client for file downloads
- **python-dotenv**: Environment variable management

### Troubleshooting

#### Common Issues

1. **Gemini API Key Issues**
   ```bash
   # Check if API key is configured
   curl http://localhost:5001/api/health
   ```

2. **File Download Errors**
   - Ensure Cloudinary URLs are publicly accessible
   - Check network connectivity
   - Verify file formats (PDF/DOCX only)

3. **Text Extraction Failures**
   - Some PDFs may be image-based (no text layer)
   - DOCX files might be corrupted
   - File size limits may apply

4. **AI Processing Errors**
   - Gemini API rate limits
   - Document content too large
   - Network timeouts

#### Logging and Debugging

The service includes comprehensive logging:
- File download status
- Text extraction results  
- AI processing steps
- Error stack traces

Enable debug mode:
```python
app.run(debug=True, port=5001)
```

## 👨‍💻 Author

**Srishti Aggarwal**
- GitHub: [@srishtiaggarwal](https://github.com/srishtiaggarwal17)

## 🙏 Acknowledgments

- React.js team for the amazing framework
- Node.js & Express contributors for scalable backend tooling
- Radix UI for accessible UI components
- MongoDB for database solutions
- Cloudinary for cloud storage services

---

**Made with ❤️ for better job matching**