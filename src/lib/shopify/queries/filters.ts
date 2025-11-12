export const getInitialFilterData = /* GraphQL */ `
  query getInitialFilterData {
    # 1. Para el filtro "CATEGORÍAS"
    # Obtiene una lista de todos los tipos de producto únicos en tu tienda.
    productTypes(first: 250) {
      edges {
        node
      }
    }

    # 2. Para el filtro "TIPO DE PRODUCTO" (usando etiquetas)
    # Obtiene una lista de todas las etiquetas únicas.
    productTags(first: 250) {
      edges {
        node
      }
    }

    # 3. Para los filtros "MARCA" y "PRECIO"
    # Obtenemos los primeros 250 productos para extraer de ellos
    # todas las marcas (vendor) y calcular el precio mínimo y máximo.
    # Nota: Si tienes más de 250 productos, necesitarías paginar esta consulta
    # para obtener un rango de precios y una lista de marcas 100% precisos.
    products(first: 250, sortKey: PRICE, reverse: false) {
      edges {
        node {
          vendor # Para MARCA
          priceRange {
            # Para PRECIO
            minVariantPrice {
              amount
            }
            maxVariantPrice {
              amount
            }
          }
        }
      }
    }
  }
`;
