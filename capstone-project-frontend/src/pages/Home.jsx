import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function Home() {
  const { isAuthenticated, user } = useAuth();

  return (
    <section className="home-page fade-in">
      <div className="home-hero p-4 p-lg-5 mb-4">
        <div className="row align-items-center g-4">
          <div className="col-lg-7">
            <span className="hero-chip">Task Management Platform</span>
            <h1 className="display-5 fw-semibold mt-3 mb-3">Move Work Forward Without the Chaos</h1>
            <p className="lead text-secondary mb-4">
              TaskFlow helps teams assign work, track progress, and stay accountable with role-based dashboards.
            </p>
            <div className="d-flex flex-wrap gap-2">
              {isAuthenticated ? (
                <>
                  <Link className="btn btn-success" to="/dashboard">
                    Go to Dashboard
                  </Link>
                  <Link className="btn btn-outline-dark" to="/tasks/new">
                    Create Task
                  </Link>
                </>
              ) : (
                <>
                  <Link className="btn btn-success" to="/register">
                    Get Started
                  </Link>
                  <Link className="btn btn-outline-dark" to="/login">
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="col-lg-5">
            <div className="hero-panel p-4">
              <h5 className="mb-3">Why teams choose TaskFlow</h5>
              <ul className="list-unstyled mb-0 home-list">
                <li>Role-based access for admins and users</li>
                <li>Smart filtering by status and assignee</li>
                <li>Clear creator and assignee ownership</li>
                <li>Secure JWT-authenticated workflow</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-md-4">
          <div className="feature-card p-4 h-100">
            <h5>Admin Control</h5>
            <p className="mb-0 text-secondary">View all users and tasks, monitor progress, and keep operations on track.</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="feature-card p-4 h-100">
            <h5>User Focus</h5>
            <p className="mb-0 text-secondary">Users get a streamlined board focused on their own tasks and priorities.</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="feature-card p-4 h-100">
            <h5>Live Collaboration</h5>
            <p className="mb-0 text-secondary">Everyone can update task status quickly and keep work transparent.</p>
          </div>
        </div>
      </div>

      {isAuthenticated && (
        <div className="alert alert-light border mt-4 mb-0">
          Signed in as <strong>{user?.email}</strong> ({user?.role}).
        </div>
      )}
    </section>
  );
}

export default Home;
