import { GoogleAuthProvider, signInWithPopup, getAuth, signOut as firebaseSignOut, signInWithRedirect, signInAnonymously, linkWithCredential } from 'firebase/auth'
import { app } from '../firebase/firebaseInit'
import { PROVIDER_ANONYMOUS, PROVIDER_GOOGLE } from '@/constants/auth'

export const providers = {
  [PROVIDER_GOOGLE]: GoogleAuthProvider,
  [PROVIDER_ANONYMOUS]: PROVIDER_ANONYMOUS
}

export const auth = getAuth(app)

export const signIn = (providerName, isMobile) => {
  if (providerName === PROVIDER_ANONYMOUS) {
    return signInAnonymously(auth)
  }

  const provider = new providers[providerName]()
  if (!provider) throw new Error(`Invalid provider: ${providerName}`)

  if (isMobile) {
    return signInWithRedirect(auth, provider)
  } else {
    return signInWithPopup(auth, provider)
  }
}

export const signOut = () => {
  return firebaseSignOut(auth)
}

export const mergeAccount = async (providerName) => {
  const provider = new providers[providerName]()
  if (!provider || provider === PROVIDER_ANONYMOUS) throw new Error(`Invalid provider: ${providerName}`)

  return signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result)
      console.log(auth.currentUser)

      return linkWithCredential(auth.currentUser, credential)
    })
}
