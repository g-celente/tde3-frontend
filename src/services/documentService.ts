import api from './api';

// Tipos
interface Document {
  id: string;
  fileName: string;
  filePath: string;
  fileType: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface DocumentsResponse {
  status: string;
  data: {
    documents: Document[];
  };
  message: string;
}

interface DocumentResponse {
  status: string;
  data: {
    document: Document;
  };
  message: string;
}

// Serviço de documentos
const documentService = {
  // Listar todos os documentos do usuário
  async getDocuments(): Promise<DocumentsResponse> {
    const response = await api.get<DocumentsResponse>('/documents');
    return response.data;
  },

  // Obter um documento específico
  async getDocument(id: string): Promise<DocumentResponse> {
    const response = await api.get<DocumentResponse>(`/documents/${id}`);
    return response.data;
  },

  // Upload de documento
  async uploadDocument(file: File): Promise<DocumentResponse> {
    const formData = new FormData();
    formData.append('document', file);

    const response = await api.post<DocumentResponse>('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  // Excluir documento
  async deleteDocument(id: string): Promise<any> {
    const response = await api.delete(`/documents/${id}`);
    return response.data;
  }
};

export default documentService;