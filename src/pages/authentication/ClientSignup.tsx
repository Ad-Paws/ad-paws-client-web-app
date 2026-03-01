import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ClientSignupStep1Form, {
  type ClientSignupStep1Values,
} from "@/components/Form/Forms/ClientSignupStep1Form";
import ClientSignupStep2Form, {
  type DogFormValues,
} from "@/components/Form/Forms/ClientSignupStep2Form";
import ClientSignupStep3Form from "@/components/Form/Forms/ClientSignupStep3Form";
import SignupSuccessScreen from "@/components/Form/Forms/SignupSuccessScreen";
import { useMutation } from "@apollo/client/react";
import { CREATE_USER_CLIENT } from "@/lib/api/user.api";
import { CREATE_USER_DOGS } from "@/lib/api/dogs.api";
import successImage from "@/assets/success.png";
import { translateDogFormToBody } from "@/utils/translators";

const TOTAL_STEPS = 3;

interface StepContent {
  title: string;
  subtitle: string;
}

const stepContent: Record<number, StepContent> = {
  1: {
    title: "Queremos conocerte",
    subtitle: "Primero, cuéntanos sobre ti.",
  },
  2: {
    title: "Cuéntanos sobre tu perro",
    subtitle: "Agrega a tus amigos peludos para completar tu perfil.",
  },
  3: {
    title: "¿Es correcto?",
    subtitle: "Por favor revisa tu información.",
  },
};

interface SignupFormData {
  step1?: ClientSignupStep1Values;
  dogs?: DogFormValues[];
}

const ClientSignup = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<SignupFormData>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createUserDogs] = useMutation(CREATE_USER_DOGS, {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onCompleted(data: any) {
      console.log("Dogs created:", data);
      setIsSubmitting(false);
      setIsSuccess(true);
    },
    onError(error) {
      console.error("Error creating dogs:", error);
      setIsSubmitting(false);
    },
  });
  const [createUserClient] = useMutation(CREATE_USER_CLIENT, {
    onCompleted: (createdUser: unknown) => {
      console.log("User created:", createdUser);
      console.log("Form data:", formData);
      createUserDogs({
        variables: {
          input: {
            dogs: formData.dogs?.map((dog) => {
              console.log("Dog:", dog);
              return translateDogFormToBody(
                dog,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                parseInt((createdUser as any)?.createUser?.user?.id),
              );
            }),
          },
        },
      });
    },
  });

  const handleStep1Submit = (data: ClientSignupStep1Values) => {
    setFormData((prev) => ({ ...prev, step1: data }));
    setCurrentStep(2);
  };

  const handleStep2Submit = (dogs: DogFormValues[]) => {
    setFormData((prev) => ({ ...prev, dogs }));
    setCurrentStep(3);
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      const { step1: userData } = formData;
      const userBody = {
        ...userData,
        birthDate: userData?.birthdate?.toISOString(),
      };
      delete userBody.birthdate;
      createUserClient({ variables: { input: userBody } });
      setIsSubmitting(true);
    } catch (error) {
      console.error("Error creating account:", error);
      setIsSubmitting(false);
    }
  };

  const handleEditUserInfo = () => {
    setCurrentStep(1);
  };

  const handleEditDog = (dogId: string) => {
    // Navigate to step 2 - the dog data is already stored in formData.dogs
    console.log("Edit dog:", dogId);
    setCurrentStep(2);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentContent = stepContent[currentStep];

  // Show success screen after account creation
  if (isSuccess) {
    return (
      <div className="fixed inset-0 w-full lg:grid lg:grid-cols-[1fr_1fr]">
        <div className="h-full hidden lg:block">
          <img
            src={successImage}
            alt="Success image"
            className="w-full h-full object-cover"
          />
        </div>
        <SignupSuccessScreen />
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

      <main className="flex-1 min-h-0 overflow-y-auto px-6 pb-[calc(2rem+env(safe-area-inset-bottom))]">
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
          />
        )}

        {currentStep === 3 && formData.step1 && formData.dogs && (
          <ClientSignupStep3Form
            userInfo={formData.step1}
            dogs={formData.dogs}
            onConfirm={handleConfirm}
            onEditUserInfo={handleEditUserInfo}
            onEditDog={handleEditDog}
            loading={isSubmitting}
          />
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
      </main>
    </div>
  );
};

export default ClientSignup;
