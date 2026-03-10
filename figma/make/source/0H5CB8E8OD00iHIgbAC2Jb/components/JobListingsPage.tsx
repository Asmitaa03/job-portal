import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Briefcase, MapPin, Clock, DollarSign, X, Upload, Building2, Shield } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { toast } from 'sonner';

interface JobListingsPageProps {
  onNavigateHome: () => void;
  onNavigateAdmin: () => void;
}

interface Job {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
  salary: string;
  summary: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
}

const mockJobs: Job[] = [
  {
    id: 1,
    title: 'Senior Frontend Developer',
    department: 'Engineering',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$120k - $160k',
    summary: 'Build beautiful and performant user interfaces with React and modern web technologies.',
    description: 'We are seeking an experienced Frontend Developer to join our engineering team. You will work on cutting-edge web applications, collaborate with designers and backend engineers, and help shape our product roadmap.',
    requirements: [
      '5+ years of experience with React and TypeScript',
      'Strong understanding of modern CSS and responsive design',
      'Experience with state management (Redux, Zustand, etc.)',
      'Proficiency in testing frameworks (Jest, React Testing Library)',
      'Excellent problem-solving and communication skills',
    ],
    responsibilities: [
      'Develop and maintain high-quality web applications',
      'Collaborate with designers to implement pixel-perfect UIs',
      'Write clean, maintainable, and well-tested code',
      'Participate in code reviews and mentor junior developers',
      'Contribute to technical architecture decisions',
    ],
    benefits: [
      'Competitive salary and equity',
      'Health, dental, and vision insurance',
      'Unlimited PTO',
      'Remote-friendly culture',
      'Learning and development budget',
    ],
  },
  {
    id: 2,
    title: 'Product Manager',
    department: 'Product',
    location: 'New York, NY',
    type: 'Full-time',
    salary: '$130k - $170k',
    summary: 'Lead product strategy and drive innovation across our platform.',
    description: 'Join our product team to define and execute product strategy. You will work closely with engineering, design, and business stakeholders to deliver exceptional products that delight our customers.',
    requirements: [
      '3+ years of product management experience',
      'Strong analytical and data-driven decision-making skills',
      'Experience with agile development methodologies',
      'Excellent communication and stakeholder management',
      'Technical background or strong technical aptitude',
    ],
    responsibilities: [
      'Define product vision and roadmap',
      'Gather and prioritize product requirements',
      'Work with engineering teams to deliver features',
      'Analyze metrics and user feedback to drive improvements',
      'Present product updates to leadership and stakeholders',
    ],
    benefits: [
      'Competitive compensation package',
      'Comprehensive health benefits',
      'Flexible work arrangements',
      'Professional development opportunities',
      '401(k) matching',
    ],
  },
  {
    id: 3,
    title: 'UX/UI Designer',
    department: 'Design',
    location: 'Remote',
    type: 'Full-time',
    salary: '$100k - $140k',
    summary: 'Create intuitive and delightful user experiences that solve real problems.',
    description: 'We are looking for a talented UX/UI Designer to join our design team. You will be responsible for creating user-centered designs that are both beautiful and functional.',
    requirements: [
      '4+ years of UX/UI design experience',
      'Proficiency in Figma and design systems',
      'Strong portfolio demonstrating design thinking',
      'Understanding of user research methodologies',
      'Experience with prototyping and interaction design',
    ],
    responsibilities: [
      'Design user interfaces for web and mobile applications',
      'Conduct user research and usability testing',
      'Create and maintain design systems',
      'Collaborate with product and engineering teams',
      'Present design concepts to stakeholders',
    ],
    benefits: [
      'Flexible remote work',
      'Health and wellness benefits',
      'Home office setup allowance',
      'Annual design conference budget',
      'Creative freedom and autonomy',
    ],
  },
  {
    id: 4,
    title: 'Data Scientist',
    department: 'Data & Analytics',
    location: 'Boston, MA',
    type: 'Full-time',
    salary: '$140k - $180k',
    summary: 'Leverage data and machine learning to drive business insights and product innovation.',
    description: 'Join our data science team to build predictive models, analyze user behavior, and help inform strategic decisions across the organization.',
    requirements: [
      'MS or PhD in Computer Science, Statistics, or related field',
      'Strong programming skills in Python and SQL',
      'Experience with machine learning frameworks (TensorFlow, PyTorch)',
      'Knowledge of statistical analysis and A/B testing',
      'Excellent data visualization skills',
    ],
    responsibilities: [
      'Build and deploy machine learning models',
      'Analyze large datasets to extract insights',
      'Design and analyze A/B tests',
      'Collaborate with product teams on data-driven features',
      'Present findings to technical and non-technical audiences',
    ],
    benefits: [
      'Top-tier compensation and equity',
      'Flexible work schedule',
      'Access to cutting-edge tools and technologies',
      'Conference and publication support',
      'Collaborative research environment',
    ],
  },
  {
    id: 5,
    title: 'DevOps Engineer',
    department: 'Infrastructure',
    location: 'Austin, TX',
    type: 'Full-time',
    salary: '$110k - $150k',
    summary: 'Build and maintain scalable infrastructure and deployment pipelines.',
    description: 'We need a skilled DevOps Engineer to help us scale our infrastructure and improve our development workflows. You will work on cloud infrastructure, CI/CD, and monitoring systems.',
    requirements: [
      '3+ years of DevOps or infrastructure experience',
      'Strong knowledge of AWS, GCP, or Azure',
      'Experience with Kubernetes and Docker',
      'Proficiency in infrastructure as code (Terraform, CloudFormation)',
      'Understanding of networking and security best practices',
    ],
    responsibilities: [
      'Manage and optimize cloud infrastructure',
      'Build and maintain CI/CD pipelines',
      'Implement monitoring and alerting systems',
      'Ensure security and compliance standards',
      'Automate operational tasks and processes',
    ],
    benefits: [
      'Competitive salary and stock options',
      'Comprehensive insurance coverage',
      'Generous PTO policy',
      'Professional certification support',
      'Latest tools and technology',
    ],
  },
  {
    id: 6,
    title: 'Marketing Manager',
    department: 'Marketing',
    location: 'Los Angeles, CA',
    type: 'Full-time',
    salary: '$90k - $120k',
    summary: 'Drive brand awareness and lead generation through creative marketing campaigns.',
    description: 'Join our marketing team to develop and execute marketing strategies that drive growth. You will oversee campaigns across multiple channels and work closely with sales and product teams.',
    requirements: [
      '5+ years of marketing experience',
      'Proven track record of successful campaigns',
      'Experience with digital marketing and analytics tools',
      'Strong project management skills',
      'Creative thinking and data-driven approach',
    ],
    responsibilities: [
      'Develop and execute marketing strategies',
      'Manage multi-channel campaigns',
      'Analyze campaign performance and ROI',
      'Collaborate with sales on lead generation',
      'Build and manage marketing budget',
    ],
    benefits: [
      'Competitive salary package',
      'Health and wellness benefits',
      'Creative work environment',
      'Marketing conference attendance',
      'Career growth opportunities',
    ],
  },
];

export default function JobListingsPage({ onNavigateHome, onNavigateAdmin }: JobListingsPageProps) {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    linkedin: '',
    coverLetter: '',
    resume: null as File | null,
  });

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.resume) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Store application in localStorage
    const applications = JSON.parse(localStorage.getItem('jobApplications') || '[]');
    const newApplication = {
      id: Date.now(),
      jobId: selectedJob?.id,
      jobTitle: selectedJob?.title,
      ...formData,
      resumeName: formData.resume?.name,
      submittedAt: new Date().toISOString(),
      atsScore: Math.floor(Math.random() * 30) + 70, // Mock ATS score
    };
    applications.push(newApplication);
    localStorage.setItem('jobApplications', JSON.stringify(applications));

    toast.success('Application submitted successfully!');
    setSelectedJob(null);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      linkedin: '',
      coverLetter: '',
      resume: null,
    });
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={onNavigateHome}
                variant="ghost"
                size="sm"
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
              <div className="flex items-center gap-2">
                <Building2 className="w-6 h-6 text-blue-600" />
                <span className="text-xl">Careers</span>
              </div>
            </div>
            <Button
              onClick={onNavigateAdmin}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Shield className="w-4 h-4" />
              Admin Login
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Hero */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Open Positions
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Find your dream role and join our talented team
            </p>
          </motion.div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid gap-6 max-w-4xl mx-auto">
            {mockJobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card
                  className="p-6 cursor-pointer hover:shadow-xl transition-all duration-300 border-slate-200"
                  onClick={() => setSelectedJob(job)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl mb-2">{job.title}</h3>
                      <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          {job.department}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {job.type}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {job.salary}
                        </span>
                      </div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                      Apply
                    </Badge>
                  </div>
                  <p className="text-slate-600">{job.summary}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Details Modal */}
      <AnimatePresence>
        {selectedJob && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedJob(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex justify-between items-start rounded-t-3xl z-10">
                <div>
                  <h2 className="text-3xl mb-2">{selectedJob.title}</h2>
                  <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      {selectedJob.department}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {selectedJob.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {selectedJob.type}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {selectedJob.salary}
                    </span>
                  </div>
                </div>
                <Button
                  onClick={() => setSelectedJob(null)}
                  variant="ghost"
                  size="sm"
                  className="rounded-full"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="p-6 space-y-8">
                {/* Description */}
                <div>
                  <h3 className="text-xl mb-3">About the Role</h3>
                  <p className="text-slate-600 leading-relaxed">{selectedJob.description}</p>
                </div>

                {/* Requirements */}
                <div>
                  <h3 className="text-xl mb-3">Requirements</h3>
                  <ul className="space-y-2">
                    {selectedJob.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-2 text-slate-600">
                        <span className="text-blue-600 mt-1">•</span>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Responsibilities */}
                <div>
                  <h3 className="text-xl mb-3">Responsibilities</h3>
                  <ul className="space-y-2">
                    {selectedJob.responsibilities.map((resp, index) => (
                      <li key={index} className="flex items-start gap-2 text-slate-600">
                        <span className="text-purple-600 mt-1">•</span>
                        {resp}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Benefits */}
                <div>
                  <h3 className="text-xl mb-3">Benefits</h3>
                  <ul className="space-y-2">
                    {selectedJob.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2 text-slate-600">
                        <span className="text-green-600 mt-1">•</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Application Form */}
                <div className="border-t border-slate-200 pt-8">
                  <h3 className="text-2xl mb-6">Apply for this Position</h3>
                  <form onSubmit={handleSubmitApplication} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="fullName">
                          Full Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="fullName"
                          value={formData.fullName}
                          onChange={(e) =>
                            setFormData({ ...formData, fullName: e.target.value })
                          }
                          placeholder="John Doe"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">
                          Email <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          placeholder="john@example.com"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          placeholder="+1 (555) 000-0000"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="linkedin">LinkedIn Profile</Label>
                        <Input
                          id="linkedin"
                          value={formData.linkedin}
                          onChange={(e) =>
                            setFormData({ ...formData, linkedin: e.target.value })
                          }
                          placeholder="https://linkedin.com/in/johndoe"
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="coverLetter">Cover Letter</Label>
                      <Textarea
                        id="coverLetter"
                        value={formData.coverLetter}
                        onChange={(e) =>
                          setFormData({ ...formData, coverLetter: e.target.value })
                        }
                        placeholder="Tell us why you're a great fit for this role..."
                        rows={5}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="resume">
                        Resume <span className="text-red-500">*</span>
                      </Label>
                      <div className="mt-1 flex items-center gap-4">
                        <Input
                          id="resume"
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              resume: e.target.files?.[0] || null,
                            })
                          }
                          className="hidden"
                        />
                        <label
                          htmlFor="resume"
                          className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors"
                        >
                          <Upload className="w-4 h-4" />
                          Choose File
                        </label>
                        {formData.resume && (
                          <span className="text-sm text-slate-600">
                            {formData.resume.name}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Accepted formats: PDF, DOC, DOCX (Max 5MB)
                      </p>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      Submit Application
                    </Button>
                  </form>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
