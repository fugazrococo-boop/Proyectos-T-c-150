export const Teachers = [
  'Carlos Alfredo Róman López',
  'Crisalia Ramos Téllez',
  'Damián Mendoza Hernández',
  'David Murrieta Salvador',
  'Gabriela Ríos Coyotl',
  'Itzel Cruz García',
  'Karina García Pérez',
  'María Selene Flores Flores',
  'Paulina García Salome',
  'Perla Xóchitl Reyes Cruz',
  'Raúl Márquez Sánchez',
  'Rocío Alejandra Alonso Morales',
  'Sandra Cruz Ortiz',
  'Surisaday López Aguilar',
] as const;

export const FormativeFields = [
  'Lenguajes',
  'Saberes y Pensamiento Científico',
  'Ética, Naturaleza y Sociedades',
  'De lo Humano y lo Comunitario',
] as const;

export const Disciplines = [
  'Español',
  'Inglés',
  'Artes',
  'Matemáticas',
  'Biología',
  'Física',
  'Química',
  'Geografía',
  'Historia',
  'Formación Cívica y Ética',
  'Tecnología',
  'Tutoría / Educación Socioemocional',
  'Educación Física',
] as const;

export const Grades = ['Primer grado', 'Segundo grado', 'Tercer Grado'] as const;

export const Groups = ['A', 'B'] as const;

export type Teacher = typeof Teachers[number];
export type FormativeField = typeof FormativeFields[number];
export type Discipline = typeof Disciplines[number];
export type Grade = typeof Grades[number];
export type Group = typeof Groups[number];


export enum Status {
  InProgress = 'En Desarrollo',
  Completed = 'Finalizado',
}

export interface EvidenceFile {
  name: string;
  type: string;
  data: string; // Base64 encoded file content
}

export interface Project {
  id: string;
  name: string;
  teacher: Teacher;
  formativeField: FormativeField;
  discipline: Discipline;
  involvedDisciplines: Discipline[];
  grade: Grade;
  group: Group;
  description: string;
  deliverables: string;
  month: string; // Format: YYYY-MM
  status: Status;
  evidenceFiles: EvidenceFile[];
  lastUpdated: string; // ISO date string
  content?: string;
  pda?: string;
}