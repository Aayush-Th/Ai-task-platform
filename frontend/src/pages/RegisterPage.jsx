import { LockKeyhole, Mail, User } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import AuthShell from "../components/AuthShell";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useToast } from "../components/ui/ToastContext";
import { useAuth } from "../context/AuthContext";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (formData.password !== formData.confirmPassword) {
      const message = "Passwords do not match";
      setError(message);
      showToast({ title: "Registration failed", message, type: "error" });
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await axiosClient.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      login(data);
      showToast({ title: "Account created", message: "Your workspace is ready." });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      showToast({
        title: "Registration failed",
        message: err.response?.data?.message || "Please review your details and try again.",
        type: "error"
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Create account"
      subtitle="Launch a polished workspace for creating, running, and tracking AI processing tasks."
      footer={
        <>
          Already have an account?{" "}
          <Link className="font-medium text-cyan-300 transition hover:text-cyan-200" to="/login">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error ? <p className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</p> : null}
        <Input
          label="Full name"
          icon={User}
          required
          placeholder="Aayush Sharma"
          value={formData.name}
          onChange={(event) => setFormData({ ...formData, name: event.target.value })}
        />
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
          placeholder="Create a secure password"
          value={formData.password}
          onChange={(event) => setFormData({ ...formData, password: event.target.value })}
        />
        <Input
          label="Confirm password"
          icon={LockKeyhole}
          type="password"
          required
          placeholder="Repeat your password"
          value={formData.confirmPassword}
          onChange={(event) => setFormData({ ...formData, confirmPassword: event.target.value })}
        />
        <Button type="submit" className="w-full" loading={submitting}>
          Create Account
        </Button>
      </form>
    </AuthShell>
  );
};

export default RegisterPage;
