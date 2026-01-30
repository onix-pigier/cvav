// // types/militant.ts
// export interface Militant {
//   _id: string;
//   prenom: string;
//   nom: string;
//   sexe: "M" | "F";
//   paroisse: string;
//   secteur: string;
//   grade: string;
//   quartier?: string;
//   telephone?: string;
//   photo?: string;
//   createdAt: string;
// }

// types/militant.ts

export interface Militant {
  _id: string;
  prenom: string;
  nom: string;
  sexe: 'M' | 'F';
  paroisse: string;
  secteur: string;
  grade: string;
  quartier?: string;
  telephone?: string;
  creePar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MilitantStats {
  total: number;
  parSecteur: {
    [key: string]: number;
  };
  parGrade: {
    [key: string]: number;
  };
}

export interface MilitantResponse {
  data: Militant[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  stats?: MilitantStats;
}