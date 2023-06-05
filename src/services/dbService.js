import { addDoc, collection, getDocs, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore/lite'
import { db } from '@/firebase/firebaseInit'

export const addData = (path, data) => {
  return addDoc(collection(db, path), {
    ...data
  })
}

export const getData = async (path, userUID) => {
  const querySnapshot = query(collection(db, path), where('owner', '==', userUID))
  const response = await getDocs(querySnapshot)
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
