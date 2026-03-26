import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loader from '../components/Loader';
import { isValidEmail, normalizeApiError } from '../utils/helpers';

function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.email) nextErrors.email = 'Email is required';
    else if (!isValidEmail(form.email)) nextErrors.email = 'Enter a valid email';

    if (!form.password) nextErrors.password = 'Password is required';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!validate()) return;

    try {
      await login(form);
      navigate('/dashboard');
    } catch (apiError) {
      setError(normalizeApiError(apiError, 'Login failed'));
    }
  };

  if (loading) {
    return <Loader text="Signing in..." />;
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-6 col-lg-5">
        <div className="card shadow-sm border-0 fade-in">
          <div className="card-body p-4">
            <h3 className="mb-3">Login</h3>
            <p className="text-secondary">Welcome back to TaskFlow.</p>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={onSubmit} noValidate>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={onChange}
                />
                {errors.email && <div className="form-error mt-1">{errors.email}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  autoComplete="current-password"
                  value={form.password}
                  onChange={onChange}
                />
                {errors.password && <div className="form-error mt-1">{errors.password}</div>}
              </div>

              <button className="btn btn-success w-100" type="submit">
                Login
              </button>
            </form>

            <p className="mt-3 mb-0 text-secondary">
              New user? <Link to="/register">Create an account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
