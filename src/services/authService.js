import { GoogleAuthProvider, signInWithPopup, getAuth, signOut } from 'firebase/auth'
import app from '../firebase/firebaseInit'

const provider = new GoogleAuthProvider()
// console.log(app.options)
const auth = getAuth(app)

const authService = {}

authService.signIn = () => {
  return signInWithPopup(auth, provider)
}

authService.signOut = () => {
  return signOut(auth)
}

export default authService
