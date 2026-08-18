import { SIGN_IN } from "@/graphql/user";
import { useMutation } from "@apollo/client/react";
import { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import LoginForm from "@/components/Form/Forms/LoginForm";
import Logo from "@/components/Logo";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";

interface LoginFormValues {
  email: string;
  password: string;
}

export default function Login() {
  const [signInUser, { loading, data, error }] = useMutation(SIGN_IN);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const onSubmit = (formData: LoginFormValues) => {
    signInUser({ variables: { input: formData } });
  };

  useEffect(() => {
    const handleLogin = async () => {
      if (data?.signUser) {
        try {
          // Con Bearer los tokens SON la sesión, no un subproducto del login
          // como cuando todo dependía de la cookie.
          await login(data.signUser);

          // Redirect to the page they were trying to access, or home
          const from =
            (location.state as { from?: { pathname: string } })?.from
              ?.pathname || "/";
          navigate(from, { replace: true });
        } catch (err) {
          console.error("Failed to login:", err);
          // Error is already handled in AuthContext
        }
      }
    };

    handleLogin();
  }, [data, login, navigate, location]);

  return (
    <Card className="w-full max-w-9/10 md:max-w-[400px] border border-border rounded-xl p-6 bg-card text-card-foreground shadow-card">
      <div className="flex items-center justify-center">
        <Logo className="w-48" />
      </div>
      <p className="text-2xl font-bold text-center text-foreground">
        ¡Bienvenido de nuevo!
      </p>
      {error && (
        <div className="mb-4 p-3 rounded-md bg-destructive/10 border border-destructive/20">
          <p className="text-sm text-destructive text-center">
            Error al iniciar sesión. Por favor, verifica tus credenciales.
          </p>
        </div>
      )}
      <LoginForm onSubmit={onSubmit} loading={loading} />
      <Link
        to="/auth/recuperar"
        className="text-sm text-center text-muted-foreground hover:text-foreground transition-colors"
      >
        ¿Olvidaste tu contraseña?
      </Link>
    </Card>
  );
}
