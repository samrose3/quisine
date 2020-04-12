module.exports = {
  siteMetadata: {
    title: 'Quisine',
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-postcss',
    'gatsby-plugin-emotion',
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: 'quisine',
        short_name: 'cc',
        start_url: '/',
        icon: 'src/images/quisine.png', // This path is relative to the root of the site.
      },
    },
    'gatsby-plugin-offline',
  ],
}
