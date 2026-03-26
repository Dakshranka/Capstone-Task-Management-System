import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loader from '../components/Loader';
import { isValidEmail, normalizeApiError } from '../utils/helpers';

function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'USER',
  });

  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.name) nextErrors.name = 'Name is required';
    if (!form.email) nextErrors.email = 'Email is required';
    else if (!isValidEmail(form.email)) nextErrors.email = 'Enter a valid email';
    if (!form.password) nextErrors.password = 'Password is required';
    else if (form.password.length < 8) nextErrors.password = 'Password must be at least 8 characters';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!validate()) return;

    try {
      await register(form);
      navigate('/dashboard');
    } catch (apiError) {
      setError(normalizeApiError(apiError, 'Registration failed'));
    }
  };

  if (loading) {
    return <Loader text="Creating account..." />;
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-7 col-lg-6">
        <div className="card shadow-sm border-0 fade-in">
          <div className="card-body p-4">
            <h3 className="mb-3">Register</h3>
            <p className="text-secondary">Create your TaskFlow account.</p>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={onSubmit} noValidate>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  autoComplete="name"
                  value={form.name}
                  onChange={onChange}
                />
                {errors.name && <div className="form-error mt-1">{errors.name}</div>}
              </div>

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
                  autoComplete="new-password"
                  value={form.password}
                  onChange={onChange}
                />
                {errors.password && <div className="form-error mt-1">{errors.password}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label">Role</label>
                <select className="form-select" name="role" value={form.role} onChange={onChange}>
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>

              <button className="btn btn-success w-100" type="submit">
                Register
              </button>
            </form>

            <p className="mt-3 mb-0 text-secondary">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
