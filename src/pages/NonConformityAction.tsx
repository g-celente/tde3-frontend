import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Alert, Button, Card, Textarea } from '../components/ui';
import { nonConformityService } from '../services';

interface NonConformity {
  id: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'CLOSED';
  checklistId: string;
  questionId: string;
  description: string | null;
  observation: string | null;
  createdAt: string;
  updatedAt: string;
  question?: {
    id: string;
    text: string;
  };
}

const statusOptions = [
  { value: 'OPEN', label: 'Pendente' },
  { value: 'IN_PROGRESS', label: 'Em Andamento' },
  { value: 'CLOSED', label: 'Resolvido' }
];

const NonConformityAction = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [nonConformity, setNonConformity] = useState<NonConformity | null>(null);
  const [description, setDescription] = useState('');
  const [observation, setObservation] = useState('');
  const [status, setStatus] = useState<'OPEN' | 'IN_PROGRESS' | 'CLOSED'>('OPEN');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchNonConformity = async () => {
      if (!id) return;

      try {
        setLoading(true);
        // Este endpoint precisa ser implementado no backend
        const response = await nonConformityService.getNonConformity(id);
        
        if (response.data?.nonConformity) {
          const nc = response.data.nonConformity;
          setNonConformity(nc);
          setDescription(nc.description || '');
          setObservation(nc.observation || '');
          setStatus(nc.status);
        } else {
          setError('Não conformidade não encontrada');
        }
      } catch (err: any) {
        console.error(err);
        setError('Erro ao carregar não conformidade');
      } finally {
        setLoading(false);
      }
    };

    fetchNonConformity();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) return;

    try {
      setSubmitting(true);
      setError(null);

      await nonConformityService.updateNonConformity(id, {
        status,
        description: description.trim() || undefined,
        observation: observation.trim() || undefined
      });

      setSuccess('Ação corretiva salva com sucesso!');

      // Redirecionar de volta para a lista após um breve momento
      setTimeout(() => {
        if (nonConformity?.checklistId) {
          navigate(`/nonconformities/${nonConformity.checklistId}`, { 
            state: { success: 'Ação corretiva salva com sucesso!' } 
          });
        } else {
          navigate('/checklists');
        }
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Erro ao salvar ação corretiva');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!nonConformity) {
    return (
      <Alert type="error">
        Não conformidade não encontrada
      </Alert>
    );
  }

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
            Ação Corretiva
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Defina um plano de ação para resolver a não conformidade identificada.
          </p>
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
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Não Conformidade</h3>
              <p className="text-gray-700 p-4 bg-gray-50 rounded-md">
                {nonConformity.question?.text || 'Questão não encontrada'}
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <div className="flex space-x-4">
                {statusOptions.map((option) => (
                  <label key={option.value} className="inline-flex items-center">
                    <input
                      type="radio"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      value={option.value}
                      checked={status === option.value}
                      onChange={() => setStatus(option.value as 'OPEN' | 'IN_PROGRESS' | 'CLOSED')}
                    />
                    <span className="ml-2 text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Plano de Ação Corretiva
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                placeholder="Descreva as ações que serão tomadas para resolver esta não conformidade"
                rows={4}
                className="w-full"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="observation" className="block text-sm font-medium text-gray-700 mb-2">
                Observações
              </label>
              <Textarea
                id="observation"
                value={observation}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setObservation(e.target.value)}
                placeholder="Informações adicionais ou contexto sobre esta não conformidade"
                rows={3}
                className="w-full"
              />
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/nonconformities/${nonConformity.checklistId}`)}
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              isLoading={submitting}
            >
              Salvar Ação Corretiva
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default NonConformityAction;