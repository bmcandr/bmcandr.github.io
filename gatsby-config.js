/**
 * @type {import('gatsby').GatsbyConfig}
 */
const path = require(`path`)
module.exports = {
  siteMetadata: {
    title: `Brendan McAndrew`,
  },
  plugins: [
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: `images`,
        path: path.join(__dirname, `src`, `images`),
      },
    },
    "gatsby-plugin-image",
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    {
      resolve: `gatsby-plugin-google-fonts`,
      options: {
        fonts: [`Rajdhani\:300`],
      },
    },
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        icon: path.join(__dirname, `src`, `images`, `avatar.png`)
      }
    }
  ],
};
