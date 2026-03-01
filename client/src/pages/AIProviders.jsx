import { AIProviders } from 'portos-ai-toolkit/client';
import toast from 'react-hot-toast';

export default function AIProvidersPage() {
  return <AIProviders onError={toast.error} colorPrefix="app" />;
}
