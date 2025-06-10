# Dental Scheduler App on Angela Villamar

A full-stack appointment booking system for dental clinics. Patients can register, log in, and schedule appointments with available dentists.
This project can fully run on localhost.

## System Architecture

- **Frontend**: React + React Router
- **Backend**: Node.js + Express + PostgreSQL
- **Database**: AWS RDS (PostgreSQL)
- **Auth**: Email/password + JWT (stored in `localStorage`)
- **Rate Limiting**: `express-rate-limit` for API protection
- **Deployment**: 
  - Frontend: AWS S3 static website hosting
  - Backend: Docker + Kubernetes (AWS EKS)
  - Container Registry: AWS ECR

---

## Components

### Backend
- `server.js`: Express app initialization and middleware.
- `/routes`: Defines routes for auth, users, appointments.
- `/controllers`: Handles logic for each route.
- `/middleware`: Auth checker, rate limiter, error handler.
- `/database`: PostgreSQL pool connection.

### Frontend
- `/pages`: Home, Booking, Dashboard, Register, Login.
- `/components`: Reusable UI elements (FormInput, Navbar, etc.).
- `/contexts`: React Context for auth state.
- `utils/api.js`: API base URL config.

---

## Database Schema

### `users`
| Column        | Type      | Description               |
|---------------|-----------|---------------------------|
| id            | SERIAL PK | User ID                   |
| first_name    | TEXT      | First name                |
| last_name     | TEXT      | Last name                 |
| home_address  | TEXT      | Address                   |
| email         | TEXT      | Unique                    |
| password      | TEXT      | Hashed                    |

### `dentists`
| Column      | Type      | Description   |
|-------------|-----------|---------------|
| id          | SERIAL PK | Dentist ID    |
| name        | TEXT      | Dentist name  |
| specialty   | TEXT      | e.g. Ortho    |

### `appointments`
| Column      | Type      | Description                       |
|-------------|-----------|-----------------------------------|
| id          | SERIAL PK | Appointment ID                    |
| user_id     | INT FK    | Linked to `users(id)`             |
| dentist_id  | INT FK    | Linked to `dentists(id)`          |
| date        | DATE      | Appointment date                  |
| time        | TIME      | Appointment time                  |
| notes       | TEXT      | Optional additional info          |

---

## Deployment Instructions

### Backend

1. **Build & Push Docker Image**
   ```bash
   docker build -t dental-backend .
   aws ecr get-login-password --region YOUR_REGION | docker login --username AWS --password-stdin YOUR_ECR_URL
   docker tag dental-backend:latest YOUR_ECR_URL/dental-backend
   docker push YOUR_ECR_URL/dental-backend
   kubectl apply -f k8s/backend-deployment.yaml
   kubectl apply -f k8s/backend-service.yaml
   kubectl create secret generic dental-secrets \

2. **RATE LIMITING (ADDITIONAL)**
I added rate limiting to every API request. To protect applications from overload, abuse, and malicious attacks.
Also, additional points for this project.

    const rateLimit = require('express-rate-limit');
    app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    }));

### Frontend

1. **Build React App**
    npm run build

1. **Upload to S3**
    Enable static site hosting in S3.
    Upload build/ folder contents.
    Set index document to index.html.

### Assumptions

Only patients (not dentists) log in.
Dentists, Users and some appointments are test seeded.
No email verification or social login.
JWT stored in localStorage (not cookies).
Frontend assumes fixed backend base URL in utils/api.js.


### DEMO

You can watch my 5-minute walkthrough video in demo.mp4

### NOTES / ADDITION
The link below is the live deployment of my dental scheduling project, hosted on an AWS S3 static website:

At the moment, only the Homepage, Login, and Register pages are accessible. Due to time, the connection between the frontend and backend has not been fully completed.
- Frontend deployed to AWS S3 as a static site.
- Backend containerized using Docker, and deployed to a Kubernetes cluster on AWS EKS.
- Used Amazon ECR for storing the backend Docker image.
- Database hosted on AWS RDS (PostgreSQL).
- Created Kubernetes secrets for pulling private images.Began setting up service exposure, but the backend is not yet reachable from the frontend due to   incomplete Ingress or Load Balancer configuration.

http://dental-frontend-bucket.s3-website-ap-southeast-1.amazonaws.com  

## Thank you!
