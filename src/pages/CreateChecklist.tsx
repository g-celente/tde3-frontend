import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Button, Card, Select } from '../components/ui';
import { documentService, checklistService } from '../services';

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

const CreateChecklist = () => {
  const { documentId } = useParams<{ documentId?: string }>();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<string>(documentId || '');
  const [standard, setStandard] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [fetchingDocs, setFetchingDocs] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Padrões disponíveis
  const standards = [
    { value: 'ISO 9001', label: 'ISO 9001 - Gestão de Qualidade' },
    { value: 'ISO 27001', label: 'ISO 27001 - Segurança da Informação' },
    { value: 'PMBOK', label: 'PMBOK - Gestão de Projetos' },
  ];

  // Carregar documentos
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setFetchingDocs(true);
        const response = await documentService.getDocuments();
        setDocuments(response.data.documents);
      } catch (err: any) {
        setError('Erro ao carregar documentos');
        console.error(err);
      } finally {
        setFetchingDocs(false);
      }
    };

    fetchDocuments();
  }, []);

  // Função para criar checklist
  const handleCreate = async () => {
    if (!selectedDocument) {
      setError('Selecione um documento');
      return;
    }

    if (!standard) {
      setError('Selecione um padrão de referência');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await checklistService.createChecklist(selectedDocument, { standard });
      navigate(`/checklists/${response.data.checklist.id}`, { state: { success: 'Checklist criado com sucesso!' } });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar checklist');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Transformar documentos em opções para o select
  const documentOptions = documents.map(doc => ({
    value: doc.id,
    label: doc.fileName
  }));

  if (fetchingDocs) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
            Criar Checklist
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Selecione um documento e um padrão de referência para gerar perguntas com IA
          </p>
        </div>
      </div>

      {documents.length === 0 ? (
        <Card>
          <div className="text-center py-10">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">Nenhum documento encontrado</h3>
            <p className="mt-1 text-sm text-gray-500">
              Você precisa enviar um documento antes de criar um checklist.
            </p>
            <div className="mt-6">
              <Button
                onClick={() => navigate('/documents/upload')}
              >
                Enviar Documento
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="max-w-3xl mx-auto">
          <div className="p-6">
            {error && (
              <Alert type="error" className="mb-6">
                {error}
              </Alert>
            )}

            <div className="space-y-6">
              <div>
                <Select
                  label="Documento"
                  id="document"
                  options={documentOptions}
                  value={selectedDocument}
                  onChange={(e) => setSelectedDocument(e.target.value)}
                  fullWidth
                  helperText="Selecione o documento que deseja analisar"
                />
              </div>

              <div>
                <Select
                  label="Padrão de Referência"
                  id="standard"
                  options={standards}
                  value={standard}
                  onChange={(e) => setStandard(e.target.value)}
                  fullWidth
                  helperText="Selecione o padrão para gerar as perguntas do checklist"
                />
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleCreate}
                  isLoading={loading}
                  disabled={!selectedDocument || !standard}
                >
                  Gerar Checklist com IA
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default CreateChecklist;