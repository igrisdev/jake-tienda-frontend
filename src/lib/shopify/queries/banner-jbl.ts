export const getBannerJBLQuery = /* GraphQL */ `
  query getHeroItems {
    metaobjects(type: "banner_jbl_popayan", first: 10) {
      edges {
        node {
          id
          handle
          fields {
            key
            value
            reference {
              ... on MediaImage {
                image {
                  url
                  altText
                }
              }
              ... on Product {
                handle
              }
            }
          }
        }
      }
    }
  }
`;
