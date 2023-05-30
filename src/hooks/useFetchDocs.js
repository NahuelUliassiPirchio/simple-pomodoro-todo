import { useState } from 'react'

export default async function useFetchDocs (path, method, options) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  try {
    const response = await method(path, options)
    setData(response)
    setLoading(false)
  } catch (error) {
    setError(error)
    setLoading(false)
  }

  return {
    data,
    error,
    loading
  }
}
