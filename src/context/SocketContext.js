// ** React Imports
import { createContext, useEffect, useState } from 'react'

// ** Sockets Import
import io from 'socket.io-client';

// ** Defaults
const defaultProvider = {
  Socket: null
}

const SocketContext = createContext(defaultProvider)


let token;
if (typeof window !== 'undefined') {
  // Perform localStorage action
  token = localStorage.getItem('accessToken')
}

const Obj = {
  transports: ["websocket"],
  auth: typeof window !== 'undefined' && { token: localStorage.getItem('accessToken') },
  upgrade: false,
  reconnection: true,
}

const SocketProvider = ({ children }) => {

  const [Socket, setSocket] = useState(null)

  useEffect(() => {
    // const newSocket = io.connect(process.env.NEXT_PUBLIC_BASE_URL, Obj)
    // setSocket(newSocket)

    // return () => newSocket.close();
  }, [setSocket])

  const values = { Socket }

  return (
    <SocketContext.Provider value={values}>
      {children}
    </SocketContext.Provider>
  )
}

export { SocketContext, SocketProvider }


