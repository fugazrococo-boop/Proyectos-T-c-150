import React, { useMemo, useState } from 'react';
import { Project, Status, EvidenceFile } from '../types';

interface DashboardProps {
  projects: Project[];
}

interface MonthlyData {
  [month: string]: number;
}

const ProjectChart: React.FC<{data: MonthlyData}> = ({ data }) => {
    const months = Object.keys(data).sort();
    if (months.length === 0) {
        return <p className="text-center text-gray-500">No hay datos de proyectos finalizados para mostrar.</p>
    }

    const maxCount = Math.max(...Object.values(data), 1);

    return (
        <div className="w-full h-72 p-4 flex items-end justify-center space-x-4" aria-label="Gráfico de proyectos finalizados por mes">
            {months.map(month => {
                const count = data[month];
                const barHeight = `${(count / maxCount) * 100}%`;
                const formattedMonth = new Date(`${month}-02`).toLocaleDateString('es-ES', { month: 'short', year: '2-digit' });
                return (
                    <div key={month} className="flex-1 flex flex-col items-center" title={`${formattedMonth}: ${count} proyecto(s)`}>
                        <div className="text-xl font-bold text-gray-700">{count}</div>
                        <div className="w-full h-full flex items-end">
                            <div
                                className="w-full bg-primary-500 hover:bg-primary-600 rounded-t-md transition-all duration-300"
                                style={{ height: barHeight }}
                                aria-label={`${count} proyectos finalizados en ${formattedMonth}`}
                            ></div>
                        </div>
                        <div className="mt-2 text-sm text-gray-500 font-medium">{formattedMonth}</div>
                    </div>
                );
            })}
        </div>
    );
}

const EvidenceGallery: React.FC<{images: EvidenceFile[]}> = ({ images }) => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    if (images.length === 0) {
        return <p className="text-center text-gray-500">No se han subido imágenes de evidencia.</p>
    }
    
    return (
        <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {images.map((image, index) => (
                    <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer group" onClick={() => setSelectedImage(image.data)}>
                        <img 
                            src={image.data} 
                            alt={image.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                        />
                    </div>
                ))}
            </div>

            {selectedImage && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-75 z-[100] flex justify-center items-center p-4 cursor-pointer"
                    onClick={() => setSelectedImage(null)}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Vista de imagen ampliada"
                >
                    <button 
                        onClick={() => setSelectedImage(null)}
                        className="absolute top-4 right-4 text-white text-4xl font-bold z-[101]"
                        aria-label="Cerrar imagen"
                    >
                        &times;
                    </button>
                    <img 
                        src={selectedImage} 
                        alt="Evidencia Ampliada" 
                        className="max-w-full max-h-full object-contain cursor-default"
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image
                    />
                </div>
            )}
        </>
    );
}


export const Dashboard: React.FC<DashboardProps> = ({ projects }) => {
  const monthlyCompletedData = useMemo(() => {
    return projects
      .filter(p => p.status === Status.Completed)
      .reduce((acc: MonthlyData, project) => {
        const month = project.month; // YYYY-MM format
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      }, {});
  }, [projects]);

  const allImages = useMemo(() => {
    return projects.flatMap(project => 
        project.evidenceFiles.filter(file => file.type.startsWith('image/'))
    );
  }, [projects]);

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Proyectos Finalizados por Mes</h2>
        <ProjectChart data={monthlyCompletedData} />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Galería de Evidencias</h2>
        <EvidenceGallery images={allImages} />
      </div>
    </div>
  );
};