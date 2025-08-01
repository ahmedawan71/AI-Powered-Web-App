# ResumeTailor_n8n

ResumeTailor_n8n is a web application that leverages AI to tailor resumes based on job descriptions. Built with Next.js and Shadcn for the frontend, it provides a modern, user-friendly interface for users to input their resume and job description, receive a tailored resume, and view AI-generated feedback. The backend uses Supabase for authentication and MongoDB for user data storage, while the AI logic is handled by a separate repository deployed on Railway.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Directory Structure](#directory-structure)
- [AI Logic](#ai-logic)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features
- **AI-Powered Resume Tailoring**: Automatically optimizes resumes to align with job descriptions.
- **User Authentication**: Secure login using Supabase's magic link via email.
- **User Data Storage**: Stores user information in MongoDB for efficient data management.
- **Resume Storage**: Saves original and tailored resumes in a Supabase database.
- **Feedback System**: Provides AI-generated feedback on resume improvements.
- **PDF Download**: Allows users to download tailored resumes as PDF files (using jsPDF).
- **Modern UI**: Glassmorphism design with gradient backgrounds, built with Next.js and Shadcn.
- **Responsive Design**: Optimized for both desktop and mobile devices.

## Tech Stack
- **Frontend**: Next.js, Shadcn, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase (Authentication & Resume Storage), MongoDB (User Data Storage)
- **AI Logic**: n8n (deployed on Railway)
- **PDF Generation**: jsPDF
- **Styling**: Tailwind CSS with custom gradients and glassmorphism effects

## Directory Structure
The project is organized as follows:
```
src/
├── api/                    # API-related code
│   ├── lib/               # Utility functions and configurations
│   │   ├── requireAuth.ts # Authentication middleware
│   │   ├── supabaseClient.ts # Supabase client configuration
│   └── tailor-resume/     # API endpoint for resume tailoring
│       └── route.ts       # Handles resume tailoring requests
├── app/                    # Frontend code
│   ├── dashboard/         # Dashboard page for resume and job description input
│   │   └── page.tsx
│   ├── results/           # Results page for viewing tailored resume and feedback
│   │   └── page.tsx
│   ├── layout.tsx         # Root layout with header, footer, and global styles
│   ├── page.tsx           # Landing page with login functionality
│   └── globals.css        # Global styles with Tailwind CSS and custom themes
├── components/            # Reusable UI components (Shadcn components)
│   └── ui/               # Shadcn UI components (e.g., Button, Textarea)
```
- **Frontend Code**: Located in `src/app/` (pages like `dashboard/page.tsx`, `results/page.tsx`, `page.tsx`, and `layout.tsx`).
- **API Code**: Located in `src/api/` (includes `tailor-resume/route.ts` for the API endpoint and `lib/` for utilities like authentication and Supabase client).

## AI Logic
The AI logic for resume tailoring is implemented in a separate repository and deployed on Railway. For details, visit:
- Repository: [ResumeTailor_n8n](https://github.com/ahmedawan71/ResumeTailor_n8n)
- The AI service is accessed via a webhook URL configured in the environment variable `N8N_WEBHOOK_URL`.

## Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Supabase account for authentication and resume storage
- MongoDB instance for user data storage
- Railway account for deploying the AI logic (optional, if modifying the AI service)
- Git (for cloning the repository)

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/ahmedawan71/ResumeTailor_n8n.git
   cd ResumeTailor_n8n
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables (see [Environment Variables](#environment-variables)).

4. Run the development server:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

## Environment Variables
Create a `.env.local` file in the root directory and add the following variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
N8N_WEBHOOK_URL=your_n8n_webhook_url
NEXT_PUBLIC_SITE_URL=http://localhost:3000
MONGODB_URI=your_mongodb_connection_string
```
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Obtain from your Supabase project settings.
- `N8N_WEBHOOK_URL`: The webhook URL for the AI service (from the Railway deployment).
- `NEXT_PUBLIC_SITE_URL`: The base URL of your app (e.g., `http://localhost:3000` for development).
- `MONGODB_URI`: The connection string for your MongoDB instance.

## Usage
1. **Sign Up/Login**: Visit the landing page and enter your email to receive a magic link for authentication.
2. **Input Resume and Job Description**: On the dashboard, paste your resume and the job description for the position you're applying to.
3. **Tailor Resume**: Submit the form to generate a tailored resume and AI feedback.
4. **View Results**: On the results page, view the tailored resume, feedback, or a before-and-after comparison. Download the tailored resume as a PDF or text file.
5. **Logout**: Use the logout button on the dashboard to sign out.

## Contributing
Contributions are welcome! To contribute:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Make your changes and commit (`git commit -m 'Add your feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a Pull Request.

Please ensure your code follows the project's style guidelines and includes appropriate tests.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

© 2025 ResumeTailor_n8n. All rights reserved.