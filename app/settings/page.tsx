'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function Settings() {
  const [openaiKey, setOpenaiKey] = useState('');
  const [deepseekKey, setDeepseekKey] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const [anthropicKey, setAnthropicKey] = useState('');

  useEffect(() => {
    setOpenaiKey(localStorage.getItem('openai_key') || '');
    setDeepseekKey(localStorage.getItem('deepseek_key') || '');
    setGeminiKey(localStorage.getItem('gemini_key') || '');
    setAnthropicKey(localStorage.getItem('anthropic_key') || '');
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('openai_key', openaiKey);
    localStorage.setItem('deepseek_key', deepseekKey);
    localStorage.setItem('gemini_key', geminiKey);
    localStorage.setItem('anthropic_key', anthropicKey);
    alert('Settings saved successfully!');
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link
            href="/"
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">API Settings</h1>

          <form onSubmit={handleSave}>
            <div className="space-y-6">
              <div>
                <label htmlFor="openai" className="block text-sm font-medium text-gray-700">
                  OpenAI API Key
                </label>
                <input
                  type="password"
                  id="openai"
                  value={openaiKey}
                  onChange={(e) => setOpenaiKey(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="deepseek" className="block text-sm font-medium text-gray-700">
                  DeepSeek API Key
                </label>
                <input
                  type="password"
                  id="deepseek"
                  value={deepseekKey}
                  onChange={(e) => setDeepseekKey(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="gemini" className="block text-sm font-medium text-gray-700">
                  Gemini API Key
                </label>
                <input
                  type="password"
                  id="gemini"
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="anthropic" className="block text-sm font-medium text-gray-700">
                  Anthropic API Key
                </label>
                <input
                  type="password"
                  id="anthropic"
                  value={anthropicKey}
                  onChange={(e) => setAnthropicKey(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Save Settings
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}