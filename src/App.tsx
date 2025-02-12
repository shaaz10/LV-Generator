import React, { useState } from 'react';
import { BookHeart, Sparkles, Loader2 } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

type Genre = 'contemporary' | 'historical' | 'fantasy' | 'tragic' | 'comedy';

function App() {
  const [genre, setGenre] = useState<Genre>('contemporary');
  const [story, setStory] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateStory = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `Generate a romantic love story in the ${genre} genre. The story should be around 200 words and be engaging and creative. Make it suitable for all audiences.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      setStory(text);
    } catch (err) {
      setError('Failed to generate story. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookHeart className="w-10 h-10 text-pink-600" />
            <h1 className="text-4xl font-bold text-gray-800">Love Story Generator</h1>
          </div>
          <p className="text-gray-600">Created with ❤️ by Shaaz</p>
        </header>

        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6">
          <div className="mb-6">
            <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-2">
              Choose your genre
            </label>
            <select
              id="genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value as Genre)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="contemporary">Contemporary Romance</option>
              <option value="historical">Historical Romance</option>
              <option value="fantasy">Fantasy Romance</option>
              <option value="tragic">Tragic Romance</option>
              <option value="comedy">Romantic Comedy</option>
            </select>
          </div>

          <button
            onClick={generateStory}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 px-6 rounded-lg font-medium 
                     hover:from-pink-600 hover:to-purple-600 transition-all duration-200 flex items-center justify-center gap-2
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Love Story
              </>
            )}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {story && !isLoading && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Your Love Story</h2>
              <div className="p-4 bg-gray-50 rounded-lg prose">
                {story.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;