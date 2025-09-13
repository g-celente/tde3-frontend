import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  CheckSquare, 
  AlertTriangle, 
  Upload, 
  Plus, 
  ArrowRight,
  TrendingUp,
  Users,
  Calendar,
  Activity
} from 'lucide-react';
import { Card, Button } from '../components/ui';
import { documentService, checklistService } from '../services';
import { useAuth } from '../hooks';

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

const Dashboard = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar dados
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [documentsResponse, checklistsResponse] = await Promise.all([
          documentService.getDocuments(),
          checklistService.getChecklists()
        ]);
        
        setDocuments(documentsResponse.data.documents);
        setChecklists(checklistsResponse.data.checklists);
      } catch (err: any) {
        setError('Erro ao carregar dados do dashboard');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calcular estatísticas
  const stats = [
    { 
      name: 'Documentos', 
      count: documents.length, 
      icon: <FileText size={24} />, 
      linkTo: '/documents',
      change: '+12%',
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      name: 'Checklists', 
      count: checklists.length, 
      icon: <CheckSquare size={24} />, 
      linkTo: '/checklists',
      change: '+8%',
      color: 'from-green-500 to-emerald-500'
    },
    { 
      name: 'Não Conformidades', 
      count: 0,
      icon: <AlertTriangle size={24} />, 
      linkTo: '/nonconformities',
      change: '-5%',
      color: 'from-orange-500 to-red-500'
    },
    { 
      name: 'Usuários Ativos', 
      count: 1,
      icon: <Users size={24} />, 
      linkTo: '/users',
      change: '+3%',
      color: 'from-purple-500 to-pink-500'
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <motion.div
          className="flex flex-col items-center space-y-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="text-lg font-medium text-gray-600 dark:text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Carregando dashboard...
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      {/* Header */}
      <motion.div 
        className="md:flex md:items-center md:justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Bem-vindo de volta, <span className="font-semibold text-blue-600 dark:text-blue-400">{user?.name}</span>! 
            Aqui está um resumo do seu progresso.
          </p>
        </div>
        <motion.div 
          className="mt-4 flex md:mt-0 md:ml-4 space-x-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link to="/documents/upload">
            <Button variant="outline" leftIcon={<Upload size={18} />}>
              Enviar Documento
            </Button>
          </Link>
          <Link to="/checklists/create">
            <Button variant="gradient" leftIcon={<Plus size={18} />}>
              Criar Checklist
            </Button>
          </Link>
        </motion.div>
      </motion.div>

      {/* Error Alert */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 p-4 rounded-lg"
          >
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Grid */}
      <motion.div 
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * index }}
            whileHover={{ y: -5 }}
          >
            <Link to={stat.linkTo}>
              <Card variant="glass" className="relative overflow-hidden group cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.name}
                    </p>
                    <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                      {stat.count}
                    </p>
                    <div className="mt-2 flex items-center">
                      <TrendingUp size={16} className="text-green-500 mr-1" />
                      <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                        {stat.change}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                        vs. último mês
                      </span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-2xl bg-gradient-to-r ${stat.color} text-white`}>
                    {stat.icon}
                  </div>
                </div>
                
                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card variant="glass" className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Atividade Recente
              </h3>
            </div>
            <Button variant="ghost" size="sm" rightIcon={<ArrowRight size={16} />}>
              Ver todas
            </Button>
          </div>
          
          <div className="space-y-4">
            {[1, 2, 3].map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
              >
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Novo documento adicionado
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Há 2 horas
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Documents */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card variant="glass" className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Documentos Recentes
                </h3>
              </div>
              <Link to="/documents">
                <Button variant="ghost" size="sm" rightIcon={<ArrowRight size={16} />}>
                  Ver todos
                </Button>
              </Link>
            </div>
            
            {documents.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Nenhum documento encontrado
                </p>
                <Link to="/documents/upload">
                  <Button variant="outline" size="sm" leftIcon={<Upload size={16} />}>
                    Enviar primeiro documento
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {documents.slice(0, 3).map((doc: any, index) => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <FileText className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {doc.fileName}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                          <Calendar size={12} className="mr-1" />
                          {new Date(doc.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Link to={`/checklists/create/${doc.id}`}>
                      <Button size="sm" variant="ghost">
                        Criar Checklist
                      </Button>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>

        {/* Recent Checklists */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card variant="glass" className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                  <CheckSquare className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Checklists Recentes
                </h3>
              </div>
              <Link to="/checklists">
                <Button variant="ghost" size="sm" rightIcon={<ArrowRight size={16} />}>
                  Ver todos
                </Button>
              </Link>
            </div>
            
            {checklists.length === 0 ? (
              <div className="text-center py-8">
                <CheckSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Nenhum checklist encontrado
                </p>
                {documents.length > 0 && (
                  <Link to="/checklists/create">
                    <Button variant="outline" size="sm" leftIcon={<Plus size={16} />}>
                      Criar primeiro checklist
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {checklists.slice(0, 3).map((checklist: any, index) => (
                  <motion.div
                    key={checklist.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                        <CheckSquare className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          Checklist {checklist.standard}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                          <Calendar size={12} className="mr-1" />
                          {new Date(checklist.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Link to={`/checklists/${checklist.id}`}>
                      <Button size="sm" variant="gradient">
                        Visualizar
                      </Button>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;