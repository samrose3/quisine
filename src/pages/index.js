import React, { useEffect, useState } from 'react'
import axios from 'axios'
import parseISO from 'date-fns/parseISO'
import Layout from '../components/layout'
import Card from '../components/card'

const IndexPage = () => {
  const [status, setStatus] = useState('loading')
  const [posts, setPosts] = useState(null)

  useEffect(() => {
    let canceled = false

    if (status !== 'loading') return

    axios('/api/get-all-posts').then(result => {
      if (canceled === true) return

      if (result.status !== 200) {
        console.log('Error loading posts!')
        console.log(result)
        return
      }

      setPosts(result.data.posts)
      setStatus('loaded')
    })

    return () => {
      canceled = true
    }
  }, [status])

  return (
    <Layout>
      {posts ? (
        posts.map(p => (
          <Card
            key={p._id}
            title={p.title}
            created={parseISO(p.created)}
            src={p.src}
            ingredients={p.ingredients}
          />
        ))
      ) : (
        <p>Loading...</p>
      )}
    </Layout>
  )
}

export default IndexPage
