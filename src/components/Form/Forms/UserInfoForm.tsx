import { FieldSet } from "@/components/ui/field";
import { Form } from "../Form";
import { FormField, FormItem } from "../FormField";
import { FormLabel } from "../FormLabel";
import { FormControl } from "../FormControl";
import { FormMessage } from "../FormMessage";
import { FormDatePicker } from "../FormDatePicker";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";

export interface UserInfoFormValues {
  name: string;
  lastname: string;
  birthdate: Date | undefined;
  gender: "Female" | "Male" | "Other" | "";
  email: string;
  password?: string;
  phone: string;
}

interface GenderOption {
  value: "Female" | "Male" | "Other";
  label: string;
}

const genderOptions: GenderOption[] = [
  { value: "Female", label: "Femenino" },
  { value: "Male", label: "Masculino" },
  { value: "Other", label: "Otro" },
];

interface UserInfoFormProps {
  onSubmit: (data: UserInfoFormValues) => void;
  defaultValues?: Partial<UserInfoFormValues>;
  loading?: boolean;
  disableEmail?: boolean;
  hidePassword?: boolean;
  submitLabel?: string;
}

export function UserInfoForm({
  onSubmit,
  defaultValues,
  loading = false,
  disableEmail = false,
  hidePassword = false,
  submitLabel,
}: UserInfoFormProps) {
  const form = useForm<UserInfoFormValues>({
    defaultValues: {
      name: "",
      lastname: "",
      birthdate: undefined,
      gender: "",
      email: "",
      password: "",
      phone: "",
      ...defaultValues,
    },
    mode: "all",
  });

  const label = submitLabel ?? (hidePassword ? "Guardar cambios" : "Continuar");

  return (
    <Form
      form={form}
      onSubmit={onSubmit}
      className="flex flex-col gap-6 w-full"
    >
      <FieldSet className="gap-5">
        {/* Nombre y Apellido */}
        <div className="flex gap-3 w-full">
          <FormField
            name="name"
            rules={{ required: "El nombre es requerido" }}
            render={({ field }) => (
              <FormItem className="flex-1 gap-2">
                <FormLabel className="px-4">Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="ej. María" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="lastname"
            rules={{ required: "El apellido es requerido" }}
            render={({ field }) => (
              <FormItem className="flex-1 gap-2">
                <FormLabel className="px-4">Apellido</FormLabel>
                <FormControl>
                  <Input placeholder="ej. García" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Fecha de nacimiento */}
        <FormField
          name="birthdate"
          rules={{ required: "La fecha de nacimiento es requerida" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="px-4">Fecha de nacimiento</FormLabel>
              <FormControl>
                <FormDatePicker
                  placeholder="dd/mm/aaaa"
                  value={field.value}
                  onChange={field.onChange}
                  maxDate={new Date()}
                  dateFormat="dd/MM/yyyy"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Género */}
        <FormField
          name="gender"
          rules={{ required: "Por favor selecciona un género" }}
          render={({ field }) => (
            <FormItem className="gap-2">
              <FormLabel className="px-4">Género</FormLabel>
              <FormControl>
                <div className="flex gap-2">
                  {genderOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => field.onChange(option.value)}
                      className={cn(
                        "h-12 px-5 rounded-md text-sm font-medium transition-all border",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        field.value === option.value
                          ? "bg-secondary text-secondary-foreground border-secondary"
                          : "bg-card border-border text-foreground hover:bg-muted",
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Correo electrónico */}
        <FormField
          name="email"
          rules={{
            required: "El correo electrónico es requerido",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Correo electrónico inválido",
            },
          }}
          render={({ field }) => (
            <FormItem className="gap-2">
              <FormLabel className="px-4">Correo electrónico</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="tu.correo@ejemplo.com"
                  disabled={disableEmail}
                  {...field}
                />
              </FormControl>
              {disableEmail && (
                <p className="text-xs text-muted-foreground px-4">
                  El correo no puede modificarse.
                </p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Contraseña — oculta en perfil */}
        {!hidePassword && (
          <FormField
            name="password"
            rules={{
              required: "La contraseña es requerida",
              minLength: {
                value: 8,
                message: "La contraseña debe tener al menos 8 caracteres",
              },
            }}
            render={({ field }) => (
              <FormItem className="gap-2">
                <FormLabel className="px-4">Contraseña</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Mínimo 8 caracteres"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Teléfono */}
        <FormField
          name="phone"
          rules={{
            required: "El número de teléfono es requerido",
            pattern: {
              value: /^[\d\s\-()+ ]+$/,
              message: "Número de teléfono inválido",
            },
            validate: (value: string) =>
              value.replace(/\D/g, "").length === 10 ||
              "El número de teléfono debe tener 10 dígitos",
          }}
          render={({ field }) => (
            <FormItem className="gap-2">
              <FormLabel className="px-4">Número de teléfono</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="(55) 1234-5678" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </FieldSet>

      <Button
        type="submit"
        size="lg"
        disabled={
          form.formState.isSubmitting ||
          !form.formState.isValid ||
          loading ||
          (hidePassword && !form.formState.isDirty)
        }
        className="w-full bg-accent hover:bg-accent/90 text-accent-foreground rounded-full h-12 text-base font-semibold mt-2"
      >
        {loading ? "Guardando..." : label}
      </Button>
    </Form>
  );
}
