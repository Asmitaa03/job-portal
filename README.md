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
- **File Parsing**: pdf-parse

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

### 5. Start Development Server

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
│   └── ats-scorer.ts              # ATS scoring algorithm
└── prisma/
    └── schema.prisma              # Database schema
```

## ATS Scoring Algorithm

The ATS (Applicant Tracking System) scorer evaluates resumes based on:

1. **Skills Matching (40%)** - Matches skills from resume against job requirements
2. **Experience Matching (30%)** - Compares years of experience with requirements
3. **Keyword Matching (30%)** - Analyzes keyword frequency and relevance

The algorithm extracts information from PDF/text resumes and calculates a compatibility score (0-100%).

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
