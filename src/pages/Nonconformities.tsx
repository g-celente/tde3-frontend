import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Search, 
  Download, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Eye,
  MessageSquare,
  Plus,
  Calendar
} from 'lucide-react';
import nonConformityService from '../services/nonConformityService';

interface NonConformity {
  id: string;
  item: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved';
  checklistId: string;
  checklistName?: string;
  createdAt: string;
  resolvedAt?: string;
  correctiveActions?: Array<{
    id: string;
    description: string;
    createdAt: string;
    author: string;
  }>;
}

const Nonconformities: React.FC = () => {
  const navigate = useNavigate();
  const { checklistId } = useParams<{ checklistId: string }>();
  const [nonConformities, setNonConformities] = useState<NonConformity[]>([]);
  const [filteredNonConformities, setFilteredNonConformities] = useState<NonConformity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [selectedChecklist, setSelectedChecklist] = useState<string>('all');
  const [checklists, setChecklists] = useState<Array<{ id: string; name: string }>>([]);

  useEffect(() => {
    loadNonConformities();
    loadChecklists();
  }, []);

  useEffect(() => {
    filterNonConformities();
  }, [nonConformities, searchTerm, statusFilter, severityFilter, selectedChecklist]);

  const loadNonConformities = async () => {
    try {
      setLoading(true);
      
      if (checklistId) {
        // Carregar não conformidades específicas do checklist
        const response = await nonConformityService.getNonConformities(checklistId);
        
        // Mapear dados da API para o formato do componente
        const mappedData: NonConformity[] = response.data.nonConformities.map(nc => ({
          id: nc.id,
          item: nc.question?.text || 'Item não especificado',
          description: nc.description || nc.observation || 'Sem descrição',
          severity: 'medium', // Como a API não retorna severity, definir como padrão
          status: nc.status.toLowerCase() as 'open' | 'in_progress' | 'resolved',
          checklistId: nc.checklist?.id || checklistId,
          checklistName: nc.checklist?.standard || 'Checklist',
          createdAt: nc.createdAt,
          resolvedAt: nc.resolvedAt || undefined,
          correctiveActions: nc.correctiveActions?.map(ca => ({
            id: ca.id,
            description: ca.action,
            createdAt: ca.createdAt,
            author: 'Sistema' // Como a API não retorna autor, usar valor padrão
          })) || []
        }));
        
        setNonConformities(mappedData);
      } else {
        // Carregar todas as não conformidades (dados mock para demonstração)
        const mockData: NonConformity[] = [
          {
            id: '1',
            item: 'Item 5.2.1',
            description: 'Procedimento de limpeza não foi seguido corretamente na área de produção',
            severity: 'high',
            status: 'open',
            checklistId: 'cl1',
            checklistName: 'Auditoria de Produção - Janeiro 2024',
            createdAt: '2024-01-15T10:30:00Z',
            correctiveActions: []
          },
          {
            id: '2',
            item: 'Item 3.1.4',
            description: 'Falta de documentação atualizada sobre processo de controle de qualidade',
            severity: 'medium',
            status: 'in_progress',
            checklistId: 'cl2',
            checklistName: 'Auditoria de Qualidade - Janeiro 2024',
            createdAt: '2024-01-14T14:20:00Z',
            correctiveActions: [
              {
                id: 'ca1',
                description: 'Iniciado processo de atualização da documentação',
                createdAt: '2024-01-16T09:00:00Z',
                author: 'João Silva'
              }
            ]
          },
          {
            id: '3',
            item: 'Item 7.3.2',
            description: 'Equipamento de segurança vencido encontrado em uso',
            severity: 'critical',
            status: 'resolved',
            checklistId: 'cl1',
            checklistName: 'Auditoria de Produção - Janeiro 2024',
            createdAt: '2024-01-13T08:45:00Z',
            resolvedAt: '2024-01-15T16:30:00Z',
            correctiveActions: [
              {
                id: 'ca2',
                description: 'Equipamento substituído imediatamente',
                createdAt: '2024-01-13T10:00:00Z',
                author: 'Maria Santos'
              },
              {
                id: 'ca3',
                description: 'Implementado sistema de controle de validade',
                createdAt: '2024-01-15T16:30:00Z',
                author: 'Carlos Lima'
              }
            ]
          }
        ];
        setNonConformities(mockData);
      }
    } catch (error) {
      console.error('Erro ao carregar não conformidades:', error);
      setNonConformities([]); // Em caso de erro, mostrar lista vazia
    } finally {
      setLoading(false);
    }
  };

  const loadChecklists = async () => {
    try {
      // Mock data - replace with actual API call
      const mockChecklists = [
        { id: 'cl1', name: 'Auditoria de Produção - Janeiro 2024' },
        { id: 'cl2', name: 'Auditoria de Qualidade - Janeiro 2024' },
        { id: 'cl3', name: 'Auditoria de Segurança - Janeiro 2024' }
      ];
      setChecklists(mockChecklists);
    } catch (error) {
      console.error('Erro ao carregar checklists:', error);
    }
  };

  const filterNonConformities = () => {
    let filtered = nonConformities;

    if (searchTerm) {
      filtered = filtered.filter(nc => 
        nc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nc.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nc.checklistName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(nc => nc.status === statusFilter);
    }

    if (severityFilter !== 'all') {
      filtered = filtered.filter(nc => nc.severity === severityFilter);
    }

    if (selectedChecklist !== 'all') {
      filtered = filtered.filter(nc => nc.checklistId === selectedChecklist);
    }

    setFilteredNonConformities(filtered);
  };

  const handleGenerateReport = async () => {
    if (selectedChecklist === 'all') {
      alert('Selecione um checklist específico para gerar o relatório');
      return;
    }

    try {
      await nonConformityService.downloadNonConformitiesReport(selectedChecklist);
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      alert('Erro ao gerar relatório. Tente novamente.');
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

  const stats = {
    total: nonConformities.length,
    open: nonConformities.filter(nc => nc.status === 'open').length,
    inProgress: nonConformities.filter(nc => nc.status === 'in_progress').length,
    resolved: nonConformities.filter(nc => nc.status === 'resolved').length,
    critical: nonConformities.filter(nc => nc.severity === 'critical').length
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

  return (
    <div className="min-h-screen bg-[#151C2B] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Não Conformidades
              </h1>
              <p className="text-gray-300">
                Gerencie e acompanhe as não conformidades identificadas nas auditorias
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGenerateReport}
              disabled={selectedChecklist === 'all'}
              className="mt-4 md:mt-0 bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Gerar Relatório
            </motion.button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-800/80 backdrop-blur-sm border border-gray-600/30 rounded-xl p-4 shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-slate-500 to-slate-600 rounded-lg">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-300">Total</p>
                  <p className="text-2xl font-bold text-white">{stats.total}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800/80 backdrop-blur-sm border border-gray-600/30 rounded-xl p-4 shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-red-500 to-red-600 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-300">Abertas</p>
                  <p className="text-2xl font-bold text-red-400">{stats.open}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-800/80 backdrop-blur-sm border border-gray-600/30 rounded-xl p-4 shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-300">Em Progresso</p>
                  <p className="text-2xl font-bold text-orange-400">{stats.inProgress}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-800/80 backdrop-blur-sm border border-gray-600/30 rounded-xl p-4 shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-300">Resolvidas</p>
                  <p className="text-2xl font-bold text-green-400">{stats.resolved}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-gray-800/80 backdrop-blur-sm border border-gray-600/30 rounded-xl p-4 shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-red-600 to-red-700 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-300">Críticas</p>
                  <p className="text-2xl font-bold text-red-400">{stats.critical}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800/80 backdrop-blur-sm border border-gray-600/30 rounded-xl p-6 shadow-lg mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Pesquisar
              </label>
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por descrição, item ou checklist..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors bg-gray-700/50 text-white placeholder-gray-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Checklist
              </label>
              <select
                value={selectedChecklist}
                onChange={(e) => setSelectedChecklist(e.target.value)}
                className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors bg-gray-700/50 text-white"
              >
                <option value="all">Todos os Checklists</option>
                {checklists.map(checklist => (
                  <option key={checklist.id} value={checklist.id}>
                    {checklist.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors bg-gray-700/50 text-white"
              >
                <option value="all">Todos os Status</option>
                <option value="open">Abertas</option>
                <option value="in_progress">Em Progresso</option>
                <option value="resolved">Resolvidas</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Severidade
              </label>
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors bg-gray-700/50 text-white"
              >
                <option value="all">Todas as Severidades</option>
                <option value="low">Baixa</option>
                <option value="medium">Média</option>
                <option value="high">Alta</option>
                <option value="critical">Crítica</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Nonconformities List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          {filteredNonConformities.length === 0 ? (
            <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-600/30 rounded-xl p-12 shadow-lg text-center">
              <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Nenhuma não conformidade encontrada
              </h3>
              <p className="text-gray-300">
                Não há não conformidades que correspondam aos filtros selecionados.
              </p>
            </div>
          ) : (
            filteredNonConformities.map((nonConformity, index) => (
              <motion.div
                key={nonConformity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.01 }}
                className="bg-gray-800/80 backdrop-blur-sm border border-gray-600/30 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-sm font-medium text-gray-300 bg-gray-700 px-2 py-1 rounded-lg">
                        {nonConformity.item}
                      </span>
                      <span className={`text-xs font-medium px-2 py-1 rounded-lg flex items-center gap-1 ${getSeverityColor(nonConformity.severity)}`}>
                        {getSeverityText(nonConformity.severity)}
                      </span>
                      <span className={`text-xs font-medium px-2 py-1 rounded-lg flex items-center gap-1 ${getStatusColor(nonConformity.status)}`}>
                        {getStatusIcon(nonConformity.status)}
                        {getStatusText(nonConformity.status)}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {nonConformity.description}
                    </h3>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-300 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(nonConformity.createdAt).toLocaleDateString('pt-BR')}
                      </div>
                      {nonConformity.checklistName && (
                        <div className="flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          {nonConformity.checklistName}
                        </div>
                      )}
                    </div>

                    {nonConformity.correctiveActions && nonConformity.correctiveActions.length > 0 && (
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <MessageSquare className="w-4 h-4" />
                        <span>{nonConformity.correctiveActions.length} ação(ões) corretiva(s)</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate(`/nonconformities/${nonConformity.id}`)}
                      className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Visualizar
                    </motion.button>
                    
                    {nonConformity.status !== 'resolved' && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate(`/nonconformities/${nonConformity.id}`)}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Ação
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Nonconformities;