const sendQuery = require('./utils/send-query')

const CREATE_POST = `
  mutation CreatePost ($data: PostInput!) {
    createPost(data: $data) {
      _id
      title
      src
      ingredients
      created
    }
  }
`

exports.handler = async event => {
  const post = JSON.parse(event.body)
  const { data, errors } = await sendQuery(CREATE_POST, {
    data: {
      ...post,
      created: new Date().toISOString,
    },
  })

  if (errors) {
    return {
      statusCode: 500,
      body: JSON.stringify(errors),
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      post: data.createPost,
    }),
  }
}
