# AI-Powered Resume Tailor - Product Requirements Document (PRD)

## 1. Overview

**Project:** AI-Powered Resume Tailor\
**Goal:** Enable users to tailor their resumes for specific job descriptions using AI, enhancing ATS compatibility and improving their chances of getting interviews.\
**Audience:** Job seekers looking to optimize their resumes for specific roles.

---

## 2. Problem Statement

Job seekers often send the same resume to multiple job listings, reducing the chances of being shortlisted due to lack of alignment with each job description. Manually tailoring resumes is time-consuming and often skipped.

---

## 3. Solution

Develop a web application that:

- Allows users to log in using **magic link authentication**.
- Lets users **upload or paste** their existing resume.
- Allows users to paste the **target job description**.
- Uses AI to generate a **tailored resume** aligned with the job description.
- Provides **feedback on improvements** for ATS compatibility.
- Saves tailored resumes for later download and review.
- Stores user history for easy reference.

---

## 4. Features

### Core Features:

✅ **Magic Link Authentication (Supabase)**\
✅ **Resume Upload/Paste** (PDF/DOCX to text extraction + plain text paste)\
✅ **Job Description Input Field**\
✅ **AI Tailoring Engine** using n8n + OpenAI/local LLM\
✅ **Download Tailored Resume as PDF/Text**\
✅ **Feedback & ATS Suggestions**\
✅ **User History & Resume Management**\
✅ **Clean UI with ShadCN and DaisyUI**\
✅ **CI/CD Deployment on Vercel**

### Optional Enhancements:

- Resume template selection.
- Highlighting sections updated by AI.
- Metrics: ATS score estimates.
- Option to store resumes in folders by job title.

---

## 5. User Flows

### New User:

1. Lands on Landing Page ➔ Clicks "Get Started"
2. Authenticates via Magic Link
3. Lands on Dashboard
4. Uploads or pastes resume
5. Pastes job description
6. Clicks "Tailor Resume"
7. Views tailored resume + feedback
8. Downloads or saves the tailored resume

### Returning User:

1. Logs in
2. Accesses "History"
3. Views/downloads previous tailored resumes

---

## 6. Tech Stack

- **Frontend:** Next.js 15, TypeScript, ShadCN UI, DaisyUI
- **Backend:** Supabase (auth, storage, Postgres), MongoDB (optional)
- **AI Integration:** n8n workflows + OpenAI / Local LLM
- **Deployment:** Vercel with CI/CD pipelines

---

## 7. Milestones & Timeline

| Milestone          | Date   | Directory            |
| ------------------ | ------ | -------------------- |
| PRD + Wireframes   | Day 15 | /grand-project/docs/ |
| Backend & DB Setup | Day 18 | /grand-project/api/  |
| Frontend UI        | Day 21 | /grand-project/app/  |
| AI Logic + Testing | Day 24 | /grand-project/ai/   |
| Public Demo        | Day 27 | —                    |
| Docs + Loom        | Day 29 | README.md            |
| Final Demo         | Day 30 | —                    |

---

## 8. Wireframes

[Attach wireframes here or in `wireframes.png`]

- Landing Page with CTA
- Auth Page
- Dashboard (Upload Resume, Paste Job Description, Tailor Button)
- Results Page (Tailored Resume + Feedback)
- History Page (List of past resumes)

---

## 9. Success Criteria

✅ Users can successfully sign up and authenticate.\
✅ Users can upload/paste resume and job description.\
✅ AI tailoring provides relevant, clean output.\
✅ Users can view and download tailored resumes.\
✅ Clean, consistent UI across devices.\
✅ Deployed on Vercel with CI/CD and open for public demo.

---

## 10. Future Enhancements (Post-Bootcamp)

- AI cover letter generator.
- Resume keyword analysis against job descriptions.
- Integration with LinkedIn to fetch user profiles.
- Advanced ATS scoring based on tailored resumes.

---

**End of PRD**

