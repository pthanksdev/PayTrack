/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  CreditCard, 
  Search, 
  BookOpen, 
  Activity, 
  Zap, 
  Copy, 
  Check, 
  ChevronDown,
  ExternalLink,
  Terminal as TerminalIcon,
  LayoutDashboard,
  BarChart3,
  Key,
  Users,
  Globe,
  Lock,
  ArrowRight,
  Code2,
  Cpu,
  ArrowLeft,
  Link
} from 'lucide-react';

// --- Types & Constants ---
type Page = 'home' | 'about' | 'docs' | 'guide' | 'auth-docs';

const THEME = {
  bg: '#0a0f1e',
  bgSecondary: '#0d1425',
  cyan: '#00d4ff',
  blue: '#0066ff',
  purple: '#8a2be2',
  success: '#4ade80',
  error: '#f87171',
  text: '#ffffff',
  textMuted: '#a0aec0',
  glass: 'rgba(255, 255, 255, 0.03)',
  glassBorder: 'rgba(0, 212, 255, 0.15)',
};

const StatusBadge = () => (
  <div style={{ 
    display: 'inline-flex', 
    alignItems: 'center', 
    gap: '8px', 
    padding: '4px 12px', 
    borderRadius: '20px', 
    background: 'rgba(74, 222, 128, 0.1)', 
    border: '1px solid rgba(74, 222, 128, 0.2)',
    fontSize: '0.75rem',
    color: THEME.success,
    fontWeight: 600
  }}>
    <span style={{ 
      width: '6px', 
      height: '6px', 
      borderRadius: '50%', 
      background: THEME.success,
      boxShadow: `0 0 8px ${THEME.success}`,
      animation: 'pulse 2s infinite'
    }} />
    API ONLINE
  </div>
);

// --- Helper Components ---

const GlassCard = ({ children, style = {}, ...props }: { children: React.ReactNode; style?: React.CSSProperties; [key: string]: any }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
      style={{
        background: THEME.glass,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: `1px solid ${THEME.glassBorder}`,
        borderRadius: '16px',
        padding: '24px',
        transition: 'all 0.3s ease',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: isHovered ? `0 0 20px rgba(0, 212, 255, 0.3)` : 'none',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const Button = ({ 
  children, 
  variant = 'filled', 
  onClick, 
  style = {} 
}: { 
  children: React.ReactNode; 
  variant?: 'filled' | 'outlined'; 
  onClick?: () => void;
  style?: React.CSSProperties;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const baseStyle: React.CSSProperties = {
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: `2px solid ${THEME.cyan}`,
    textDecoration: 'none',
  };

  const variantStyle: React.CSSProperties = variant === 'filled' 
    ? {
        backgroundColor: THEME.cyan,
        color: THEME.bg,
        boxShadow: isHovered ? `0 0 15px ${THEME.cyan}` : 'none',
      }
    : {
        backgroundColor: 'transparent',
        color: THEME.cyan,
      };

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ ...baseStyle, ...variantStyle, ...style }}
    >
      {children}
    </button>
  );
};

// --- Three.js Background Component ---

const ThreeBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let scene: any, camera: any, renderer: any, particles: any, terrain: any, cubes: any[] = [];
    let mouseX = 0, mouseY = 0;
    let frameId: number;

    const init = () => {
      // @ts-ignore
      const THREE = window.THREE;
      if (!THREE) return;

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 3000);
      camera.position.z = 1000;
      camera.position.y = 200;

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      containerRef.current?.appendChild(renderer.domElement);

      // 1. Dynamic Terrain (Wireframe Landscape)
      const terrainGeometry = new THREE.PlaneGeometry(3000, 3000, 60, 60);
      const terrainMaterial = new THREE.MeshBasicMaterial({
        color: THEME.cyan,
        wireframe: true,
        transparent: true,
        opacity: 0.15,
        blending: THREE.AdditiveBlending
      });
      
      terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);
      terrain.rotation.x = -Math.PI / 2;
      terrain.position.y = -400;
      scene.add(terrain);

      // Initial terrain displacement
      const posAttr = terrain.geometry.attributes.position;
      for (let i = 0; i < posAttr.count; i++) {
        const x = posAttr.getX(i);
        const y = posAttr.getY(i);
        const z = Math.sin(x / 200) * Math.cos(y / 200) * 100;
        posAttr.setZ(i, z);
      }
      posAttr.needsUpdate = true;

      // 2. Floating Data Cubes
      const cubeGeometry = new THREE.BoxGeometry(20, 20, 20);
      const cubeMaterial = new THREE.MeshBasicMaterial({
        color: THEME.blue,
        wireframe: true,
        transparent: true,
        opacity: 0.3
      });

      for (let i = 0; i < 40; i++) {
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.position.set(
          (Math.random() - 0.5) * 2000,
          (Math.random() - 0.5) * 1000,
          (Math.random() - 0.5) * 2000
        );
        cube.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
        cube.userData = {
          rotationSpeed: (Math.random() - 0.5) * 0.02,
          floatSpeed: Math.random() * 0.5 + 0.2
        };
        scene.add(cube);
        cubes.push(cube);
      }

      // 3. Enhanced Particles (Starfield)
      const particleCount = 1000;
      const particleGeometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 3000;
        positions[i + 1] = (Math.random() - 0.5) * 3000;
        positions[i + 2] = (Math.random() - 0.5) * 3000;

        const color = new THREE.Color(i % 2 === 0 ? THEME.cyan : THEME.purple);
        colors[i] = color.r;
        colors[i + 1] = color.g;
        colors[i + 2] = color.b;
      }

      particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const particleMaterial = new THREE.PointsMaterial({
        size: 2,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
      });

      particles = new THREE.Points(particleGeometry, particleMaterial);
      scene.add(particles);

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('resize', onWindowResize);
      animate();
    };

    const onMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX - window.innerWidth / 2) * 0.05;
      mouseY = (event.clientY - window.innerHeight / 2) * 0.05;
    };

    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    const animate = () => {
      if (!renderer) return;
      frameId = requestAnimationFrame(animate);

      const time = Date.now() * 0.001;

      // Animate Terrain
      const posAttr = terrain.geometry.attributes.position;
      for (let i = 0; i < posAttr.count; i++) {
        const x = posAttr.getX(i);
        const y = posAttr.getY(i);
        const z = Math.sin(x / 200 + time) * Math.cos(y / 200 + time) * 80;
        posAttr.setZ(i, z);
      }
      posAttr.needsUpdate = true;
      terrain.rotation.z += 0.001;

      // Animate Cubes
      cubes.forEach(cube => {
        cube.rotation.x += cube.userData.rotationSpeed;
        cube.rotation.y += cube.userData.rotationSpeed;
        cube.position.y += Math.sin(time + cube.position.x) * 0.5;
      });

      // Animate Particles
      particles.rotation.y += 0.0005;
      const particlePositions = particles.geometry.attributes.position.array;
      for (let i = 0; i < particlePositions.length; i += 3) {
        particlePositions[i + 1] -= 0.2;
        if (particlePositions[i + 1] < -1500) particlePositions[i + 1] = 1500;
      }
      particles.geometry.attributes.position.needsUpdate = true;

      // Camera Parallax
      camera.position.x += (mouseX - camera.position.x) * 0.05;
      camera.position.y += (-mouseY + 200 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    if (!(window as any).THREE) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
      script.onload = init;
      document.head.appendChild(script);
    } else {
      init();
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onWindowResize);
      cancelAnimationFrame(frameId);
      if (renderer) {
        renderer.dispose();
        containerRef.current?.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        zIndex: 0, 
        pointerEvents: 'none' 
      }} 
    />
  );
};

// --- Pages ---

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      style={{
        background: 'rgba(255, 255, 255, 0.1)',
        border: 'none',
        borderRadius: '4px',
        padding: '6px',
        cursor: 'pointer',
        color: copied ? THEME.success : THEME.textMuted,
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: '0.7rem'
      }}
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {copied ? 'COPIED' : 'COPY'}
    </button>
  );
};

const LiveTerminal = ({ trigger }: { trigger?: number }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev.slice(-7), msg]);
  };

  useEffect(() => {
    if (trigger) {
      addLog('⚡ MANUAL_TRIGGER: Executing test request...');
      setTimeout(() => addLog('POST /v1/test_ping 200 OK (42ms)'), 500);
    }
  }, [trigger]);

  useEffect(() => {
    const events = [
      'POST /v1/payments/pay_92kL1... 200 OK',
      'WEBHOOK stripe.checkout.completed -> paytrack_worker_1',
      'AUDIT_LOG: User dev@co.com updated role to manager',
      'RATE_LIMIT: IP 192.168.1.45 blocked for 60s',
      'LEDGER_SYNC: Reconciliation complete for batch #882',
      'AUTH: New JWT issued for session_a928x',
      'STRIPE_API: Fetching exchange rates...',
      'WEBHOOK_RETRY: Attempting delivery for event_9x2...',
    ];

    const interval = setInterval(() => {
      addLog(events[Math.floor(Math.random() * events.length)]);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div style={{ 
      background: '#000', 
      borderRadius: '12px', 
      padding: '20px', 
      fontFamily: 'monospace', 
      fontSize: '0.85rem',
      border: `1px solid ${THEME.glassBorder}`,
      boxShadow: 'inset 0 0 20px rgba(0, 212, 255, 0.1)',
      width: '100%',
      maxWidth: '600px',
      height: '200px',
      overflow: 'hidden',
      position: 'relative'
    }}>
      <div style={{ position: 'absolute', top: '10px', right: '15px', color: THEME.cyan, opacity: 0.5, fontSize: '0.7rem' }}>LIVE_FEED</div>
      <div ref={scrollRef} style={{ height: '100%', overflowY: 'auto' }}>
        {logs.map((log, i) => (
          <div key={i} style={{ color: log.includes('200') ? THEME.success : log.includes('RATE_LIMIT') ? THEME.error : THEME.cyan, marginBottom: '4px', opacity: (i + 1) / logs.length }}>
            <span style={{ opacity: 0.5, marginRight: '8px' }}>[{new Date().toLocaleTimeString()}]</span>
            {log}
          </div>
        ))}
        {logs.length === 0 && <div style={{ color: THEME.textMuted }}>Initializing secure stream...</div>}
      </div>
    </div>
  );
};

const Home = ({ setPage }: { setPage: (p: Page) => void }) => {
  const [trigger, setTrigger] = useState(0);

  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      <ThreeBackground />
      
      {/* Hero Section */}
      <section style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        textAlign: 'center',
        padding: '120px 20px 80px',
      }}>
        <div style={{ marginBottom: '24px' }}>
          <StatusBadge />
        </div>
        <h1 style={{ 
          fontSize: 'clamp(3.5rem, 12vw, 6rem)', 
          fontWeight: 900, 
          margin: 0, 
          background: `linear-gradient(135deg, ${THEME.cyan} 0%, ${THEME.blue} 50%, ${THEME.purple} 100%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: 1,
          letterSpacing: '-0.02em'
        }}>
          PayTrack API
        </h1>
        <p style={{ 
          fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)', 
          color: THEME.textMuted, 
          maxWidth: '700px', 
          marginTop: '32px',
          lineHeight: 1.6,
          fontWeight: 400
        }}>
          The infrastructure for mission-critical financial operations. 
          Audit-grade security, real-time reconciliation, and webhook orchestration.
        </p>
        
        <div style={{ marginTop: '48px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '40px' }}>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Button onClick={() => setPage('docs')}>Start Building</Button>
            <Button variant="outlined" onClick={() => setTrigger(t => t + 1)}>
              <TerminalIcon size={18} style={{ marginRight: '8px' }} />
              Test API Ping
            </Button>
          </div>
          
          <LiveTerminal trigger={trigger} />
        </div>
        
        {/* Scroll Indicator */}
        <div style={{ 
          position: 'absolute', 
          bottom: '40px', 
          animation: 'bounce 2s infinite',
          fontSize: '1.5rem',
          color: THEME.cyan,
          opacity: 0.6
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7 13 5 5 5-5M7 6l5 5 5-5"/></svg>
        </div>
      </section>

      {/* Stats Bar */}
      <section style={{ 
        padding: '60px 20px', 
        background: THEME.bgSecondary,
        borderTop: `1px solid ${THEME.glassBorder}`,
        borderBottom: `1px solid ${THEME.glassBorder}`,
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          display: 'flex', 
          justifyContent: 'space-around',
          flexWrap: 'wrap',
          gap: '40px',
          textAlign: 'center'
        }}>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: THEME.cyan }}>99.99%</div>
            <div style={{ color: THEME.textMuted, marginTop: '8px' }}>Uptime SLA</div>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: THEME.cyan }}>&lt;80ms</div>
            <div style={{ color: THEME.textMuted, marginTop: '8px' }}>Avg Latency</div>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: THEME.cyan }}>SOC2-Ready</div>
            <div style={{ color: THEME.textMuted, marginTop: '8px' }}>Audit Logs</div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ padding: '100px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '60px', fontWeight: 800 }}>Core Infrastructure</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '32px' 
        }}>
          <GlassCard>
            <div style={{ color: THEME.cyan, marginBottom: '20px' }}><ShieldCheck size={32} /></div>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '12px', fontWeight: 700 }}>Security Engine</h3>
            <p style={{ color: THEME.textMuted, lineHeight: 1.6, fontSize: '0.95rem' }}>
              JWT authentication, RBAC roles, rate limiting, and automated input sanitization for every request.
            </p>
          </GlassCard>
          <GlassCard>
            <div style={{ color: THEME.cyan, marginBottom: '20px' }}><CreditCard size={32} /></div>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '12px', fontWeight: 700 }}>Payments & Webhooks</h3>
            <p style={{ color: THEME.textMuted, lineHeight: 1.6, fontSize: '0.95rem' }}>
              Native Stripe integration, event queuing, and automatic retry logic for robust payment processing.
            </p>
          </GlassCard>
          <GlassCard>
            <div style={{ color: THEME.cyan, marginBottom: '20px' }}><Search size={32} /></div>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '12px', fontWeight: 700 }}>Audit & Admin</h3>
            <p style={{ color: THEME.textMuted, lineHeight: 1.6, fontSize: '0.95rem' }}>
              Full immutable audit trails, granular admin controls, and compliance-ready data exports.
            </p>
          </GlassCard>
          <GlassCard>
            <div style={{ color: THEME.cyan, marginBottom: '20px' }}><BookOpen size={32} /></div>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '12px', fontWeight: 700 }}>Transaction Ledger</h3>
            <p style={{ color: THEME.textMuted, lineHeight: 1.6, fontSize: '0.95rem' }}>
              Comprehensive invoice management, ledger entries, and automated reconciliation support.
            </p>
          </GlassCard>
          <GlassCard>
            <div style={{ color: THEME.cyan, marginBottom: '20px' }}><Activity size={32} /></div>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '12px', fontWeight: 700 }}>Observability</h3>
            <p style={{ color: THEME.textMuted, lineHeight: 1.6, fontSize: '0.95rem' }}>
              Structured logging, real-time error tracking, and detailed latency metrics for performance monitoring.
            </p>
          </GlassCard>
          <GlassCard>
            <div style={{ color: THEME.cyan, marginBottom: '20px' }}><Globe size={32} /></div>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '12px', fontWeight: 700 }}>Global Scale</h3>
            <p style={{ color: THEME.textMuted, lineHeight: 1.6, fontSize: '0.95rem' }}>
              Multi-currency support, regional compliance handling, and low-latency edge processing.
            </p>
          </GlassCard>
        </div>
      </section>
    </div>
  );
};

const Guide = ({ setPage }: { setPage: (p: Page) => void }) => {
  return (
    <div style={{ padding: '120px 20px', maxWidth: '1000px', margin: '0 auto' }}>
      <button 
        onClick={() => setPage('docs')} 
        style={{ 
          background: 'none', 
          border: 'none', 
          color: THEME.cyan, 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          cursor: 'pointer',
          marginBottom: '32px',
          fontSize: '1rem',
          fontWeight: 600
        }}
      >
        <ArrowLeft size={20} />
        Back to Docs
      </button>
      <h1 style={{ fontSize: '3rem', marginBottom: '24px' }}>Getting Started Guide</h1>
      <p style={{ fontSize: '1.2rem', color: THEME.textMuted, marginBottom: '40px', lineHeight: 1.8 }}>
        This guide will walk you through your first integration with PayTrack API.
      </p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
        <section>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '16px' }}>1. Create an Account</h2>
          <p style={{ color: THEME.textMuted, lineHeight: 1.8 }}>
            Sign up for a developer account to get your API keys. You'll start in the Test environment by default.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '16px' }}>2. Obtain API Keys</h2>
          <p style={{ color: THEME.textMuted, lineHeight: 1.8, marginBottom: '16px' }}>
            Navigate to your settings to find your `pk_test` and `sk_test` keys. Never share your secret keys.
          </p>
          <GlassCard style={{ background: '#000' }}>
            <code style={{ color: THEME.cyan }}>Authorization: Bearer pk_test_your_key_here</code>
          </GlassCard>
        </section>

        <section>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '16px' }}>3. Make Your First Request</h2>
          <p style={{ color: THEME.textMuted, lineHeight: 1.8, marginBottom: '16px' }}>
            Use cURL or any HTTP client to ping our health check endpoint.
          </p>
          <GlassCard style={{ background: '#000' }}>
            <pre style={{ color: THEME.cyan, margin: 0, overflowX: 'auto' }}>{`curl -X GET https://api.paytrack.io/v1/health \\
  -H "Authorization: Bearer YOUR_API_KEY"`}</pre>
          </GlassCard>
        </section>
      </div>
    </div>
  );
};

const AuthDocs = ({ setPage }: { setPage: (p: Page) => void }) => {
  return (
    <div style={{ padding: '120px 20px', maxWidth: '1000px', margin: '0 auto' }}>
      <button 
        onClick={() => setPage('docs')} 
        style={{ 
          background: 'none', 
          border: 'none', 
          color: THEME.cyan, 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          cursor: 'pointer',
          marginBottom: '32px',
          fontSize: '1rem',
          fontWeight: 600
        }}
      >
        <ArrowLeft size={20} />
        Back to Docs
      </button>
      <h1 style={{ fontSize: '3rem', marginBottom: '24px' }}>Authentication Docs</h1>
      <p style={{ fontSize: '1.2rem', color: THEME.textMuted, marginBottom: '40px', lineHeight: 1.8 }}>
        Learn how to securely authenticate your requests to the PayTrack API.
      </p>

      <GlassCard style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Bearer Token Authentication</h2>
        <p style={{ color: THEME.textMuted, lineHeight: 1.8, marginBottom: '24px' }}>
          PayTrack uses JWT-based Bearer tokens for all API requests. You must include your API key in the `Authorization` header of every request.
        </p>
        <div style={{ padding: '16px', background: '#000', borderRadius: '8px', border: `1px solid ${THEME.glassBorder}` }}>
          <code style={{ color: THEME.cyan }}>Authorization: Bearer <span style={{ color: THEME.textMuted }}>&lt;YOUR_API_KEY&gt;</span></code>
        </div>
      </GlassCard>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
        <section>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '12px' }}>Test Mode</h3>
          <p style={{ color: THEME.textMuted, fontSize: '0.95rem', lineHeight: 1.6 }}>
            Use keys starting with `pk_test_` for development. No real transactions will be processed.
          </p>
        </section>
        <section>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '12px' }}>Live Mode</h3>
          <p style={{ color: THEME.textMuted, fontSize: '0.95rem', lineHeight: 1.6 }}>
            Use keys starting with `pk_live_` for production. Ensure your account is fully verified before switching.
          </p>
        </section>
      </div>
    </div>
  );
};

const About = () => {
  const team = [
    { name: 'Alex Rivera', role: 'CEO & Founder', bio: 'Ex-Stripe, FinTech veteran with 15 years experience.', icon: <Cpu size={24} /> },
    { name: 'Sarah Chen', role: 'CTO', bio: 'Distributed systems expert, previously at AWS Infrastructure.', icon: <Code2 size={24} /> },
    { name: 'Marcus Thorne', role: 'Head of Security', bio: 'Cybersecurity researcher focused on immutable ledgers.', icon: <Lock size={24} /> }
  ];

  return (
    <div style={{ padding: '120px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <section style={{ textAlign: 'center', marginBottom: '80px' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '24px' }}>Our Mission</h1>
        <p style={{ fontSize: '1.2rem', color: THEME.textMuted, maxWidth: '800px', margin: '0 auto', lineHeight: 1.8 }}>
          PayTrack API was founded to bridge the gap between complex financial infrastructure and developer experience. 
          We provide the tools necessary to build secure, scalable, and compliant payment systems without the overhead of building from scratch.
        </p>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', marginBottom: '100px' }}>
        <GlassCard style={{ borderLeft: `4px solid ${THEME.cyan}` }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '32px' }}>Core Capabilities</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              "RESTful API v1 with global versioning",
              "Complete payment lifecycle orchestration",
              "RBAC-driven administrative controls"
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: THEME.cyan }}>✅</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <h2 style={{ fontSize: '2rem' }}>Tech Stack</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {['Node.js', 'Express', 'PostgreSQL', 'Redis', 'Stripe', 'JWT', 'Zod'].map((tech) => (
              <span key={tech} style={{ 
                padding: '8px 16px', 
                borderRadius: '20px', 
                background: THEME.bgSecondary, 
                border: `1px solid ${THEME.glassBorder}`,
                color: THEME.cyan,
                fontWeight: 600
              }}>
                {tech}
              </span>
            ))}
          </div>
          <p style={{ color: THEME.textMuted, lineHeight: 1.8 }}>
            Our stack is chosen for maximum reliability and performance. We leverage industry-standard tools to ensure your financial data is always safe and accessible.
          </p>
        </div>
      </div>

      <section>
        <h2 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '60px', fontWeight: 800 }}>Leadership</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
          {team.map((member, i) => (
            <GlassCard key={i} style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '64px', 
                height: '64px', 
                borderRadius: '50%', 
                background: THEME.bgSecondary, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                margin: '0 auto 20px',
                color: THEME.cyan,
                border: `1px solid ${THEME.glassBorder}`
              }}>
                {member.icon}
              </div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '4px' }}>{member.name}</h3>
              <div style={{ color: THEME.cyan, fontSize: '0.9rem', fontWeight: 600, marginBottom: '16px' }}>{member.role}</div>
              <p style={{ color: THEME.textMuted, fontSize: '0.9rem', lineHeight: 1.6 }}>{member.bio}</p>
            </GlassCard>
          ))}
        </div>
      </section>
    </div>
  );
};

const Docs = ({ setPage }: { setPage: (p: Page) => void }) => {
  const [search, setSearch] = useState('');

  const EndpointRow = ({ method, path, desc }: { method: string, path: string, desc: string }) => {
    const methodColors: Record<string, string> = {
      GET: '#4ade80',
      POST: '#60a5fa',
      PATCH: '#fb923c',
      DELETE: '#f87171'
    };

    if (search && !path.toLowerCase().includes(search.toLowerCase()) && !desc.toLowerCase().includes(search.toLowerCase())) return null;

    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        padding: '12px 0', 
        borderBottom: `1px solid rgba(255,255,255,0.1)`,
        gap: '16px',
        flexWrap: 'wrap'
      }}>
        <span style={{ 
          padding: '4px 8px', 
          borderRadius: '4px', 
          fontSize: '0.75rem', 
          fontWeight: 800, 
          background: methodColors[method] || '#ccc',
          color: '#000',
          minWidth: '60px',
          textAlign: 'center'
        }}>
          {method}
        </span>
        <code style={{ fontFamily: 'monospace', color: THEME.cyan, fontSize: '0.9rem' }}>{path}</code>
        <span style={{ color: THEME.textMuted, fontSize: '0.9rem' }}>{desc}</span>
      </div>
    );
  };

  return (
    <div style={{ padding: '120px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h1 style={{ fontSize: '3rem', marginBottom: '12px' }}>Documentation</h1>
          <p style={{ color: THEME.textMuted, fontSize: '1.1rem' }}>
            Welcome to the PayTrack API reference. Use our RESTful endpoints to manage your payment lifecycle.
          </p>
        </div>
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: THEME.textMuted }} />
          <input 
            type="text" 
            placeholder="Search endpoints..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ 
              padding: '10px 16px 10px 40px', 
              background: THEME.bgSecondary, 
              border: `1px solid ${THEME.glassBorder}`, 
              borderRadius: '8px', 
              color: THEME.text,
              width: '250px'
            }} 
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', marginBottom: '60px' }}>
        <GlassCard>
          <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={20} style={{ color: THEME.cyan }} />
            Getting Started
          </h3>
          <p style={{ color: THEME.textMuted, fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '20px' }}>
            Integrate PayTrack in minutes. Follow our quickstart guide to issue your first payment.
          </p>
          <Button variant="outlined" onClick={() => setPage('guide')} style={{ fontSize: '0.8rem', padding: '8px 16px' }}>View Guide</Button>
        </GlassCard>
        <GlassCard>
          <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={20} style={{ color: THEME.success }} />
            Authentication
          </h3>
          <p style={{ color: THEME.textMuted, fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '20px' }}>
            All requests must be authenticated using a Bearer JWT token in the Authorization header.
          </p>
          <Button variant="outlined" onClick={() => setPage('auth-docs')} style={{ fontSize: '0.8rem', padding: '8px 16px' }}>Auth Docs</Button>
        </GlassCard>
        <GlassCard>
          <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen size={20} style={{ color: THEME.blue }} />
            API Reference
          </h3>
          <p style={{ color: THEME.textMuted, fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '20px' }}>
            Explore our comprehensive API reference to understand every endpoint and parameter.
          </p>
          <Button variant="outlined" style={{ fontSize: '0.8rem', padding: '8px 16px' }}>View Reference</Button>
        </GlassCard>
      </div>

      <GlassCard style={{ marginBottom: '60px' }}>
        <h3 style={{ marginBottom: '12px' }}>Base URL</h3>
        <code style={{ 
          display: 'block', 
          padding: '16px', 
          background: '#000', 
          borderRadius: '8px', 
          color: THEME.cyan,
          fontSize: '1.1rem'
        }}>
          https://api.paytrack.io/v1
        </code>
      </GlassCard>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '32px' }}>
        <GlassCard>
          <h2 style={{ marginBottom: '24px' }}>Auth</h2>
          <EndpointRow method="POST" path="/auth/register" desc="Create account" />
          <EndpointRow method="POST" path="/auth/login" desc="Get JWT token" />
          <EndpointRow method="POST" path="/auth/refresh" desc="Refresh access token" />
        </GlassCard>

        <GlassCard>
          <h2 style={{ marginBottom: '24px' }}>Payments</h2>
          <EndpointRow method="GET" path="/payments" desc="List transactions" />
          <EndpointRow method="POST" path="/payments" desc="Initiate payment" />
          <EndpointRow method="GET" path="/payments/:id" desc="Get payment detail" />
          <EndpointRow method="POST" path="/payments/:id/refund" desc="Issue refund" />
        </GlassCard>

        <GlassCard>
          <h2 style={{ marginBottom: '24px' }}>Webhooks</h2>
          <EndpointRow method="POST" path="/webhooks/stripe" desc="Receive Stripe events" />
          <EndpointRow method="GET" path="/webhooks/logs" desc="View delivery history" />
        </GlassCard>

        <GlassCard>
          <h2 style={{ marginBottom: '24px' }}>Admin</h2>
          <EndpointRow method="GET" path="/admin/users" desc="List users" />
          <EndpointRow method="PATCH" path="/admin/users/:id/role" desc="Update role" />
          <EndpointRow method="GET" path="/admin/audit" desc="Audit log" />
        </GlassCard>
      </div>

      <div style={{ marginTop: '60px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ margin: 0 }}>Code Example</h2>
          <CopyButton text={`POST /auth/register\nContent-Type: application/json\n\n{\n  "email": "dev@co.com",\n  "password": "••••••••",\n  "role": "manager"\n}`} />
        </div>
        <pre style={{ 
          background: '#0d1425', 
          padding: '24px', 
          borderRadius: '12px', 
          overflowX: 'auto',
          border: `1px solid ${THEME.glassBorder}`,
          fontSize: '0.9rem',
          lineHeight: 1.5,
          position: 'relative'
        }}>
          <span style={{ color: '#fb923c' }}>POST</span> <span style={{ color: THEME.cyan }}>/auth/register</span>{'\n'}
          <span style={{ color: THEME.textMuted }}>Content-Type: application/json</span>{'\n\n'}
          {'{'}{'\n'}
          {'  '}<span style={{ color: '#4ade80' }}>"email"</span>: <span style={{ color: THEME.cyan }}>"dev@co.com"</span>,{'\n'}
          {'  '}<span style={{ color: '#4ade80' }}>"password"</span>: <span style={{ color: THEME.cyan }}>"••••••••"</span>,{'\n'}
          {'  '}<span style={{ color: '#4ade80' }}>"role"</span>: <span style={{ color: THEME.cyan }}>"manager"</span>{'\n'}
          {'}'}
        </pre>
      </div>
    </div>
  );
};

// --- Main App Component ---

export default function App() {
  const [page, setPage] = useState<Page>('home');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  const navItemStyle = (active: boolean): React.CSSProperties => ({
    cursor: 'pointer',
    color: active ? THEME.cyan : THEME.text,
    fontWeight: active ? 700 : 500,
    transition: 'color 0.3s ease',
    fontSize: '0.95rem',
  });

  return (
    <div style={{ 
      backgroundColor: THEME.bg, 
      color: THEME.text, 
      minHeight: '100vh', 
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      overflowX: 'hidden'
    }}>
      {/* Global Styles */}
      <style>{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
          40% {transform: translateY(-10px);}
          60% {transform: translateY(-5px);}
        }
        @keyframes pulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
          100% { opacity: 1; transform: scale(1); }
        }
        body { margin: 0; padding: 0; background: ${THEME.bg}; }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: ${THEME.bg}; }
        ::-webkit-scrollbar-thumb { background: ${THEME.glassBorder}; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: ${THEME.cyan}; }
      `}</style>

      {/* Navigation */}
      <nav style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100%', 
        padding: '16px 40px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        zIndex: 100,
        background: 'rgba(10, 15, 30, 0.7)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${THEME.glassBorder}`
      }}>
        <div 
          onClick={() => setPage('home')} 
          style={{ fontSize: '1.4rem', fontWeight: 900, cursor: 'pointer', color: THEME.cyan, display: 'flex', alignItems: 'center', gap: '10px' }}
        >
          <span style={{ fontSize: '1.8rem', filter: `drop-shadow(0 0 8px ${THEME.cyan})` }}>⬡</span> 
          <span style={{ letterSpacing: '-0.02em' }}>PayTrack</span>
        </div>
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '24px', marginRight: '16px' }}>
            <span onClick={() => setPage('home')} style={navItemStyle(page === 'home')}>Home</span>
            <span onClick={() => setPage('about')} style={navItemStyle(page === 'about')}>About</span>
            <span onClick={() => setPage('docs')} style={navItemStyle(page === 'docs')}>Docs</span>
          </div>
          <Button variant="outlined" onClick={() => setPage('docs')} style={{ padding: '8px 20px', fontSize: '0.85rem' }}>
            API Keys
          </Button>
        </div>
      </nav>

      {/* Content */}
      <main style={{ minHeight: 'calc(100vh - 200px)' }}>
        {page === 'home' && <Home setPage={setPage} />}
        {page === 'about' && <About />}
        {page === 'docs' && <Docs setPage={setPage} />}
        {page === 'guide' && <Guide setPage={setPage} />}
        {page === 'auth-docs' && <AuthDocs setPage={setPage} />}
      </main>

      {/* Footer */}
      <footer style={{ 
        padding: '60px 40px', 
        background: THEME.bgSecondary, 
        borderTop: `1px solid ${THEME.glassBorder}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '24px'
      }}>
        <div style={{ fontWeight: 700, color: THEME.textMuted }}>
          <span style={{ color: THEME.cyan }}>⬡</span> PayTrack API © 2026
        </div>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {['Node', 'Express', 'PostgreSQL', 'Redis', 'Stripe'].map(tag => (
            <span key={tag} style={{ fontSize: '0.8rem', color: THEME.textMuted, opacity: 0.6 }}>{tag}</span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '24px' }}>
          <span onClick={() => setPage('docs')} style={{ cursor: 'pointer', color: THEME.textMuted }}>Docs</span>
          <Link href="https://github.com/pthanksdev/PayTrack.git" target="_blank" rel="noopener noreferrer">
            <span style={{ cursor: 'pointer', color: THEME.textMuted }}>GitHub</span>
          </Link>
          <span style={{ cursor: 'pointer', color: THEME.textMuted }}>Status</span>
        </div>
      </footer>
    </div>
  );
}
