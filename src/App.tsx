import { Provider } from 'react-redux';
import { ChakraProvider } from '@chakra-ui/react';
import store from './store';
import AppNavigator from './navigator';
import { BrowserRouter } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './navigator/AuthProvider';
import { QueryClient, QueryClientProvider } from 'react-query';

function App() {
  const queryClient = new QueryClient();
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider>
          <BrowserRouter>
            <AuthProvider>
              <ToastContainer />
              <AppNavigator />
            </AuthProvider>
          </BrowserRouter>
        </ChakraProvider>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
