import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TaskCard from '../components/TaskCard';
import Loader from '../components/Loader';
import taskService from '../services/taskService';
import userService from '../services/userService';
import { useAuth } from '../hooks/useAuth';
import { normalizeApiError } from '../utils/helpers';

function Dashboard() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [filters, setFilters] = useState({
    status: '',
    assignedTo: '',
  });

  const loadTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await taskService.getTasks({
        status: filters.status || undefined,
        assignedTo: filters.assignedTo || undefined,
      });
      setTasks(data);
    } catch (apiError) {
      setError(normalizeApiError(apiError, 'Failed to load tasks'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [filters.status, filters.assignedTo]);

  useEffect(() => {
    const loadUsers = async () => {
      if (!isAdmin) {
        setUsers([]);
        return;
      }

      try {
        const data = await userService.getUsers();
        setUsers(data);
      } catch (error) {
        setUsers([]);
      }
    };

    loadUsers();
  }, [isAdmin]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Delete this task?');
    if (!confirmed) return;

    try {
      await taskService.deleteTask(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (apiError) {
      setError(normalizeApiError(apiError, 'Failed to delete task'));
    }
  };

  return (
    <section>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h2 className="mb-1">Dashboard</h2>
          <p className="text-secondary mb-0">Track and manage all tasks in one place.</p>
        </div>
        <Link to="/tasks/new" className="btn btn-success">
          + Create Task
        </Link>
      </div>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={filters.status}
                onChange={(event) => setFilters((prev) => ({ ...prev, status: event.target.value }))}
              >
                <option value="">All</option>
                <option value="TODO">TODO</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="DONE">DONE</option>
              </select>
            </div>

            {isAdmin && (
              <div className="col-md-4">
                <label className="form-label">Assigned User</label>
                <select
                  className="form-select"
                  value={filters.assignedTo}
                  onChange={(event) => setFilters((prev) => ({ ...prev, assignedTo: event.target.value }))}
                >
                  <option value="">All</option>
                  {users.map((assignee) => (
                    <option key={assignee.id} value={assignee.id}>
                      {assignee.name} ({assignee.email})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="col-md-4 d-flex align-items-end">
              <button className="btn btn-outline-secondary w-100" onClick={() => setFilters({ status: '', assignedTo: '' })}>
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <Loader text="Loading tasks..." />
      ) : tasks.length === 0 ? (
        <div className="empty-state p-5 text-center">No tasks found for current filters.</div>
      ) : (
        <div className="row g-3">
          {tasks.map((task) => (
            <div className="col-md-6 col-lg-4" key={task.id}>
              <TaskCard task={task} onDelete={handleDelete} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Dashboard;
