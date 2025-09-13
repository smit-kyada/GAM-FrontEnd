// ** React Imports
import { createContext, useEffect, useState } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios

// ** Config
import authConfig from 'src/configs/auth'

// ** graphQl
import { useMutation } from '@apollo/client'
import { GET_ME1, USER_LOGIN, USER_REGISTER } from "src/graphql/mutation/user"

import toast from 'react-hot-toast'

// ** Defaults
const defaultProvider = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),

  // resetPassword:()=>Promise.resolve()
}
const AuthContext = createContext(defaultProvider)

const AuthProvider = ({ children }) => {
  // ** States
  const [user, setUser] = useState(defaultProvider.user)
  const [loading, setLoading] = useState(defaultProvider.loading)

  // ** Graphql
  //** Mutation */
  const [register] = useMutation(USER_REGISTER);
  const [login] = useMutation(USER_LOGIN);
  const [getMe1] = useMutation(GET_ME1)



  // ** Hooks
  const router = useRouter()
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)
      if (storedToken) {
        await getMe1({ variables: { user: "user" } })
          .then(async response => {
            setLoading(false)
            setUser({ ...response?.data?.getMe })
          })
          .catch(() => {
            localStorage.removeItem('userData')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('accessToken')
            setUser(null)
            setLoading(false)
            if (authConfig.onTokenExpiration === 'logout' && !router.pathname.includes('login')) {
              router.replace('/login')
            }
          })
      } else {
        setLoading(false)
      }
    }
    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogin = async (params, errorCallback) => {

    await login({
      variables: {
        "email": params?.email,
        "password": params?.password,
        "isSideLogin": params?.isSideLogin
      }
    })
      .then(async response => {
        params.rememberMe
          ? window.localStorage.setItem(authConfig.storageTokenKeyName, response?.data?.login?.token)
          : null
        const returnUrl = router.query.returnUrl
        toast.success("login Successfully")
        setUser({ ...response?.data?.login?.user })
        let userData = response?.data?.login?.user;
        userData.isSideLogin = params?.isSideLogin
        params?.isSideLogin && (userData.site = params?.email)
        params.rememberMe ? window.localStorage.setItem('userData', JSON.stringify(userData)) : null
        const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
        router.replace(redirectURL)
      })
      .catch(err => {
        toast.error(err?.message)
        if (errorCallback) errorCallback(err)
      })
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    router.push('/login')
  }

  const handleRegister = async (params, errorCallback) => {

    await register({
      variables: {
        "input": {
          "email": params?.email,
          "userName": params?.username,
          "password": params?.password,
          "fName": params?.fName,
          "lName": params?.lName,
          "companyName": params?.companyName,
          "contact": params?.contact,
          "role": "client",
          isPolicyAccept: true
        }
      }
    })
      .then(res => {
        if (res.data.error) {
          if (errorCallback) errorCallback(res.data.error)
        } else {
          toast.success("User Register Sucessfully")

          router.push(res?.data?.register)

          // handleLogin({ email: params.email, password: params.password })
        }
      })
      .catch(err => {
        (errorCallback ? errorCallback(err) : null)
        toast.error(err?.message)
      })
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister,
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
