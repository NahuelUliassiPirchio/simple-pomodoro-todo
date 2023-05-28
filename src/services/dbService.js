import { addDoc, collection, getDocs } from 'firebase/firestore/lite'
import { db } from '@/firebase/firebaseInit'

export const addData = (path, data) => {
  return addDoc(collection(db, path), {
    ...data
  })
}

export const getData = (path) => {
  return getDocs(collection(db, path))
}
