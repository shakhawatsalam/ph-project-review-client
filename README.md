# Project Submission & Review Dashboard — Frontend

A web application that allows students to submit their projects and mentors to review, approve, or reject submissions through a role-based dashboard.

## Live Demo

- **Frontend:** https://ph-project-review-client.vercel.app/login
- **Backend API:** https://ph-project-review-server.onrender.com
- **Health Check:** https://ph-project-review-server.onrender.com/health

## Features

### Authentication & Authorization
- Student and mentor authentication.
- Role-based access control.
- HTTP-only cookie-based JWT authentication.
- Protected student and mentor routes.
- Logout functionality.

### Student Dashboard
- Submit a project with its name, repository URL, optional live demo URL, and description.
- View submitted project information and review status.

### Mentor Dashboard
- View project submissions in a paginated table.
- Filter submissions by review status.
- View project details.
- Approve or reject pending submissions.
- View project statistics, including total, pending, approved, and rejected submissions.

## Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Server State:** TanStack React Query
- **HTTP Client:** Axios
- **Deployment:** Vercel

## Prerequisites

- Node.js and npm
- Access to the backend API, either locally or through the deployed backend

## Getting Started

### 1. Clone the repository

```bash
git clone <YOUR_FRONTEND_REPOSITORY_URL>
cd ph-project-review-client
```

Replace `<YOUR_FRONTEND_REPOSITORY_URL>` with the actual Git repository URL.

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

For the deployed frontend, configure the following environment variable in Vercel:

```env
NEXT_PUBLIC_API_URL=https://ph-project-review-server.onrender.com
```

Use the local backend URL when developing locally and the deployed backend URL when using the production environment.

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build the production application |
| `npm run start` | Start the production server |
| `npm run lint` | Run linting if configured in `package.json` |

## Application Routes

| Route | Purpose |
|---|---|
| `/login` | Sign in |
| `/signup` | Student registration |
| `/student` | Student submission dashboard |
| `/mentor` | Mentor review dashboard |

Access to protected pages depends on the authenticated user's role.

## Backend Integration

The frontend communicates with the Express.js backend using Axios. Requests include credentials to support cookie-based authentication.

The backend handles authentication, authorization, project submissions, review operations, pagination, filtering, and statistics.

See the backend repository's README for API documentation and backend setup instructions.

## Deployment

The frontend is deployed on Vercel and uses `NEXT_PUBLIC_API_URL` to identify the backend API.

When deploying your own instance, configure the environment variable and ensure the backend's CORS settings allow your frontend origin.

## Security Notes

- Do not commit `.env.local` or other environment files containing secrets.
- Never expose database credentials or JWT secrets through `NEXT_PUBLIC_` environment variables.
- The backend is responsible for enforcing authentication and role-based permissions.

## License

No license has been specified for this project yet.
