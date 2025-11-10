import React, { useState, useEffect } from 'react';
import { Project, Status, Teachers, FormativeFields, Disciplines, Grades, Groups, EvidenceFile, Discipline } from '../types';
import { improveDescription } from '../services/geminiService';
import { SparklesIcon, PaperclipIcon, TrashIcon } from './icons';
import { pdaData } from '../data/pdaData';

interface ProjectFormProps {
  onSubmit: (project: Omit<Project, 'id' | 'lastUpdated'>) => void;
  onCancel: () => void;
  projectToEdit?: Project | null;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({ onSubmit, onCancel, projectToEdit }) => {
  const getInitialFormData = (): Omit<Project, 'id' | 'lastUpdated'> => ({
    name: '',
    teacher: Teachers[0],
    formativeField: FormativeFields[0],
    discipline: Disciplines[0],
    involvedDisciplines: [],
    grade: Grades[0],
    group: Groups[0],
    description: '',
    deliverables: '',
    month: new Date().toISOString().slice(0, 7), // YYYY-MM
    status: Status.InProgress,
    evidenceFiles: [],
    content: '',
    pda: '',
  });

  const [formData, setFormData] = useState<Omit<Project, 'id' | 'lastUpdated'>>(getInitialFormData());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  const [error, setError] = useState('');
  
  const [availableContents, setAvailableContents] = useState<{ content: string; pda: string[] }[]>([]);
  const [availablePdas, setAvailablePdas] = useState<string[]>([]);

  useEffect(() => {
    if (projectToEdit) {
      setFormData({
        name: projectToEdit.name,
        teacher: projectToEdit.teacher,
        formativeField: projectToEdit.formativeField,
        discipline: projectToEdit.discipline,
        involvedDisciplines: projectToEdit.involvedDisciplines || [],
        grade: projectToEdit.grade,
        group: projectToEdit.group,
        description: projectToEdit.description,
        deliverables: projectToEdit.deliverables || '',
        month: projectToEdit.month,
        status: projectToEdit.status,
        evidenceFiles: projectToEdit.evidenceFiles || [],
        content: projectToEdit.content || '',
        pda: projectToEdit.pda || '',
      });
    } else {
      setFormData(getInitialFormData());
    }
  }, [projectToEdit]);

  // Effect to update available Contents based on Grade and Discipline
  useEffect(() => {
    // @ts-ignore
    const contentsForGradeAndDiscipline = pdaData[formData.grade]?.[formData.discipline] || [];
    setAvailableContents(contentsForGradeAndDiscipline);

    // If the currently selected content is not in the new list, reset it.
    if (!contentsForGradeAndDiscipline.some(c => c.content === formData.content)) {
      setFormData(prev => ({ ...prev, content: '', pda: '' }));
    }
  }, [formData.grade, formData.discipline]);

  // Effect to update available PDAs when Content changes
  useEffect(() => {
    const selectedContentData = availableContents.find(c => c.content === formData.content);
    const pdasForContent = selectedContentData ? selectedContentData.pda : [];
    setAvailablePdas(pdasForContent);

    // Reset pda selection if it's not in the new list of available pdas
    if (!pdasForContent.includes(formData.pda ?? '')) {
         setFormData(prev => ({ ...prev, pda: '' }));
    }
  }, [formData.content, availableContents]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleInvolvedDisciplinesChange = (discipline: Discipline) => {
    setFormData(prev => {
        const currentDisciplines = prev.involvedDisciplines;
        const newDisciplines = currentDisciplines.includes(discipline)
            ? currentDisciplines.filter(d => d !== discipline)
            : [...currentDisciplines, discipline];
        return { ...prev, involvedDisciplines: newDisciplines };
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
        const files = Array.from(e.target.files);
        const filePromises = files.map(file => {
            return new Promise<EvidenceFile>((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    resolve({
                        name: file.name,
                        type: file.type,
                        data: reader.result as string
                    });
                };
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        });

        Promise.all(filePromises).then(newFiles => {
            setFormData(prev => ({
                ...prev,
                evidenceFiles: [...prev.evidenceFiles, ...newFiles]
            }));
        }).catch(err => {
            console.error("Error reading files:", err);
            setError("Error al procesar los archivos. Inténtelo de nuevo.");
        });
    }
  };
  
  const handleRemoveFile = (index: number) => {
    setFormData(prev => ({
        ...prev,
        evidenceFiles: prev.evidenceFiles.filter((_, i) => i !== index)
    }));
  };

  const handleImproveDescription = async () => {
    setIsImproving(true);
    setError('');
    try {
      const improved = await improveDescription(formData.description);
      setFormData(prev => ({ ...prev, description: improved }));
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setIsImproving(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
        setError('Por favor, ingrese el nombre del proyecto.');
        return;
    }
    setError('');
    setIsSubmitting(true);
    onSubmit(formData);
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">{projectToEdit ? 'Editar Proyecto' : 'Agregar Nuevo Proyecto'}</h2>
        
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">{error}</div>}

        <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre del Proyecto</label>
            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
        </div>

        <div>
            <label htmlFor="teacher" className="block text-sm font-medium text-gray-700">Nombre del Docente</label>
            <select name="teacher" id="teacher" value={formData.teacher} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500">
                {Teachers.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
                <label htmlFor="formativeField" className="block text-sm font-medium text-gray-700">Campo Formativo</label>
                <select name="formativeField" id="formativeField" value={formData.formativeField} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500">
                    {FormativeFields.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="discipline" className="block text-sm font-medium text-gray-700">Disciplina Principal</label>
                <select name="discipline" id="discipline" value={formData.discipline} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500">
                    {Disciplines.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
            </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
             <div>
                <label htmlFor="grade" className="block text-sm font-medium text-gray-700">Grado</label>
                <select name="grade" id="grade" value={formData.grade} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500">
                    {Grades.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="group" className="block text-sm font-medium text-gray-700">Grupo</label>
                <select name="group" id="group" value={formData.group} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500">
                    {Groups.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
            </div>
        </div>
        
        <div className="p-4 border border-gray-200 rounded-lg space-y-4 bg-gray-50">
            <h3 className="text-base font-semibold text-gray-800">Contenido y PDA</h3>
            <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">Contenido</label>
                <select
                    name="content"
                    id="content"
                    value={formData.content}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100"
                    disabled={availableContents.length === 0}
                >
                    <option value="">{availableContents.length > 0 ? 'Seleccione un contenido' : 'Seleccione grado y disciplina primero'}</option>
                    {availableContents.map((c, index) => <option key={index} value={c.content}>{c.content}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="pda" className="block text-sm font-medium text-gray-700">Proceso de Desarrollo de Aprendizaje (PDA)</label>
                <select
                    name="pda"
                    id="pda"
                    value={formData.pda}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100"
                    disabled={availablePdas.length === 0}
                >
                    <option value="">{availablePdas.length > 0 ? 'Seleccione un PDA' : 'Seleccione un contenido primero'}</option>
                    {availablePdas.map((p, index) => <option key={index} value={p}>{p}</option>)}
                </select>
            </div>
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700">Otras Disciplinas Involucradas</label>
            <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 border border-gray-300 rounded-md p-4">
                {Disciplines.map(discipline => (
                    <div key={discipline} className="flex items-center">
                        <input
                            id={`discipline-${discipline}`}
                            name="involvedDisciplines"
                            type="checkbox"
                            checked={formData.involvedDisciplines.includes(discipline)}
                            onChange={() => handleInvolvedDisciplinesChange(discipline)}
                            className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <label htmlFor={`discipline-${discipline}`} className="ml-2 block text-sm text-gray-900">
                            {discipline}
                        </label>
                    </div>
                ))}
            </div>
        </div>

        <div>
            <div className="flex justify-between items-center">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
                <button type="button" onClick={handleImproveDescription} disabled={isImproving || !formData.description} className="flex items-center text-sm font-medium text-primary-600 hover:text-primary-800 disabled:opacity-50 disabled:cursor-not-allowed">
                    <SparklesIcon className={`h-4 w-4 mr-1 ${isImproving ? 'animate-spin' : ''}`} />
                    {isImproving ? 'Mejorando...' : 'Mejorar con IA'}
                </button>
            </div>
            <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={4} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"></textarea>
        </div>

        <div>
            <label htmlFor="deliverables" className="block text-sm font-medium text-gray-700">Productos Entregables</label>
            <textarea name="deliverables" id="deliverables" value={formData.deliverables} onChange={handleChange} rows={3} placeholder="Ej: Un video documental, una maqueta, un ensayo..." className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"></textarea>
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700">Evidencias (Imágenes o PDF)</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    <div className="flex text-sm text-gray-600">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                            <span>Subir archivos</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple onChange={handleFileChange} accept="image/*,.pdf" />
                        </label>
                        <p className="pl-1">o arrastrar y soltar</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF hasta 10MB; PDF</p>
                </div>
            </div>
            {formData.evidenceFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">Archivos Adjuntos:</h4>
                    <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                        {formData.evidenceFiles.map((file, index) => (
                            <li key={index} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                                <div className="w-0 flex-1 flex items-center">
                                    <PaperclipIcon className="flex-shrink-0 h-5 w-5 text-gray-400" />
                                    <span className="ml-2 flex-1 w-0 truncate">{file.name}</span>
                                </div>
                                <div className="ml-4 flex-shrink-0">
                                    <button type="button" onClick={() => handleRemoveFile(index)} className="p-1 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50" aria-label="Remove file">
                                        <TrashIcon className="h-4 w-4" />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
                <label htmlFor="month" className="block text-sm font-medium text-gray-700">Mes</label>
                <input type="month" name="month" id="month" value={formData.month} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
            </div>
            <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">Estado</label>
                <select name="status" id="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500">
                    {Object.values(Status).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onCancel} className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                Cancelar
            </button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-primary-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50">
                {isSubmitting ? 'Guardando...' : (projectToEdit ? 'Guardar Cambios' : 'Agregar Proyecto')}
            </button>
        </div>
    </form>
  );
};