import React from 'react';
import { Project, Status } from '../types';
import { ProjectCard } from './ProjectCard';
import { SearchIcon } from './icons';

interface ProjectListProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: Status | 'all';
  setStatusFilter: (status: Status | 'all') => void;
}

export const ProjectList: React.FC<ProjectListProps> = ({ 
  projects, 
  onEdit, 
  onDelete,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
                <input
                    type="text"
                    placeholder="Buscar por nombre, docente, disciplina..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-gray-400"/>
                </div>
            </div>
            <div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as Status | 'all')}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-white"
                >
                    <option value="all">Todos los Estados</option>
                    {Object.values(Status).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>
        </div>
      </div>

      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <ProjectCard key={project.id} project={project} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-6 bg-white rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-700">No se encontraron proyectos.</h3>
          <p className="text-gray-500 mt-2">¡Intente ajustar sus filtros o agregue un nuevo proyecto para comenzar!</p>
        </div>
      )}
    </div>
  );
};
