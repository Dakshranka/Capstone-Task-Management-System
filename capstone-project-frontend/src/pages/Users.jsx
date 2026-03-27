import { useEffect, useState } from 'react';
import Loader from '../components/Loader';
import userService from '../services/userService';
import { useAuth } from '../hooks/useAuth';
import { formatDate, normalizeApiError } from '../utils/helpers';

function Users() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [createError, setCreateError] = useState('');
  const [createSuccess, setCreateSuccess] = useState('');
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const [updatingUserId, setUpdatingUserId] = useState(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await userService.getUsers();
        setUsers(data);
      } catch (apiError) {
        setError(normalizeApiError(apiError, 'Failed to load users'));
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onCreateUser = async (event) => {
    event.preventDefault();
    setCreateError('');
    setCreateSuccess('');
    setActionError('');
    setActionSuccess('');

    if (!form.name || !form.email || !form.password) {
      setCreateError('Name, email, and password are required.');
      return;
    }

    if (form.password.length < 8) {
      setCreateError('Password must be at least 8 characters.');
      return;
    }

    setCreating(true);
    try {
      const createdUser = await userService.createUser(form);
      setUsers((prev) => [createdUser, ...prev]);
      setForm({ name: '', email: '', password: '' });
      setCreateSuccess('User created successfully. You can now assign tasks to this user.');
    } catch (apiError) {
      setCreateError(normalizeApiError(apiError, 'Failed to create user'));
    } finally {
      setCreating(false);
    }
  };

  const onToggleUserStatus = async (targetUser) => {
    setActionError('');
    setActionSuccess('');
    setCreateError('');
    setCreateSuccess('');

    setUpdatingUserId(targetUser.id);
    try {
      const updatedUser = targetUser.active
        ? await userService.deactivateUser(targetUser.id)
        : await userService.activateUser(targetUser.id);

      setUsers((prev) => prev.map((user) => (user.id === updatedUser.id ? updatedUser : user)));
      setActionSuccess(
        updatedUser.active
          ? `User ${updatedUser.email} activated successfully.`
          : `User ${updatedUser.email} deactivated successfully.`
      );
    } catch (apiError) {
      setActionError(normalizeApiError(apiError, 'Failed to update user status'));
    } finally {
      setUpdatingUserId(null);
    }
  };

  if (loading) {
    return <Loader text="Loading users..." />;
  }

  return (
    <section className="fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Users</h2>
          <p className="text-secondary mb-0">Admin view of all registered users.</p>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {!error && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <h5 className="card-title mb-3">Create User</h5>
            {createError && <div className="alert alert-danger">{createError}</div>}
            {createSuccess && <div className="alert alert-success">{createSuccess}</div>}
            {actionError && <div className="alert alert-danger">{actionError}</div>}
            {actionSuccess && <div className="alert alert-success">{actionSuccess}</div>}
            <form onSubmit={onCreateUser}>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">Name</label>
                  <input
                    className="form-control"
                    name="name"
                    value={form.name}
                    onChange={onChange}
                    autoComplete="name"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={form.email}
                    onChange={onChange}
                    autoComplete="email"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={form.password}
                    onChange={onChange}
                    autoComplete="new-password"
                  />
                </div>
              </div>
              <div className="mt-3">
                <button className="btn btn-success" type="submit" disabled={creating}>
                  {creating ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {!error && (
        <div className="card border-0 shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`badge ${user.role === 'ADMIN' ? 'text-bg-dark' : 'text-bg-secondary'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${user.active ? 'text-bg-success' : 'text-bg-warning'}`}>
                        {user.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>{formatDate(user.createdAt)}</td>
                    <td className="text-end">
                      <button
                        className={`btn btn-sm ${user.active ? 'btn-outline-danger' : 'btn-outline-success'}`}
                        type="button"
                        disabled={updatingUserId === user.id || currentUser?.id === user.id}
                        onClick={() => onToggleUserStatus(user)}
                      >
                        {updatingUserId === user.id
                          ? 'Updating...'
                          : user.active
                            ? 'Deactivate'
                            : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}

export default Users;
