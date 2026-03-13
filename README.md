# Job Portal - Recruitment Management System

A stunning, feature-rich job portal with beautiful animations, ATS scoring, and comprehensive admin dashboard.

## Features

### Public Features (Job Seekers)
- 🎨 **Beautiful Landing Page** - Animated job listings with gradient backgrounds
- 🔍 **Advanced Search & Filters** - Search by title, description, or department
- 📄 **Detailed Job Pages** - Comprehensive job descriptions and requirements
- 📤 **Resume Upload** - Drag-and-drop resume upload with real-time preview
- 🤖 **ATS Scoring** - Automatic resume scoring based on job requirements
- ✨ **Smooth Animations** - Powered by Framer Motion for a delightful UX

### Admin Features (Recruiters)
- 🔐 **Secure Authentication** - NextAuth.js with credentials
- 📊 **Analytics Dashboard** - Beautiful charts and statistics
- 📝 **Application Management** - View, filter, and sort all applications
- 🎯 **ATS Score Sorting** - Sort applications by ATS compatibility score
- 📋 **Job Management** - Create, edit, and manage job postings
- 👥 **Status Management** - Update application status (Applied, Reviewing, Shortlisted, etc.)

## Tech Stack

- **Framework**: Next.js 16 with React 19
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Form Handling**: React Hook Form + Zod
- **Resume Parsing**: pdf-parse (PDF text extraction for ATS)

## Architecture

- **Public app**: Server-rendered and client pages for landing, job list, job detail, and application form. Data is fetched from Next.js API routes.
- **Admin app**: Session-protected routes under `/admin` (dashboard, applications, jobs). NextAuth credentials provider with JWT; admin layout wraps all admin pages.
- **API**: REST-style routes under `/api` for jobs (CRUD), applications (create + list/update), and auth. Resume files are stored on disk under `public/resumes/`; resume text is extracted and stored for ATS and search.
- **ATS pipeline**: On application submit, the server extracts text from the uploaded PDF/TXT, parses skills and years of experience, runs the ATS scorer against the job description, then persists the application with score and parsed fields.

## Tech Decisions

| Decision | Rationale |
|----------|-----------|
| **Next.js App Router** | Single codebase for SSR, API routes, and client navigation; good DX and deployment (e.g. Vercel). |
| **Prisma + PostgreSQL** | Type-safe schema, migrations, and one source of truth for jobs, applications, and users. |
| **NextAuth credentials** | Simple admin auth without OAuth; JWT keeps session stateless. |
| **Resume text extraction** | ATS needs plain text; we extract from PDF/TXT at upload time and store it so scoring and future features (e.g. search) don’t re-parse files. |
| **File-based resume storage** | Keeps the demo simple; for production you’d use object storage (e.g. S3/Vercel Blob) and signed URLs. |

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="your-postgresql-connection-string"
NEXTAUTH_SECRET="your-secret-key-min-32-characters"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Set Up Database

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations (if database is accessible)
npm run prisma:migrate
```

**Note**: If you get a connection error, ensure your PostgreSQL database is running and accessible. You can retry the migration once the database is available.

### 4. Create Admin User

```bash
npm run create-admin
```

This creates a default admin user:
- Email: `admin@company.com`
- Password: `admin123`

**⚠️ Important**: Change the default password after first login!

### 5. Run Tests

```bash
npm run test
```

Tests cover the ATS scorer (`calculateATSScore`, `parseResume`) and resume text extraction (`extractResumeText`). Use `npm run test:watch` for watch mode.

### 6. Start Development Server

```bash
npm run dev
```

Visit:
- **Public Portal**: http://localhost:3000
- **Admin Login**: http://localhost:3000/admin/login

## Project Structure

```
├── app/
│   ├── (public routes)
│   │   ├── page.tsx              # Landing page with job listings
│   │   ├── jobs/[id]/            # Job detail page
│   │   └── apply/[id]/           # Application form
│   ├── (admin routes)
│   │   ├── admin/
│   │   │   ├── login/            # Admin login
│   │   │   ├── dashboard/        # Analytics dashboard
│   │   │   ├── applications/     # Application management
│   │   │   └── jobs/              # Job management
│   │   └── api/
│   │       ├── auth/              # Authentication routes
│   │       ├── jobs/              # Job CRUD
│   │       └── applications/      # Application handling
│   └── providers.tsx              # Session provider
├── components/
│   ├── JobCard.tsx               # Animated job card component
│   └── AdminLayout.tsx            # Admin layout wrapper
├── lib/
│   ├── prisma.ts                  # Prisma client instance
│   ├── ats-scorer.ts              # ATS scoring algorithm
│   └── resume-parser.ts           # PDF/TXT text extraction for resumes
└── prisma/
    └── schema.prisma              # Database schema
```

## ATS Scoring Algorithm

The ATS (Applicant Tracking System) scorer runs on **extracted resume text** (from PDF or TXT uploads) and compares it to the job’s requirements and description. It outputs a **0–100% compatibility score** and is used to sort and filter applications in the admin dashboard.

**Weight breakdown:**

1. **Skills / keyword match (~45%)** – Term and phrase overlap between resume and job (including synonyms and “required/preferred” weighting).
2. **Experience (~25%)** – Years of experience parsed from the resume vs. requirements mentioned in the job text.
3. **Soft skills (~10%)** – Presence of terms like communication, leadership, teamwork in the resume.
4. **Keyword coverage (~20%)** – Fraction of important job terms found in the resume.

Resume text is extracted in `lib/resume-parser.ts` (PDF via pdf-parse, TXT as plain text). Parsed skills and experience are stored on the application and used by `lib/ats-scorer.ts`.

## Database Schema

- **User** - Admin/recruiter accounts
- **Job** - Job postings with descriptions and requirements
- **Application** - Job applications with resume, ATS score, and status

## Features in Detail

### Landing Page
- Animated hero section with gradient background
- Real-time search and department filtering
- Smooth card animations on scroll
- Responsive design for all devices

### Application Flow
1. User selects a job
2. Fills out personal information
3. Uploads resume (PDF or text)
4. System automatically:
   - Extracts text from resume
   - Parses skills and experience
   - Calculates ATS score
   - Stores application

### Admin Dashboard
- Real-time statistics
- Interactive charts (pie and bar charts)
- Application filtering and sorting
- Status management
- Resume viewing and download

## Customization

### Changing Colors
Edit `tailwind.config` or use inline Tailwind classes. The design uses:
- Primary: Blue (`blue-600`)
- Secondary: Purple (`purple-600`)
- Accents: Pink, Green

### Adding More Job Fields
1. Update `prisma/schema.prisma`
2. Run `npm run prisma:migrate`
3. Update API routes and forms

## Troubleshooting

### Database Connection Issues
- Verify your `DATABASE_URL` is correct
- Ensure PostgreSQL is running
- Check SSL mode if using cloud databases (e.g., Aiven)

### Migration Errors
- Make sure Prisma Client is generated: `npm run prisma:generate`
- Try resetting the database (development only): `npx prisma migrate reset`

### PDF Parsing Issues
- Ensure `pdf-parse` is installed
- Some PDFs may not parse correctly if they're image-based
- Fallback to basic info extraction if parsing fails

## Production Deployment

1. Update `NEXTAUTH_URL` to your production domain
2. Set a strong `NEXTAUTH_SECRET` (use `openssl rand -base64 32`)
3. Ensure database is accessible from production environment
4. Build: `npm run build`
5. Start: `npm start`

## License

MIT

## Support

For issues or questions, please open an issue in the repository.
