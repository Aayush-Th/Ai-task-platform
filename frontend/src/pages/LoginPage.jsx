import { LockKeyhole, Mail } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import AuthShell from "../components/AuthShell";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useToast } from "../components/ui/ToastContext";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const { data } = await axiosClient.post("/auth/login", formData);
      login(data);
      showToast({ title: "Welcome back", message: "You are now signed in." });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      showToast({ title: "Login failed", message: err.response?.data?.message || "Please try again.", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Sign in"
      subtitle="Access your task workspace, queue jobs, and monitor processing in real time."
      footer={
        <>
          New user?{" "}
          <Link className="font-medium text-cyan-300 transition hover:text-cyan-200" to="/register">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error ? <p className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</p> : null}
        <Input
          label="Email address"
          icon={Mail}
          type="email"
          required
          placeholder="you@example.com"
          value={formData.email}
          onChange={(event) => setFormData({ ...formData, email: event.target.value })}
        />
        <Input
          label="Password"
          icon={LockKeyhole}
          type="password"
          required
          placeholder="Enter your password"
          value={formData.password}
          onChange={(event) => setFormData({ ...formData, password: event.target.value })}
        />
        <Button type="submit" className="w-full" loading={submitting}>
          Sign In
        </Button>
      </form>
    </AuthShell>
  );
};

export default LoginPage;
