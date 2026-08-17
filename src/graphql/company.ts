import { graphql } from "@/generated";

/**
 * Cara pública del negocio, para la pantalla de registro.
 *
 * Es `@public` a propósito: cuando alguien abre el link de registro todavía no
 * hay sesión, y aun así tiene que poder confirmar que se está registrando en
 * el lugar correcto. Devuelve null si el slug no existe o el negocio no está
 * activo — la pantalla trata ambos casos igual.
 */
export const COMPANY_BY_SLUG = graphql(`
  query CompanyBySlug($slug: String!) {
    companyBySlug(slug: $slug) {
      id
      slug
      name
      logoUrl
    }
  }
`);

/**
 * Vincula al usuario autenticado como cliente de un negocio.
 *
 * Es idempotente en el servidor: repetirla devuelve la membresía existente en
 * vez de fallar, así que reintentar tras un error de red es seguro.
 */
export const JOIN_COMPANY = graphql(`
  mutation JoinCompany($slug: String!) {
    joinCompany(slug: $slug) {
      id
      role
      status
      company {
        id
        name
        slug
        logoUrl
      }
    }
  }
`);
