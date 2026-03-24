import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedLayout from './components/ProtectedLayout';
import Login from './pages/Login';
import Home from './pages/Home';
import Roles from './pages/admin/Roles';
import Users from './pages/admin/Users';
import Profile from './pages/Profile';
import Timesheets from './pages/timesheets/Index';
import Leaves from './pages/leaves/Index';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedLayout />}>
            <Route index element={<Home />} />
            <Route path="profile" element={<Profile />} />
            <Route path="timesheets" element={<Timesheets />} />
            <Route path="leaves" element={<Leaves />} />
            <Route path="admin/roles" element={<Roles />} />
            <Route path="admin/users" element={<Users />} />
            {/* Other routes will be added in subsequent WPs */}
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
