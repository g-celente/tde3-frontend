import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Alert, Button, Card } from '../components/ui';
import { documentService } from '../services';

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

const Documents = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar documentos
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const response = await documentService.getDocuments();
        setDocuments(response.data.documents);
      } catch (err: any) {
        setError('Erro ao carregar documentos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  // Função para excluir documento
  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este documento?')) {
      try {
        await documentService.deleteDocument(id);
        setDocuments(documents.filter(doc => doc.id !== id));
      } catch (err: any) {
        setError('Erro ao excluir documento');
        console.error(err);
      }
    }
  };

  if (loading) {
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
            Documentos
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Gerencie seus documentos para criar checklists
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link to="/documents/upload">
            <Button>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
              </svg>
              Enviar Documento
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <Alert type="error" className="mb-6">
          {error}
        </Alert>
      )}

      {documents.length === 0 ? (
        <Card>
          <div className="text-center py-10">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">Nenhum documento</h3>
            <p className="mt-1 text-sm text-gray-500">
              Comece enviando seu primeiro documento para análise.
            </p>
            <div className="mt-6">
              <Link to="/documents/upload">
                <Button>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                  Enviar Documento
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {documents.map((document) => (
            <Card key={document.id}>
              <div className="flex items-center">
                <div className="flex-shrink-0 h-12 w-12 bg-gray-100 rounded-md flex items-center justify-center">
                  <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">{document.fileName}</h3>
                  <p className="text-sm text-gray-500">
                    Enviado em {new Date(document.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <Link to={`/checklists/create/${document.id}`}>
                  <Button size="sm" variant="primary">
                    Criar Checklist
                  </Button>
                </Link>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDelete(document.id)}
                >
                  Excluir
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Documents;