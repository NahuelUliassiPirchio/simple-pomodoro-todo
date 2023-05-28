import { useState, useEffect } from 'react'
import { GoogleAuthProvider } from 'firebase/auth'
import authService from '../services/authService'

const useAuth = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signIn = async () => {
    try {
      const result = await authService.signIn()
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result)
      const token = credential.accessToken
      // The signed-in user info.
      const user = result.user
      // IdP data available using getAdditionalUserInfo(result)
      // TODO: Handle successful sign-in

      console.log({ token, user })
    } catch (error) {
      const errorCode = error.code
      const errorMessage = error.message

      if (errorCode === 'auth/popup-blocked') { // TODO: fix magic string
        console.log('popup blocked') // TODO: SHOW ERROR MESSAGE
      }

      // The email of the user's account used.
      const email = error.customData.email
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error)
      // ...
      console.error(error)
    }
  }

  const signOut = async () => {
    try {
      await authService.signOut()
      // TODO: Handle successful sign-out
    } catch (error) {
      // TODO: Handle sign-out error
    }
  }

  return { user, loading, signIn, signOut }
}

export default useAuth
