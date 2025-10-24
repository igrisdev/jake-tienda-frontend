import imageFragment from "./image";
import seoFragment from "./seo";

export const productFragment = /* GraphQl */ `
  fragment product on Product {
    id
    handle
    availableForSale
    title
    description
    descriptionHtml

    # 🆕 Campos añadidos para los filtros
    vendor
    productType

    options {
      id
      name
      values
    }

    priceRange {
      maxVariantPrice {
        amount
        currencyCode
      }
      minVariantPrice {
        amount
        currencyCode
      }
    }

    variants(first: 250) {
      edges {
        node {
          id
          title
          availableForSale
          quantityAvailable
          selectedOptions {
            name
            value
          }
          price {
            amount
            currencyCode
          }
        }
      }
    }

    # ✅ Restaurado: este campo es vital y no se elimina
    featuredImage {
      ...image
    }

    images(first: 20) {
      edges {
        node {
          ...image
        }
      }
    }

    # 🆕 Campos añadidos para los filtros por colección y metacampos
    collections(first: 10) {
      edges {
        node {
          id
          handle
          title
        }
      }
    }

    metafields(
      identifiers: [
        { namespace: "custom", key: "tecnologia" }
        { namespace: "custom", key: "procesamiento" }
        { namespace: "custom", key: "proveedor" }
      ]
    ) {
      key
      value
    }

    seo {
      ...seo
    }

    tags
    updatedAt
  }
  ${imageFragment}
  ${seoFragment}
`;
