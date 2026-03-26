import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '../services/userService';
import taskService from '../services/taskService';
import { useAuth } from '../hooks/useAuth';
import { normalizeApiError } from '../utils/helpers';

function CreateTask() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'TODO',
    assignedToId: '',
  });

  useEffect(() => {
    const loadUsers = async () => {
      if (!isAdmin) {
        if (user?.id) {
          setUsers([{ id: user.id, name: user.email, email: user.email }]);
          setForm((prev) => ({ ...prev, assignedToId: String(user.id) }));
        }
        return;
      }

      try {
        const data = await userService.getUsers();
        setUsers(data);
      } catch (apiError) {
        setError(normalizeApiError(apiError, 'Unable to load users. Admin-only endpoint may be restricted.'));
      }
    };

    loadUsers();
  }, [isAdmin, user?.id, user?.email]);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!form.title || !form.assignedToId) {
      setError('Title and assigned user are required.');
      return;
    }

    setSubmitting(true);
    try {
      await taskService.createTask({
        title: form.title,
        description: form.description,
        status: form.status,
        assignedToId: Number(form.assignedToId),
      });
      navigate('/dashboard');
    } catch (apiError) {
      setError(normalizeApiError(apiError, 'Failed to create task'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-lg-8">
        <div className="card border-0 shadow-sm fade-in">
          <div className="card-body p-4">
            <h3 className="mb-3">Create Task</h3>
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={onSubmit}>
              <div className="mb-3">
                <label className="form-label">Title</label>
                <input className="form-control" name="title" value={form.title} onChange={onChange} />
              </div>

              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows="4"
                  name="description"
                  value={form.description}
                  onChange={onChange}
                ></textarea>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label">Status</label>
                  <select className="form-select" name="status" value={form.status} onChange={onChange}>
                    <option value="TODO">TODO</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="DONE">DONE</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Assign User</label>
                  <select
                    className="form-select"
                    name="assignedToId"
                    value={form.assignedToId}
                    onChange={onChange}
                    disabled={!isAdmin}
                  >
                    <option value="">Select user</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="d-flex gap-2">
                <button className="btn btn-success" type="submit" disabled={submitting}>
                  {submitting ? 'Saving...' : 'Create Task'}
                </button>
                <button className="btn btn-outline-secondary" type="button" onClick={() => navigate('/dashboard')}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateTask;
