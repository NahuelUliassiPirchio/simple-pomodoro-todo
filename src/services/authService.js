import { GoogleAuthProvider, signInWithPopup, getAuth, signOut as firebaseSignOut } from 'firebase/auth'
import { app } from '../firebase/firebaseInit'

const provider = new GoogleAuthProvider()
export const auth = getAuth(app)

const signIn = () => {
  return signInWithPopup(auth, provider)
}

const signOut = () => {
  return firebaseSignOut(auth)
}

export { signIn, signOut }
