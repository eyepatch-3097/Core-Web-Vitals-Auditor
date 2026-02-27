import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, Globe, Activity, AlertCircle, CheckCircle2, Loader2, ExternalLink, BarChart3, ChevronRight, Lock, Users, Database, LayoutDashboard, LogOut, FileDown, Zap, Shield, Rocket, ArrowRight, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PageVitals, getLCPSeverity, getINPSeverity, getCLSSeverity, Severity, PageCategory, AdminStats } from './types';

const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: { x: number; y: number; vx: number; vy: number; size: number }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const count = Math.floor((canvas.width * canvas.height) / 15000);
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Connect particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};

const WhyItMattersCarousel = () => {
  const [index, setIndex] = useState(0);
  const items = [
    {
      title: "SEO & Rankings",
      desc: "Google uses Core Web Vitals as a direct ranking factor. Sites that meet the 'Good' threshold see significantly better visibility in search results.",
      icon: <Search className="text-emerald-500" size={32} />
    },
    {
      title: "Conversion Rates",
      desc: "A 1-second delay in mobile load times can impact conversion rates by up to 20%. Speed is directly tied to your bottom line.",
      icon: <Zap className="text-amber-500" size={32} />
    },
    {
      title: "User Retention",
      desc: "53% of mobile site visits are abandoned if pages take longer than 3 seconds to load. Performance keeps users engaged and coming back.",
      icon: <Users className="text-blue-500" size={32} />
    },
    {
      title: "Brand Perception",
      desc: "A fast, stable site conveys professionalism and trust. Visual instability (CLS) frustrates users and damages your brand's credibility.",
      icon: <Shield className="text-purple-500" size={32} />
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex(prev => (prev + 1) % items.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [items.length]);

  return (
    <div className="relative max-w-4xl mx-auto">
      <div className="overflow-hidden rounded-[32px] bg-white/5 border border-white/5 p-6 md:p-12 lg:p-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center text-center"
          >
            <div className="mb-8 p-6 rounded-3xl bg-white/5 border border-white/5">
              {items[index].icon}
            </div>
            <h3 className="text-3xl font-bold mb-6">{items[index].title}</h3>
            <p className="text-xl text-neutral-400 leading-relaxed max-w-2xl">
              {items[index].desc}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
      
      <div className="flex justify-center gap-3 mt-8">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-2 h-2 rounded-full transition-all ${i === index ? 'w-8 bg-white' : 'bg-white/20'}`}
          />
        ))}
      </div>
    </div>
  );
};

const HeroFlowAnimation = () => {
  const personas = [
    { name: "SEO Marketers", icon: <Search size={16} />, top: "-15%", left: "-5%" },
    { name: "Web Managers", icon: <LayoutDashboard size={16} />, top: "105%", left: "5%" },
    { name: "Performance Marketers", icon: <BarChart3 size={16} />, top: "-15%", right: "-5%" },
    { name: "Developers", icon: <Zap size={16} />, top: "105%", right: "5%" },
    { name: "UX Designers", icon: <Activity size={16} />, top: "45%", left: "-15%" },
    { name: "Site Owners", icon: <Shield size={16} />, top: "45%", right: "-15%" },
  ];

  // Tidal wave particles (increased count and randomized delays)
  const [particleCount, setParticleCount] = useState(20);

  useEffect(() => {
    setParticleCount(window.innerWidth < 768 ? 15 : 40);
  }, []);

  return (
    <div className="relative w-full max-w-5xl mx-auto mt-12 mb-12 md:mt-24 md:mb-24 h-[300px] md:h-[400px]">
      <div className="absolute inset-0 scale-[0.5] sm:scale-[0.7] md:scale-100 origin-center transition-transform duration-500">
        {/* Floating Personas (Outside the box) */}
        {personas.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              y: [0, -20, 0],
              x: [0, 10, 0]
            }}
            transition={{ 
              opacity: { delay: 0.5 + i * 0.1 },
              scale: { delay: 0.5 + i * 0.1 },
              y: { duration: 4 + i, repeat: Infinity, ease: "easeInOut" },
              x: { duration: 5 + i, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute z-30 px-6 py-3 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center gap-3 backdrop-blur-md shadow-[0_0_30px_rgba(16,185,129,0.2)]"
            style={{ 
              top: p.top, 
              left: p.left, 
              right: p.right 
            }}
          >
            <div className="text-emerald-400">{p.icon}</div>
            <span className="text-sm font-bold uppercase tracking-widest text-emerald-400 whitespace-nowrap">{p.name}</span>
          </motion.div>
        ))}

        <div className="relative w-full h-full rounded-[40px] bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center">
          {/* Background Glows */}
          <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />

          <div className="relative z-10 w-full flex items-center justify-between px-6 lg:px-16">
            {/* Website Node */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="w-24 h-24 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-2xl">
                <Globe className="text-neutral-400" size={48} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Your Website</span>
            </motion.div>

            {/* Connection Line 1 - Tidal Wave */}
            <div className="flex-1 h-12 relative mx-4">
              {Array.from({ length: particleCount }).map((_, i) => (
                <motion.div 
                  key={i}
                  className="absolute w-1.5 h-1.5 bg-white rounded-full blur-[1px]"
                  style={{ 
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{ 
                    left: ['0%', '100%'],
                    opacity: [0, 1, 0],
                    scale: [0.5, 1.2, 0.5]
                  }}
                  transition={{ 
                    duration: 2 + Math.random() * 2, 
                    repeat: Infinity, 
                    ease: "linear",
                    delay: Math.random() * 3
                  }}
                />
              ))}
            </div>

            {/* Auditor Node */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="w-28 h-28 rounded-3xl bg-white text-black flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.2)]">
                <Activity size={56} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-white">CWV Auditor</span>
            </motion.div>

            {/* Connection Line 2 - Tidal Wave */}
            <div className="flex-1 h-12 relative mx-4">
              {Array.from({ length: particleCount }).map((_, i) => (
                <motion.div 
                  key={i}
                  className="absolute w-1.5 h-1.5 bg-emerald-500 rounded-full blur-[1px]"
                  style={{ 
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{ 
                    left: ['0%', '100%'],
                    opacity: [0, 1, 0],
                    scale: [0.5, 1.2, 0.5]
                  }}
                  transition={{ 
                    duration: 2 + Math.random() * 2, 
                    repeat: Infinity, 
                    ease: "linear",
                    delay: 1.5 + Math.random() * 3
                  }}
                />
              ))}
            </div>

            {/* Metrics Node */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col items-center gap-6"
            >
              <div className="grid grid-cols-1 gap-2">
                {[
                  { label: 'LCP', val: '1.2s', color: 'text-emerald-500' },
                  { label: 'INP', val: '45ms', color: 'text-emerald-500' },
                  { label: 'CLS', val: '0.01', color: 'text-emerald-500' }
                ].map((m, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 + (i * 0.1) }}
                    className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-8 min-w-[140px]"
                  >
                    <span className="text-[10px] font-bold text-neutral-500 uppercase">{m.label}</span>
                    <span className={`text-xs font-bold font-mono ${m.color}`}>{m.val}</span>
                  </motion.div>
                ))}
              </div>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="flex items-center gap-2 text-emerald-500"
              >
                <CheckCircle2 size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Healthy & Fast</span>
              </motion.div>
            </motion.div>
          </div>

          {/* Scanning Line */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent w-1/4 h-full z-0"
            animate={{ left: ['-25%', '100%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [view, setView] = useState<'landing' | 'app'>('landing');
  const [domain, setDomain] = useState('');
  const [email, setEmail] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<PageVitals[]>([]);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [error, setError] = useState<string | null>(null);
  const [emailStatus, setEmailStatus] = useState<{ message: string, type: 'success' | 'info' | 'error' } | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Categorization & Selection
  const [step, setStep] = useState<'input' | 'selection' | 'scanning'>('input');
  const [allPages, setAllPages] = useState<{ url: string, category: PageCategory }[]>([]);
  const [selectedUrls, setSelectedUrls] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<PageCategory[]>(['cms', 'main', 'other']);

  // Admin State
  const [isAdminView, setIsAdminView] = useState(window.location.pathname === '/admin');
  const [adminToken, setAdminToken] = useState<string | null>(localStorage.getItem('adminToken'));
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [adminLoginData, setAdminLoginData] = useState({ email: '', password: '' });

  useEffect(() => {
    const handlePopState = () => setIsAdminView(window.location.pathname === '/admin');
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (isAdminView && adminToken) {
      fetchAdminStats();
    }
  }, [isAdminView, adminToken]);

  const fetchAdminStats = async () => {
    try {
      const res = await fetch('/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAdminStats(data);
      } else {
        setAdminToken(null);
        localStorage.removeItem('adminToken');
      }
    } catch (err) {
      console.error('Failed to fetch admin stats', err);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adminLoginData)
      });
      const data = await res.json();
      if (data.success) {
        setAdminToken(data.token);
        localStorage.setItem('adminToken', data.token);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Login failed');
    }
  };

  const recordAudit = async (pagesCount: number) => {
    try {
      await fetch('/api/record-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain, email, pagesAnalyzed: pagesCount })
      });
    } catch (err) {
      console.error('Failed to record audit', err);
    }
  };

  const sendBatchEmail = async (batchData: PageVitals[], batchIndex: number) => {
    if (!email) return;
    
    try {
      const res = await fetch('/api/export-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, data: batchData, batchIndex })
      });
      const data = await res.json();
      if (data.success) {
        setEmailStatus({ 
          message: `Batch ${batchIndex + 1} sent to ${email}${data.previewUrl ? ` (Preview: ${data.previewUrl})` : ''}`, 
          type: 'success' 
        });
      }
    } catch (err) {
      console.error('Failed to send email batch', err);
      setEmailStatus({ message: `Failed to send batch ${batchIndex + 1}`, type: 'error' });
    }
  };

  const exportFullReport = async () => {
    if (!email) {
      setEmailStatus({ message: 'Please enter an email address to receive the report.', type: 'info' });
      return;
    }
    
    setIsExporting(true);
    try {
      const res = await fetch('/api/export-full-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, data: results.filter(r => r.status === 'success'), domain })
      });
      const data = await res.json();
      if (data.success) {
        setEmailStatus({ 
          message: `Full report (PDF & CSV) sent to ${email}${data.previewUrl ? ` (Preview: ${data.previewUrl})` : ''}`, 
          type: 'success' 
        });
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      console.error('Failed to export full report', err);
      setEmailStatus({ message: `Failed to export report: ${err.message}`, type: 'error' });
    } finally {
      setIsExporting(false);
    }
  };

  const toggleUrlSelection = (url: string) => {
    setSelectedUrls(prev => prev.includes(url) ? prev.filter(u => u !== url) : [...prev, url]);
  };

  const toggleGroupSelection = (urls: string[]) => {
    const allSelected = urls.every(u => selectedUrls.includes(u));
    if (allSelected) {
      setSelectedUrls(prev => prev.filter(u => !urls.includes(u)));
    } else {
      setSelectedUrls(prev => Array.from(new Set([...prev, ...urls])));
    }
  };

  const selectAll = () => {
    setSelectedUrls(allPages.map(p => p.url));
  };

  const deselectAll = () => {
    setSelectedUrls([]);
  };

  const fetchSitemap = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain) return;

    setIsScanning(true);
    setError(null);
    setResults([]);
    setProgress({ current: 0, total: 0 });

    try {
      const sitemapRes = await fetch(`/api/sitemap?domain=${encodeURIComponent(domain)}`);
      if (!sitemapRes.ok) throw new Error('Could not fetch sitemap. Make sure the domain is correct and has a sitemap.xml');
      
      const { urls } = await sitemapRes.json();
      if (!urls || urls.length === 0) throw new Error('No URLs found in sitemap.');

      // Deduplicate
      const uniqueUrls = Array.from(new Map(urls.map((u: any) => [u.url, u])).values()) as { url: string, category: PageCategory }[];
      setAllPages(uniqueUrls);
      setSelectedUrls(uniqueUrls.map(u => u.url)); // Select all by default
      setStep('selection');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsScanning(false);
    }
  };

  const startScan = async () => {
    const filteredPages = allPages.filter(p => selectedUrls.includes(p.url));
    if (filteredPages.length === 0) {
      setError('Please select at least one page to analyze.');
      return;
    }

    setStep('scanning');
    setIsScanning(true);
    setError(null);
    
    const initialResults: PageVitals[] = filteredPages.map(p => ({
      url: p.url,
      category: p.category,
      status: 'pending'
    }));
    setResults(initialResults);
    setProgress({ current: 0, total: filteredPages.length });

    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();

    try {
      for (let i = 0; i < filteredPages.length; i++) {
        if (abortControllerRef.current?.signal.aborted) break;

        const url = filteredPages[i].url;
        setResults(prev => prev.map((item, idx) => idx === i ? { ...item, status: 'loading' } : item));

        try {
          const vitalsRes = await fetch(`/api/vitals?url=${encodeURIComponent(url)}`, {
            signal: abortControllerRef.current.signal
          });
          if (!vitalsRes.ok) throw new Error('Failed to fetch vitals');
          
          const vitalsData = await vitalsRes.json();
          const updatedPage = { ...initialResults[i], ...vitalsData, status: 'success' };
          
          setResults(prev => prev.map((item, idx) => 
            idx === i ? updatedPage : item
          ));

          // Batching logic: every 50 pages
          const currentBatchNumber = Math.floor((i + 1) / 50);
          const isAtBatchEnd = (i + 1) % 50 === 0 || (i + 1) === filteredPages.length;
          
          if (isAtBatchEnd && email) {
            const startIdx = Math.floor(i / 50) * 50;
            setResults(prev => {
              const batchData = prev.slice(startIdx, i + 1);
              sendBatchEmail(batchData, currentBatchNumber);
              return prev;
            });
          }
        } catch (err) {
          setResults(prev => prev.map((item, idx) => 
            idx === i ? { ...item, status: 'error' } : item
          ));
        }
        setProgress(prev => ({ ...prev, current: i + 1 }));
      }
      
      // Record audit in DB
      recordAudit(filteredPages.length);
    } catch (err: any) {
      if (err.name !== 'AbortError') setError(err.message);
    } finally {
      setIsScanning(false);
    }
  };

  const SeverityBadge = ({ severity, label }: { severity: Severity, label: string | number }) => {
    const colors = {
      good: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      'needs-improvement': 'bg-amber-50 text-amber-700 border-amber-200',
      poor: 'bg-red-50 text-red-700 border-red-200'
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono border ${colors[severity]}`}>
        {label}
      </span>
    );
  };

  if (isAdminView) {
    if (!adminToken) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-neutral-100">
            <div className="flex items-center gap-3 mb-8">
              <Lock className="text-black" size={24} />
              <h1 className="text-xl font-bold">Admin Login</h1>
            </div>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-400 uppercase mb-1">Email</label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5"
                  value={adminLoginData.email}
                  onChange={e => setAdminLoginData({ ...adminLoginData, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-400 uppercase mb-1">Password</label>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5"
                  value={adminLoginData.password}
                  onChange={e => setAdminLoginData({ ...adminLoginData, password: e.target.value })}
                />
              </div>
              {error && <p className="text-red-500 text-xs">{error}</p>}
              <button type="submit" className="w-full py-3 bg-black text-white rounded-lg font-bold hover:bg-neutral-800 transition-colors">
                Login
              </button>
            </form>
          </motion.div>
        </div>
      );
    }

    return (
      <div className="min-h-screen max-w-6xl mx-auto px-6 py-12">
        <header className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-3">
            <LayoutDashboard size={24} />
            <h1 className="text-2xl font-medium">Admin Panel</h1>
          </div>
          <button 
            onClick={() => { setAdminToken(null); localStorage.removeItem('adminToken'); }}
            className="flex items-center gap-2 text-neutral-500 hover:text-black transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </header>

        {!adminStats ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
                <div className="flex items-center gap-3 text-neutral-400 mb-2">
                  <Activity size={18} />
                  <span className="text-xs font-bold uppercase tracking-wider">Total Audits</span>
                </div>
                <p className="text-4xl font-medium">{adminStats.totalAudits}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
                <div className="flex items-center gap-3 text-neutral-400 mb-2">
                  <Database size={18} />
                  <span className="text-xs font-bold uppercase tracking-wider">Pages Analyzed</span>
                </div>
                <p className="text-4xl font-medium">{adminStats.totalPagesAnalyzed}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
              <div className="flex items-center gap-3 text-neutral-400 mb-6">
                <Users size={18} />
                <span className="text-xs font-bold uppercase tracking-wider">User Emails</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {adminStats.emails.map((email, i) => (
                  <div key={i} className="px-4 py-2 bg-neutral-50 rounded-lg text-sm text-neutral-600 border border-neutral-100">
                    {email}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (view === 'landing' && !isAdminView) {
    return (
      <div className="min-h-screen bg-[#050505] text-white selection:bg-white selection:text-black overflow-x-hidden">
        <ParticleBackground />
        
        {/* Navigation */}
        <nav className="relative z-10 max-w-7xl mx-auto px-6 py-8 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-black">
              <Activity size={18} />
            </div>
            <span className="font-bold tracking-tight text-xl">CWV Auditor</span>
          </div>
          <div className="flex items-center gap-6">
            <button 
              onClick={() => {
                const el = document.getElementById('metrics');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-sm text-neutral-400 hover:text-white transition-colors hidden md:block"
            >
              Metrics
            </button>
            <button 
              onClick={() => {
                const el = document.getElementById('why-it-matters');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-sm text-neutral-400 hover:text-white transition-colors hidden md:block"
            >
              Why it matters
            </button>
            <button 
              onClick={() => setView('app')}
              className="px-5 py-2 bg-white text-black rounded-full font-medium hover:bg-neutral-200 transition-all text-sm"
            >
              <span className="hidden md:inline">Launch App</span>
              <span className="md:hidden">Launch</span>
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
          <div className="flex flex-col items-center text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl"
            >
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-8"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Next-Gen Web Performance
              </motion.div>
              <h1 className="text-4xl sm:text-6xl lg:text-9xl font-bold leading-[0.85] tracking-tighter mb-10">
                THE ULTIMATE <br />
                <span className="text-neutral-500">HEALTHCHECK.</span>
              </h1>
              <p className="text-xl text-neutral-400 max-w-2xl mx-auto mb-12 leading-relaxed">
                Core Web Vitals are the definitive signal of a healthy website. 
                Our auditor performs a deep diagnostic scan of your entire sitemap 
                to ensure every page is performing at peak efficiency.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button 
                  onClick={() => setView('app')}
                  className="px-10 py-5 bg-white text-black rounded-full font-bold hover:scale-105 transition-transform flex items-center gap-2 group"
                >
                  Start Free Audit
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <div className="flex items-center gap-2 px-8 py-5 border border-white/10 rounded-full text-neutral-400 text-sm">
                  <Shield size={16} />
                  No API Key Required
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <HeroFlowAnimation />
          </motion.div>

          {/* Features Section */}

          {/* Features Section */}
          <section className="mt-40">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Precision Auditing Tools</h2>
              <p className="text-neutral-500 max-w-2xl mx-auto">Everything you need to diagnose and fix web performance issues at scale.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-12">
              {[
                { 
                  icon: <Zap className="text-amber-500" />, 
                  title: "Instant Insights", 
                  desc: "Get real-time feedback on Largest Contentful Paint, Interaction to Next Paint, and Cumulative Layout Shift." 
                },
                { 
                  icon: <Database className="text-blue-500" />, 
                  title: "Sitemap Scanning", 
                  desc: "Automatically discover and categorize every page on your domain. No manual URL entry needed." 
                },
                { 
                  icon: <Rocket className="text-purple-500" />, 
                  title: "Exportable Reports", 
                  desc: "Download detailed PDF and CSV reports with optimization opportunities sent directly to your inbox." 
                }
              ].map((feature, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-white/10 transition-all"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-neutral-500 leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Key Metrics Section */}
          <section id="metrics" className="mt-60">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-8">The Core Three.</h2>
                <p className="text-xl text-neutral-400 mb-12 leading-relaxed">
                  Google's Core Web Vitals focus on three aspects of the user experience—loading, interactivity, and visual stability.
                </p>
                <div className="space-y-8">
                  {[
                    { 
                      title: "Largest Contentful Paint (LCP)", 
                      desc: "Measures loading performance. To provide a good user experience, LCP should occur within 2.5 seconds of when the page first starts loading.",
                      icon: <Activity size={18} className="text-emerald-500" />
                    },
                    { 
                      title: "Interaction to Next Paint (INP)", 
                      desc: "Measures responsiveness. A low INP means the page was consistently able to respond quickly to all or the vast majority of user interactions.",
                      icon: <Zap size={18} className="text-amber-500" />
                    },
                    { 
                      title: "Cumulative Layout Shift (CLS)", 
                      desc: "Measures visual stability. To provide a good user experience, pages should maintain a CLS of 0.1 or less.",
                      icon: <Shield size={18} className="text-blue-500" />
                    }
                  ].map((metric, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex gap-6"
                    >
                      <div className="mt-1">{metric.icon}</div>
                      <div>
                        <h4 className="text-lg font-bold mb-2">{metric.title}</h4>
                        <p className="text-neutral-500 text-sm leading-relaxed">{metric.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-full border border-white/5 flex items-center justify-center p-12">
                  <div className="aspect-square w-full rounded-full border border-white/10 flex items-center justify-center p-12">
                    <div className="aspect-square w-full rounded-full bg-gradient-to-br from-neutral-900 to-black border border-white/20 flex flex-col items-center justify-center text-center p-8">
                      <Activity className="text-emerald-500 mb-4" size={48} />
                      <h3 className="text-2xl font-bold mb-2">Health Score</h3>
                      <p className="text-4xl font-mono font-bold text-emerald-500">A+</p>
                    </div>
                  </div>
                </div>
                {/* Floating metric badges */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute top-0 right-0 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl"
                >
                  <p className="text-[10px] font-bold text-neutral-500 uppercase mb-1">LCP</p>
                  <p className="text-lg font-bold text-emerald-500">1.2s</p>
                </motion.div>
                <motion.div 
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 5, repeat: Infinity }}
                  className="absolute bottom-10 left-0 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl"
                >
                  <p className="text-[10px] font-bold text-neutral-500 uppercase mb-1">CLS</p>
                  <p className="text-lg font-bold text-emerald-500">0.01</p>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Why it Matters Carousel */}
          <section id="why-it-matters" className="mt-60">
            <div className="text-center mb-20">
              <h2 className="text-4xl font-bold tracking-tight mb-4">Why It Matters</h2>
              <p className="text-neutral-500 max-w-2xl mx-auto">Performance isn't just a technical metric—it's a business imperative.</p>
            </div>
            
            <WhyItMattersCarousel />
          </section>

          {/* CTA Section */}
          <section className="mt-60 mb-40">
            <div className="relative rounded-[40px] bg-white p-8 md:p-12 lg:p-24 text-black overflow-hidden group">
              <div className="relative z-10 max-w-2xl">
                <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tighter mb-8 leading-[0.9]">READY TO <br />OPTIMIZE?</h2>
                <p className="text-xl text-neutral-600 mb-12 leading-relaxed">
                  Join thousands of developers and SEO experts using CWV Auditor to build a faster, more stable web.
                </p>
                <button 
                  onClick={() => setView('app')}
                  className="px-10 py-5 bg-black text-white rounded-full font-bold hover:scale-105 transition-transform flex items-center gap-3 group/btn"
                >
                  Launch Your First Audit
                  <ArrowRight size={24} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
              <div className="absolute top-1/2 -translate-y-1/2 -right-20 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                <Activity size={400} />
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="pt-20 pb-10 border-t border-white/5 flex justify-center">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-neutral-600">CWV Auditor</p>
          </footer>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-6xl mx-auto px-6 py-12">
      <header className="mb-12 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-4 cursor-pointer" onClick={() => setView('landing')}>
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white">
              <Activity size={24} />
            </div>
            <h1 className="text-2xl font-medium tracking-tight">CWV Auditor</h1>
          </div>
          <p className="text-neutral-500 max-w-xl">
            Analyze your domain's Core Web Vitals performance across all pages found in the sitemap. 
            Identify critical bottlenecks and optimize your user experience.
          </p>
        </div>
        
        {results.some(r => r.status === 'success') && !isScanning && (
          <button
            onClick={exportFullReport}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            {isExporting ? <Loader2 className="animate-spin" size={16} /> : <FileDown size={16} />}
            Export Full Report
          </button>
        )}
      </header>

      <section className="mb-12">
        {step === 'input' && (
          <form onSubmit={fetchSitemap} className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                <input
                  type="text"
                  placeholder="Enter domain (e.g., example.com)"
                  className="w-full pl-11 pr-4 py-3 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  disabled={isScanning}
                />
              </div>
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                <input
                  type="email"
                  placeholder="Email for CSV reports (optional)"
                  className="w-full pl-11 pr-4 py-3 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isScanning}
                />
              </div>
              <button
                type="submit"
                disabled={isScanning || !domain}
                className="px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-neutral-800 disabled:bg-neutral-200 disabled:cursor-not-allowed transition-all flex items-center gap-2"
              >
                {isScanning ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Activity size={18} />
                    Audit Domain
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {step === 'selection' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium">Sitemap Structure & Selection</h2>
              <div className="flex items-center gap-3">
                <button 
                  onClick={selectAll}
                  className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 hover:text-black transition-colors"
                >
                  Select All
                </button>
                <span className="text-neutral-200">|</span>
                <button 
                  onClick={deselectAll}
                  className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 hover:text-black transition-colors"
                >
                  Deselect All
                </button>
                <div className="ml-4 text-xs text-neutral-400 font-mono">
                  {allPages.length} total pages found
                </div>
              </div>
            </div>

            <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 mb-8 custom-scrollbar">
              {/* Main Pages Section */}
              <div>
                <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <LayoutDashboard size={12} /> Main Pages
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {allPages.filter(p => p.category === 'main').map((page, idx) => {
                    const isPageSelected = selectedUrls.includes(page.url);
                    return (
                      <button
                        key={`${page.url}-${idx}`}
                        onClick={() => toggleUrlSelection(page.url)}
                        className={`p-3 rounded-xl border text-left text-xs transition-all flex justify-between items-center ${
                          isPageSelected ? 'border-black bg-black text-white' : 'border-neutral-100 bg-neutral-50 text-neutral-600 hover:border-neutral-200'
                        }`}
                      >
                        <span className="truncate">
                          {(() => {
                            try {
                              const urlObj = new URL(page.url);
                              return urlObj.pathname === '/' ? '/' : urlObj.pathname;
                            } catch (e) {
                              return page.url;
                            }
                          })()}
                        </span>
                        {isPageSelected && <CheckCircle2 size={14} />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* CMS & Other Sections Grouped by Prefix */}
              {(() => {
                const groups: Record<string, { urls: string[], category: PageCategory }> = {};
                const otherUrls: string[] = [];

                try {
                  allPages.forEach(p => {
                    if (p.category === 'main') return;
                    
                    if (p.category === 'other') {
                      otherUrls.push(p.url);
                    } else {
                      const segments = new URL(p.url).pathname.split('/').filter(Boolean);
                      const prefix = segments.length > 0 ? `/${segments[0]}/` : '/others/';
                      if (!groups[prefix]) groups[prefix] = { urls: [], category: p.category };
                      groups[prefix].urls.push(p.url);
                    }
                  });
                } catch (e) {
                  console.error("Error processing sitemap URLs", e);
                }

                const groupElements = Object.entries(groups).map(([prefix, group]) => (
                  <div key={prefix}>
                    <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Database size={12} /> 
                      {prefix} <span className="lowercase font-normal opacity-60">(CMS)</span>
                    </h3>
                    <button
                      onClick={() => toggleGroupSelection(group.urls)}
                      className={`w-full p-4 rounded-xl border transition-all text-left flex justify-between items-center ${
                        group.urls.every(u => selectedUrls.includes(u)) 
                          ? 'border-black bg-black text-white' 
                          : group.urls.some(u => selectedUrls.includes(u))
                            ? 'border-neutral-400 bg-neutral-100 text-black'
                            : 'border-neutral-100 bg-neutral-50 text-neutral-600 hover:border-neutral-200'
                      }`}
                    >
                      <div>
                        <p className="text-sm font-medium">{group.urls.length} pages in this section</p>
                        <p className="text-[10px] opacity-60 truncate max-w-md">
                          {group.urls.slice(0, 3).map(u => {
                            try { return new URL(u).pathname; } catch(e) { return u; }
                          }).join(', ')}...
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono">
                          {group.urls.filter(u => selectedUrls.includes(u)).length} / {group.urls.length}
                        </span>
                        {group.urls.every(u => selectedUrls.includes(u)) && <CheckCircle2 size={18} />}
                      </div>
                    </button>
                  </div>
                ));

                if (otherUrls.length > 0) {
                  groupElements.push(
                    <div key="others-bucket">
                      <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Globe size={12} /> Others
                      </h3>
                      <button
                        onClick={() => toggleGroupSelection(otherUrls)}
                        className={`w-full p-4 rounded-xl border transition-all text-left flex justify-between items-center ${
                          otherUrls.every(u => selectedUrls.includes(u)) 
                            ? 'border-black bg-black text-white' 
                            : otherUrls.some(u => selectedUrls.includes(u))
                              ? 'border-neutral-400 bg-neutral-100 text-black'
                              : 'border-neutral-100 bg-neutral-50 text-neutral-600 hover:border-neutral-200'
                        }`}
                      >
                        <div>
                          <p className="text-sm font-medium">{otherUrls.length} other pages</p>
                          <p className="text-[10px] opacity-60 truncate max-w-md">
                            {otherUrls.slice(0, 3).map(u => {
                              try { return new URL(u).pathname; } catch(e) { return u; }
                            }).join(', ')}...
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono">
                            {otherUrls.filter(u => selectedUrls.includes(u)).length} / {otherUrls.length}
                          </span>
                          {otherUrls.every(u => selectedUrls.includes(u)) && <CheckCircle2 size={18} />}
                        </div>
                      </button>
                    </div>
                  );
                }

                return groupElements;
              })()}
            </div>

            <div className="flex justify-between items-center pt-6 border-t border-neutral-100">
              <button onClick={() => setStep('input')} className="text-neutral-500 hover:text-black text-sm">Back to Search</button>
              <div className="flex items-center gap-4">
                <span className="text-xs font-mono text-neutral-400">
                  {selectedUrls.length} pages selected
                </span>
                <button 
                  onClick={startScan}
                  disabled={selectedUrls.length === 0}
                  className="px-8 py-3 bg-black text-white rounded-xl font-medium hover:bg-neutral-800 disabled:bg-neutral-200 disabled:cursor-not-allowed transition-all"
                >
                  Analyze Selected Pages
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {emailStatus && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-4 p-3 rounded-lg text-xs flex items-center gap-2 ${
              emailStatus.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
              emailStatus.type === 'error' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-blue-50 text-blue-700 border border-blue-100'
            }`}
          >
            {emailStatus.type === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
            <span className="flex-1">{emailStatus.message}</span>
            <button onClick={() => setEmailStatus(null)} className="opacity-50 hover:opacity-100">×</button>
          </motion.div>
        )}

        {isScanning && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-neutral-500 mb-2">
              <span>Auditing pages...</span>
              <span>{progress.current} / {progress.total}</span>
            </div>
            <div className="h-1 w-full bg-neutral-100 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-black"
                initial={{ width: 0 }}
                animate={{ width: `${(progress.current / progress.total) * 100}%` }}
              />
            </div>
          </div>
        )}

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-700 text-sm"
          >
            <AlertCircle className="shrink-0 mt-0.5" size={18} />
            <p>{error}</p>
          </motion.div>
        )}
      </section>

      <main className="pb-20">
        <div className="hidden md:grid grid-cols-[1fr_120px_120px_120px_100px] gap-4 px-4 py-3 data-grid-header">
          <div>PAGE URL</div>
          <div className="text-center">LCP</div>
          <div className="text-center">INP</div>
          <div className="text-center">CLS</div>
          <div className="text-right">SCORE</div>
        </div>

        <div className="space-y-px md:space-y-0">
          <AnimatePresence mode="popLayout">
            {results.length === 0 && !isScanning && (
              <div className="py-20 text-center text-neutral-400">
                <BarChart3 className="mx-auto mb-4 opacity-20" size={48} />
                <p>No audit data yet. Enter a domain to begin.</p>
              </div>
            )}
            {results.map((page, idx) => (
              <motion.div
                key={`${page.url}-${idx}`}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(idx * 0.05, 1) }}
                className="data-row"
              >
                {/* Desktop View */}
                <div className="hidden md:grid grid-cols-[1fr_120px_120px_120px_100px] gap-4 px-4 py-4 items-center group border-none">
                  <div className="flex items-center gap-3 min-w-0">
                    {page.status === 'loading' && <Loader2 className="animate-spin text-neutral-400 shrink-0" size={16} />}
                    {page.status === 'success' && <CheckCircle2 className="text-emerald-500 shrink-0" size={16} />}
                    {page.status === 'error' && <AlertCircle className="text-red-500 shrink-0" size={16} />}
                    {page.status === 'pending' && <div className="w-4 h-4 rounded-full border-2 border-neutral-100 shrink-0" />}
                    <a 
                      href={page.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm font-medium truncate hover:text-black hover:underline flex items-center gap-1"
                    >
                      {(() => {
                        try {
                          const urlObj = new URL(page.url);
                          return urlObj.pathname === '/' ? urlObj.hostname : urlObj.pathname;
                        } catch (e) {
                          return page.url;
                        }
                      })()}
                      <ExternalLink size={12} className="opacity-0 group-hover:opacity-100" />
                    </a>
                  </div>

                  <div className="text-center">
                    {page.lcp !== undefined ? (
                      <SeverityBadge severity={getLCPSeverity(page.lcp)} label={`${(page.lcp / 1000).toFixed(2)}s`} />
                    ) : (
                      <span className="text-neutral-300">—</span>
                    )}
                  </div>

                  <div className="text-center">
                    {page.inp !== undefined ? (
                      <SeverityBadge severity={getINPSeverity(page.inp)} label={`${page.inp.toFixed(0)}ms`} />
                    ) : (
                      <span className="text-neutral-300">—</span>
                    )}
                  </div>

                  <div className="text-center">
                    {page.cls !== undefined ? (
                      <SeverityBadge severity={getCLSSeverity(page.cls)} label={page.cls.toFixed(3)} />
                    ) : (
                      <span className="text-neutral-300">—</span>
                    )}
                  </div>

                  <div className="text-right font-mono text-xs font-bold">
                    {page.performanceScore !== undefined ? (
                      <span className={
                        page.performanceScore >= 90 ? 'text-emerald-600' :
                        page.performanceScore >= 50 ? 'text-amber-600' : 'text-red-600'
                      }>
                        {Math.round(page.performanceScore)}
                      </span>
                    ) : (
                      <span className="text-neutral-300">—</span>
                    )}
                  </div>
                </div>

                {/* Mobile View */}
                <div className="md:hidden p-4 border-b border-neutral-100 bg-white">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 min-w-0">
                      {page.status === 'loading' && <Loader2 className="animate-spin text-neutral-400 shrink-0" size={14} />}
                      {page.status === 'success' && <CheckCircle2 className="text-emerald-500 shrink-0" size={14} />}
                      {page.status === 'error' && <AlertCircle className="text-red-500 shrink-0" size={14} />}
                      <span className="text-xs font-bold truncate">
                        {(() => {
                          try {
                            const urlObj = new URL(page.url);
                            return urlObj.pathname === '/' ? urlObj.hostname : urlObj.pathname;
                          } catch (e) {
                            return page.url;
                          }
                        })()}
                      </span>
                    </div>
                    {page.performanceScore !== undefined && (
                      <span className={`text-xs font-bold font-mono ${
                        page.performanceScore >= 90 ? 'text-emerald-600' : 
                        page.performanceScore >= 50 ? 'text-amber-600' : 'text-red-600'
                      }`}>
                        {Math.round(page.performanceScore)}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-neutral-50 p-2 rounded-lg">
                      <p className="text-[9px] text-neutral-400 uppercase font-bold mb-1">LCP</p>
                      <p className="text-xs font-bold">
                        {page.lcp !== undefined ? `${(page.lcp / 1000).toFixed(2)}s` : '—'}
                      </p>
                    </div>
                    <div className="bg-neutral-50 p-2 rounded-lg">
                      <p className="text-[9px] text-neutral-400 uppercase font-bold mb-1">INP</p>
                      <p className="text-xs font-bold">
                        {page.inp !== undefined ? `${page.inp.toFixed(0)}ms` : '—'}
                      </p>
                    </div>
                    <div className="bg-neutral-50 p-2 rounded-lg">
                      <p className="text-[9px] text-neutral-400 uppercase font-bold mb-1">CLS</p>
                      <p className="text-xs font-bold">
                        {page.cls !== undefined ? page.cls.toFixed(3) : '—'}
                      </p>
                    </div>
                  </div>
                </div>
                
                {page.insights && page.insights.length > 0 && (
                  <div className="px-4 pb-4 bg-neutral-50/30">
                    <div className="ml-7 space-y-2">
                      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Optimization Opportunities</p>
                      {page.insights.map((insight, iIdx) => (
                        <div key={iIdx} className="text-xs">
                          <span className="font-semibold text-neutral-700">{insight.title}: </span>
                          <span className="text-neutral-500">{insight.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>

      <footer className="mt-20 pt-8 border-t border-neutral-200 flex justify-between items-center text-[10px] uppercase tracking-widest text-neutral-400 font-medium">
        <div>&copy; {new Date().getFullYear()} CWV Auditor Tool</div>
        <div className="flex gap-6">
          <span>Google PageSpeed API</span>
          <span>Sitemap Scanner</span>
        </div>
      </footer>
    </div>
  );
}
