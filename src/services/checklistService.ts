import api from './api';

// Tipos
interface Question {
  id: string;
  text: string;
  checklistId: string;
  answer?: boolean | null;
}

interface Checklist {
  id: string;
  standard: string;
  userId: string;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  document?: {
    id: string;
    fileName: string;
  };
  questions?: Question[];
}

interface ChecklistResponse {
  status: string;
  data: {
    checklist: Checklist;
  };
  message: string;
}

interface ChecklistsResponse {
  status: string;
  data: {
    checklists: Checklist[];
  };
  message: string;
}

interface CreateChecklistData {
  standard: string;
}

// Serviço de checklists
const checklistService = {
  // Listar todos os checklists
  async getChecklists(): Promise<ChecklistsResponse> {
    const response = await api.get<ChecklistsResponse>('/checklists');
    return response.data;
  },

  // Obter um checklist específico
  async getChecklist(id: string): Promise<ChecklistResponse> {
    const response = await api.get<ChecklistResponse>(`/checklists/${id}`);
    return response.data;
  },

  // Criar checklist
  async createChecklist(documentId: string, data: CreateChecklistData): Promise<ChecklistResponse> {
    const response = await api.post<ChecklistResponse>(`/checklists/create/${documentId}`, data);
    return response.data;
  },

  // Excluir checklist
  async deleteChecklist(id: string): Promise<any> {
    const response = await api.delete(`/checklists/${id}`);
    return response.data;
  }
};

export default checklistService;