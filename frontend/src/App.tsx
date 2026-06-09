```jsx
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

const BASE = window.__BACKEND_URL__ || '';

async function apiFetch(path, opts = {}) {
  for (let i = 0; i < 5; i++) {
    try {
      const r = await fetch(BASE + path, opts);
      if (r.ok) return r.json();
    } catch (_) {}
    await new Promise(r => setTimeout(r, 1500));
  }
  return null;
}

function LandingPage({ onSignup, onLogin }) {
  const [showLogin, setShowLogin] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password || (!showLogin && !name)) {
      setError('All fields required');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setError('');
    if (showLogin) {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
        onLogin({ name: user.name, email: user.email, plan: 'free', joinedAt: user.joinedAt });
      } else {
        setError('Invalid credentials');
      }
    } else {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      if (users.find(u => u.email === email)) {
        setError('Email already registered');
        return;
      }
      const newUser = { name, email, password, plan: 'free', joinedAt: Date.now() };
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      onSignup({ name, email, plan: 'free', joinedAt: Date.now() });
      setToast('Account created! Welcome to TalentPipe.');
    }
  };

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = ':root { --accent: #00C9A7; --accent2: #1E3A5F; }';
      document.head.appendChild(style);
    return () => style.remove();
  }, []);

  const features = [
    { icon: '🔍', title: 'Auto-Screen Resumes', desc: 'AI instantly matches candidate resumes against your job requirements, flagging top fits in seconds.' },
    { icon: '📅', title: 'Calendar Interview Scheduling', desc: 'Sync with Google/Outlook calendars to auto-schedule interviews at mutually available times.' },
    { icon: '👥', title: 'Full Pipeline Tracking', desc: 'Visual kanban board tracks candidates from application through offer, with drag-and-drop simplicity.' }
  ];

  const pricingTiers = [
    { name: 'Pay-per-hire', price: '$299', desc: 'per successful placement', details: 'Pay only when you hire. No monthly fees. Perfect for companies hiring 1-5 roles per month.', cta: 'Start Hiring' },
    { name: 'Unlimited', price: '$199', desc: 'per month', details: 'Flat monthly fee for unlimited active roles. Best for high-volume recruiting.', cta: 'Go Unlimited', featured: true }
  ];

  return (
    <div style={{ minHeight: '100vh', padding: '0 24px', maxWidth: 1280, margin: '0 auto' }}>
      {toast && <div className="toast">{toast}</div>}
      
      {/* Navbar */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #00B4D8, #1E3A5F)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 18, color: 'white' }}>TP</div>
          <span style={{ fontWeight: 700, fontSize: 20, color: 'white' }}>TalentPipe</span>
        </div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <a href="#features" style={{ color: '#8899aa', textDecoration: 'none', fontSize: 14 }}>Features</a>
          <a href="#pricing" style={{ color: '#8899aa', textDecoration: 'none', fontSize: 14 }}>Pricing</a>
          <button className="btn-secondary" style={{ padding: '8px 20px', fontSize: 14 }} onClick={() => { setShowLogin(true); setError(''); }}>Log In</button>
          <button className="btn-primary" style={{ padding: '8px 20px', fontSize: 14 }} onClick={() => { setShowLogin(false); setError(''); }}>Sign Up</button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '80px 0', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 800, lineHeight: 1.1, margin: '0 0 24px' }}>
          Cut your time-to-hire from{' '}
          <span style={{ color: '#ff6b6b' }}>45 days</span> to{' '}
          <span className="gradient-text" style={{ background: 'linear-gradient(135deg, #00B4D8, #48dbfb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>12 days</span>
          <br />with AI-powered recruiting
        </h1>
        <p style={{ fontSize: 20, color: '#8899aa', maxWidth: 600, margin: '0 auto 40px', lineHeight: 1.6 }}>
          TalentPipe automates resume screening, interview scheduling, and pipeline management so your startup hires faster.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn-primary" onClick={() => { document.getElementById('signup-form')?.scrollIntoView({ behavior: 'smooth' }); setShowLogin(false); }}>Get Started Free</button>
          <button className="btn-secondary" onClick={() => { document.getElementById('signup-form')?.scrollIntoView({ behavior: 'smooth' }); setShowLogin(true); }}>See Demo</button>
        </div>
      </section>

      {/* Hero Stats */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, margin: '60px 0' }}>
        <div className="stat-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 36, fontWeight: 800, color: '#ff6b6b' }}>45</div>
          <div style={{ fontSize: 14, color: '#8899aa', marginTop: 8 }}>Days to hire without TalentPipe</div>
        </div>
        <div className="stat-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 36, fontWeight: 800, color: '#00B4D8' }}>12</div>
          <div style={{ fontSize: 14, color: '#8899aa', marginTop: 8 }}>Days to hire with TalentPipe</div>
        </div>
        <div className="stat-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 36, fontWeight: 800, color: '#48dbfb' }}>$299</div>
          <div style={{ fontSize: 14, color: '#8899aa', marginTop: 8 }}>Per successful placement cost</div>
        </div>
        <div className="stat-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 36, fontWeight: 800, color: '#00B4D8' }}>73%</div>
          <div style={{ fontSize: 14, color: '#8899aa', marginTop: 8 }}>Faster time-to-hire reduction</div>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: '60px 0' }}>
        <h2 style={{ fontSize: 32, fontWeight: 700, textAlign: 'center', marginBottom: 48 }}>Everything you need to hire faster</h2>
        <div className="feature-grid">
          {features.map((f, i) => (
            <div key={i} className="pricing-card" style={{ padding: 32 }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>{f.icon}</div>
              <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>{f.title}</h3>
              <p style={{ color: '#8899aa', lineHeight: 1.6, fontSize: 14 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ padding: '60px 0' }}>
        <h2 style={{ fontSize: 32, fontWeight: 700, textAlign: 'center', marginBottom: 48 }}>Simple, transparent pricing</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32, maxWidth: 800, margin: '0 auto' }}>
          {pricingTiers.map((tier, i) => (
            <div key={i} className={'pricing-card' + (tier.featured ? ' featured' : '')} style={{ position: 'relative' }}>
              {tier.featured && <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#00B4D8', color: 'white', padding: '4px 16px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>MOST POPULAR</div>}
              <div style={{ fontSize: 14, color: '#8899aa', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>{tier.name}</div>
              <div style={{ fontSize: 48, fontWeight: 800, color: 'white', marginBottom: 4 }}>{tier.price}</div>
              <div style={{ fontSize: 16, color: '#8899aa', marginBottom: 24 }}>{tier.desc}</div>
              <p style={{ color: '#8899aa', fontSize: 14, lineHeight: 1.6, marginBottom: 32 }}>{tier.details}</p>
              <button className={tier.featured ? 'btn-primary' : 'btn-secondary'} style={{ width: '100%' }}>{tier.cta}</button>
            </div>
          ))}
        </div>
      </section>

      {/* Signup Form */}
      <section id="signup-form" style={{ padding: '80px 0', textAlign: 'center' }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>Ready to cut your time-to-hire?</h2>
        <p style={{ color: '#8899aa', marginBottom: 40, fontSize: 16 }}>Join thousands of startups using TalentPipe to hire in 12 days.</p>
        <form onSubmit={handleSubmit} style={{ maxWidth: 420, margin: '0 auto' }}>
          {!showLogin && (
            <div style={{ marginBottom: 16 }}>
              <input className="input-field" type="text" placeholder="Full name" value={name} onChange={e => setName(e.target.value)} />
            </div>
          )}
          <div style={{ marginBottom: 16 }}>
            <input className="input-field" type="email" placeholder="Work email" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <input className="input-field" type="password" placeholder="Password (min 6 characters)" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          {error && <div style={{ color: '#ff6b6b', fontSize: 14, marginBottom: 16 }}>{error}</div>}
          <button className="btn-primary" type="submit" style={{ width: '100%' }}>
            {showLogin ? 'Log In' : 'Start Free'}
          </button>
          <p style={{ color: '#8899aa', fontSize: 14, marginTop: 16 }}>
            {showLogin ? "Don't have an account? " : "Already have an account? "}
            <span style={{ color: '#00B4D8', cursor: 'pointer' }} onClick={() => { setShowLogin(!showLogin); setError(''); }}>
              {showLogin ? 'Sign Up' : 'Log In'}
            </span>
          </p>
        </form>
      </section>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '40px 0', borderTop: '1px solid rgba(0,180,216,0.1)', color: '#556677', fontSize: 14 }}>
        &copy; 2024 TalentPipe. AI-powered recruiting for startups.
      </footer>
    </div>
  );
}

function ProductApp({ user, onLogout }) {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [metrics, setMetrics] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [sortField, setSortField] = useState('date');
  const [sortDir, setSortDir] = useState('desc');
  const [showForm, setShowForm] = useState(false);
  const [roleName, setRoleName] = useState('');
  const [roleDesc, setRoleDesc] = useState('');
  const [toast, setToast] = useState(null);
  const [isFirstLogin, setIsFirstLogin] = useState(!localStorage.getItem('tp_welcomed'));
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError(false);
    const [metricsData, chartD, activityD] = await Promise.all([
      apiFetch('/api/metrics'),
      apiFetch('/api/chart-data'),
      apiFetch('/api/recent-activity')
    ]);
    if (metricsData && chartD && activityD) {
      setMetrics(metricsData);
      setChartData(chartD || []);
      setActivity(activityD || []);
    } else {
      setError(true);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `

      * { font-family: 'Inter', sans-serif; box-sizing: border-box; }
      body { margin: 0; background: #0a0e17; color: #e0e6ed; }
      .sidebar-item { display: flex; align-items: center; gap: 12px; padding: 12px 20px; border-radius: 12px; cursor: pointer; transition: all 0.2s; color: #8899aa; }
      .sidebar-item:hover { background: rgba(0, 180, 216, 0.08); color: #e0e6ed; }
      .sidebar-item.active { background: rgba(0, 180, 216, 0.12); color: #00B4D8; }
      .card { background: rgba(30, 58, 95, 0.15); border: 1px solid rgba(0, 180, 216, 0.08); border-radius: 16px; padding: 24px; }
      .table-header { display: flex; align-items: center; gap: 8px; cursor: pointer; padding: 12px 16px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #8899aa; transition: color 0.2s; }
      .table-header:hover { color: #00B4D8; }
      .table-row { display: grid; padding: 14px 16px; border-bottom: 1px solid rgba(0, 180, 216, 0.05); transition: background 0.2s; font-size: 14px; }
      .table-row:hover { background: rgba(0, 180, 216, 0.03); }
      .btn-icon { background: transparent; border: none; color: #8899aa; cursor: pointer; padding: 8px; border-radius: 8px; transition: all 0.2s; }
      .btn-icon:hover { background: rgba(0, 180, 216, 0.1); color: #00B4D8; }
      .badge { padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; }
      .badge-free { background: rgba(0, 180, 216, 0.1); color: #00B4D8; }
      .badge-pro { background: rgba(255, 215, 0, 0.1); color: #ffd700; }
      .toast { position: fixed; top: 24px; right: 24px; background: linear-gradient(135deg, #00B4D8, #1E3A5F); color: white; padding: 16px 24px; border-radius: 12px; z-index: 1000; animation: slideIn 0.3s ease; }
      @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      @media (max-width: 768px) { .sidebar-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 50; } }
      .chart-line { fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
      .chart-area { fill: url(#gradient); opacity: 0.3; }
    `;
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  useEffect(() => {
    if (isFirstLogin) {
      localStorage.setItem('tp_welcomed', 'true');
      const timer = setTimeout(() => setIsFirstLogin(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isFirstLogin]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const sortedActivity = useMemo(() => {
    const data = activity || [];
    return [...data].sort((a, b) => {
      let valA, valB;
      if (sortField === 'date') {
        valA = new Date(a.date || 0).getTime();
        valB = new Date(b.date || 0).getTime();
      } else if (sortField === 'candidate') {
        valA = (a.candidate || '').toLowerCase();
        valB = (b.candidate || '').toLowerCase();
      } else if (sortField === 'status') {
        valA = (a.status || '').toLowerCase();
        valB = (b.status || '').toLowerCase();
      } else if (sortField === 'role') {
        valA = (a.role || '').toLowerCase();
        valB = (b.role || '').toLowerCase();
      } else {
        return 0;
      }
      if (typeof valA === 'string') {
        return sortDir === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortDir === 'asc' ? valA - valB : valB - valA;
    });
  }, [activity, sortField, sortDir]);

  const handleAddRole = async (e) => {
    e.preventDefault();
    if (!roleName || !roleDesc) return;
    const result = await apiFetch('/api/roles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: roleName, description: roleDesc, createdAt: new Date().toISOString() })
    });
    if (result) {
      setToast(`Role "${roleName}" created successfully`);
      setRoleName('');
      setRoleDesc('');
      setShowForm(false);
      fetchAllData();
    } else {
      setToast('Failed to create role. Please try again.');
    }
  };

  const statusColors = {
    'Screening': '#ffd700',
    'Interview': '#00B4D8',
    'Offer': '#4caf50',
    'Rejected': '#ff6b6b',
    'Pending': '#8899aa'
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'candidates', label: 'Candidates', icon: '👥' },
    { id: 'roles', label: 'Open Roles', icon: '💼' },
    { id: 'interviews', label: 'Interviews', icon: '📅' },
    { id: 'analytics', label: 'Analytics', icon: '📈' }
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', border: '3px solid rgba(0,180,216,0.1)', borderTopColor: '#00B4D8', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div>
          <div style={{ color: '#8899aa' }}>Loading your dashboard...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
          <h2 style={{ margin: '0 0 8px' }}>Connection Error</h2>
          <p style={{ color: '#8899aa', marginBottom: 24 }}>Failed to load dashboard data</p>
          <button className="btn-primary" style={{ padding: '10px 24px' }} onClick={fetchAllData}>Retry</button>
        </div>
      </div>
    );
  }

  const areaChartId = 'area-chart-gradient';

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {toast && <div className="toast">{toast}</div>}
      {isFirstLogin && (
        <div style={{ position: 'fixed', top: 80, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #00B4D8, #1E3A5F)', color: 'white', padding: '16px 32px', borderRadius: 16, zIndex: 100, boxShadow: '0 10px 40px rgba(0,180,216,0.3)', animation: 'slideIn 0.3s ease' }}>
          🎉 Welcome, {user.name}! Your account is ready.
        </div>
      )}

      {/* Sidebar Overlay for mobile */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside style={{
        width: 260,
        background: 'rgba(30, 58, 95, 0.08)',
        borderRight: '1px solid rgba(0, 180, 216, 0.05)',
        padding: '24px 12px',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 60,
        transform: 'translateX(' + (sidebarOpen ? '0' : '-100%') + ')',
        transition: 'transform 0.3s ease'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40, padding: '0 12px' }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #00B4D8, #1E3A5F)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16, color: 'white' }}>TP</div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 16 }}>TalentPipe</div>
            <div style={{ fontSize: 11, color: '#8899aa' }}>Recruiting Platform</div>
          </div>
        </div>

        {navItems.map(item => (
          <div
            key={item.id}
            className={'sidebar-item' + (activeSection === item.id ? ' active' : '')}
            onClick={() => { setActiveSection(item.id); setSidebarOpen(false); }}
          >
            <span style={{ fontSize: 18 }}>{item.icon}</span>
            <span style={{ fontSize: 14, fontWeight: 500 }}>{item.label}</span>
          </div>
        ))}

        <div style={{ flex: 1 }} />
        <div style={{ padding: '12px', borderTop: '1px solid rgba(0,180,216,0.05)', fontSize: 12, color: '#556677' }}>
          v2.4.1 · AI Recruiting Engine
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, marginLeft: 260, padding: '20px 32px 40px', maxWidth: 'calc(100vw - 260px)' }}>
        {/* Top Navbar */}
        <nav style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 32,
          paddingBottom: 20,
          borderBottom: '1px solid rgba(0, 180, 216, 0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button className="btn-icon" style={{ display: 'none' }} onClick={() => setSidebarOpen(true)}>☰</button>
            <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, textTransform: 'capitalize' }}>{activeSection === 'dashboard' ? 'Dashboard' : activeSection}</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ position: 'relative' }}>
              <button className="btn-icon">🔔</button>
              <span style={{ position: 'absolute', top: 0, right: 0, width: 8, height: 8, borderRadius: '50%', background: '#ff6b6b' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #00B4D8, #1E3A5F)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600, color: 'white' }}>
                {(user.name || 'U').charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{user.email}</div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 2 }}>
                  <span className={'badge ' + (user.plan === 'pro' ? 'badge-pro' : 'badge-free')}>{user.plan || 'free'}</span>
                  <button onClick={() => { localStorage.removeItem('nc_user'); onLogout(); }} style={{ background: 'transparent', border: 'none', color: '#ff6b6b', fontSize: 12, cursor: 'pointer', padding: 2 }}>Logout</button>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Dashboard */}
        <div style={{ position: 'relative' }}>
          {/* Mobile sidebar toggle */}
          <button
            onClick={() => setSidebarOpen(true)}
            style={{ display: sidebarOpen ? 'none' : 'block', background: 'rgba(0,180,216,0.1)', border: '1px solid rgba(0,180,216,0.2)', color: '#00B4D8', padding: '8px 16px', borderRadius: 8, marginBottom: 16, fontSize: 14, cursor: 'pointer' }}
            className="mobile-menu-btn"
          >
            ☰ Menu
          </button>

          {/* KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 32 }}>
            <div className="card">
              <div style={{ fontSize: 13, color: '#8899aa', marginBottom: 8 }}>Active Candidates</div>
              <div style={{ fontSize: 32, fontWeight: 700, color: 'white' }}>{metrics?.activeCandidates ?? 0}</div>
              <div style={{ fontSize: 12, color: '#4caf50', marginTop: 4 }}>+{metrics?.candidatesGrowth ?? 0}% this week</div>
            </div>
            <div className="card">
              <div style={{ fontSize: 13, color: '#8899aa', marginBottom: 8 }}>Open Roles</div>
              <div style={{ fontSize: 32, fontWeight: 700, color: 'white' }}>{metrics?.openRoles ?? 0}</div>
              <div style={{ fontSize: 12, color: '#00B4D8', marginTop: 4 }}>{metrics?.rolesGrowth ?? 0} new this month</div>
            </div>
            <div className="card">
              <div style={{ fontSize: 13, color: '#8899aa', marginBottom: 8 }}>Interviews Scheduled</div>
              <div style={{ fontSize: 32, fontWeight: 700, color: 'white' }}>{metrics?.interviewsScheduled ?? 0}</div>
              <div style={{ fontSize: 12, color: '#ffd700', marginTop: 4 }}>{metrics?.interviewsThisWeek ?? 0} this week</