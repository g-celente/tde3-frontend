import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Alert, Button, Card } from '../components/ui';
import { checklistService, reportService } from '../services';

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

const Reports = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [report, setReport] = useState<ChecklistSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      if (!id) return;

      try {
        setLoading(true);
        // Obter relatório do checklist
        const response = await reportService.getChecklistReport(id);
        
        if (response.data?.report) {
          setReport(response.data.report);
        } else {
          setError('Relatório não encontrado');
        }
      } catch (err: any) {
        console.error(err);
        setError('Erro ao carregar relatório');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  const handleGeneratePdf = async () => {
    if (!id) return;

    try {
      setGenerating(true);
      setError(null);
      
      // Gerar PDF do relatório
      const blob = await reportService.generateReportPdf(id);
      
      // Criar link para download do arquivo
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `relatorio-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      // Limpar link após download
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setSuccess('Relatório PDF gerado com sucesso!');
    } catch (err: any) {
      console.error(err);
      setError('Erro ao gerar PDF do relatório');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!report) {
    return (
      <Alert type="error">
        Relatório não encontrado
      </Alert>
    );
  }

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
            Relatório de Conformidade
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Resumo dos resultados da auditoria para o documento
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
          <Button
            variant="outline"
            onClick={() => navigate(`/checklists/${id}`)}
          >
            Voltar ao Checklist
          </Button>
          <Button
            onClick={handleGeneratePdf}
            isLoading={generating}
          >
            Exportar PDF
          </Button>
        </div>
      </div>

      {error && (
        <Alert type="error" className="mb-6" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert type="success" className="mb-6" onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      <Card>
        <div className="p-4 bg-gray-50 border-b">
          <h3 className="text-lg font-medium">Informações do Checklist</h3>
        </div>
        <div className="p-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Norma</dt>
              <dd className="mt-1 text-sm text-gray-900">{report.standard}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Documento</dt>
              <dd className="mt-1 text-sm text-gray-900">{report.documentName}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Data da Auditoria</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(report.createdAt).toLocaleDateString('pt-BR')}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Total de Perguntas</dt>
              <dd className="mt-1 text-sm text-gray-900">{report.totalQuestions}</dd>
            </div>
          </dl>
        </div>
      </Card>

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {/* Conformidades */}
        <Card>
          <div className="p-6 text-center">
            <h3 className="text-lg font-medium text-gray-900">Conformidades</h3>
            <div className="mt-4 text-4xl font-bold text-green-600">{report.conformities}</div>
            <p className="mt-1 text-sm text-gray-500">
              Perguntas respondidas com "Sim"
            </p>
          </div>
        </Card>

        {/* Não Conformidades */}
        <Card>
          <div className="p-6 text-center">
            <h3 className="text-lg font-medium text-gray-900">Não Conformidades</h3>
            <div className="mt-4 text-4xl font-bold text-red-600">{report.nonConformities}</div>
            <p className="mt-1 text-sm text-gray-500">
              Perguntas respondidas com "Não"
            </p>
          </div>
        </Card>

        {/* Taxa de Conformidade */}
        <Card>
          <div className="p-6 text-center">
            <h3 className="text-lg font-medium text-gray-900">Taxa de Conformidade</h3>
            <div className="mt-4 text-4xl font-bold" style={{ 
              color: report.conformityRate >= 80 ? '#059669' : 
                    report.conformityRate >= 50 ? '#D97706' : '#DC2626' 
            }}>
              {report.conformityRate.toFixed(1)}%
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Percentual de perguntas em conformidade
            </p>
          </div>
        </Card>
      </div>

      <div className="mt-8">
        <div className="h-2 bg-gray-200 rounded-full">
          <div 
            className="h-2 rounded-full" 
            style={{ 
              width: `${report.conformityRate}%`,
              backgroundColor: report.conformityRate >= 80 ? '#059669' : 
                              report.conformityRate >= 50 ? '#D97706' : '#DC2626'
            }}
          ></div>
        </div>
        <div className="mt-4 flex justify-between text-sm text-gray-500">
          <div>0%</div>
          <div>50%</div>
          <div>100%</div>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <Button
          onClick={() => navigate(`/nonconformities/${id}`)}
          variant={report.nonConformities > 0 ? 'primary' : 'outline'}
          className="w-full md:w-auto"
        >
          {report.nonConformities > 0 
            ? `Ver ${report.nonConformities} Não Conformidades` 
            : 'Nenhuma Não Conformidade Encontrada'}
        </Button>
      </div>
    </div>
  );
};

export default Reports;