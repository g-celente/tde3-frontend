import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';
import './index.css';

function App() {
  return (
    <div className="w-full min-h-screen">
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 5000,
              style: {
                background: '#ffffff',
                color: '#111827',
              },
              success: {
                style: {
                  border: '1px solid #10B981',
                },
              },
              error: {
                style: {
                  border: '1px solid #EF4444',
                },
              },
            }}
          />
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
