import { useForm } from "react-hook-form";
import { Form } from "@/components/Form/Form";
import { FormField, FormItem } from "@/components/Form/FormField";
import { FormLabel } from "@/components/Form/FormLabel";
import { FormControl } from "@/components/Form/FormControl";
import { FormMessage } from "@/components/Form/FormMessage";
import { FormDatePicker } from "@/components/Form/FormDatePicker";
import { FormCombobox } from "@/components/Form/FormCombobox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn, DOG_BREEDS } from "@/lib/utils";
import type { DogSize, Gender } from "@/generated/schema-types";

export interface DogEditValues {
  name: string;
  breed: string;
  color: string;
  size: DogSize | "";
  gender: Gender | "";
  /** Decimal en string: es lo que espera `weightKg` y lo que evita perder gramos. */
  weightKg: string;
  birthDate: Date | undefined;
  notes: string;
}

const breedOptions = Object.entries(DOG_BREEDS).map(([value, label]) => ({
  value,
  label,
}));

const sizeOptions: { value: DogSize; label: string }[] = [
  { value: "TOY", label: "Toy" },
  { value: "SMALL", label: "Chico" },
  { value: "MEDIUM", label: "Mediano" },
  { value: "LARGE", label: "Grande" },
  { value: "GIGANTIC", label: "X-Grande" },
];

const genderOptions: { value: Gender; label: string }[] = [
  { value: "MALE", label: "Macho" },
  { value: "FEMALE", label: "Hembra" },
];

interface DogEditFormProps {
  defaultValues: DogEditValues;
  onSubmit: (values: DogEditValues) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function DogEditForm({
  defaultValues,
  onSubmit,
  onCancel,
  loading = false,
}: DogEditFormProps) {
  const form = useForm<DogEditValues>({ defaultValues, mode: "all" });

  return (
    <Form form={form} onSubmit={onSubmit} className="flex flex-col gap-5">
      <FormField
        name="name"
        rules={{ required: "El nombre es requerido" }}
        render={({ field }) => (
          <FormItem className="gap-2">
            <FormLabel className="px-1">Nombre</FormLabel>
            <FormControl>
              <Input placeholder="ej. Canela" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="breed"
        render={({ field }) => (
          <FormItem className="gap-2">
            <FormLabel className="px-1">Raza</FormLabel>
            <FormControl>
              <FormCombobox
                options={breedOptions}
                value={field.value}
                onValueChange={field.onChange}
                placeholder="Busca la raza"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="flex gap-3">
        <FormField
          name="color"
          render={({ field }) => (
            <FormItem className="flex-1 gap-2">
              <FormLabel className="px-1">Color</FormLabel>
              <FormControl>
                <Input placeholder="ej. Café" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="weightKg"
          rules={{
            pattern: {
              value: /^\d{1,3}([.,]\d{1,2})?$/,
              message: "Usa kilos, por ejemplo 8.4",
            },
          }}
          render={({ field }) => (
            <FormItem className="flex-1 gap-2">
              <FormLabel className="px-1">Peso (kg)</FormLabel>
              <FormControl>
                <Input inputMode="decimal" placeholder="ej. 8.4" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        name="size"
        rules={{ required: "Selecciona un tamaño" }}
        render={({ field }) => (
          <FormItem className="gap-2">
            <FormLabel className="px-1">Tamaño</FormLabel>
            <FormControl>
              <div className="flex flex-wrap gap-2">
                {sizeOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => field.onChange(option.value)}
                    className={cn(
                      "h-11 px-4 rounded-md text-sm font-medium transition-all border",
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

      <FormField
        name="gender"
        render={({ field }) => (
          <FormItem className="gap-2">
            <FormLabel className="px-1">Sexo</FormLabel>
            <FormControl>
              <div className="flex gap-2">
                {genderOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => field.onChange(option.value)}
                    className={cn(
                      "h-11 px-5 rounded-md text-sm font-medium transition-all border",
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

      <FormField
        name="birthDate"
        render={({ field }) => (
          <FormItem className="gap-2">
            <FormLabel className="px-1">Fecha de nacimiento</FormLabel>
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

      <FormField
        name="notes"
        render={({ field }) => (
          <FormItem className="gap-2">
            <FormLabel className="px-1">Notas</FormLabel>
            <FormControl>
              <Textarea
                rows={3}
                placeholder="Alergias, medicamentos, manías…"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="flex gap-2 pt-1">
        <Button
          type="button"
          variant="outline"
          className="flex-1 rounded-full h-11"
          onClick={onCancel}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className="flex-1 rounded-full h-11"
          disabled={loading || !form.formState.isValid}
        >
          {loading ? <Spinner className="size-4" /> : "Guardar"}
        </Button>
      </div>
    </Form>
  );
}
