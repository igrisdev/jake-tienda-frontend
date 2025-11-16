import { collectionFragment } from "../fragments/collection";
import { productFragment } from "../fragments/product";

export const getCollectionsQuery = /* GraphQL */ `
  query getCollections {
    collections(first: 100, sortKey: TITLE) {
      edges {
        node {
          ...collection
        }
      }
    }
  }
  ${collectionFragment}
`;

export const getCollectionProductsQuery = /* GraphQL */ `
  query getCollectionProducts(
    $handle: String!
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
    $first: Int
    $last: Int
    $after: String
    $before: String
  ) {
    collection(handle: $handle) {
      products(
        sortKey: $sortKey
        reverse: $reverse
        first: $first
        last: $last
        after: $after
        before: $before
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
  }
  ${productFragment}
`;

export const getCollectionsByCategoryAndBrandQuery = /* GraphQL */ `
  query getMenu($handle: String!) {
    menu(handle: $handle) {
      items {
        id
        title
        url
        items {
          id
          title
          url
          resource {
            ... on Collection {
              handle
              image {
                url
                altText
              }
            }
          }
          items {
            id
            title
            url
            resource {
              ... on Collection {
                handle
                image {
                  url
                  altText
                }
              }
            }
          }
        }
      }
    }
  }
`;
