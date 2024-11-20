import ChatIA from './components/ChatIA';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
export const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ChatIA />
    </QueryClientProvider>
  );
}

export default App;
