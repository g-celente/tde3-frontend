import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, Card, FileUpload } from '../components/ui';
import { documentService } from '../services';

const DocumentUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Função para lidar com o upload
  const handleUpload = async () => {
    if (!file) {
      setError('Selecione um arquivo para enviar');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await documentService.uploadDocument(file);
      navigate('/documents', { state: { success: 'Documento enviado com sucesso!' } });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao enviar documento');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
            Enviar Documento
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Envie um documento para análise e criação de checklists
          </p>
        </div>
      </div>

      <Card className="max-w-3xl mx-auto">
        <div className="p-6">
          {error && (
            <Alert type="error" className="mb-6">
              {error}
            </Alert>
          )}

          <div className="space-y-6">
            <div>
              <FileUpload
                label="Documento"
                accept=".pdf,.doc,.docx,.txt"
                onChange={setFile}
                value={file}
                helperText="Formatos aceitos: PDF, DOC, DOCX, TXT"
                fullWidth
              />
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleUpload}
                isLoading={loading}
                disabled={!file}
              >
                Enviar Documento
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DocumentUpload;