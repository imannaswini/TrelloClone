import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, LayoutDashboard, Users, Zap, Shield, BarChart3, Workflow, CheckCircle2, Star } from "lucide-react";
import useAuthStore from "../context/AuthStore";
import { Button } from "../components/ui/Button";
import { Skeleton } from "../components/ui/Skeleton";
import { cn } from "../lib/utils";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        scrolled ? "bg-background/80 backdrop-blur-md border-white/10 py-4 shadow-lg" : "bg-transparent border-transparent py-6"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
            <span className="text-white font-bold leading-none">S</span>
          </div>
          <span className="text-white font-heading font-bold text-xl tracking-tight">SPARK</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#workflow" className="hover:text-white transition-colors">Workflow</a>
          <span className="cursor-not-allowed opacity-50 relative group">
            Pricing
            <span className="absolute -top-3 -right-6 text-[9px] bg-accent-500/20 text-accent-400 px-1.5 py-0.5 rounded">Soon</span>
          </span>
          <a href="#about" className="hover:text-white transition-colors">About</a>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors hidden sm:block">
            Sign In
          </Link>
          <Button onClick={() => navigate("/register")} size="sm" className="rounded-full px-5">
            Get Started
          </Button>
        </div>
      </div>
    </motion.nav>
  );
};

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="relative pt-40 pb-20 md:pt-52 md:pb-32 overflow-hidden flex flex-col items-center justify-center min-h-screen text-center px-6">
      {/* Background Blobs */}
      <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-primary-600/20 blur-[120px] rounded-full mix-blend-screen animate-pulse" />
      <div className="absolute top-[30%] right-[20%] w-[400px] h-[400px] bg-accent-600/20 blur-[120px] rounded-full mix-blend-screen animate-pulse" style={{ animationDelay: "2s" }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 max-w-4xl mx-auto"
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-zinc-300 mb-8"
        >
          <span className="flex h-2 w-2 rounded-full bg-accent-500 animate-pulse"></span>
          SPARK 2.0 is now live
        </motion.div>

        <h1 className="text-5xl md:text-7xl font-heading font-extrabold text-white tracking-tight leading-[1.1] mb-6">
          Manage Projects. <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-accent-400 to-primary-400 bg-300% animate-gradient">
            Track Progress.
          </span> <br className="hidden md:block" />
          Deliver Faster.
        </h1>

        <p className="text-lg md:text-xl text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          Modern project management platform for teams, developers, and organizations. 
          Streamline your workflow with intelligent boards and real-time analytics.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button onClick={() => navigate("/register")} size="lg" className="w-full sm:w-auto rounded-full px-8 h-14 text-base">
            Start Building Free <ArrowRight size={18} className="ml-2" />
          </Button>
          <Button variant="secondary" size="lg" className="w-full sm:w-auto rounded-full px-8 h-14 text-base glass-panel bg-white/5 hover:bg-white/10 border-white/10">
            Book a Demo
          </Button>
        </div>
      </motion.div>
    </section>
  );
};

const ProductPreview = () => {
  return (
    <section className="py-20 relative z-10 px-6">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto relative"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/30 to-accent-500/30 blur-2xl rounded-[2.5rem] opacity-50" />
        <div className="glass-panel p-2 md:p-4 rounded-[2rem] border border-white/10 shadow-2xl relative bg-[#0B1120]/80 backdrop-blur-xl overflow-hidden">
           {/* Mockup Header */}
           <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 mb-4">
             <div className="flex gap-1.5">
               <div className="w-3 h-3 rounded-full bg-red-500/80" />
               <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
               <div className="w-3 h-3 rounded-full bg-green-500/80" />
             </div>
             <div className="mx-auto bg-white/5 px-3 py-1 rounded text-xs text-zinc-500 font-mono">spark.app/dashboard</div>
           </div>
           
           {/* Mockup Content */}
           <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
              <div className="hidden md:flex flex-col gap-2 border-r border-white/5 pr-4">
                <Skeleton className="h-8 w-3/4 rounded" />
                <Skeleton className="h-4 w-1/2 rounded mt-4" />
                <Skeleton className="h-4 w-2/3 rounded" />
                <Skeleton className="h-4 w-1/2 rounded" />
              </div>
              <div className="md:col-span-3 grid grid-cols-3 gap-4">
                <div className="col-span-3 grid grid-cols-3 gap-4 mb-4">
                  <Skeleton className="h-24 rounded-xl border border-white/5 bg-white/5" />
                  <Skeleton className="h-24 rounded-xl border border-white/5 bg-white/5" />
                  <Skeleton className="h-24 rounded-xl border border-white/5 bg-white/5" />
                </div>
                <div className="col-span-1 space-y-3">
                  <div className="h-2 w-20 bg-zinc-700 rounded" />
                  <Skeleton className="h-20 rounded-lg bg-primary-500/20 border border-primary-500/30" />
                  <Skeleton className="h-32 rounded-lg bg-white/5" />
                </div>
                <div className="col-span-1 space-y-3">
                  <div className="h-2 w-20 bg-zinc-700 rounded" />
                  <Skeleton className="h-24 rounded-lg bg-accent-500/20 border border-accent-500/30" />
                </div>
                <div className="col-span-1 space-y-3">
                  <div className="h-2 w-20 bg-zinc-700 rounded" />
                  <Skeleton className="h-16 rounded-lg bg-white/5" />
                  <Skeleton className="h-20 rounded-lg bg-white/5" />
                </div>
              </div>
           </div>
        </div>
      </motion.div>
    </section>
  );
};

const Features = () => {
  const features = [
    { icon: LayoutDashboard, title: "Project Management", desc: "Organize boards, lists, and cards with intuitive drag-and-drop interfaces." },
    { icon: Users, title: "Team Collaboration", desc: "Work together in real-time. Assign tasks, leave comments, and share files seamlessly." },
    { icon: Zap, title: "Task Tracking", desc: "Monitor progress with priority badges, due dates, and visual status indicators." },
    { icon: BarChart3, title: "Analytics Preview", desc: "Gain insights into team velocity and project bottlenecks with rich visualizations." },
    { icon: Shield, title: "Secure Access", desc: "Enterprise-grade security with role-based access control and strict permissions." },
    { icon: Workflow, title: "Role Based Workflows", desc: "Distinct capabilities for Admins and Members to ensure operational integrity." },
  ];

  return (
    <section id="features" className="py-24 px-6 max-w-7xl mx-auto relative">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Everything you need. <span className="text-zinc-500">Nothing you don't.</span></h2>
        <p className="text-zinc-400 max-w-2xl mx-auto text-lg">A carefully curated suite of tools designed to get out of your way and let you focus on shipping.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass-panel p-8 rounded-2xl border border-white/5 hover:border-primary-500/30 transition-colors group"
          >
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary-500/20 transition-all">
              <f.icon className="text-primary-400" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">{f.title}</h3>
            <p className="text-zinc-400 leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const Stats = () => {
  const stats = [
    { value: "10k+", label: "Active Projects" },
    { value: "2M+", label: "Tasks Completed" },
    { value: "99.9%", label: "Uptime" },
    { value: "50+", label: "Integrations" },
  ];

  return (
    <section className="py-20 border-y border-white/5 bg-white/[0.02]">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/5">
        {stats.map((s, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-center px-4"
          >
            <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-500 mb-2">{s.value}</div>
            <div className="text-zinc-400 font-medium tracking-wide text-sm uppercase">{s.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const Testimonials = () => {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto text-center">
      <h2 className="text-3xl font-bold text-white mb-16">Trusted by innovative teams</h2>
      <div className="flex flex-wrap justify-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
         {/* Placeholder logos */}
         <div className="text-2xl font-bold font-serif">ACME Corp</div>
         <div className="text-2xl font-bold font-mono tracking-tighter">GLOBEX</div>
         <div className="text-2xl font-bold flex items-center gap-1"><Zap size={24}/> STARK</div>
         <div className="text-2xl font-bold uppercase tracking-widest">Initech</div>
      </div>
    </section>
  );
};

const CTA = () => {
  const navigate = useNavigate();
  return (
    <section className="py-32 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary-600/10" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[300px] bg-primary-500/30 blur-[100px] rounded-full pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto text-center relative z-10"
      >
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">Ready to organize your workflow?</h2>
        <p className="text-xl text-zinc-400 mb-10">Join thousands of teams already using SPARK to deliver their best work.</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button onClick={() => navigate("/register")} size="lg" className="rounded-full px-8 h-14">
            Sign Up for Free
          </Button>
          <Button variant="secondary" onClick={() => navigate("/login")} size="lg" className="rounded-full px-8 h-14 glass-panel bg-white/5">
            Log In to Account
          </Button>
        </div>
      </motion.div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-background pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-primary-500 flex items-center justify-center">
            <span className="text-white font-bold text-xs">S</span>
          </div>
          <span className="text-white font-bold tracking-tight">SPARK</span>
        </div>
        
        <div className="flex items-center gap-6 text-sm text-zinc-500">
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
          <a href="#" className="hover:text-white transition-colors">Twitter</a>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-8 text-center md:text-left text-xs text-zinc-600">
        &copy; {new Date().getFullYear()} SPARK Inc. All rights reserved.
      </div>
    </footer>
  );
};

export default function Home() {
  const navigate = useNavigate();
  const { token, user } = useAuthStore();

  useEffect(() => {
    if (token && user?.role) {
      navigate(user.role === "admin" ? "/admin" : "/member");
    }
  }, [token, user, navigate]);

  return (
    <div className="min-h-screen bg-background text-zinc-50 font-sans selection:bg-primary-500/30">
      <Navbar />
      <main>
        <Hero />
        <ProductPreview />
        <Testimonials />
        <Features />
        <Stats />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
