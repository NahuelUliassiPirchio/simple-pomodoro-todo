import { GoogleAuthProvider, signInWithPopup, getAuth, signOut as firebaseSignOut, signInWithRedirect } from 'firebase/auth'
import { app } from '../firebase/firebaseInit'

const provider = new GoogleAuthProvider()
export const auth = getAuth(app)

const signIn = (isMobile) => {
  if (isMobile) {
    return signInWithRedirect(auth, provider)
  } else {
    return signInWithPopup(auth, provider)
  }
}

const signOut = () => {
  return firebaseSignOut(auth)
}

export { signIn, signOut }
