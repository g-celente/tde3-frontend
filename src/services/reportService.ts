import api from './api';

// Tipos
interface ChecklistSummary {
  id: string;
  standard: string;
  documentName: string;
  createdAt: string;
  totalQuestions: number;
  conformities: number;
  nonConformities: number;
  conformityRate: number;
}

interface ReportResponse {
  status: string;
  data: {
    report: ChecklistSummary;
  };
  message: string;
}

// Serviço de relatórios
const reportService = {
  // Obter relatório de um checklist
  async getChecklistReport(checklistId: string): Promise<ReportResponse> {
    const response = await api.get<ReportResponse>(`/reports/${checklistId}`);
    return response.data;
  },

  // Gerar relatório em PDF
  async generateReportPdf(checklistId: string): Promise<Blob> {
    const response = await api.get(`/reports/${checklistId}/pdf`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Download do relatório em PDF
  downloadPdfReport(checklistId: string): void {
    this.generateReportPdf(checklistId).then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `checklist-report-${checklistId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    });
  }
};

export default reportService;