import { UserInfoForm, type UserInfoFormValues } from "./UserInfoForm";

export type ClientSignupStep1Values = UserInfoFormValues;

interface ClientSignupStep1FormProps {
  onSubmit: (data: ClientSignupStep1Values) => void;
  defaultValues?: Partial<ClientSignupStep1Values>;
  loading?: boolean;
}

const ClientSignupStep1Form = ({
  onSubmit,
  defaultValues,
  loading = false,
}: ClientSignupStep1FormProps) => {
  return (
    <UserInfoForm
      onSubmit={onSubmit}
      defaultValues={defaultValues}
      loading={loading}
      submitLabel="Continuar"
    />
  );
};

export default ClientSignupStep1Form;
