import React from 'react';
import { Project, Status } from '../types';
import { EditIcon, TrashIcon, DownloadIcon, PaperclipIcon } from './icons';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

const statusColors: { [key in Status]: string } = {
  [Status.Completed]: 'bg-green-100 text-green-800 border-green-200',
  [Status.InProgress]: 'bg-blue-100 text-blue-800 border-blue-200',
};

const generateReportHTML = (project: Project) => {
    const formattedMonth = new Date(`${project.month}-02`).toLocaleDateString('es-ES', {
        month: 'long',
        year: 'numeric',
    });
    
    const generateEvidenceSection = () => {
        if (!project.evidenceFiles || project.evidenceFiles.length === 0) {
            return '<h2>Evidencias Adjuntas</h2><p>No se adjuntaron archivos de evidencia.</p>';
        }

        const images = project.evidenceFiles.filter(f => f.type.startsWith('image/'));
        const otherFiles = project.evidenceFiles.filter(f => !f.type.startsWith('image/'));

        let html = '<h2>Evidencias Adjuntas</h2>';

        if (images.length > 0) {
            html += '<div class="evidence-gallery">';
            images.forEach(img => {
                html += `
                    <div class="evidence-item">
                        <p>${img.name}</p>
                        <img src="${img.data}" alt="${img.name}" />
                    </div>
                `;
            });
            html += '</div>';
        }

        if (otherFiles.length > 0) {
            html += '<h3>Otros Archivos</h3><ul class="evidence-list">';
            otherFiles.forEach(file => {
                html += `<li class="evidence-list-item">${file.name} (${file.type})</li>`;
            });
            html += '</ul>';
        }

        return html;
    };

    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <title>Informe del Proyecto: ${project.name}</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; margin: 2rem; color: #333; }
            .container { max-width: 800px; margin: 0 auto; }
            h1 { color: #1d4ed8; border-bottom: 2px solid #1d4ed8; padding-bottom: 0.5rem; }
            p { line-height: 1.6; }
            .details { border-collapse: collapse; width: 100%; margin: 2rem 0; }
            .details th, .details td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            .details th { background-color: #f2f7ff; font-weight: 600; }
            h2 { color: #1e40af; margin-top: 2rem; border-bottom: 1px solid #93c5fd; padding-bottom: 0.3rem;}
            h3 { font-size: 1.1rem; color: #333; margin-top: 1.5rem; }
            .description { background-color: #f9fafb; border-left: 4px solid #93c5fd; padding: 1rem; margin: 1rem 0; }
            ul { list-style-type: square; padding-left: 20px; }
            .footer { margin-top: 3rem; padding-top: 1rem; border-top: 1px solid #ccc; font-size: 0.8rem; color: #777; text-align: center; }
            .evidence-gallery { margin-top: 1rem; }
            .evidence-item { page-break-inside: avoid; margin-bottom: 1.5rem; text-align: center; }
            .evidence-item p { font-weight: 500; margin-bottom: 0.5rem; font-size: 0.9rem; color: #555; }
            .evidence-item img { max-width: 100%; max-height: 500px; height: auto; margin: 0 auto; border: 1px solid #ddd; border-radius: 4px; padding: 4px; }
            .evidence-list { list-style-type: square; padding-left: 20px; margin-top: 0.5rem; }
            .evidence-list-item { margin-bottom: 0.5rem; }
            .signatures { display: flex; justify-content: space-around; margin-top: 6rem; text-align: center; page-break-inside: avoid; }
            .signature-box { width: 45%; }
            .signature-line { border-bottom: 1px solid #333; height: 3rem; margin-bottom: 0.5rem; }
            .signature-box p { margin: 0.2rem 0; font-size: 0.9rem; }
            @media print {
              .no-print { display: none; }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Informe de Proyecto</h1>
            <p><strong>Nombre del Proyecto:</strong> ${project.name}</p>
            <p><strong>Fecha de Generación:</strong> ${new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}</p>

            <table class="details">
                <tr><th>Docente</th><td>${project.teacher}</td></tr>
                <tr><th>Grado y Grupo</th><td>${project.grade} - ${project.group}</td></tr>
                <tr><th>Campo Formativo</th><td>${project.formativeField}</td></tr>
                <tr><th>Disciplina Principal</th><td>${project.discipline}</td></tr>
                <tr><th>Mes de Registro</th><td>${formattedMonth}</td></tr>
                <tr><th>Estado</th><td>${project.status}</td></tr>
            </table>

            <h2>Descripción del Proyecto</h2>
            <div class="description">
                <p>${project.description.replace(/\n/g, '<br>')}</p>
            </div>
            
            <h2>Contenido y Proceso de Desarrollo de Aprendizaje (PDA)</h2>
            <div class="description">
                <p><strong>Contenido:</strong> ${project.content || 'No especificado.'}</p>
                <p><strong>PDA:</strong> ${project.pda || 'No especificado.'}</p>
            </div>

            <h2>Otras Disciplinas Involucradas</h2>
            ${project.involvedDisciplines.length > 0 ? `<ul>${project.involvedDisciplines.map(d => `<li>${d}</li>`).join('')}</ul>` : '<p>No se especificaron otras disciplinas.</p>'}

            <h2>Productos Entregables</h2>
            <div class="description">
                <p>${project.deliverables.replace(/\n/g, '<br>') || 'No se especificaron productos entregables.'}</p>
            </div>

            ${generateEvidenceSection()}
            
            <div class="signatures">
                <div class="signature-box">
                    <div class="signature-line"></div>
                    <p><strong>${project.teacher}</strong></p>
                    <p>Nombre y Firma del Docente</p>
                </div>
                <div class="signature-box">
                    <div class="signature-line"></div>
                    <p><strong>Oscar Cruz Gallardo</strong></p>
                    <p>Nombre y Firma del Director</p>
                </div>
            </div>

            <div class="footer">
                Informe generado por la aplicación de Seguimiento de Proyectos Escuela Secundaria Técnica No. 150.
            </div>
        </div>
        <script>
            window.onload = () => {
              window.print();
            };
        </script>
    </body>
    </html>
    `;
};


export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onEdit, onDelete }) => {
  const { id, name, teacher, description, month, status, grade, group, formativeField, discipline, evidenceFiles, involvedDisciplines, deliverables, content, pda } = project;

  const formattedMonth = new Date(`${month}-02`).toLocaleDateString('es-ES', {
    month: 'long',
    year: 'numeric',
  });

  const handleDownloadReport = () => {
    const reportHtml = generateReportHTML(project);
    const reportWindow = window.open('', '_blank');
    if(reportWindow) {
        reportWindow.document.write(reportHtml);
        reportWindow.document.close();
    }
  };


  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300 flex flex-col">
      <div className="p-6 flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-900 pr-2">{name}</h3>
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full border whitespace-nowrap ${statusColors[status]}`}
          >
            {status}
          </span>
        </div>
        <p className="text-sm font-medium text-primary-600 mb-2">{teacher}</p>

        <div className="flex flex-wrap gap-2 mb-4 text-xs">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-medium bg-gray-100 text-gray-800">
                {grade} - {group}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-medium bg-indigo-100 text-indigo-800">
                {formativeField}
            </span>
             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-medium bg-pink-100 text-pink-800">
                {discipline}
            </span>
            {involvedDisciplines.map(d => (
                <span key={d} className="inline-flex items-center px-2.5 py-0.5 rounded-full font-medium bg-gray-200 text-gray-600">
                    {d}
                </span>
            ))}
        </div>
        
        <p className="text-gray-600 text-sm mb-4 h-12 overflow-hidden text-ellipsis">
          {description}
        </p>
        
        {deliverables && (
            <div className="mt-4 pt-4 border-t border-gray-100">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Entregables</h4>
                <p className="text-gray-700 text-sm mt-1 whitespace-pre-wrap">
                  {deliverables}
                </p>
            </div>
        )}

        {content && (
             <div className="mt-4 pt-4 border-t border-gray-100">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Contenido y PDA</h4>
                <p className="text-gray-700 text-sm mt-1">
                  <strong>Contenido:</strong> {content}
                </p>
                 <p className="text-gray-500 text-sm mt-1">
                  <strong>PDA:</strong> {pda}
                </p>
            </div>
        )}

      </div>
      <div className="bg-gray-50 px-6 py-4 rounded-b-xl border-t border-gray-200 flex justify-between items-center">
        <div>
            <p className="text-xs text-gray-500 font-semibold capitalize">{formattedMonth}</p>
             <div className="flex items-center text-xs text-gray-400 mt-1">
                <PaperclipIcon className="h-3 w-3 mr-1" />
                <span>{evidenceFiles.length} evidencia(s)</span>
            </div>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={handleDownloadReport}
            className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-100 rounded-full transition-colors"
            aria-label="Download report"
          >
            <DownloadIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => onEdit(project)}
            className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-100 rounded-full transition-colors"
            aria-label="Edit project"
          >
            <EditIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => onDelete(id)}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors"
            aria-label="Delete project"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};