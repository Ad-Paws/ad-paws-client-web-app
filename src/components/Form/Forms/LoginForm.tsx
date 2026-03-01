import React from "react";
import { Form } from "@/components/Form/Form";
import { FieldSet } from "@/components/ui/field";
import { FormItem } from "@/components/Form";
import { FormControl } from "@/components/Form";
import { FormMessage } from "@/components/Form";
import { FormField } from "@/components/Form";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Mail, Lock } from "lucide-react";

interface LoginFormValues {
  email: string;
  password: string;
}

export default function LoginForm({
  onSubmit,
  loading,
}: {
  onSubmit: (data: LoginFormValues) => void;
  loading: boolean;
}): React.ReactElement {
  const form = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  return (
    <Form form={form} onSubmit={onSubmit}>
      <FieldSet className="w-full">
        <FormField
          name="email"
          rules={{
            required: "Ingresa tu email",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Ingresa un email válido",
            },
          }}
          render={({ field, fieldState }) => {
            console.log("field", field);
            console.log("fieldState", fieldState);
            return (
              <FormItem>
                <FormControl>
                  <InputGroup>
                    <InputGroupAddon>
                      <Mail className="dark:text-white/80 text-black" />
                    </InputGroupAddon>
                    <InputGroupInput
                      type="email"
                      placeholder="Ingresa tu email"
                      {...field}
                    />
                  </InputGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <FormField
          name="password"
          rules={{
            required: "La contraseña es requerida",
          }}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <InputGroup>
                  <InputGroupAddon>
                    <Lock className="dark:text-white/80 text-black" />
                  </InputGroupAddon>
                  <InputGroupInput
                    type="password"
                    placeholder="Ingresa tu contraseña"
                    {...field}
                  />
                </InputGroup>
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
          form.formState.isSubmitting || !form.formState.isValid || loading
        }
        className="w-full"
      >
        {form.formState.isSubmitting ? "Iniciando sesión..." : "Inicia sesión"}
      </Button>
      <div className="flex justify-center">
        <Link
          to="/registro-cliente"
          className="text-sm font-medium text-secondary"
        >
          ¿No tienes una cuenta? Regístrate
        </Link>
      </div>
    </Form>
  );
}
