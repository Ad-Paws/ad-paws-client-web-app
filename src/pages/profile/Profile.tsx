import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { Helmet } from "react-helmet-async";
import { ChevronRight, LogOut } from "lucide-react";
import { ME, UPDATE_USER } from "@/graphql/user";
import { UserInfoForm, type UserInfoFormValues } from "@/components/Form/Forms/UserInfoForm";
import ChangePasswordForm from "@/components/Form/Forms/ChangePasswordForm";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { messageFor } from "@/lib/api/errors";

function ProfileAvatar({ name, lastname }: { name: string; lastname: string }) {
  const initials = [name[0], lastname[0]].filter(Boolean).join("").toUpperCase();
  return (
    <div className="flex flex-col items-center gap-2 py-6">
      <div className="w-20 h-20 rounded-full bg-primary/70 flex items-center justify-center">
        <span className="text-2xl font-bold text-primary-foreground">{initials}</span>
      </div>
      <p className="text-base font-semibold text-foreground">
        {name} {lastname}
      </p>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="flex flex-col items-center gap-6 py-6 px-6">
      <div className="flex flex-col items-center gap-2">
        <Skeleton className="w-20 h-20 rounded-full" />
        <Skeleton className="w-32 h-4 rounded-full" />
      </div>
      <div className="w-full flex flex-col gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-1.5">
            <Skeleton className="w-24 h-3 rounded-full" />
            <Skeleton className="w-full h-12 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Profile() {
  const { refetchUser, logout, activeCompany, companies, selectCompany } = useAuth();
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const { data, loading } = useQuery(ME, { fetchPolicy: "network-only" });

  const [updateUser, { loading: updating, error: updateError }] = useMutation(
    UPDATE_USER,
    { onCompleted: () => void refetchUser() },
  );

  const user = data?.me;

  /**
   * `UpdateUserInput` sólo acepta nombre, apellido, teléfono, género y fecha.
   * El correo salió a propósito —cambiarlo invalidaría la verificación— y la
   * contraseña tiene su propia mutación, que exige la actual.
   */
  const handleSubmit = (values: UserInfoFormValues) => {
    void updateUser({
      variables: {
        input: {
          name: values.name,
          lastname: values.lastname,
          phone: values.phone,
          gender: values.gender || null,
          birthDate: values.birthdate?.toISOString() ?? null,
        },
      },
    });
  };

  return (
    <>
      <Helmet>
        <title>AdPaws | Mi perfil</title>
      </Helmet>

      <div className="h-full overflow-auto">
        <div className="px-6 pb-8">
          {loading || !user ? (
            <ProfileSkeleton />
          ) : (
            <>
              <ProfileAvatar name={user.name ?? ""} lastname={user.lastname ?? ""} />

              <UserInfoForm
                onSubmit={handleSubmit}
                loading={updating}
                disableEmail
                hidePassword
                defaultValues={{
                  name: user.name ?? "",
                  lastname: user.lastname ?? "",
                  email: user.email,
                  phone: user.phone ?? "",
                  gender: user.gender ?? "",
                  birthdate: user.birthDate ? new Date(user.birthDate) : undefined,
                }}
              />

              {updateError && (
                <p className="mt-3 text-sm text-destructive">{messageFor(updateError)}</p>
              )}

              <section className="mt-8 flex flex-col gap-2">
                <p className="text-sm font-semibold text-muted-foreground">Seguridad</p>

                {showPasswordForm ? (
                  <ChangePasswordForm onDone={() => setShowPasswordForm(false)} />
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowPasswordForm(true)}
                    className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3.5 text-left transition-colors hover:bg-muted"
                  >
                    <span className="text-sm font-medium text-foreground">
                      Cambiar contraseña
                    </span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </button>
                )}
              </section>

              {/*
                Selector de negocio. Sólo aparece con más de una membresía: es
                el caso en que `x-company-id` deja de ser opcional y el usuario
                tiene que poder decir sobre cuál está mirando.
              */}
              {companies.length > 1 && (
                <section className="mt-8 flex flex-col gap-2">
                  <p className="text-sm font-semibold text-muted-foreground">Negocio</p>
                  {companies.map((company) => (
                    <button
                      key={company.id}
                      type="button"
                      onClick={() => selectCompany(company.id)}
                      className={
                        "flex items-center justify-between rounded-xl border px-4 py-3.5 text-left transition-colors " +
                        (company.id === activeCompany?.id
                          ? "border-primary bg-primary/10"
                          : "border-border bg-card hover:bg-muted")
                      }
                    >
                      <span className="text-sm font-medium text-foreground">
                        {company.name}
                      </span>
                      {company.id === activeCompany?.id && (
                        <span className="text-xs font-semibold text-primary">Activo</span>
                      )}
                    </button>
                  ))}
                </section>
              )}

              <button
                type="button"
                onClick={() => void logout()}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-full border border-border px-4 py-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted"
              >
                <LogOut className="h-4 w-4" />
                Cerrar sesión
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
