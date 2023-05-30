import { addDoc, collection, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore/lite'
import { db } from '@/firebase/firebaseInit'

export const addData = (path, data) => {
  return addDoc(collection(db, path), {
    ...data
  })
}

export const getData = async (path) => {
  const response = await getDocs(collection(db, path))
  return response.docs.map(doc => {
    return {
      id: doc.id,
      ...doc.data()
    }
  })
}

export const updateData = (path, id, data) => {
  return updateDoc(doc(db, path, id), {
    ...data
  })
}

export const deleteData = (path, id) => {
  return deleteDoc(doc(db, path, id))
}
