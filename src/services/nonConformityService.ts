import api from './api';

// Tipos
interface CorrectiveAction {
  id: string;
  action: string;
  createdAt: string;
  nonConformityId?: string;
}

interface NonConformity {
  id: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  description: string | null;
  observation: string | null;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
  question?: {
    id: string;
    text: string;
  };
  checklist?: {
    id: string;
    standard: string;
    document: {
      id: string;
      fileName: string;
    };
  };
  correctiveActions?: CorrectiveAction[];
}

interface NonConformitiesResponse {
  status: string;
  data: {
    nonConformities: NonConformity[];
  };
  message: string;
}

interface NonConformityResponse {
  status: string;
  data: {
    nonConformity: NonConformity;
  };
  message: string;
}

interface CorrectiveActionResponse {
  status: string;
  data: {
    correctiveAction: CorrectiveAction;
  };
  message: string;
}

interface UpdateNonConformityData {
  status?: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  description?: string;
  observation?: string;
}

interface AddCorrectiveActionData {
  action: string;
}

interface ResolveNonConformityData {
  conclusion: string;
}

// Serviço de não conformidades
const nonConformityService = {
  // Listar não conformidades de um checklist
  async getNonConformities(checklistId: string): Promise<NonConformitiesResponse> {
    const response = await api.get<NonConformitiesResponse>(`/nonconformities/${checklistId}`);
    return response.data;
  },

  // Obter detalhes completos de uma não conformidade específica
  async getNonConformityDetails(id: string): Promise<NonConformityResponse> {
    const response = await api.get<NonConformityResponse>(`/nonconformities/details/${id}`);
    return response.data;
  },

  // Obter uma não conformidade específica (mantido para compatibilidade)
  async getNonConformity(id: string): Promise<NonConformityResponse> {
    return this.getNonConformityDetails(id);
  },

  // Atualizar uma não conformidade
  async updateNonConformity(id: string, data: UpdateNonConformityData): Promise<NonConformityResponse> {
    const response = await api.put<NonConformityResponse>(`/nonconformities/${id}`, data);
    return response.data;
  },

  // Adicionar ação corretiva
  async addCorrectiveAction(id: string, data: AddCorrectiveActionData): Promise<CorrectiveActionResponse> {
    const response = await api.post<CorrectiveActionResponse>(`/nonconformities/${id}/corrective-action`, data);
    return response.data;
  },

  // Concluir não conformidade
  async resolveNonConformity(id: string, data: ResolveNonConformityData): Promise<NonConformityResponse> {
    const response = await api.put<NonConformityResponse>(`/nonconformities/${id}/resolve`, data);
    return response.data;
  },

  // Gerar relatório de não conformidades em PDF
  async generateNonConformitiesReport(checklistId: string): Promise<Blob> {
    const response = await api.get(`/reports/${checklistId}/nonconformities/pdf`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Download do relatório de não conformidades
  async downloadNonConformitiesReport(checklistId: string, fileName?: string): Promise<void> {
    const blob = await this.generateNonConformitiesReport(checklistId);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName || `relatorio-nao-conformidades-${checklistId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
};

export default nonConformityService;