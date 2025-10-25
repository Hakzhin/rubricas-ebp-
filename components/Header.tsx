import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Rúbric@s EBP</h1>
            <p className="text-blue-100 mt-1">
              Generador de rúbricas de evaluación con Inteligencia Artificial
            </p>
          </div>
          <div className="hidden md:flex items-center space-x-2 text-sm">
            <span className="px-3 py-1 bg-blue-500 rounded-full">LOMLOE</span>
            <span className="px-3 py-1 bg-indigo-500 rounded-full">Región de Murcia</span>
          </div>
        </div>
      </div>
    </header>
  );
};
