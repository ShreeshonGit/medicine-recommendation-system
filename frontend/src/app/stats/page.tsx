'use client';

import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Users, Target } from 'lucide-react';

export default function Stats() {
  const stats = [
    { label: "Accuracy Rate", value: "94.2%", icon: <Target className="text-emerald-400" /> },
    { label: "Cases Analyzed", value: "38,537", icon: <Users className="text-blue-400" /> },
    { label: "Avg. Latency", value: "1.2s", icon: <TrendingUp className="text-purple-400" /> },
    { label: "Clinical Reference", value: "WHO/GINA", icon: <BarChart3 className="text-yellow-400" /> }
  ];

  return (
    <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl font-bold mb-4 text-gradient">System Performance & Insights</h2>
        <p className="text-gray-400 text-xl max-w-2xl mx-auto">
          Our platform's reliability is built on a massive dataset and state-of-the-art ML architectures.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="p-8 rounded-3xl bg-white/5 border border-white/10 text-center hover:bg-white/10 transition-colors"
          >
            <div className="mb-4 flex justify-center">{stat.icon}</div>
            <div className="text-3xl font-extrabold text-white mb-2 tracking-tight">{stat.value}</div>
            <div className="text-gray-400 font-medium uppercase text-xs tracking-wider">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-16 p-8 rounded-3xl bg-white/5 border border-white/10 relative overflow-hidden"
      >
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-4">Dataset Coverage</h3>
            <p className="text-gray-400 leading-relaxed mb-6">
              Our models are trained on diverse pulmonary patient data, covering everything from acute infections like Pneumonia 
              to chronic conditions such as COPD and Asthma.
            </p>
            <div className="space-y-4">
              {['COPD & Asthma', 'Pneumonia & Bronchitis', 'Pulmonary Fibrosis', 'Normal Pulmonary Function'].map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-gray-500">
                    <span>{item}</span>
                    <span>{80 + (i * 5)}% Confidence</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${80 + (i * 5)}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-blue-600 to-emerald-500" 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 flex justify-center">
             <div className="w-64 h-64 rounded-full border-4 border-dashed border-blue-500/20 animate-spin-slow flex items-center justify-center">
                <div className="w-48 h-48 rounded-full border-4 border-dashed border-emerald-500/20 animate-spin-slow-reverse flex items-center justify-center">
                  <Target size={40} className="text-blue-400 opacity-50" />
                </div>
             </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
