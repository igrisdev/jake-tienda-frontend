import { productFragment } from "../fragments/product";

export const getProductQuery = /* GraphQL */ `
  query getProduct($handle: String!) {
    product(handle: $handle) {
      ...product
    }
  }
  ${productFragment}
`;

export const getProductRecommendationsQuery = /* GraphQL */ `
  query getProductRecommendations($productId: ID!) {
    productRecommendations(productId: $productId) {
      ...product
    }
  }
  ${productFragment}
`;

export const getNewProductsQuery = /* GraphQL */ `
  query getNewProducts($query: String) {
    products(reverse: true, query: $query, first: 10) {
      edges {
        node {
          ...product
        }
      }
    }
  }
  ${productFragment}
`;

// export const getProductsQuery = /* GraphQL */ `
//   query getProducts(
//     $sortKey: ProductSortKeys
//     $reverse: Boolean
//     $query: String
//     $first: Int
//     $after: String
//     $before: String
//     $last: Int
//   ) {
//     products(
//       sortKey: $sortKey
//       reverse: $reverse
//       query: $query
//       first: $first
//       after: $after
//       before: $before
//       last: $last
//     ) {
//       filters {
//         id
//         label
//         type
//         values {
//           id
//           label
//           count
//           input
//         }
//       }
//       pageInfo {
//         hasNextPage
//         hasPreviousPage
//         startCursor
//         endCursor
//       }
//       edges {
//         node {
//           ...product
//         }
//       }
//     }
//   }
//   ${productFragment}
// `;

export const getProductsQuery = /* GraphQL */ `
  query getProducts(
    $sortKey: ProductSortKeys
    $reverse: Boolean
    $query: String
    $first: Int
    $after: String
    $before: String
    $last: Int
  ) {
    products(
      sortKey: $sortKey
      reverse: $reverse
      query: $query
      first: $first
      after: $after
      before: $before
      last: $last
    ) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          ...product
        }
      }
    }
  }
  ${productFragment}
`;
