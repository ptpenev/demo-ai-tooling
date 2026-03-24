import { useEffect } from 'react';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/auth';

export default function ProtectedLayout() {
  const { isAuthenticated, fetchProfile, permissions, user, logout } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfile();
    }
  }, [isAuthenticated, fetchProfile]);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const hasPermission = (action: string, resource: string) => {
    return permissions.some(p => p.action === action && p.resource === resource);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      <aside className="w-full md:w-64 bg-white border-r min-h-screen">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Internal Ops</h2>
          <p className="text-sm text-gray-500">{user?.first_name} {user?.last_name}</p>
        </div>
        <nav className="p-4 space-y-2">
          <Link to="/" className="block py-2 px-4 rounded hover:bg-gray-100">Dashboard</Link>
          {hasPermission('read', 'timesheet') && (
            <Link to="/timesheets" className="block py-2 px-4 rounded hover:bg-gray-100">Timesheets</Link>
          )}
          {hasPermission('read', 'leave_request') && (
            <Link to="/leaves" className="block py-2 px-4 rounded hover:bg-gray-100">Leaves</Link>
          )}
          {hasPermission('read', 'calendar') && (
            <Link to="/calendar" className="block py-2 px-4 rounded hover:bg-gray-100">Calendar</Link>
          )}
          {hasPermission('read', 'role') && (
            <>
              <Link to="/admin/roles" className="block py-2 px-4 rounded hover:bg-gray-100">Roles Management</Link>
              <Link to="/admin/users" className="block py-2 px-4 rounded hover:bg-gray-100">User Assignments</Link>
            </>
          )}
          <Link to="/profile" className="block py-2 px-4 rounded hover:bg-gray-100">My Profile</Link>
          <button 
            onClick={logout}
            className="w-full text-left py-2 px-4 text-red-500 hover:bg-red-50 rounded mt-auto"
          >
            Logout
          </button>
        </nav>
      </aside>
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
