import React, { useContext } from "react"

import { AuthContext } from "../../../src/App"
import client from "../../lib/api/client"

// とりあえず認証済みユーザーの名前やメールアドレスを表示
const Home: React.FC = () => {
  const { isSignedIn, currentUser } = useContext(AuthContext)

  const Kanban = () => {
    client.post("sections", params)

    return (
      <>
        <div>看板</div>
      </>
    )
  };

  return (
    <>
      {
        isSignedIn && currentUser ? (
          <>
            <h1>Signed in successfully!</h1>
            <h2>Email: {currentUser?.email}</h2>
            <h2>Name: {currentUser?.name}</h2>
          </>
        ) : (
          <h1>Not signed in</h1>
        )
      }

      <Kanban></Kanban>
    </>
  )
}

export default Home
