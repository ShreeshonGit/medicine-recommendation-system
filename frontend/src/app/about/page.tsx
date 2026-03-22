'use client';

import { motion } from 'framer-motion';
import { Database, BrainCircuit, Activity, Globe } from 'lucide-react';

export default function About() {
  const steps = [
    {
      icon: <Database className="text-blue-400" />,
      title: "Data Foundation",
      desc: "Our system is trained on thousands of respiratory cases from validated medical datasets, mapping symptoms to confirmed diagnoses."
    },
    {
      icon: <BrainCircuit className="text-purple-400" />,
      title: "ML Prediction",
      desc: "An optimized Support Vector Machine (SVM) model processes input symptoms to identify the most probable respiratory condition."
    },
    {
      icon: <Activity className="text-emerald-400" />,
      title: "Clinical Logic",
      desc: "The system considers age-specific risk factors and treatment protocols to refine recommendations."
    },
    {
      icon: <Globe className="text-yellow-400" />,
      title: "Global Standards",
      desc: "Our output is cross-referenced with WHO and GINA guidelines to ensure standard-of-care recommendations."
    }
  ];

  return (
    <div className="pt-32 pb-20 px-4 max-w-5xl mx-auto">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl font-bold mb-4">Bridging Technology & Medicine</h2>
        <p className="text-gray-400 text-xl max-w-2xl mx-auto">
          PulmoCare AI is a research project designed to provide clinical decision support 
          to healthcare providers and patients.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="p-8 rounded-3xl bg-white/5 border border-white/10 glass-hover"
          >
            <div className="mb-4">{step.icon}</div>
            <h3 className="text-xl font-bold mb-2">{step.title}</h3>
            <p className="text-gray-400 leading-relaxed">{step.desc}</p>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-16 p-10 rounded-3xl bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-500/20 text-center"
      >
        <h3 className="text-2xl font-bold mb-4 italic">"Medical technology is most powerful when it empowers human decision-making."</h3>
        <p className="text-gray-400">This platform serves as a proof-of-concept for automated clinical triage and support.</p>
      </motion.div>
    </div>
  );
}
