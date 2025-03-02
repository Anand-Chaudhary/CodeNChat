import React, { useContext } from 'react'
import { UserContext } from '../context/User.Context.jsx'

function Home() {
  const { user } = useContext(UserContext);

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-8">
      {user ? (
        <div>
          <h1 className="text-2xl font-bold mb-4">Welcome!</h1>
          <p>Email: {user.email}</p>
        </div>
      ) : (
        <p>Please log in to view this page</p>
      )}
    </div>
  )
}

export default Home