
import { useState, useEffect, useCallback } from 'react';
import { Project, Status } from '../types';

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    try {
      const storedProjects = localStorage.getItem('projects');
      if (storedProjects) {
        setProjects(JSON.parse(storedProjects));
      }
    } catch (error) {
      console.error("Failed to load projects from localStorage", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('projects', JSON.stringify(projects));
    } catch (error) {
      console.error("Failed to save projects to localStorage", error);
    }
  }, [projects]);

  const addProject = useCallback((projectData: Omit<Project, 'id' | 'lastUpdated'>) => {
    const newProject: Project = {
      ...projectData,
      id: new Date().toISOString() + Math.random().toString(36),
      lastUpdated: new Date().toISOString(),
      evidenceFiles: projectData.evidenceFiles || [],
      involvedDisciplines: projectData.involvedDisciplines || [],
      deliverables: projectData.deliverables || '',
      content: projectData.content || '',
      pda: projectData.pda || '',
    };
    setProjects(prev => [newProject, ...prev]);
  }, []);

  const updateProject = useCallback((id: string, updatedData: Partial<Omit<Project, 'id' | 'lastUpdated'>>) => {
    setProjects(prev =>
      prev.map(p =>
        p.id === id ? { ...p, ...updatedData, lastUpdated: new Date().toISOString() } : p
      )
    );
  }, []);

  const deleteProject = useCallback((id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  }, []);

  return { projects, addProject, updateProject, deleteProject };
};