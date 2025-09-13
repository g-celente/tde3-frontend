import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Alert, Button, Card } from '../components/ui';
import { checklistService } from '../services';

// Tipos
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
  questions?: any[];
}

const Checklists = () => {
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar checklists
  useEffect(() => {
    const fetchChecklists = async () => {
      try {
        setLoading(true);
        const response = await checklistService.getChecklists();
        setChecklists(response.data.checklists);
      } catch (err: any) {
        setError('Erro ao carregar checklists');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchChecklists();
  }, []);

  // Função para excluir checklist
  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este checklist?')) {
      try {
        await checklistService.deleteChecklist(id);
        setChecklists(checklists.filter(checklist => checklist.id !== id));
      } catch (err: any) {
        setError('Erro ao excluir checklist');
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
            Checklists
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Gerencie seus checklists de auditoria
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link to="/checklists/create">
            <Button>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
              </svg>
              Criar Checklist
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <Alert type="error" className="mb-6">
          {error}
        </Alert>
      )}

      {checklists.length === 0 ? (
        <Card>
          <div className="text-center py-10">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">Nenhum checklist</h3>
            <p className="mt-1 text-sm text-gray-500">
              Comece criando seu primeiro checklist baseado em um documento.
            </p>
            <div className="mt-6">
              <Link to="/checklists/create">
                <Button>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                  Criar Checklist
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {checklists.map((checklist) => (
            <Card key={checklist.id}>
              <div className="flex items-center">
                <div className="flex-shrink-0 h-12 w-12 bg-blue-100 rounded-md flex items-center justify-center">
                  <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Checklist {checklist.standard}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Criado em {new Date(checklist.createdAt).toLocaleDateString()}
                  </p>
                  {checklist.document && (
                    <p className="text-xs text-gray-500 mt-1">
                      Documento: {checklist.document.fileName}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <Link to={`/checklists/${checklist.id}`}>
                  <Button size="sm" variant="primary">
                    Responder
                  </Button>
                </Link>
                <Link to={`/nonconformities/checklist/${checklist.id}`}>
                  <Button size="sm" variant="secondary">
                    NCs
                  </Button>
                </Link>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDelete(checklist.id)}
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

export default Checklists;