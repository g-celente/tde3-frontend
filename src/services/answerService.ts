import api from './api';

// Tipos
interface Answer {
  id: string;
  response: boolean;
  questionId: string;
  createdAt: string;
  updatedAt: string;
}

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

interface AnswerRequest {
  questionId: string;
  response: boolean;
}

interface AnswersResponse {
  status: string;
  data: {
    savedAnswers: Answer[];
    nonConformities: NonConformity[];
  };
  message: string;
}

// Serviço de respostas
const answerService = {
  // Responder às perguntas de um checklist
  async answerQuestions(checklistId: string, answers: AnswerRequest[]): Promise<AnswersResponse> {
    const response = await api.post<AnswersResponse>(`/answers/${checklistId}`, {
      answers
    });
    return response.data;
  }
};

export default answerService;