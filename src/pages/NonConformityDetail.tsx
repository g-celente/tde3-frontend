import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  MessageSquare,
  Send,
  FileText,
  Check
} from 'lucide-react';
import nonConformityService from '../services/nonConformityService';

interface CorrectiveAction {
  id: string;
  description: string;
  createdAt: string;
  author: string;
}

interface NonConformityDetails {
  id: string;
  item: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved';
  checklistId: string;
  checklistName: string;
  createdAt: string;
  resolvedAt?: string;
  correctiveActions: CorrectiveAction[];
}

const NonConformityDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [nonConformity, setNonConformity] = useState<NonConformityDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [resolving, setResolving] = useState(false);

  useEffect(() => {
    if (id) {
      loadNonConformityDetails();
    }
  }, [id]);

  const loadNonConformityDetails = async () => {
    try {
      setLoading(true);
      
      // Mock data - replace with actual API call
      const mockData: NonConformityDetails = {
        id: id || '1',
        item: 'Item 5.2.1',
        description: 'Procedimento de limpeza não foi seguido corretamente na área de produção',
        severity: 'high',
        status: 'open',
        checklistId: 'cl1',
        checklistName: 'Auditoria de Produção - Janeiro 2024',
        createdAt: '2024-01-15T10:30:00Z',
        correctiveActions: [
          {
            id: 'ca1',
            description: 'Identificado problema na comunicação dos procedimentos para a equipe noturna.',
            createdAt: '2024-01-16T09:00:00Z',
            author: 'João Silva'
          },
          {
            id: 'ca2',
            description: 'Agendado treinamento específico sobre procedimentos de limpeza para todos os turnos.',
            createdAt: '2024-01-17T14:30:00Z',
            author: 'Maria Santos'
          }
        ]
      };
      
      setNonConformity(mockData);
    } catch (error) {
      console.error('Erro ao carregar detalhes da não conformidade:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !nonConformity) return;

    try {
      setSubmittingComment(true);
      
      // Call API to add corrective action
      await nonConformityService.addCorrectiveAction(nonConformity.id, {
        action: newComment
      });

      // Add to local state for immediate update
      const newAction: CorrectiveAction = {
        id: `ca${Date.now()}`,
        description: newComment,
        createdAt: new Date().toISOString(),
        author: 'Usuário Atual'
      };

      setNonConformity(prev => prev ? {
        ...prev,
        correctiveActions: [...prev.correctiveActions, newAction],
        status: prev.status === 'open' ? 'in_progress' : prev.status
      } : null);

      setNewComment('');
    } catch (error) {
      console.error('Erro ao adicionar ação corretiva:', error);
      alert('Erro ao adicionar ação corretiva. Tente novamente.');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleResolveNonConformity = async () => {
    if (!nonConformity) return;

    const confirmResolve = window.confirm(
      'Tem certeza que deseja marcar esta não conformidade como resolvida? Esta ação não pode ser desfeita.'
    );

    if (!confirmResolve) return;

    try {
      setResolving(true);
      
      // Call API to resolve non-conformity
      await nonConformityService.resolveNonConformity(nonConformity.id, {
        conclusion: 'Não conformidade resolvida pelo usuário'
      });

      // Update local state
      setNonConformity(prev => prev ? {
        ...prev,
        status: 'resolved',
        resolvedAt: new Date().toISOString()
      } : null);

      alert('Não conformidade marcada como resolvida com sucesso!');
    } catch (error) {
      console.error('Erro ao resolver não conformidade:', error);
      alert('Erro ao resolver não conformidade. Tente novamente.');
    } finally {
      setResolving(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-yellow-600 bg-yellow-100';
      case 'medium': return 'text-orange-600 bg-orange-100';
      case 'high': return 'text-red-600 bg-red-100';
      case 'critical': return 'text-red-800 bg-red-200';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-red-600 bg-red-100';
      case 'in_progress': return 'text-yellow-600 bg-yellow-100';
      case 'resolved': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <AlertTriangle className="w-4 h-4" />;
      case 'in_progress': return <Clock className="w-4 h-4" />;
      case 'resolved': return <CheckCircle className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open': return 'Aberta';
      case 'in_progress': return 'Em Progresso';
      case 'resolved': return 'Resolvida';
      default: return status;
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'low': return 'Baixa';
      case 'medium': return 'Média';
      case 'high': return 'Alta';
      case 'critical': return 'Crítica';
      default: return severity;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#151C2B] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-orange-200 border-t-orange-600 rounded-full"
        />
      </div>
    );
  }

  if (!nonConformity) {
    return (
      <div className="min-h-screen bg-[#151C2B] flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">
            Não conformidade não encontrada
          </h2>
          <button
            onClick={() => navigate('/nonconformities')}
            className="text-orange-400 hover:text-orange-300 font-medium"
          >
            Voltar para não conformidades
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#151C2B] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/nonconformities')}
            className="flex items-center gap-2 text-gray-300 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar para Não Conformidades
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Não Conformidade #{nonConformity.id}
              </h1>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-300 bg-gray-700 px-3 py-1 rounded-lg">
                  {nonConformity.item}
                </span>
                <span className={`text-xs font-medium px-2 py-1 rounded-lg ${getSeverityColor(nonConformity.severity)}`}>
                  {getSeverityText(nonConformity.severity)}
                </span>
                <span className={`text-xs font-medium px-2 py-1 rounded-lg flex items-center gap-1 ${getStatusColor(nonConformity.status)}`}>
                  {getStatusIcon(nonConformity.status)}
                  {getStatusText(nonConformity.status)}
                </span>
              </div>
            </div>

            {nonConformity.status !== 'resolved' && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleResolveNonConformity}
                disabled={resolving}
                className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {resolving ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <Check className="w-5 h-5" />
                )}
                Marcar como Resolvida
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800/80 backdrop-blur-sm border border-gray-600/30 rounded-xl p-6 shadow-lg mb-6"
        >
          <h2 className="text-xl font-semibold text-white mb-4">Detalhes</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Descrição
              </label>
              <p className="text-white">{nonConformity.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Checklist
                </label>
                <div className="flex items-center gap-2 text-white">
                  <FileText className="w-4 h-4" />
                  {nonConformity.checklistName}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Data de Criação
                </label>
                <div className="flex items-center gap-2 text-white">
                  <Calendar className="w-4 h-4" />
                  {new Date(nonConformity.createdAt).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>

            {nonConformity.resolvedAt && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Data de Resolução
                </label>
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle className="w-4 h-4" />
                  {new Date(nonConformity.resolvedAt).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Corrective Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800/80 backdrop-blur-sm border border-gray-600/30 rounded-xl p-6 shadow-lg mb-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <MessageSquare className="w-5 h-5 text-orange-400" />
            <h2 className="text-xl font-semibold text-white">
              Ações Corretivas ({nonConformity.correctiveActions.length})
            </h2>
          </div>

          <div className="space-y-4 mb-6">
            {nonConformity.correctiveActions.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-300">
                  Nenhuma ação corretiva registrada ainda.
                </p>
              </div>
            ) : (
              nonConformity.correctiveActions.map((action, index) => (
                <motion.div
                  key={action.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-gray-700/50 border border-gray-600 rounded-lg p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-white">{action.author}</span>
                        <span className="text-sm text-gray-300">
                          {new Date(action.createdAt).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <p className="text-gray-200">{action.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Add New Comment */}
          {nonConformity.status !== 'resolved' && (
            <div className="border-t border-gray-600 pt-6">
              <h3 className="text-lg font-medium text-white mb-4">
                Adicionar Ação Corretiva
              </h3>
              <div className="space-y-4">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Descreva a ação corretiva tomada ou planejada..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors bg-gray-700/50 text-white placeholder-gray-400 resize-none"
                />
                <div className="flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddComment}
                    disabled={!newComment.trim() || submittingComment}
                    className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {submittingComment ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    Adicionar Ação
                  </motion.button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default NonConformityDetail;