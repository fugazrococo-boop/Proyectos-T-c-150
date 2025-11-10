import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { ProjectList } from './components/ProjectList';
import { ProjectForm } from './components/ProjectForm';
import { Modal } from './components/Modal';
import { useProjects } from './hooks/useProjects';
import { Project, Status } from './types';
import { Dashboard } from './components/Dashboard';

const App: React.FC = () => {
  const { projects, addProject, updateProject, deleteProject } = useProjects();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status | 'all'>('all');
  const [view, setView] = useState<'list' | 'dashboard'>('list');

  const openModalForNew = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const openModalForEdit = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
  };

  const handleFormSubmit = (projectData: Omit<Project, 'id' | 'lastUpdated'>) => {
    if (editingProject) {
      updateProject(editingProject.id, { ...projectData });
    } else {
      addProject(projectData);
    }
    closeModal();
  };

  const handleDeleteProject = (id: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar este proyecto?')) {
      deleteProject(id);
    }
  };
  
  const filteredProjects = useMemo(() => {
    return projects
      .filter(project => {
        if (statusFilter === 'all') return true;
        return project.status === statusFilter;
      })
      .filter(project => {
        const search = searchTerm.toLowerCase();
        return project.name.toLowerCase().includes(search) ||
          project.teacher.toLowerCase().includes(search) ||
          project.discipline.toLowerCase().includes(search) ||
          project.grade.toLowerCase().includes(search) ||
          project.involvedDisciplines.some(d => d.toLowerCase().includes(search));
        }
      )
      .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
  }, [projects, searchTerm, statusFilter]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <Header 
        onAddNewProject={openModalForNew}
        view={view}
        setView={setView}
      />
      <main className="container mx-auto p-4 md:p-8">
        {view === 'list' ? (
          <ProjectList 
            projects={filteredProjects}
            onEdit={openModalForEdit}
            onDelete={handleDeleteProject}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />
        ) : (
          <Dashboard projects={projects} />
        )}
      </main>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ProjectForm 
          onSubmit={handleFormSubmit} 
          onCancel={closeModal}
          projectToEdit={editingProject} 
        />
      </Modal>
    </div>
  );
};

export default App;