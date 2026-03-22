'use client';

import { motion } from 'framer-motion';
import { Wind, ShieldCheck, Leaf, Activity, ArrowUpRight } from 'lucide-react';

export default function Tips() {
  const categories = [
    {
      icon: <Wind className="text-blue-400" />,
      title: "Air Quality Control",
      tips: ["Avoid areas with high pollution", "Keep windows closed during high pollen counts", "Use HEPA air purifiers indoors"]
    },
    {
      icon: <ShieldCheck className="text-emerald-400" />,
      title: "Infection Prevention",
      tips: ["Wash hands frequently", "Wear a mask in crowded, enclosed spaces", "Ensure up-to-date vaccinations"]
    },
    {
      icon: <Leaf className="text-yellow-400" />,
      title: "Lifestyle Choices",
      tips: ["Quit smoking and avoid second-hand smoke", "Maintain a balanced diet rich in antioxidants", "Stay hydrated to thin mucus"]
    },
    {
      icon: <Activity className="text-purple-400" />,
      title: "Breathing Exercises",
      tips: ["Practice diaphragmatic breathing", "Perform light cardiovascular activity", "Try pursed-lip breathing"]
    }
  ];

  return (
    <div className="pt-32 pb-20 px-4 max-w-6xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl font-bold mb-4">Pulmonary Health & Prevention</h2>
        <p className="text-gray-400 text-xl max-w-2xl mx-auto">
          Protecting your lungs is a daily commitment. These guidelines are based on clinical respiratory wellness standards.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8">
        {categories.map((cat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-3xl bg-white/5 border border-white/10 glass-hover"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-white/5 rounded-2xl">{cat.icon}</div>
              <h3 className="text-xl font-bold">{cat.title}</h3>
            </div>
            <ul className="space-y-4">
              {cat.tips.map((tip, j) => (
                <li key={j} className="flex items-start gap-3 text-gray-400">
                  <ArrowUpRight size={18} className="mt-1 text-blue-500/50 flex-shrink-0" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
