'use client';
import { useRouter } from 'next/navigation';
import React from 'react';
import toast from 'react-hot-toast';

const features = [
  "Quickly generate professional-quality documentation",
  "Improve team collaboration and code handovers",
  "Make your projects easier to maintain and scale",
  "No more manual commenting, endless explaining, or messy handovers",
];

const About = () => {

  const router = useRouter();
  const handleRoute = () => {
    if (!localStorage.getItem('token')) {
      toast("Please login to continue", {
        icon: '🚫',
      });
      router.push('/login');
    }
    else {
      router.push('/autodocs');
    }
  }
  


  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="mt-12 rounded-2xl shadow-2xl p-10 max-w-5xl w-full text-white">
        <h1 className="text-5xl font-extrabold mb-6 text-center">
          About <span className="text-[#3f474e]">CodocAI</span>
        </h1>
        <p className="text-lg mb-8 text-slate-300 text-center">
          Welcome to <span className="font-semibold text-white">CodocAI </span> – your smart assistant for effortless code documentation.
        </p>
        <p className="mb-6 text-base text-slate-400">
          Our platform is designed to make code more accessible and understandable for everyone. Whether you're a developer, student, or team lead, CodeDoc AI saves you time and effort by transforming your code files into clear, well-structured documentation – instantly.
        </p>
        <p className="mb-6 text-base text-slate-400">
          Simply upload a code file in any programming language, and our AI-powered system will analyze your code, interpret its logic, and generate comprehensive documentation. The output is organized, easy to read, and designed to help anyone – from beginners to seasoned developers – understand what the code does, how it works, and why it matters.
        </p>
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-3 text-white">With CodeDoc AI, you can:</h2>
          <ul className="list-disc list-inside space-y-2 text-slate-300">
            {features.map((feature, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-[#3f474e] rounded-full"></span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
        <div className="text-center mt-6">
          <span onClick={handleRoute} className="inline-block bg-[#3f474e] text-white px-6 py-3 rounded-lg font-semibold shadow-lg">
            Start uploading. Start understanding.
          </span>
        </div>
      </div>
    </div>
  );
};

export default About;