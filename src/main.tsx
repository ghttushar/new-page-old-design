import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './app/app';
import { AuthWrapper } from './app/components/hoc/auth-wrapper';
import './index.css'; // RE-DEPLOY
import store from './redux/store';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      refetchOnReconnect: true,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    },
  },
});

root.render(
  <BrowserRouter>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthWrapper>
          <App />
        </AuthWrapper>
      </QueryClientProvider>
    </Provider>
  </BrowserRouter>
);
