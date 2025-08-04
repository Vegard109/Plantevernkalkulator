import React from 'react';
import PesticideCalculator from './PesticideCalculator';

function App() {
  return (
    <div className="min-h-screen bg-green-50 text-gray-800">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-5 flex items-center space-x-4">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" viewBox="0 0 20 20" fill="currentColor">
            <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V5.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15 7l-2 1v8l2-1V7z" />
            <path d="M4 13.236V5.236a1 1 0 011.447-.894l4 2a1 1 0 01.553.894V17a1 1 0 01-1.447.894l-4-2A1 1 0 014 15V13.236z" />
          </svg>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Plantevernkalkulator</h1>
            <p className="text-sm text-gray-500">For norsk landbruk</p>
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4 md:p-8">
        <PesticideCalculator />
      </main>
      <footer className="text-center py-4 text-sm text-gray-500">
        <p>Laget med data fra Mattilsynet &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

export default App;