import { addDoc, collection, getDocs, updateDoc, deleteDoc, doc, query } from 'firebase/firestore/lite'
import { db } from '@/firebase/firebaseInit'
import { filters } from '@/utils/filters'

export const addData = (path, data) => {
  return addDoc(collection(db, path), {
    ...data
  })
}

export const getData = async (path, activeFilter) => {
  const querySnapshot = query(collection(db, path), filters[activeFilter])
  const response = await getDocs(querySnapshot)
  return response.docs.map(doc => {
    const documentTimestamp = doc._document.createTime
    const documentDate = documentTimestamp.toTimestamp().toDate()

    return {
      id: doc.id,
      ...doc.data(),
      createDate: documentDate
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
