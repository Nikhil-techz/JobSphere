import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowRight,
  Bell,
  Bookmark,
  BriefcaseBusiness,
  Building2,
  Check,
  CircleDollarSign,
  Clock,
  ChevronDown,
  Edit3,
  FileText,
  Flame,
  Heart,
  Home,
  LogIn,
  LogOut,
  MapPin,
  MessageCircle,
  Moon,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Sparkles,
  Trash2,
  User,
  UserPlus,
  Users,
  X,
} from 'lucide-react';
import employerHero from './assets/employer-hero.png';
import './styles.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const blankAuth = {
  name: '',
  email: '',
  password: '',
  role: 'applicant',
};

const blankJob = {
  title: '',
  company: '',
  location: '',
  salary: '',
  experience_level: '',
  skills: '',
  description: '',
};

const demoJobs = [
  {
    id: 'demo-google',
    title: 'Software Engineer',
    company: 'Google',
    location: 'Bangalore, India',
    salary: '18 - 28 LPA',
    description: 'Build reliable products for millions of users.',
  },
  {
    id: 'demo-microsoft',
    title: 'Data Engineer',
    company: 'Microsoft',
    location: 'Hyderabad, India',
    salary: '16 - 24 LPA',
    description: 'Design data systems that power better decisions.',
  },
  {
    id: 'demo-swiggy',
    title: 'Backend Developer',
    company: 'Swiggy',
    location: 'Bangalore, India',
    salary: '15 - 22 LPA',
    description: 'Ship fast APIs for high-volume marketplace flows.',
  },
];

function formatSalary(value) {
  if (value === undefined || value === null || value === '') return 'Salary undisclosed';
  return typeof value === 'number' ? `₹${value.toLocaleString('en-IN')}` : `₹${value}`;
}

function App() {
  const [audience, setAudience] = useState('seeker');
  const [activeWorkspace, setActiveWorkspace] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [authMode, setAuthMode] = useState('login');
  const [authForm, setAuthForm] = useState(blankAuth);
  const [jobForm, setJobForm] = useState(blankJob);
  const [editingJobId, setEditingJobId] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('job_api_token') || '');
  const [profile, setProfile] = useState(null);
  const [applicantProfile, setApplicantProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [query, setQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [appliedJobIds, setAppliedJobIds] = useState(() => new Set());
  const [savedJobIds, setSavedJobIds] = useState(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem('job_saved_jobs') || '[]'));
    } catch (error) {
      return new Set();
    }
  });
  const [status, setStatus] = useState({ type: 'idle', message: '' });
  const [loading, setLoading] = useState(false);
  const [authSubmitting, setAuthSubmitting] = useState(false);

  const selectedJob = jobs.find((job) => job.id === selectedJobId) || jobs[0] || null;
  const isRecruiter = profile?.role === 'recruiter';
  const isLoggedIn = Boolean(profile);

  const filteredJobs = useMemo(() => {
    const text = query.trim().toLowerCase();
    const place = locationQuery.trim().toLowerCase();

    return jobs.filter((job) => {
      const matchesText =
        !text ||
        [job.title, job.company, job.skills, job.description]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(text));
      const matchesLocation = !place || job.location?.toLowerCase().includes(place);
      return matchesText && matchesLocation;
    });
  }, [jobs, query, locationQuery]);

  useEffect(() => {
    loadJobs();
  }, []);

  useEffect(() => {
    setAuthForm((current) => ({
      ...current,
      role: audience === 'employer' ? 'recruiter' : 'applicant',
    }));
  }, [audience]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('job_api_token', token);
      loadProfile(token);
    } else {
      localStorage.removeItem('job_api_token');
      setProfile(null);
      setApplicantProfile(null);
      setApplications([]);
      setAppliedJobIds(new Set());
    }
  }, [token]);

  useEffect(() => {
    localStorage.setItem('job_saved_jobs', JSON.stringify([...savedJobIds]));
  }, [savedJobIds]);

  async function request(path, options = {}) {
    let response;

    try {
      response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...options.headers,
        },
      });
    } catch (error) {
      throw new Error(`Cannot connect to FastAPI at ${API_BASE_URL}. Start the backend and refresh.`);
    }

    const contentType = response.headers.get('content-type') || '';
    const payload = contentType.includes('application/json') ? await response.json() : null;

    if (!response.ok) {
      throw new Error(payload?.detail || 'Something went wrong');
    }

    return payload;
  }

  async function loadJobs() {
    setLoading(true);
    try {
      const data = await request('/jobs/');
      setJobs(data);
      setSelectedJobId((current) => current || data[0]?.id || null);
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  }

  async function loadProfile(activeToken = token) {
    try {
      let response;

      try {
        response = await fetch(`${API_BASE_URL}/auth/profile`, {
          headers: { Authorization: `Bearer ${activeToken}` },
        });
      } catch (error) {
        throw new Error(`Cannot connect to FastAPI at ${API_BASE_URL}. Start the backend and refresh.`);
      }

      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.detail || 'Session expired');
      setProfile(payload);
      setAudience(payload.role === 'recruiter' ? 'employer' : 'seeker');
      if (payload.role === 'applicant') {
        try {
          await loadApplicantDashboardData(activeToken);
        } catch (dashboardError) {
          setStatus({ type: 'error', message: dashboardError.message });
        }
      }
    } catch (error) {
      setToken('');
      setStatus({ type: 'error', message: error.message });
    }
  }

  async function fetchWithToken(path, activeToken) {
    let response;

    try {
      response = await fetch(`${API_BASE_URL}${path}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${activeToken}`,
        },
      });
    } catch (error) {
      throw new Error(`Cannot connect to FastAPI at ${API_BASE_URL}. Start the backend and refresh.`);
    }

    const contentType = response.headers.get('content-type') || '';
    const payload = contentType.includes('application/json') ? await response.json() : null;
    return { ok: response.ok, payload, statusCode: response.status };
  }

  async function loadApplicantDashboardData(activeToken = token) {
    const [profileResult, applicationsResult] = await Promise.all([
      fetchWithToken('/applicant-profile/', activeToken),
      fetchWithToken('/Applications/my-applications', activeToken),
    ]);

    if (profileResult.ok) {
      setApplicantProfile(profileResult.payload);
    } else if (profileResult.statusCode === 404) {
      setApplicantProfile(null);
    } else {
      throw new Error(profileResult.payload?.detail || 'Could not load applicant profile');
    }

    if (applicationsResult.ok) {
      const nextApplications = applicationsResult.payload || [];
      setApplications(nextApplications);
      setAppliedJobIds(new Set(nextApplications.map((application) => application.job_id)));
    } else {
      throw new Error(applicationsResult.payload?.detail || 'Could not load recent applications');
    }
  }

  async function handleAuth(event) {
    event.preventDefault();
    setStatus({ type: 'idle', message: '' });
    setAuthSubmitting(true);

    try {
      const activeRole = audience === 'employer' ? 'recruiter' : 'applicant';

      if (authMode === 'register') {
        await request('/users/register', {
          method: 'POST',
          body: JSON.stringify({
            name: authForm.name,
            email: authForm.email,
            password: authForm.password,
            role: activeRole,
          }),
        });

        const data = await request('/auth/login', {
          method: 'POST',
          body: JSON.stringify({
            email: authForm.email,
            password: authForm.password,
          }),
        });
        setToken(data.access_token);
        setActiveWorkspace(activeRole === 'recruiter' ? 'employer' : 'seeker');
        setAuthForm({ ...blankAuth, role: activeRole });
        setStatus({ type: 'success', message: 'Account created and logged in successfully.' });
        return;
      }

      const data = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: authForm.email,
          password: authForm.password,
        }),
      });
      setToken(data.access_token);
      setActiveWorkspace(activeRole === 'recruiter' ? 'employer' : 'seeker');
      setAuthForm(blankAuth);
      setStatus({ type: 'success', message: 'Logged in successfully.' });
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setAuthSubmitting(false);
    }
  }

  function handleLogout() {
    setToken('');
    setProfile(null);
    setStatus({ type: 'success', message: 'Logged out successfully.' });
  }

  async function handleSaveJob(event) {
    event.preventDefault();
    const payload = {
      ...jobForm,
      salary: Number(jobForm.salary),
      experience_level: Number(jobForm.experience_level),
    };

    try {
      const path = editingJobId ? `/jobs/${editingJobId}` : '/jobs/';
      await request(path, {
        method: editingJobId ? 'PUT' : 'POST',
        body: JSON.stringify(payload),
      });
      setStatus({
        type: 'success',
        message: editingJobId ? 'Job updated successfully.' : 'Job posted successfully.',
      });
      setJobForm(blankJob);
      setEditingJobId(null);
      await loadJobs();
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    }
  }

  async function handleDeleteJob(jobId) {
    try {
      await request(`/jobs/${jobId}`, { method: 'DELETE' });
      setStatus({ type: 'success', message: 'Job deleted successfully.' });
      setSelectedJobId(null);
      await loadJobs();
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    }
  }

  async function handleApplyJob(jobId) {
    if (!profile || profile.role !== 'applicant') {
      openLogin('seeker');
      return;
    }

    try {
      await request('/Applications/', {
        method: 'POST',
        body: JSON.stringify({ job_id: jobId }),
      });
      setAppliedJobIds((current) => new Set(current).add(jobId));
      await loadApplicantDashboardData();
      setStatus({ type: 'success', message: 'Application submitted successfully.' });
    } catch (error) {
      if (error.message.toLowerCase().includes('already applied')) {
        setAppliedJobIds((current) => new Set(current).add(jobId));
      }
      setStatus({ type: 'error', message: error.message });
    }
  }

  function toggleSavedJob(jobId) {
    setSavedJobIds((current) => {
      const next = new Set(current);
      if (next.has(jobId)) {
        next.delete(jobId);
      } else {
        next.add(jobId);
      }
      return next;
    });
  }

  function startEdit(job) {
    setAudience('employer');
    setActiveWorkspace('employer');
    setEditingJobId(job.id);
    setJobForm({
      title: job.title,
      company: job.company,
      location: job.location,
      salary: job.salary,
      experience_level: job.experience_level,
      skills: job.skills,
      description: job.description,
    });
  }

  function scrollToWorkspace() {
    window.setTimeout(() => {
      document.getElementById('workspace')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 40);
  }

  function openJobsWorkspace() {
    setAudience('seeker');
    setActiveWorkspace('seeker');
    loadJobs();
    scrollToWorkspace();
  }

  function openPostJobWorkspace() {
    setAudience('employer');
    if (!isRecruiter) {
      setActiveWorkspace('auth');
      setAuthMode('register');
      setAuthForm({ ...blankAuth, role: 'recruiter' });
    } else {
      setActiveWorkspace('employer');
    }
    scrollToWorkspace();
  }

  function openLogin(targetAudience = 'seeker') {
    setAudience(targetAudience);
    setActiveWorkspace('auth');
    setAuthMode('login');
    setAuthForm({
      ...blankAuth,
      role: targetAudience === 'employer' ? 'recruiter' : 'applicant',
    });
    scrollToWorkspace();
  }

  function openRegister(targetAudience) {
    setAudience(targetAudience);
    setActiveWorkspace('auth');
    setAuthMode('register');
    setAuthForm({
      ...blankAuth,
      role: targetAudience === 'employer' ? 'recruiter' : 'applicant',
    });
    scrollToWorkspace();
  }

  return (
    <main className="site-shell">
      {status.message && (
        <div className={`notice ${status.type}`}>
          <span>{status.message}</span>
          <button onClick={() => setStatus({ type: 'idle', message: '' })} title="Dismiss">
            <X size={16} />
          </button>
        </div>
      )}

      {!activeWorkspace && (
        <section className="landing-stage">
          <header className="site-header">
            <button className="brand" onClick={() => setAudience('seeker')}>
              <span className="brand-mark">
                <BriefcaseBusiness size={25} />
              </span>
              <span>
                JobSphere
                <small>Find. Connect. Grow</small>
              </span>
            </button>

            <nav className="main-nav" aria-label="Primary">
              <a href="#home" className="active">Home</a>
              <button onClick={openJobsWorkspace}>Find Jobs</button>
              <button onClick={openPostJobWorkspace}>Find Talent</button>
              <a href="#about">About Us</a>
              <a href="#pricing">Pricing</a>
              <a href="#contact">Contact</a>
            </nav>

            <div className="header-actions">
              <button className="icon-button header-icon" title="Toggle theme">
                <Moon size={18} />
              </button>
              {profile ? (
                <div className="session-pill">
                  <span>{profile.name || profile.email}</span>
                  <strong>{profile.role}</strong>
                  <button onClick={handleLogout} title="Logout">
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <>
                  <button className="text-button" onClick={() => openLogin('seeker')}>Login</button>
                  <button className="header-cta" onClick={() => openRegister('seeker')}>Sign Up</button>
                </>
              )}
            </div>
          </header>

          <LandingHero
            jobs={jobs}
            onChooseSeeker={openJobsWorkspace}
            onOpenEmployerRegister={openPostJobWorkspace}
            onOpenSeekerLogin={() => openLogin('seeker')}
            onOpenSeekerRegister={() => openRegister('seeker')}
            profile={profile}
          />
        </section>
      )}

      {activeWorkspace && (
        <section className="workspace-reveal" id="workspace">
          {activeWorkspace === 'auth' ? (
            <AuthScreen
              audience={audience}
              authForm={authForm}
              authMode={authMode}
              authSubmitting={authSubmitting}
              onAuth={handleAuth}
              onSwitchMode={setAuthMode}
              setAuthForm={setAuthForm}
              status={status}
            />
          ) : audience === 'seeker' ? (
            <JobSeekerView
              authForm={authForm}
              authMode={authMode}
              authSubmitting={authSubmitting}
              filteredJobs={filteredJobs}
              isLoggedIn={isLoggedIn}
              isRecruiter={isRecruiter}
              applicantProfile={applicantProfile}
              applications={applications}
              appliedJobIds={appliedJobIds}
              loading={loading}
              locationQuery={locationQuery}
              onAuth={handleAuth}
              onApplyJob={handleApplyJob}
              onDeleteJob={handleDeleteJob}
              onEditJob={startEdit}
              onLoadJobs={loadJobs}
              onOpenRegister={() => openRegister('seeker')}
              onSelectJob={setSelectedJobId}
              onToggleSavedJob={toggleSavedJob}
              profile={profile}
              query={query}
              savedJobIds={savedJobIds}
              selectedJob={selectedJob}
              setAuthForm={setAuthForm}
              setAuthMode={setAuthMode}
              setLocationQuery={setLocationQuery}
              setQuery={setQuery}
              status={status}
            />
          ) : (
            <EmployerView
              authForm={authForm}
              authMode={authMode}
              authSubmitting={authSubmitting}
              editingJobId={editingJobId}
              isRecruiter={isRecruiter}
              jobForm={jobForm}
              jobs={jobs}
              onAuth={handleAuth}
              onCancelEdit={() => {
                setEditingJobId(null);
                setJobForm(blankJob);
              }}
              onDeleteJob={handleDeleteJob}
              onEditJob={startEdit}
              onOpenRegister={() => openRegister('employer')}
              onSaveJob={handleSaveJob}
              profile={profile}
              setAuthForm={setAuthForm}
              setAuthMode={setAuthMode}
              setJobForm={setJobForm}
              status={status}
            />
          )}
        </section>
      )}
    </main>
  );
}

function LandingHero({
  jobs,
  onChooseSeeker,
  onOpenEmployerRegister,
  onOpenSeekerLogin,
  onOpenSeekerRegister,
  profile,
}) {
  const featuredJobs = (jobs.length ? jobs : demoJobs).slice(0, 3);
  const [activeFeaturedIndex, setActiveFeaturedIndex] = useState(0);
  const [savedJobs, setSavedJobs] = useState(() => new Set());
  const [appliedJobs, setAppliedJobs] = useState(() => new Set());
  const companies = ['Google', 'Microsoft', 'Amazon', 'Swiggy', 'TCS', 'Infosys', 'Adobe'];
  const canViewFeaturedJobs = profile?.role === 'applicant';

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveFeaturedIndex((current) => (current + 1) % featuredJobs.length);
    }, 3200);

    return () => window.clearInterval(timer);
  }, [featuredJobs.length]);

  function getJobKey(job, index) {
    return job.id || `${job.title}-${job.company}-${index}`;
  }

  function toggleSaved(jobKey) {
    setSavedJobs((current) => {
      const next = new Set(current);
      if (next.has(jobKey)) {
        next.delete(jobKey);
      } else {
        next.add(jobKey);
      }
      return next;
    });
  }

  function markApplied(jobKey) {
    setAppliedJobs((current) => {
      const next = new Set(current);
      next.add(jobKey);
      return next;
    });
  }

  return (
    <div className="landing-inner" id="home">
      <div className="hero-grid">
        <section className="hero-copy">
          <div className="priority-pill">
            <Sparkles size={16} />
            Your Career, Our Priority
          </div>
          <h1>
            Find Your Dream Job.
            <span> Build Your Future.</span>
          </h1>
          <p>Explore thousands of job opportunities with top companies and take the next step in your career.</p>
          <div className="hero-actions">
            <button className="primary-button" onClick={onChooseSeeker}>
              Find Jobs
              <ArrowRight size={20} />
            </button>
            <button className="ghost-button" onClick={onOpenEmployerRegister}>
              Post a Job
              <ArrowRight size={20} />
            </button>
          </div>
          <div className="trust-row">
            <div className="avatar-stack" aria-hidden="true">
              <span>JS</span>
              <span>UX</span>
              <span>AI</span>
              <span>QA</span>
            </div>
            <span>Trusted by 10,000+ job seekers and companies</span>
          </div>
        </section>

        {canViewFeaturedJobs ? (
          <section className="featured-panel" id="jobs">
            <div className="featured-head">
              <div>
                <h2>
                  <Flame size={18} />
                  Featured Jobs
                </h2>
                <span className="live-pill">
                  <span />
                  Live openings
                </span>
              </div>
              <button>
                View all jobs
                <ArrowRight size={18} />
              </button>
            </div>

            <div className="featured-list">
              {featuredJobs.map((job, index) => (
                <article
                  className={`featured-job ${index === activeFeaturedIndex ? 'active' : ''}`}
                  key={getJobKey(job, index)}
                  onMouseEnter={() => setActiveFeaturedIndex(index)}
                >
                  <div className="company-logo">{(job.company || 'J').slice(0, 1)}</div>
                  <div>
                    <h3>{job.title}</h3>
                    <p>{job.company}</p>
                    <span className="featured-meta-row">
                      <MapPin size={14} />
                      {job.location}
                      <span className="dot" />
                      Full-time
                    </span>
                  </div>
                  <div className="job-side">
                    <strong>{formatSalary(job.salary)}</strong>
                    <button onClick={() => markApplied(getJobKey(job, index))}>
                      {appliedJobs.has(getJobKey(job, index)) ? 'Applied' : 'Apply Now'}
                    </button>
                  </div>
                  <button
                    className={`bookmark-button ${savedJobs.has(getJobKey(job, index)) ? 'saved' : ''}`}
                    onClick={() => toggleSaved(getJobKey(job, index))}
                    title={savedJobs.has(getJobKey(job, index)) ? 'Saved' : 'Save job'}
                  >
                    <Bookmark size={21} />
                  </button>
                </article>
              ))}
            </div>

            <div className="feature-progress" aria-label="Featured job rotation">
              {featuredJobs.map((job, index) => (
                <button
                  className={index === activeFeaturedIndex ? 'active' : ''}
                  key={`progress-${getJobKey(job, index)}`}
                  onClick={() => setActiveFeaturedIndex(index)}
                  title={`Show ${job.title}`}
                />
              ))}
            </div>
          </section>
        ) : (
          <section className="featured-panel featured-lock" id="jobs">
            <div className="lock-icon">
              <BriefcaseBusiness size={32} />
            </div>
            <h2>Featured Jobs</h2>
            <p>
              {profile?.role === 'recruiter'
                ? 'Featured live openings are available only for applicant accounts.'
                : 'Login or create an applicant account to view live featured openings.'}
            </p>
            <div className="lock-actions">
              <button
                className="primary-button"
                onClick={onOpenSeekerLogin}
              >
                Login
              </button>
              <button className="ghost-button" onClick={onOpenSeekerRegister}>
                Sign Up
                <ArrowRight size={18} />
              </button>
            </div>
          </section>
        )}
      </div>

      <section className="company-strip">
        <p>Join top companies hiring on JobSphere</p>
        <div>
          {companies.map((company) => (
            <span key={company}>{company}</span>
          ))}
        </div>
      </section>

    </div>
  );
}

function JobSeekerView({
  applicantProfile,
  applications,
  authForm,
  authMode,
  authSubmitting,
  filteredJobs,
  isLoggedIn,
  isRecruiter,
  loading,
  locationQuery,
  onAuth,
  onDeleteJob,
  onEditJob,
  onApplyJob,
  appliedJobIds,
  onLoadJobs,
  onOpenRegister,
  onSelectJob,
  onToggleSavedJob,
  profile,
  query,
  savedJobIds,
  selectedJob,
  setAuthForm,
  setAuthMode,
  setLocationQuery,
  setQuery,
  status,
}) {
  const [searchSubmitting, setSearchSubmitting] = useState(false);

  async function handleSearch(event) {
    event.preventDefault();
    setSearchSubmitting(true);

    try {
      await Promise.all([
        onLoadJobs(),
        new Promise((resolve) => setTimeout(resolve, 600)),
      ]);
    } finally {
      setSearchSubmitting(false);
    }
  }

  const isSearching = loading || searchSubmitting;

  if (isLoggedIn && !isRecruiter) {
    return (
      <ApplicantDashboard
        appliedJobIds={appliedJobIds}
        applicantProfile={applicantProfile}
        applications={applications}
        jobs={filteredJobs}
        locationQuery={locationQuery}
        onApplyJob={onApplyJob}
        onLoadJobs={onLoadJobs}
        onToggleSavedJob={onToggleSavedJob}
        profile={profile}
        query={query}
        savedJobIds={savedJobIds}
        setLocationQuery={setLocationQuery}
        setQuery={setQuery}
      />
    );
  }

  return (
    <>
      <section className="seeker-hero">
        <form className={`job-search-bar ${isSearching ? 'searching' : ''}`} onSubmit={handleSearch}>
          <label>
            <Search size={24} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Job title, keywords, or company"
            />
          </label>
          <span className="divider" />
          <label>
            <MapPin size={24} />
            <input
              value={locationQuery}
              onChange={(event) => setLocationQuery(event.target.value)}
              placeholder="City, state, or remote"
            />
          </label>
          <button type="submit" disabled={isSearching} aria-busy={isSearching}>
            {isSearching ? <RefreshCw size={20} className="spin" /> : <Search size={20} />}
            {isSearching ? 'Searching...' : 'Find jobs'}
          </button>
        </form>

        <div className="seeker-title">
          <div className="wordmark">JobSphere</div>
          <h1>Your next job starts here</h1>
          <p>Create an account or sign in to see jobs that match your profile.</p>
          {!isLoggedIn && (
            <button className="primary-button hero-button" onClick={onOpenRegister}>
              Get Started
              <ArrowRight size={20} />
            </button>
          )}
        </div>
      </section>

      <section className="content-grid seeker-grid">
        {!isLoggedIn && (
          <AuthPanel
            authForm={authForm}
            authMode={authMode}
            authSubmitting={authSubmitting}
            fixedRole="applicant"
            onAuth={onAuth}
            setAuthForm={setAuthForm}
            setAuthMode={setAuthMode}
            status={status}
            title="Job seeker account"
          />
        )}

        <section className="job-board">
          <div className="section-head">
            <div>
              <p className="eyebrow">Available roles</p>
              <h2>{filteredJobs.length} jobs found</h2>
            </div>
            <button className="icon-button" onClick={onLoadJobs} title="Refresh jobs">
              <RefreshCw size={18} className={loading ? 'spin' : ''} />
            </button>
          </div>

          <div className="jobs-grid">
            <div className="job-list">
              {filteredJobs.map((job) => (
                <button
                  key={job.id}
                  className={`job-card ${selectedJob?.id === job.id ? 'selected' : ''}`}
                  onClick={() => onSelectJob(job.id)}
                >
                  <span className="job-title">{job.title}</span>
                  <span className="meta">
                    <Building2 size={15} />
                    {job.company}
                  </span>
                  <span className="meta">
                    <MapPin size={15} />
                    {job.location}
                  </span>
                </button>
              ))}

              {!filteredJobs.length && <div className="empty-state">No jobs found.</div>}
            </div>

            <JobDetails
              isRecruiter={isRecruiter}
              job={selectedJob}
              onDeleteJob={onDeleteJob}
              onEditJob={onEditJob}
            />
          </div>
        </section>
      </section>
    </>
  );
}

function ApplicantDashboard({
  appliedJobIds,
  applicantProfile,
  applications,
  jobs,
  locationQuery,
  onApplyJob,
  onLoadJobs,
  onToggleSavedJob,
  profile,
  query,
  savedJobIds,
  setLocationQuery,
  setQuery,
}) {
  const [visibleRecommendationCount, setVisibleRecommendationCount] = useState(3);
  const displayName = profile?.name || 'Applicant';
  const firstName = displayName.split(' ')[0] || displayName;
  const savedJobs = jobs.filter((job) => savedJobIds.has(job.id));
  const profileProgress = getProfileProgress(profile, applicantProfile);
  const recentApplications = applications
    .slice()
    .sort((first, second) => new Date(second.applied_at) - new Date(first.applied_at))
    .slice(0, 3);
  const recommendedJobs = getRecommendedJobs({
    applicantProfile,
    appliedJobIds,
    jobs,
    query,
    savedJobIds,
  });
  const visibleRecommendedJobs = recommendedJobs.slice(0, visibleRecommendationCount);
  const hasMoreRecommendations = visibleRecommendationCount < recommendedJobs.length;

  function handleDashboardSearch(event) {
    event.preventDefault();
    onLoadJobs();
  }

  return (
    <div className="applicant-shell">
      <aside className="app-sidebar">
        <button className="app-brand">
          <BriefcaseBusiness size={26} />
          <span>JobSphere</span>
        </button>

        <div className="profile-card mini">
          <div className="avatar">{getInitials(displayName)}</div>
          <div>
            <strong>{displayName}</strong>
            <span>View Profile</span>
          </div>
          <ArrowRight size={15} />
        </div>

        <nav className="dashboard-nav" aria-label="Applicant">
          {[
            [Home, 'Dashboard', true],
            [Search, 'Find Jobs'],
            [BriefcaseBusiness, 'My Applications'],
            [Heart, 'Saved Jobs'],
            [Bell, 'Job Alerts'],
            [FileText, 'Resume'],
            [User, 'Profile'],
            [Settings, 'Settings'],
          ].map(([Icon, label, active]) => (
            <button className={active ? 'active' : ''} key={label}>
              <Icon size={20} />
              {label}
            </button>
          ))}
        </nav>

        <div className="match-card">
          <div className="rocket">R</div>
          <div className="mini-ring" style={{ '--progress': `${profileProgress.percent}%` }}>
            <span>{profileProgress.percent}%</span>
          </div>
          <strong>Get better job matches</strong>
          <p>Complete your profile and increase your chances.</p>
          <button>Complete Profile</button>
        </div>
      </aside>

      <section className="applicant-main">
        <header className="dashboard-topbar">
          <form className="top-search" onSubmit={handleDashboardSearch}>
            <Search size={20} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search jobs, skills or companies..."
            />
            <kbd>Ctrl + K</kbd>
          </form>
          <div className="top-actions">
            <button className="notify-button" title="Notifications">
              <Bell size={22} />
              <span>3</span>
            </button>
            <button className="notify-button" title="Messages">
              <MessageCircle size={22} />
            </button>
            <div className="top-profile">
              <div className="avatar small">{getInitials(displayName)}</div>
              <div>
                <strong>{displayName}</strong>
                <span>Job Seeker</span>
              </div>
              <ChevronDown size={18} />
            </div>
          </div>
        </header>

        <div className="dashboard-layout">
          <div className="dashboard-center">
            <section className="welcome-panel">
              <div>
                <h1>
                  Welcome back, <span>{firstName}!</span>
                </h1>
                <p>Explore thousands of job opportunities and take the next step in your career.</p>
              </div>
              <div className="briefcase-art" aria-hidden="true">
                <BriefcaseBusiness size={96} />
              </div>
              <form className="hero-search" onSubmit={handleDashboardSearch}>
                <label>
                  <Search size={22} />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Job title, keywords or company"
                  />
                </label>
                <label>
                  <MapPin size={22} />
                  <input
                    value={locationQuery}
                    onChange={(event) => setLocationQuery(event.target.value)}
                    placeholder="Location"
                  />
                </label>
                <button type="submit">Search Jobs</button>
              </form>
              <div className="popular-searches">
                <span>Popular searches:</span>
                {['Python Developer', 'Data Analyst', 'Frontend Developer', 'Product Manager'].map((term) => (
                  <button key={term} type="button" onClick={() => setQuery(term)}>
                    {term}
                  </button>
                ))}
              </div>
            </section>

            <section className="stats-strip">
              <StatTile icon={BriefcaseBusiness} label="Applications" value={applications.length} sublabel="View all" />
              <StatTile icon={Bookmark} label="Saved Jobs" value={savedJobIds.size} sublabel="View all" />
              <StatTile icon={Bell} label="Job Alerts" value={recommendedJobs.length} sublabel="Active" tone="amber" />
              <StatTile icon={Check} label="Profile Strength" value={`${profileProgress.percent}%`} sublabel="Improve" tone="green" />
            </section>

            <section className="jobs-panel">
              <div className="panel-title-row">
                <h2>Recommended Jobs For You</h2>
                <button>View all jobs</button>
              </div>
              <div className="recommended-list">
                {visibleRecommendedJobs.length ? (
                  visibleRecommendedJobs.map((job, index) => (
                    <article className="recommended-card" key={job.id || `${job.title}-${index}`}>
                      <div className={`company-badge ${job.logo.tone}`}>{job.logo.text}</div>
                      <div className="job-summary">
                        <h3>{job.title}</h3>
                        <p>{job.company}</p>
                        <span>
                          <MapPin size={14} />
                          {job.location}
                          <span className="dot-separator" />
                          {job.matchScore}% match
                        </span>
                        <div className="tag-row">
                          {job.tags.map((tag) => (
                            <em key={tag}>{tag}</em>
                          ))}
                        </div>
                      </div>
                      <div className="job-pay">
                        <strong>{formatSalary(job.salary)}</strong>
                        <span>
                          <Clock size={14} />
                          {job.posted}
                        </span>
                      </div>
                      <div className="job-actions">
                        <button
                          className={`save-btn ${savedJobIds.has(job.id) ? 'saved' : ''}`}
                          onClick={() => onToggleSavedJob(job.id)}
                        >
                          {savedJobIds.has(job.id) ? 'Saved' : 'Save'}
                        </button>
                        <button className="apply-btn" onClick={() => onApplyJob(job.id)}>
                          {appliedJobIds.has(job.id) ? 'Applied' : 'Apply Now'}
                        </button>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="compact-empty">No recommended jobs yet. Add jobs or complete your profile.</div>
                )}
              </div>
              {hasMoreRecommendations && (
                <button
                  className="more-jobs"
                  onClick={() => setVisibleRecommendationCount((current) => current + 3)}
                >
                  View More Jobs
                </button>
              )}
            </section>
          </div>

          <aside className="dashboard-side">
            <ProfileProgress progress={profileProgress} />
            <RecentApplications applications={recentApplications} jobs={jobs} />
            <SavedJobs jobs={savedJobs.slice(0, 3)} />
          </aside>
        </div>
      </section>
    </div>
  );
}

function StatTile({ icon: Icon, label, value, sublabel, tone = 'purple' }) {
  return (
    <article className={`stat-tile ${tone}`}>
      <span>
        <Icon size={23} />
      </span>
      <div>
        <strong>{value}</strong>
        <p>{label}</p>
        <small>{sublabel}</small>
      </div>
    </article>
  );
}

function ProfileProgress({ progress }) {
  return (
    <section className="side-card profile-progress">
      <h2>Profile Completeness</h2>
      <div className="progress-body">
        <div className="progress-ring" style={{ '--progress': `${progress.percent}%` }}>
          <span>{progress.percent}%</span>
        </div>
        <div className="profile-checks">
          <p>{progress.message}</p>
          {progress.items.map((item) => (
            <span className={item.complete ? 'done' : ''} key={item.label}>
              {item.complete ? <Check size={16} /> : <span className="empty-dot" />}
              {item.label}
            </span>
          ))}
        </div>
      </div>
      <button>Complete Profile</button>
    </section>
  );
}

function RecentApplications({ applications, jobs }) {
  return (
    <section className="side-card compact-list">
      <div className="panel-title-row">
        <h2>Recent Applications</h2>
        <button>View all</button>
      </div>
      {applications.length ? (
        applications.map((application) => {
          const job = jobs.find((item) => item.id === application.job_id);
          const statusTone = getStatusTone(application.status);

          return (
            <article key={application.id}>
              <div className={`small-logo ${statusTone}`}>{(job?.company || 'J').slice(0, 1)}</div>
              <div>
                <strong>{job?.title || `Job #${application.job_id}`}</strong>
                <p>{job?.company || 'Company unavailable'}</p>
                <span>{formatAppliedDate(application.applied_at)}</span>
              </div>
              <em className={statusTone}>{application.status}</em>
            </article>
          );
        })
      ) : (
        <div className="compact-empty">No applications yet.</div>
      )}
    </section>
  );
}

function SavedJobs({ jobs }) {
  return (
    <section className="side-card compact-list saved-list">
      <div className="panel-title-row">
        <h2>Saved Jobs</h2>
        <button>View all</button>
      </div>
      {jobs.length ? (
        jobs.map((job, index) => {
          const logo = getCompanyLogo(job.company, index);

          return (
            <article key={job.id}>
              <div className={`small-logo ${logo.tone}`}>{logo.text}</div>
              <div>
                <strong>{job.title}</strong>
                <p>{job.company}</p>
              </div>
              <em>{formatSalary(job.salary)}</em>
            </article>
          );
        })
      ) : (
        <div className="compact-empty">No saved jobs yet.</div>
      )}
    </section>
  );
}

function getInitials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function getCompanyLogo(company = 'Job', index = 0) {
  const map = {
    Google: { text: 'G', tone: 'google' },
    Microsoft: { text: 'M', tone: 'microsoft' },
    Amazon: { text: 'a', tone: 'amazon' },
    Swiggy: { text: 'S', tone: 'swiggy' },
    Infosys: { text: 'I', tone: 'infosys' },
  };

  return map[company] || { text: company.slice(0, 1).toUpperCase(), tone: ['purple', 'green', 'blue'][index % 3] };
}

function getRecommendedJobs({ applicantProfile, appliedJobIds, jobs, query, savedJobIds }) {
  const profileKeywords = getApplicantKeywords(applicantProfile);
  const queryKeywords = tokenize(query);
  const applicantLocation = applicantProfile?.location?.toLowerCase() || '';
  const applicantExperience = parseExperienceYears(applicantProfile?.experience);
  const maxScore = 120;

  return jobs
    .filter((job) => job?.is_active !== false)
    .map((job, index) => {
      const jobText = [
        job.title,
        job.company,
        job.location,
        job.skills,
        job.description,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      const matchedProfileKeywords = profileKeywords.filter((keyword) => jobText.includes(keyword));
      const matchedQueryKeywords = queryKeywords.filter((keyword) => jobText.includes(keyword));
      const locationMatch =
        applicantLocation && job.location?.toLowerCase().includes(applicantLocation.split(',')[0].trim());
      const experienceLevel = parseExperienceYears(job.experience_level);
      const experienceMatch =
        applicantExperience === null || experienceLevel === null || experienceLevel <= applicantExperience + 1;
      const createdAt = job.created_at ? new Date(job.created_at).getTime() : 0;

      let score = 20;
      score += matchedProfileKeywords.length * 12;
      score += matchedQueryKeywords.length * 16;
      score += locationMatch ? 18 : 0;
      score += experienceMatch ? 12 : -8;
      score += job.is_featured ? 12 + Number(job.featured_priority || 0) : 0;
      score += savedJobIds.has(job.id) ? 6 : 0;
      score -= appliedJobIds.has(job.id) ? 28 : 0;
      score += Math.min(10, Math.max(0, Math.round((createdAt || 0) / 100000000000)));

      return {
        ...job,
        logo: getCompanyLogo(job.company, index),
        tags: getJobTags(job, index),
        matchScore: Math.max(35, Math.min(99, Math.round((score / maxScore) * 100))),
        posted: formatPostedDate(job.created_at),
        recommendationScore: score,
      };
    })
    .sort((first, second) => {
      if (second.recommendationScore !== first.recommendationScore) {
        return second.recommendationScore - first.recommendationScore;
      }

      return new Date(second.created_at || 0) - new Date(first.created_at || 0);
    });
}

function getJobTags(job, index) {
  const fallback = [
    ['Python', 'React', 'JavaScript', '+2'],
    ['Python', 'SQL', 'Azure', '+3'],
    ['Java', 'Spring Boot', 'Microservices', '+2'],
  ];

  if (!job.skills) return fallback[index % fallback.length];
  return job.skills
    .split(',')
    .map((skill) => skill.trim())
    .filter(Boolean)
    .slice(0, 4);
}

function getApplicantKeywords(applicantProfile) {
  if (!applicantProfile) return [];

  return tokenize([
    applicantProfile.full_name,
    applicantProfile.location,
    applicantProfile.experience,
    applicantProfile.education,
    applicantProfile.linkedin,
    applicantProfile.github,
  ].filter(Boolean).join(' '));
}

function tokenize(value = '') {
  const stopWords = new Set(['and', 'the', 'for', 'with', 'from', 'http', 'https', 'www', 'com']);

  return [...new Set(
    String(value)
      .toLowerCase()
      .split(/[^a-z0-9+#.]+/)
      .map((word) => word.trim())
      .filter((word) => word.length > 2 && !stopWords.has(word))
  )];
}

function parseExperienceYears(value) {
  if (value === undefined || value === null || value === '') return null;
  const match = String(value).match(/\d+(\.\d+)?/);
  return match ? Number(match[0]) : null;
}

function formatPostedDate(value) {
  if (!value) return 'Recently posted';

  const createdAt = new Date(value);
  if (Number.isNaN(createdAt.getTime())) return 'Recently posted';

  const diffMs = Date.now() - createdAt.getTime();
  const diffHours = Math.max(0, Math.floor(diffMs / 3600000));
  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;

  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
  }).format(createdAt);
}

function getProfileProgress(userProfile, applicantProfile) {
  const items = [
    {
      label: 'Basic Information',
      complete: Boolean(userProfile?.name && userProfile?.email),
    },
    {
      label: 'Contact Details',
      complete: Boolean(applicantProfile?.contact && applicantProfile?.location),
    },
    {
      label: 'Education',
      complete: Boolean(applicantProfile?.education),
    },
    {
      label: 'Work Experience',
      complete: Boolean(applicantProfile?.experience),
    },
    {
      label: 'Professional Links',
      complete: Boolean(applicantProfile?.linkedin || applicantProfile?.github),
    },
  ];
  const completed = items.filter((item) => item.complete).length;
  const percent = Math.round((completed / items.length) * 100);
  const message =
    percent >= 80
      ? 'Great! Your profile is almost complete.'
      : percent >= 40
        ? 'Good start. Add a few more details to improve matches.'
        : 'Complete your profile to get better job matches.';

  return { completed, items, message, percent };
}

function getStatusTone(status = '') {
  const normalized = status.toLowerCase();
  if (normalized.includes('review')) return 'orange';
  if (normalized.includes('shortlisted') || normalized.includes('hired')) return 'green';
  if (normalized.includes('rejected') || normalized.includes('withdrawn')) return 'red';
  return 'blue';
}

function formatAppliedDate(value) {
  if (!value) return 'Applied recently';

  try {
    return `Applied ${new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(value))}`;
  } catch (error) {
    return 'Applied recently';
  }
}

function EmployerView({
  authForm,
  authMode,
  authSubmitting,
  editingJobId,
  isRecruiter,
  jobForm,
  jobs,
  onAuth,
  onCancelEdit,
  onDeleteJob,
  onEditJob,
  onOpenRegister,
  onSaveJob,
  profile,
  setAuthForm,
  setAuthMode,
  setJobForm,
  status,
}) {
  return (
    <>
      <section className="employer-hero">
        <div className="employer-copy">
          <p className="eyebrow">JobSphere for employers</p>
          <h1>Let's hire your next great candidate. Fast.</h1>
          <p>No matter the skills, experience, or qualifications you need, post roles and manage them here.</p>
          <button className="warm-button" onClick={isRecruiter ? undefined : onOpenRegister}>
            Post a job
          </button>
        </div>
        <img src={employerHero} alt="Professional reviewing candidates on a laptop" />
      </section>

      <section className="content-grid employer-grid">
        {!profile && (
          <AuthPanel
            authForm={authForm}
            authMode={authMode}
            authSubmitting={authSubmitting}
            fixedRole="recruiter"
            onAuth={onAuth}
            setAuthForm={setAuthForm}
            setAuthMode={setAuthMode}
            status={status}
            title="Employer account"
          />
        )}

        {profile && !isRecruiter && (
          <div className="panel locked-panel">
            <Users size={30} />
            <h2>Recruiter account required</h2>
            <p>You are signed in as an applicant. Create or login with a recruiter account to post jobs.</p>
          </div>
        )}

        {isRecruiter && (
          <PostJobPanel
            editingJobId={editingJobId}
            jobForm={jobForm}
            onCancelEdit={onCancelEdit}
            onSaveJob={onSaveJob}
            setJobForm={setJobForm}
          />
        )}

        <section className="job-board employer-jobs">
          <div className="section-head">
            <div>
              <p className="eyebrow">Current listings</p>
              <h2>{jobs.length} active jobs</h2>
            </div>
          </div>

          <div className="employer-list">
            {jobs.map((job) => (
              <article className="employer-job-card" key={job.id}>
                <div>
                  <h3>{job.title}</h3>
                  <p>{job.company} - {job.location}</p>
                </div>
                {isRecruiter && (
                  <div className="actions compact-actions">
                    <button onClick={() => onEditJob(job)}>
                      <Edit3 size={16} />
                      Edit
                    </button>
                    <button className="danger" onClick={() => onDeleteJob(job.id)}>
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>
      </section>
    </>
  );
}

function AuthScreen({
  audience,
  authForm,
  authMode,
  authSubmitting,
  onAuth,
  onSwitchMode,
  setAuthForm,
  status,
}) {
  const isRecruiterAuth = audience === 'employer';
  const fixedRole = isRecruiterAuth ? 'recruiter' : 'applicant';
  const modeLabel = authMode === 'login' ? 'Login' : 'Sign Up';
  const audienceLabel = isRecruiterAuth ? 'Recruiter' : 'Applicant';
  const title =
    authMode === 'login'
      ? `${audienceLabel} Login`
      : isRecruiterAuth
        ? 'Create Your Company'
        : 'Create Your Account';

  return (
    <section className={`auth-screen ${fixedRole}`}>
      <div className="auth-showcase">
        <div className="auth-mini-brand">
          <BriefcaseBusiness size={22} />
          <strong>JobSphere</strong>
        </div>
        <div className="auth-figure" aria-hidden="true">
          <div className="figure-head" />
          <div className="figure-body" />
          <div className="figure-device" />
        </div>
        <h2>{authMode === 'login' ? 'Welcome Back!' : title}</h2>
        <p>
          {authMode === 'login'
            ? `Login to access your ${isRecruiterAuth ? 'recruiter' : 'job seeker'} account.`
            : isRecruiterAuth
              ? 'Join thousands of recruiters hiring top talent.'
              : 'Join thousands of job seekers finding better opportunities.'}
        </p>
      </div>

      <AuthPanel
        authForm={authForm}
        authMode={authMode}
        authSubmitting={authSubmitting}
        fixedRole={fixedRole}
        onAuth={onAuth}
        setAuthForm={setAuthForm}
        setAuthMode={onSwitchMode}
        status={status}
        title={title}
      />
    </section>
  );
}

function AuthPanel({
  authForm,
  authMode,
  authSubmitting,
  fixedRole,
  onAuth,
  setAuthForm,
  setAuthMode,
  status,
  title,
}) {
  const roleLabel = fixedRole === 'recruiter' ? 'Recruiter' : 'Applicant';

  return (
    <aside className="panel auth-panel">
      <div className="panel-heading">
        <h2>{title}</h2>
        <span>{roleLabel}</span>
      </div>
      <div className="tabs">
        <button className={authMode === 'login' ? 'active' : ''} onClick={() => setAuthMode('login')}>
          <LogIn size={16} />
          Login
        </button>
        <button className={authMode === 'register' ? 'active' : ''} onClick={() => setAuthMode('register')}>
          <UserPlus size={16} />
          Register
        </button>
      </div>

      {status.message && <div className={`inline-notice ${status.type}`}>{status.message}</div>}

      <form onSubmit={onAuth} className="stack">
        {authMode === 'register' && (
          <label>
            Name
            <input
              value={authForm.name}
              onChange={(event) => setAuthForm({ ...authForm, name: event.target.value, role: fixedRole })}
              required
            />
          </label>
        )}
        <label>
          Email
          <input
            type="email"
            value={authForm.email}
            onChange={(event) => setAuthForm({ ...authForm, email: event.target.value, role: fixedRole })}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={authForm.password}
            onChange={(event) => setAuthForm({ ...authForm, password: event.target.value, role: fixedRole })}
            required
          />
        </label>
        <input type="hidden" value={fixedRole} readOnly />
        <button className="primary-button" type="submit" disabled={authSubmitting}>
          {authMode === 'login' ? <LogIn size={18} /> : <UserPlus size={18} />}
          {authSubmitting
            ? authMode === 'login'
              ? 'Logging in...'
              : 'Creating account...'
            : authMode === 'login'
              ? 'Login'
              : `Create ${roleLabel.toLowerCase()} account`}
        </button>
      </form>
    </aside>
  );
}

function PostJobPanel({ editingJobId, jobForm, onCancelEdit, onSaveJob, setJobForm }) {
  return (
    <aside className="panel post-panel">
      <div className="form-title">
        <h2>{editingJobId ? 'Edit job' : 'Post a job'}</h2>
        {editingJobId && (
          <button className="icon-button" onClick={onCancelEdit} title="Cancel edit">
            <X size={18} />
          </button>
        )}
      </div>
      <form className="stack" onSubmit={onSaveJob}>
        <label>
          Title
          <input
            value={jobForm.title}
            onChange={(event) => setJobForm({ ...jobForm, title: event.target.value })}
            required
          />
        </label>
        <label>
          Company
          <input
            value={jobForm.company}
            onChange={(event) => setJobForm({ ...jobForm, company: event.target.value })}
            required
          />
        </label>
        <label>
          Location
          <input
            value={jobForm.location}
            onChange={(event) => setJobForm({ ...jobForm, location: event.target.value })}
            required
          />
        </label>
        <div className="two-columns">
          <label>
            Salary
            <input
              type="number"
              value={jobForm.salary}
              onChange={(event) => setJobForm({ ...jobForm, salary: event.target.value })}
              required
            />
          </label>
          <label>
            Experience
            <input
              type="number"
              value={jobForm.experience_level}
              onChange={(event) => setJobForm({ ...jobForm, experience_level: event.target.value })}
              required
            />
          </label>
        </div>
        <label>
          Skills
          <input
            value={jobForm.skills}
            onChange={(event) => setJobForm({ ...jobForm, skills: event.target.value })}
            required
          />
        </label>
        <label>
          Description
          <textarea
            value={jobForm.description}
            onChange={(event) => setJobForm({ ...jobForm, description: event.target.value })}
            required
          />
        </label>
        <button className="primary-button" type="submit">
          <Plus size={18} />
          {editingJobId ? 'Update job' : 'Post job'}
        </button>
      </form>
    </aside>
  );
}

function JobDetails({ isRecruiter, job, onDeleteJob, onEditJob }) {
  if (!job) {
    return <div className="detail-panel empty-state">Select a job to see details.</div>;
  }

  return (
    <article className="detail-panel">
      <div className="detail-head">
        <div>
          <p className="eyebrow">{job.company}</p>
          <h2>{job.title}</h2>
        </div>
        <BriefcaseBusiness size={26} />
      </div>

      <div className="facts">
        <span>
          <MapPin size={16} />
          {job.location}
        </span>
        <span>
          <CircleDollarSign size={16} />
          {job.salary}
        </span>
        <span>
          <Check size={16} />
          {job.experience_level} years
        </span>
      </div>

      <p className="description">{job.description}</p>
      <div className="skills">{job.skills}</div>

      {isRecruiter && (
        <div className="actions">
          <button onClick={() => onEditJob(job)}>
            <Edit3 size={16} />
            Edit
          </button>
          <button className="danger" onClick={() => onDeleteJob(job.id)}>
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      )}
    </article>
  );
}

createRoot(document.getElementById('root')).render(<App />);
