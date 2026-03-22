'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Shield, Zap, Stethoscope, Wifi, WifiOff, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [serverStatus, setServerStatus] = useState<'loading' | 'online' | 'offline'>('loading');

  useEffect(() => {
    const checkServer = async () => {
      try {
        await axios.get('http://127.0.0.1:8000/health', { timeout: 3000 });
        setServerStatus('online');
      } catch (err) {
        setServerStatus('offline');
      }
    };
    checkServer();
  }, []);

  return (
    <main className="pt-24 pb-12">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Status Indicator */}
          <div className="mb-8 flex justify-center">
            <div className={`px-4 py-2 rounded-full border flex items-center gap-2 text-sm font-medium ${
              serverStatus === 'online' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
              serverStatus === 'offline' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
              'bg-blue-500/10 border-blue-500/20 text-blue-400'
            }`}>
              {serverStatus === 'loading' ? <Loader2 size={16} className="animate-spin" /> :
               serverStatus === 'online' ? <Wifi size={16} /> : <WifiOff size={16} />}
              System Status: {serverStatus.toUpperCase()}
              {serverStatus === 'offline' && <span className="text-xs ml-2 opacity-70">(Restart server.py)</span>}
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-6">
            Intelligent <span className="text-blue-400">Respiratory</span> <br />
            Decision Support
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            Advanced clinical analysis combining machine learning with senior pulmonary expertise 
            to provide accurate diagnostic guidance in seconds.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/diagnose" 
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold flex items-center gap-2 transition-all transform hover:scale-105 shadow-lg shadow-blue-900/40">
              Start Diagnosis <ArrowRight size={20} />
            </Link>
            <Link href="/about" 
              className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/20 rounded-full font-bold transition-all">
              Learn How It Works
            </Link>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-24">
          {[
            {
              icon: <Zap className="w-8 h-8 text-yellow-400" />,
              title: "Instant Prediction",
              desc: "Get initial disease and treatment predictions powered by optimized SVM models."
            },
            {
              icon: <Stethoscope className="w-8 h-8 text-emerald-400" />,
              title: "Senior AI Review",
              desc: "Every prediction is cross-validated by Gemini AI acting as a senior pulmonologist."
            },
            {
              icon: <Shield className="w-8 h-8 text-blue-400" />,
              title: "Clinically Grounded",
              desc: "Recommendations aligned with international guidelines from WHO, CDC, and GINA."
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors"
            >
              <div className="mb-4 flex justify-center">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
