import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface SignupSuccessScreenProps {
  onGoHome?: () => void;
  /** Aviso cuando algo secundario falló — un perro que no se guardó. */
  notice?: string | null;
  /** El alta no traía negocio: hay que vincularlo antes de usar la app. */
  needsCompany?: boolean;
}

const SignupSuccessScreen = ({
  onGoHome,
  notice,
  needsCompany = false,
}: SignupSuccessScreenProps) => {
  const navigate = useNavigate();
  const { login } = useAuth();

  /**
   * Los tokens ya se guardaron al crear la cuenta, así que `login()` sólo
   * carga al usuario: no hace falta pasar por el formulario de acceso.
   */
  const handleGoHome = async () => {
    if (onGoHome) {
      onGoHome();
      return;
    }
    await login();
    navigate(needsCompany ? "/vincular-negocio" : "/inicio");
  };

  return (
    <div className="min-h-dvh w-full bg-background flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-8">
        <div className="w-28 h-28 rounded-full bg-primary flex items-center justify-center mb-8 shadow-lg shadow-primary/20">
          <Check className="w-14 h-14 text-white stroke-[3]" />
        </div>

        <h1 className="text-3xl font-bold text-brandInfo-700 dark:text-brandAccent-400 font-bookmania mb-3 text-center">
          ¡Todo listo!
        </h1>

        <p className="text-muted-foreground text-center max-w-xs leading-relaxed">
          {needsCompany
            ? "Antes de empezar, vincula tu cuenta con la guardería u hotel donde llevas a tu perro."
            : "Revisa tu correo y confirma tu cuenta para empezar a cuidar a tu mejor amigo."}
        </p>

        {notice && (
          <p className="mt-5 max-w-xs rounded-xl border border-amber-300/60 bg-amber-50 px-3.5 py-2.5 text-center text-xs leading-relaxed text-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
            {notice}
          </p>
        )}
      </main>

      <div className="px-6 pb-8">
        <Button
          type="button"
          size="lg"
          onClick={() => void handleGoHome()}
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground rounded-full h-12 text-base font-semibold"
        >
          {needsCompany ? "Vincular mi negocio" : "Ir al inicio"}
        </Button>
      </div>
    </div>
  );
};

export default SignupSuccessScreen;
