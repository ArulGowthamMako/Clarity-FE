import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import PrivateRoute from './PrivateRoute';
import { Suspense } from 'react';
import { Spinner } from '@chakra-ui/react';
import Task from '../pages/Tasks';

const AppNavigator = () => {
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<PrivateRoute />}>
          <Route path="/tasks" element={<Task />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppNavigator;
