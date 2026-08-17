import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, Building2 } from "lucide-react";
import { useMutation, useQuery } from "@apollo/client/react";
import ClientSignupStep1Form, {
  type ClientSignupStep1Values,
} from "@/components/Form/Forms/ClientSignupStep1Form";
import ClientSignupStep2Form, {
  type DogFormValues,
} from "@/components/Form/Forms/ClientSignupStep2Form";
import ClientSignupStep3Form from "@/components/Form/Forms/ClientSignupStep3Form";
import SignupSuccessScreen from "@/components/Form/Forms/SignupSuccessScreen";
import { CREATE_USER } from "@/graphql/user";
import { CREATE_DOG } from "@/graphql/dogs";
import { COMPANY_BY_SLUG } from "@/graphql/company";
import { setTokens } from "@/lib/session";
import { messageFor } from "@/lib/api/errors";
import { toCreateDogInput } from "@/utils/translators";
import successImage from "@/assets/success.png";

const TOTAL_STEPS = 3;

interface StepContent {
  title: string;
  subtitle: string;
}

const stepContent: Record<number, StepContent> = {
  1: { title: "Queremos conocerte", subtitle: "Primero, cuéntanos sobre ti." },
  2: {
    title: "Cuéntanos sobre tu perro",
    subtitle: "Agrega a tus amigos peludos para completar tu perfil.",
  },
  3: { title: "¿Es correcto?", subtitle: "Por favor revisa tu información." },
};

interface SignupFormData {
  step1?: ClientSignupStep1Values;
  dogs?: DogFormValues[];
}

/**
 * Alta de cliente.
 *
 * El negocio viaja en la URL: `/registro-cliente?empresa=<slug>`. Ese slug es
 * lo que convierte la cuenta en cliente de alguien — sin él el usuario queda
 * sin membresía y no puede ni registrar un perro, porque `createDog` exige
 * empresa activa. Cuando falta, el alta sigue siendo válida y la vinculación
 * se resuelve después en /vincular-negocio.
 */
const ClientSignup = () => {
  const [searchParams] = useSearchParams();
  const companySlug = searchParams.get("empresa")?.trim().toLowerCase() ?? null;

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<SignupFormData>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [editingDogId, setEditingDogId] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { data: companyData } = useQuery(COMPANY_BY_SLUG, {
    variables: { slug: companySlug ?? "" },
    skip: !companySlug,
  });
  const company = companyData?.companyBySlug ?? null;

  const [createUser] = useMutation(CREATE_USER);
  const [createDog] = useMutation(CREATE_DOG);

  const scrollToTop = () => {
    document.getElementById("main-content")?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStep1Submit = (data: ClientSignupStep1Values) => {
    setFormData((prev) => ({ ...prev, step1: data }));
    setCurrentStep(2);
    scrollToTop();
  };

  const handleStep2Submit = (dogs: DogFormValues[]) => {
    setFormData((prev) => ({ ...prev, dogs }));
    setEditingDogId(null);
    setCurrentStep(3);
    scrollToTop();
  };

  /**
   * Cuenta primero, perros después.
   *
   * `createDogs` en bulk ya no existe, así que van uno por uno — y como
   * `createDog` requiere sesión, los tokens que devuelve `createUser` se
   * guardan ANTES del primer perro.
   *
   * Si un perro falla a mitad, los anteriores ya existen: crear la cuenta de
   * nuevo daría "ese correo ya está registrado" y dejaría al usuario atorado.
   * Por eso se avisa cuál falló y se lleva a la app, donde puede agregarlo sin
   * repetir nada.
   */
  const handleConfirm = async () => {
    const { step1, dogs = [] } = formData;
    if (!step1) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const created = await createUser({
        variables: {
          input: {
            email: step1.email,
            password: step1.password ?? "",
            name: step1.name,
            lastname: step1.lastname,
            phone: step1.phone,
            gender: step1.gender || null,
            birthDate: step1.birthdate?.toISOString() ?? null,
            ...(companySlug ? { companySlug } : {}),
            app: "CLIENT" as const,
          },
        },
      });

      const tokens = created.data?.createUser.tokens;
      if (!tokens) throw new Error("La cuenta se creó pero no recibimos sesión.");
      setTokens(tokens);

      // Sin negocio no hay dónde registrar un perro: se hará tras vincularse.
      if (companySlug) {
        const failed: string[] = [];
        for (const dog of dogs) {
          try {
            await createDog({ variables: { input: toCreateDogInput(dog) } });
          } catch {
            failed.push(dog.name);
          }
        }

        if (failed.length > 0) {
          setSubmitError(
            `Tu cuenta quedó lista, pero no pudimos guardar a ${failed.join(", ")}. ` +
              `Puedes agregarlo desde la app.`,
          );
        }
      }

      setIsSuccess(true);
    } catch (error) {
      setSubmitError(messageFor(error as Parameters<typeof messageFor>[0]));
    } finally {
      setIsSubmitting(false);
      scrollToTop();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
    scrollToTop();
  };

  const currentContent = stepContent[currentStep];

  if (isSuccess) {
    return (
      <div className="fixed inset-0 w-full lg:grid lg:grid-cols-[1fr_1fr]">
        <div className="h-full hidden lg:block">
          <img src={successImage} alt="" className="w-full h-full object-cover" />
        </div>
        <SignupSuccessScreen notice={submitError} needsCompany={!companySlug} />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 w-full flex flex-col">
      <header className="shrink-0 flex items-center justify-between px-4 py-4">
        {currentStep > 1 ? (
          <button
            onClick={handleBack}
            className="p-2 -ml-2 text-secondary hover:text-secondary/80 transition-colors cursor-pointer"
            aria-label="Regresar"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        ) : (
          <div className="w-5 h-5" />
        )}
        <span className="text-sm text-muted-foreground font-medium">
          {currentStep} de {TOTAL_STEPS}
        </span>
      </header>

      <div className="shrink-0 px-4 mb-6">
        <div className="h-1 bg-border rounded-full overflow-hidden">
          <div
            className="h-full bg-brandInfo-300 transition-all duration-300 ease-out rounded-full"
            style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
          />
        </div>
      </div>

      <main
        id="main-content"
        className="flex-1 min-h-0 overflow-y-auto px-6 pb-[calc(2rem+env(safe-area-inset-bottom))]"
      >
        <div className="sm:max-w-[600px] sm:mx-auto">
          {/* Confirma en qué negocio se está registrando, antes de teclear nada. */}
          {company && (
            <div className="mb-5 flex items-center gap-3 rounded-2xl border border-border bg-muted/40 p-3">
              <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center overflow-hidden shrink-0">
                {company.logoUrl ? (
                  <img
                    src={company.logoUrl}
                    alt={company.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Building2 className="w-5 h-5 text-primary" />
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Te estás registrando en{" "}
                <span className="font-semibold text-foreground">{company.name}</span>
              </p>
            </div>
          )}

          <div className="mb-6 lg:mb-8">
            <h1 className="text-3xl font-bold text-brandInfo-700 dark:text-brandAccent-400 font-bookmania mb-2">
              {currentContent.title}
            </h1>
            <p className="text-muted-foreground">{currentContent.subtitle}</p>
          </div>

          {currentStep === 1 && (
            <ClientSignupStep1Form
              onSubmit={handleStep1Submit}
              defaultValues={formData.step1}
            />
          )}

          {currentStep === 2 && (
            <ClientSignupStep2Form
              onSubmit={handleStep2Submit}
              defaultDogs={formData.dogs}
              editingDogId={editingDogId}
            />
          )}

          {currentStep === 3 && formData.step1 && formData.dogs && (
            <>
              <ClientSignupStep3Form
                userInfo={formData.step1}
                dogs={formData.dogs}
                onConfirm={() => void handleConfirm()}
                onEditUserInfo={() => {
                  setCurrentStep(1);
                  scrollToTop();
                }}
                onEditDog={(dogId) => {
                  setEditingDogId(dogId);
                  setCurrentStep(2);
                  scrollToTop();
                }}
                loading={isSubmitting}
              />
              {submitError && (
                <p className="mt-4 text-sm text-destructive text-center">{submitError}</p>
              )}
            </>
          )}

          <div className="mt-6 text-center">
            <span className="text-sm text-muted-foreground">
              ¿Ya tienes una cuenta?{" "}
              <Link
                to="/auth/login"
                className="font-semibold text-secondary hover:text-secondary/80 underline underline-offset-2"
              >
                Inicia sesión
              </Link>
            </span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClientSignup;
