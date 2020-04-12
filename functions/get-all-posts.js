const sendQuery = require('./utils/send-query')

const ALL_POSTS = `
  query AllPosts {
    allPosts {
      data {
        _id
        title
        src
        ingredients,
        created
      }
    }
  }
`

exports.handler = async () => {
  const { data, errors } = await sendQuery(ALL_POSTS)

  if (errors) {
    return {
      statusCode: 500,
      body: JSON.stringify(errors),
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      posts: data.allPosts.data,
    }),
  }
}
