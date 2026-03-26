import { Link } from 'react-router-dom';
import { formatDate } from '../utils/helpers';

const STATUS_COLOR = {
  TODO: 'secondary',
  IN_PROGRESS: 'warning',
  DONE: 'success',
};

function TaskCard({ task, onDelete }) {
  const badgeClass = STATUS_COLOR[task.status] || 'secondary';

  return (
    <div className="card h-100 card-animate border-0 shadow-sm">
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h5 className="card-title mb-0">{task.title}</h5>
          <span className={`badge text-bg-${badgeClass} task-badge`}>{task.status}</span>
        </div>

        <p className="card-text text-secondary mb-3">{task.description || 'No description provided.'}</p>

        <div className="small text-muted mb-3">
          <div>Assigned: {task.assignedToName || '-'}</div>
          <div>Created By: {task.createdByName || '-'}</div>
          <div>Updated: {formatDate(task.updatedAt)}</div>
        </div>

        <div className="mt-auto d-flex gap-2">
          <Link className="btn btn-outline-primary btn-sm" to={`/tasks/${task.id}/edit`}>
            Edit
          </Link>
          <button className="btn btn-outline-danger btn-sm" onClick={() => onDelete(task.id)}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;
