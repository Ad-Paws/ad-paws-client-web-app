import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { Plus, Stethoscope, Siren, UserCheck, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { ADD_DOG_CONTACT, DOG, REMOVE_DOG_CONTACT } from "@/graphql/dogs";
import { messageFor } from "@/lib/api/errors";
import type { ContactType, DogContact } from "@/generated/schema-types";

/**
 * Contactos del perro.
 *
 * Tres tipos, y la distinción importa en el mostrador: a quién llamar si algo
 * pasa, quién es su veterinario, y quién tiene permiso de llevárselo. El
 * último es el que conviene tener por escrito antes de que alguien se presente
 * a recogerlo.
 */

type ContactFields = Pick<
  DogContact,
  "id" | "type" | "name" | "phone" | "email" | "relation" | "notes"
>;

const CONTACT_TYPES: {
  value: ContactType;
  label: string;
  icon: typeof Siren;
  hint: string;
}[] = [
  {
    value: "EMERGENCY",
    label: "Emergencia",
    icon: Siren,
    hint: "A quién llamamos si algo pasa",
  },
  {
    value: "VETERINARIAN",
    label: "Veterinario",
    icon: Stethoscope,
    hint: "Su médico de cabecera",
  },
  {
    value: "AUTHORIZED_PICKUP",
    label: "Puede recogerlo",
    icon: UserCheck,
    hint: "Además de ti",
  },
];

const typeMeta = (type: ContactType) =>
  CONTACT_TYPES.find((t) => t.value === type) ?? CONTACT_TYPES[0];

interface DogContactsProps {
  dogId: string;
  contacts: ContactFields[];
}

export default function DogContacts({ dogId, contacts }: DogContactsProps) {
  const [adding, setAdding] = useState(false);
  const [type, setType] = useState<ContactType>("EMERGENCY");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [relation, setRelation] = useState("");

  const refetch = { refetchQueries: [{ query: DOG, variables: { id: dogId } }] };

  const [addContact, { loading: addingContact, error: addError }] = useMutation(
    ADD_DOG_CONTACT,
    {
      ...refetch,
      onCompleted: () => {
        setAdding(false);
        setName("");
        setPhone("");
        setRelation("");
      },
    },
  );

  const [removeContact, { loading: removing }] = useMutation(
    REMOVE_DOG_CONTACT,
    refetch,
  );

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-muted-foreground">Contactos</h2>
        {!adding && (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            <Plus className="h-4 w-4" /> Agregar
          </button>
        )}
      </div>

      {contacts.length === 0 && !adding && (
        <p className="rounded-2xl border border-dashed border-border px-4 py-5 text-center text-sm leading-relaxed text-muted-foreground">
          Agrega a quién llamar en una emergencia y quién puede recoger a tu
          perro. Lo van a agradecer el día que haga falta.
        </p>
      )}

      {contacts.map((contact) => {
        const meta = typeMeta(contact.type);
        const Icon = meta.icon;
        return (
          <div
            key={contact.id}
            className="flex items-start gap-3 rounded-2xl border border-border bg-card p-3.5"
          >
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Icon className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-foreground">{contact.name}</p>
              <p className="text-xs text-muted-foreground">
                {meta.label}
                {contact.relation ? ` · ${contact.relation}` : ""}
              </p>
              <a
                href={`tel:${contact.phone}`}
                className="mt-0.5 inline-block text-sm text-secondary underline underline-offset-2"
              >
                {contact.phone}
              </a>
            </div>
            <button
              type="button"
              aria-label={`Eliminar a ${contact.name}`}
              disabled={removing}
              onClick={() => void removeContact({ variables: { id: contact.id } })}
              className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        );
      })}

      {adding && (
        <form
          className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4"
          onSubmit={(event) => {
            event.preventDefault();
            void addContact({
              variables: {
                input: {
                  type,
                  name: name.trim(),
                  phone: phone.trim(),
                  relation: relation.trim() || null,
                },
                dogId,
              },
            });
          }}
        >
          <div className="flex flex-wrap gap-2">
            {CONTACT_TYPES.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setType(option.value)}
                className={cn(
                  "h-10 rounded-md border px-3 text-sm font-medium transition-all",
                  type === option.value
                    ? "border-secondary bg-secondary text-secondary-foreground"
                    : "border-border bg-card text-foreground hover:bg-muted",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
          <p className="px-1 text-xs text-muted-foreground">{typeMeta(type).hint}</p>

          <Input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre"
            aria-label="Nombre del contacto"
          />
          <Input
            required
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Teléfono"
            aria-label="Teléfono del contacto"
          />
          <Input
            value={relation}
            onChange={(e) => setRelation(e.target.value)}
            placeholder="Parentesco o relación (opcional)"
            aria-label="Relación"
          />

          {addError && (
            <p className="text-sm text-destructive">{messageFor(addError)}</p>
          )}

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1 rounded-full"
              onClick={() => setAdding(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 rounded-full"
              disabled={addingContact || !name.trim() || !phone.trim()}
            >
              {addingContact ? <Spinner className="size-4" /> : "Guardar"}
            </Button>
          </div>
        </form>
      )}
    </section>
  );
}
