import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useLazyQuery } from "@apollo/client/react";
import { Helmet } from "react-helmet-async";
import { Building2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import Logo from "@/components/Logo";
import { COMPANY_BY_SLUG, JOIN_COMPANY } from "@/graphql/company";
import { useAuth } from "@/contexts/AuthContext";
import { messageFor } from "@/lib/api/errors";

/**
 * Vinculación con un negocio para una cuenta que aún no pertenece a ninguno.
 *
 * Pasa cuando alguien se registró sin el link del negocio, o cuando quiere
 * añadir una segunda sucursal. La confirmación intermedia —buscar, ver el
 * nombre, aceptar— existe porque un slug mal tecleado que vincula en silencio
 * es un error que el usuario no puede deshacer solo.
 */
export default function LinkCompany() {
  const navigate = useNavigate();
  const { refetchUser, logout } = useAuth();
  const [slug, setSlug] = useState("");
  const [notFound, setNotFound] = useState(false);

  const [search, { data, loading: searching }] = useLazyQuery(COMPANY_BY_SLUG, {
    fetchPolicy: "network-only",
  });

  const [joinCompany, { loading: joining, error: joinError }] = useMutation(
    JOIN_COMPANY,
    {
      onCompleted: async () => {
        await refetchUser();
        navigate("/inicio", { replace: true });
      },
    },
  );

  const company = data?.companyBySlug ?? null;

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    const normalised = slug.trim().toLowerCase();
    if (!normalised) return;
    setNotFound(false);
    const result = await search({ variables: { slug: normalised } });
    setNotFound(!result.data?.companyBySlug);
  };

  return (
    <>
      <Helmet>
        <title>AdPaws | Vincular negocio</title>
      </Helmet>

      <div className="min-h-dvh w-full flex items-center justify-center px-4 py-8">
        <Card className="w-full max-w-md border border-border rounded-lg p-6 flex flex-col gap-5">
          <div className="flex justify-center">
            <Logo className="w-40" />
          </div>

          <div className="text-center space-y-1.5">
            <h1 className="text-xl font-bold text-foreground">
              Vincula tu cuenta a un negocio
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Escribe el código que te dio tu guardería u hotel canino. Suele
              venir en el link o el QR que te compartieron.
            </p>
          </div>

          <form onSubmit={(e) => void handleSearch(e)} className="flex flex-col gap-3">
            <Input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="ej. casa-perruna"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              aria-label="Código del negocio"
            />
            <Button
              type="submit"
              variant="outline"
              className="rounded-full h-11"
              disabled={searching || !slug.trim()}
            >
              {searching ? <Spinner className="size-4" /> : "Buscar negocio"}
            </Button>
          </form>

          {notFound && (
            <p className="text-sm text-destructive text-center">
              No encontramos ningún negocio con ese código. Revísalo con ellos.
            </p>
          )}

          {company && (
            <div className="flex flex-col gap-3 rounded-2xl border border-border bg-muted/40 p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center overflow-hidden shrink-0">
                  {company.logoUrl ? (
                    <img
                      src={company.logoUrl}
                      alt={company.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Building2 className="w-6 h-6 text-primary" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-foreground truncate">
                    {company.name}
                  </p>
                  <p className="text-xs text-muted-foreground">/{company.slug}</p>
                </div>
              </div>

              <Button
                type="button"
                className="rounded-full h-11"
                disabled={joining}
                onClick={() =>
                  void joinCompany({ variables: { slug: company.slug } })
                }
              >
                {joining ? (
                  <Spinner className="size-4" />
                ) : (
                  <>
                    <Check className="w-4 h-4" /> Sí, es mi negocio
                  </>
                )}
              </Button>
            </div>
          )}

          {joinError && (
            <p className="text-sm text-destructive text-center">
              {messageFor(joinError)}
            </p>
          )}

          <button
            type="button"
            onClick={() => void logout()}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Cerrar sesión
          </button>
        </Card>
      </div>
    </>
  );
}
