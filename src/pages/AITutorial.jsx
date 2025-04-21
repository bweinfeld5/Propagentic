import React, { useState } from 'react';
import { useModelContext } from '../contexts/ModelContext';
import AIConfigurationPanel from '../components/ai/AIConfigurationPanel';

// Example of direct use of the useModelContext hook without a specialized hook
const AITutorial = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [systemPrompt, setSystemPrompt] = useState(
    'You are an AI assistant for property management helping with tenant questions.'
  );

  // Using the ModelContext directly
  const { 
    addMessage, 
    setSystemMessage,
    getCompletion, 
    clearContext, 
    messages, 
    isLoading, 
    error 
  } = useModelContext();

  // Handle a direct AI request
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    try {
      // Reset context for a new conversation
      if (messages.length === 0) {
        clearContext();
        setSystemMessage(systemPrompt);
      }

      // Add the user message
      addMessage('user', prompt);
      
      // Get AI response
      const result = await getCompletion();
      setResponse(result.content);
      
      // Clear the input
      setPrompt('');
    } catch (err) {
      console.error('Error getting AI response:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl font-bold text-center mb-8 text-propagentic-teal">
          Model Context Protocol Tutorial
        </h1>
        
        <AIConfigurationPanel />
        
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">1. Direct ModelContext Usage</h2>
          <p className="mb-4 text-gray-700">
            This example shows how to use the useModelContext hook directly in a component:
          </p>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              System Prompt (AI instructions)
            </label>
            <textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              rows="2"
            />
          </div>
          
          <form onSubmit={handleSubmit} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Message
            </label>
            <div className="flex">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg"
                placeholder="Ask a property management question..."
              />
              <button
                type="submit"
                disabled={isLoading || !prompt.trim()}
                className={`px-4 py-2 bg-propagentic-teal text-white rounded-r-lg ${
                  isLoading || !prompt.trim() ? 'opacity-50' : 'hover:bg-teal-600'
                }`}
              >
                {isLoading ? 'Sending...' : 'Send'}
              </button>
            </div>
          </form>
          
          {error && (
            <div className="p-3 bg-red-100 border border-red-400 rounded text-red-700 mb-4">
              Error: {error.message}
            </div>
          )}
          
          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="font-medium text-gray-700 mb-2">AI Response:</h3>
            {isLoading ? (
              <p className="text-gray-500">Thinking...</p>
            ) : response ? (
              <p className="whitespace-pre-line">{response}</p>
            ) : (
              <p className="text-gray-400">Enter a message to get a response</p>
            )}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">2. Creating Specialized Hooks</h2>
          <div className="prose">
            <p>
              For specialized AI features, create custom hooks like we did with <code>usePropertyDescriptionAI</code> and <code>useMaintenanceAI</code>.
            </p>
            
            <h3>Steps to create a specialized AI hook:</h3>
            
            <ol>
              <li>Import <code>useModelContext</code> from <code>contexts/ModelContext</code></li>
              <li>Define types or interfaces for your inputs and outputs</li>
              <li>Create a system prompt specific to your AI task</li>
              <li>Build a function that:
                <ul>
                  <li>Clears the previous context</li>
                  <li>Sets your specialized system prompt</li>
                  <li>Adds user message with formatted inputs</li>
                  <li>Gets completion and processes the response</li>
                </ul>
              </li>
              <li>Return the core function and state variables</li>
            </ol>
            
            <pre className="bg-gray-800 text-white p-4 rounded-lg overflow-auto text-sm">
{`import { useState } from 'react';
import { useModelContext } from '../contexts/ModelContext';

export const useCustomAI = () => {
  const { addMessage, setSystemMessage, getCompletion, clearContext, isLoading, error } = useModelContext();
  const [result, setResult] = useState(null);

  const performAITask = async (input) => {
    try {
      // Clear previous context
      clearContext();
      
      // Set specialized system prompt
      setSystemMessage("Your specialized instructions here");
      
      // Add user input
      addMessage('user', \`User input: \${input}\`);
      
      // Get AI response
      const response = await getCompletion();
      
      // Process response
      const processedResult = handleResponse(response.content);
      setResult(processedResult);
      
      return processedResult;
    } catch (err) {
      console.error('Error:', err);
      throw err;
    }
  };

  return {
    performAITask,
    result,
    isLoading,
    error,
  };
};`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AITutorial; 