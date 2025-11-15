export const getMenuQuery = /* GraphQL */ `
  query getMenu($handle: String!) {
    menu(handle: $handle) {
      items {
        title
        url
        items {
          title
          url
          items {
            title
            url
          }
        }
      }
    }
  }
`;

export const getMenuWithImageQuery = /* GraphQL */ `
  query getMenu($handle: String!) {
    menu(handle: $handle) {
      items {
        title
        url
        resource {
          ... on Collection {
            image {
              url
              altText
              width
              height
            }
          }
        }
        items {
          title
          url
          resource {
            ... on Collection {
              image {
                url
                altText
                width
                height
              }
            }
          }
        }
      }
    }
  }
`;
