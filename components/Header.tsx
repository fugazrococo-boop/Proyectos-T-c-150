import React from 'react';
import { PlusIcon, ListIcon, ChartIcon } from './icons';

interface HeaderProps {
  onAddNewProject: () => void;
  view: 'list' | 'dashboard';
  setView: (view: 'list' | 'dashboard') => void;
}

export const Header: React.FC<HeaderProps> = ({ onAddNewProject, view, setView }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center">
            <h1 className="text-lg md:text-xl font-bold text-gray-800">
                Seguimiento de Proyectos Escuela Secundaria Técnica No. 150
            </h1>
        </div>
        
        <div className="flex items-center space-x-2">
            <button
                onClick={() => setView('list')}
                className={`p-2 rounded-lg transition-colors ${view === 'list' ? 'bg-primary-100 text-primary-700' : 'text-gray-500 hover:bg-gray-100'}`}
                aria-label="Ver lista de proyectos"
            >
                <ListIcon className="h-5 w-5"/>
            </button>
            <button
                onClick={() => setView('dashboard')}
                 className={`p-2 rounded-lg transition-colors ${view === 'dashboard' ? 'bg-primary-100 text-primary-700' : 'text-gray-500 hover:bg-gray-100'}`}
                 aria-label="Ver dashboard"
            >
                <ChartIcon className="h-5 w-5"/>
            </button>
             <button
                onClick={onAddNewProject}
                className="flex items-center bg-primary-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
             >
                <PlusIcon className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">Nuevo Proyecto</span>
            </button>
        </div>
      </div>
    </header>
  );
};