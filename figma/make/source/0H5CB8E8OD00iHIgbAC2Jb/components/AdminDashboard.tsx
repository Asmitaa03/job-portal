import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Users,
  Briefcase,
  TrendingUp,
  Download,
  Search,
  Filter,
  Eye,
  Mail,
  Phone,
  Linkedin,
  Calendar,
  Star,
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { toast } from 'sonner@2.0.3';

interface AdminDashboardProps {
  onNavigateHome: () => void;
}

interface Application {
  id: number;
  jobId: number;
  jobTitle: string;
  fullName: string;
  email: string;
  phone: string;
  linkedin: string;
  coverLetter: string;
  resumeName: string;
  submittedAt: string;
  atsScore: number;
}

export default function AdminDashboard({ onNavigateHome }: AdminDashboardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'score' | 'name'>('date');
  const [filterByJob, setFilterByJob] = useState<string>('all');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadApplications();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    filterAndSortApplications();
  }, [applications, searchQuery, sortBy, filterByJob]);

  const loadApplications = () => {
    const stored = localStorage.getItem('jobApplications');
    if (stored) {
      setApplications(JSON.parse(stored));
    }
  };

  const filterAndSortApplications = () => {
    let filtered = [...applications];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (app) =>
          app.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Job filter
    if (filterByJob !== 'all') {
      filtered = filtered.filter((app) => app.jobTitle === filterByJob);
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
      } else if (sortBy === 'score') {
        return b.atsScore - a.atsScore;
      } else {
        return a.fullName.localeCompare(b.fullName);
      }
    });

    setFilteredApplications(filtered);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple authentication (in production, this would be a real auth system)
    if (username === 'admin' && password === 'admin123') {
      setIsAuthenticated(true);
      toast.success('Login successful!');
    } else {
      toast.error('Invalid credentials');
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 75) return 'text-blue-600 bg-blue-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const uniqueJobTitles = Array.from(new Set(applications.map((app) => app.jobTitle)));

  const stats = [
    {
      label: 'Total Applications',
      value: applications.length,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
    },
    {
      label: 'Open Positions',
      value: 6,
      icon: Briefcase,
      color: 'from-purple-500 to-purple-600',
    },
    {
      label: 'Avg ATS Score',
      value: applications.length
        ? Math.round(
            applications.reduce((sum, app) => sum + app.atsScore, 0) / applications.length
          )
        : 0,
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
    },
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Card className="p-8 shadow-2xl border-slate-200">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-3xl mb-2">Admin Login</h2>
              <p className="text-slate-600">Access the recruitment dashboard</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="mt-1"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Sign In
              </Button>

              <div className="text-center text-sm text-slate-500">
                <p>Demo credentials:</p>
                <p>Username: admin | Password: admin123</p>
              </div>
            </form>

            <div className="mt-6 text-center">
              <Button onClick={onNavigateHome} variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl mb-2">Recruitment Dashboard</h1>
              <p className="text-slate-600">Manage applications and candidates</p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setIsAuthenticated(false)}
                variant="outline"
              >
                Logout
              </Button>
              <Button onClick={onNavigateHome} variant="ghost" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 border-slate-200">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}
                    >
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-3xl">{stat.value}</div>
                      <div className="text-sm text-slate-600">{stat.label}</div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 mb-6 border-slate-200">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="search">Search</Label>
                <div className="relative mt-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="search"
                    placeholder="Search by name, email, or job..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="sort">Sort By</Label>
                <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date (Newest First)</SelectItem>
                    <SelectItem value="score">ATS Score (Highest First)</SelectItem>
                    <SelectItem value="name">Name (A-Z)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="filter">Filter by Job</Label>
                <Select value={filterByJob} onValueChange={setFilterByJob}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Positions</SelectItem>
                    {uniqueJobTitles.map((title) => (
                      <SelectItem key={title} value={title}>
                        {title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Applications Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Candidate</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>ATS Score</TableHead>
                    <TableHead>Applied Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12 text-slate-500">
                        No applications found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredApplications.map((app) => (
                      <TableRow key={app.id} className="hover:bg-slate-50">
                        <TableCell>
                          <div>
                            <div>{app.fullName}</div>
                            <div className="text-sm text-slate-500">{app.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>{app.jobTitle}</TableCell>
                        <TableCell>
                          <Badge className={`${getScoreColor(app.atsScore)}`}>
                            <Star className="w-3 h-3 mr-1" />
                            {app.atsScore}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Calendar className="w-4 h-4" />
                            {new Date(app.submittedAt).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            onClick={() => setSelectedApplication(app)}
                            size="sm"
                            variant="outline"
                            className="gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Application Details Dialog */}
      <Dialog open={!!selectedApplication} onOpenChange={() => setSelectedApplication(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedApplication && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">Application Details</DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Candidate Info */}
                <div>
                  <h3 className="text-lg mb-3">Candidate Information</h3>
                  <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                    <div>
                      <span className="text-sm text-slate-600">Name:</span>
                      <div className="text-lg">{selectedApplication.fullName}</div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-slate-600 flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          Email:
                        </span>
                        <div className="text-sm">{selectedApplication.email}</div>
                      </div>
                      {selectedApplication.phone && (
                        <div>
                          <span className="text-sm text-slate-600 flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            Phone:
                          </span>
                          <div className="text-sm">{selectedApplication.phone}</div>
                        </div>
                      )}
                    </div>
                    {selectedApplication.linkedin && (
                      <div>
                        <span className="text-sm text-slate-600 flex items-center gap-1">
                          <Linkedin className="w-4 h-4" />
                          LinkedIn:
                        </span>
                        <a
                          href={selectedApplication.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          {selectedApplication.linkedin}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Position & Score */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg mb-2">Position Applied</h3>
                    <Badge className="bg-blue-100 text-blue-700">
                      {selectedApplication.jobTitle}
                    </Badge>
                  </div>
                  <div>
                    <h3 className="text-lg mb-2">ATS Score</h3>
                    <Badge className={`${getScoreColor(selectedApplication.atsScore)}`}>
                      <Star className="w-4 h-4 mr-1" />
                      {selectedApplication.atsScore}%
                    </Badge>
                  </div>
                </div>

                {/* Cover Letter */}
                {selectedApplication.coverLetter && (
                  <div>
                    <h3 className="text-lg mb-2">Cover Letter</h3>
                    <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {selectedApplication.coverLetter}
                    </div>
                  </div>
                )}

                {/* Resume */}
                <div>
                  <h3 className="text-lg mb-2">Resume</h3>
                  <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Download className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm">{selectedApplication.resumeName}</div>
                      <div className="text-xs text-slate-500">
                        Uploaded on{' '}
                        {new Date(selectedApplication.submittedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="gap-2">
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-slate-200">
                  <Button className="flex-1 bg-green-600 hover:bg-green-700">
                    <Mail className="w-4 h-4 mr-2" />
                    Contact Candidate
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Schedule Interview
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
