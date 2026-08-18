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
import { CREATE_DOG, UPLOAD_DOG_IMAGE } from "@/graphql/dogs";
import { useAuth } from "@/contexts/AuthContext";
import { messageFor } from "@/lib/api/errors";
import {
  clearPendingDogs,
  readPendingDogs,
  readPendingPhoto,
} from "@/lib/pendingDogs";
import { setCompanyId } from "@/lib/session";

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
  /**
   * Cubre la ventana entre "la mutación respondió" y "ya navegamos".
   *
   * `joining` de Apollo se apaga en cuanto llega la respuesta, pero después
   * todavía quedan los perros pendientes y el refetch. Sin este estado el
   * botón se volvía a habilitar en medio de eso y aceptaba un segundo click.
   * Nunca se apaga: en el camino feliz esta pantalla desaparece.
   */
  const [finishing, setFinishing] = useState(false);

  const [search, { data, loading: searching }] = useLazyQuery(COMPANY_BY_SLUG, {
    fetchPolicy: "network-only",
  });

  const [createDog] = useMutation(CREATE_DOG);
  const [uploadDogImage] = useMutation(UPLOAD_DOG_IMAGE);

  const [joinCompany, { loading: joining, error: joinError }] = useMutation(
    JOIN_COMPANY,
    {
      // Un fallo devuelve el control: el usuario tiene que poder reintentar.
      onError: () => setFinishing(false),
      onCompleted: async (result) => {
        setFinishing(true);
        /**
         * La empresa activa se fija ANTES de crear los perros. El actor se
         * resuelve al inicio de cada petición, así que sin este header la
         * siguiente llamada seguiría creyendo que la cuenta no pertenece a
         * ningún negocio.
         */
        setCompanyId(result.joinCompany.company.id);

        // Los perros capturados en el alta sin slug esperaban este momento.
        const pending = readPendingDogs();
        for (const [index, input] of pending.entries()) {
          try {
            const created = await createDog({ variables: { input } });
            const dogId = created.data?.createDog.id;
            const photo = readPendingPhoto(index);
            if (dogId && photo) {
              await uploadDogImage({ variables: { id: dogId, file: photo } });
            }
          } catch (error) {
            console.error("No se pudo registrar un perro pendiente:", error);
          }
        }
        clearPendingDogs();

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
              disabled={searching || finishing || joining || !slug.trim()}
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
                disabled={joining || finishing}
                onClick={() =>
                  void joinCompany({ variables: { slug: company.slug } })
                }
              >
                {joining || finishing ? (
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
