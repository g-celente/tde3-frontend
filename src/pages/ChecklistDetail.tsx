import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Alert, Button, Card, RadioGroup } from '../components/ui';
import { checklistService, answerService } from '../services';

// Tipos
interface Question {
  id: string;
  text: string;
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
  questions: Question[];
}

const ChecklistDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [checklist, setChecklist] = useState<Checklist | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Verificar se há mensagem de sucesso na navegação
  useEffect(() => {
    if (location.state?.success) {
      setSuccess(location.state.success as string);
    }
  }, [location]);

  // Carregar checklist
  useEffect(() => {
    const fetchChecklist = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await checklistService.getChecklist(id);
        
        // Validar que temos os dados esperados
        if (response.data?.checklist && Array.isArray(response.data.checklist.questions)) {
          setChecklist(response.data.checklist as Checklist);
          
          // Inicializar respostas com valores existentes
          const initialAnswers: Record<string, string> = {};
          response.data.checklist.questions.forEach((question: Question) => {
            if (question.answer !== null && question.answer !== undefined) {
              initialAnswers[question.id] = question.answer ? 'true' : 'false';
            }
          });
          
          setAnswers(initialAnswers);
        } else {
          setError('Formato de resposta inválido');
        }
      } catch (err: any) {
        setError('Erro ao carregar checklist');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchChecklist();
  }, [id]);

  // Função para lidar com a mudança nas respostas
  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers({
      ...answers,
      [questionId]: value
    });
  };

  // Função para enviar respostas
  const handleSubmit = async () => {
    if (!id || !checklist) return;

    // Verificar se todas as perguntas foram respondidas
    const unansweredQuestions = checklist.questions.filter(
      (question: Question) => !answers[question.id]
    );

    if (unansweredQuestions.length > 0) {
      setError(`Por favor, responda todas as ${unansweredQuestions.length} perguntas restantes.`);
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      
      // Formatar respostas para o formato esperado pela API
      const formattedAnswers = Object.entries(answers).map(([questionId, response]) => ({
        questionId,
        response: response === 'true'
      }));
      
      await answerService.answerQuestions(id, formattedAnswers);
      setSuccess('Respostas salvas com sucesso!');
      
      // Redirecionar para a página de não conformidades
      setTimeout(() => {
        navigate(`/nonconformities/${id}`);
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao salvar respostas');
      console.error(err);
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

  if (!checklist) {
    return (
      <Alert type="error">
        Checklist não encontrado
      </Alert>
    );
  }

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
            Checklist {checklist.standard}
          </h2>
          {checklist.document && (
            <p className="mt-1 text-sm text-gray-500">
              Documento: {checklist.document.fileName}
            </p>
          )}
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Button
            onClick={handleSubmit}
            isLoading={submitting}
          >
            Salvar Respostas
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
          <h3 className="text-lg font-medium">Responda as perguntas abaixo</h3>
          <p className="text-sm text-gray-500">
            Todas as perguntas devem ser respondidas com Sim ou Não.
          </p>
        </div>
        <div className="p-6">
          <div className="space-y-8">
            {checklist.questions.map((question: Question, index: number) => (
              <div key={question.id} className={index > 0 ? 'pt-6 border-t' : ''}>
                <div className="mb-4">
                  <h4 className="text-base font-medium">
                    {index + 1}. {question.text}
                  </h4>
                </div>
                <RadioGroup
                  name={`question-${question.id}`}
                  options={[
                    { value: 'true', label: 'Sim' },
                    { value: 'false', label: 'Não' }
                  ]}
                  value={answers[question.id] || ''}
                  onChange={(value) => handleAnswerChange(question.id, value)}
                  inline
                />
              </div>
            ))}
          </div>
        </div>
        <div className="p-4 bg-gray-50 border-t flex justify-end">
          <Button
            onClick={handleSubmit}
            isLoading={submitting}
          >
            Salvar Respostas
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ChecklistDetail;