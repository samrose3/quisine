import React, { useEffect, useState } from 'react'
import axios from 'axios'
import isBefore from 'date-fns/isBefore'
import parseISO from 'date-fns/parseISO'
import Layout from '../components/layout'
import Navbar from '../components/navbar'
import Card from '../components/card'

const IndexPage = () => {
  const [status, setStatus] = useState('loading')
  const [posts, setPosts] = useState(null)

  useEffect(() => {
    let canceled = false

    if (status !== 'loading') return

    axios('/.netlify/functions/get-all-posts').then(result => {
      if (canceled === true) return

      if (result.status !== 200) {
        console.log('Error loading posts!')
        console.log(result)
        return
      }

      setPosts(
        result.data.posts.map(p => {
          p.created = parseISO(p.created)
          return p
        })
      )
      setStatus('loaded')
    })

    return () => {
      canceled = true
    }
  }, [status])

  return (
    <>
      <Navbar onNewPost={() => setStatus('loading')} />
      <Layout>
        {posts ? (
          posts
            .sort((p1, p2) => (isBefore(p1.created, p2.created) ? 1 : -1))
            .map(p => (
              <Card
                key={p._id}
                title={p.title}
                created={p.created}
                src={p.src}
                ingredients={p.ingredients}
              />
            ))
        ) : (
          <p>Loading...</p>
        )}
      </Layout>
    </>
  )
}

export default IndexPage
