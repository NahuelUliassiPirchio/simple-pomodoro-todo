'use client'

import { createContext, useContext, useState } from 'react'

const DataContext = createContext()

export function useDataContext () {
  return useContext(DataContext)
}

export function DataProvider ({ children }) {
  const [data, setData] = useState(null)

  const updateData = (data) => {
    setData(data)
  }

  const value = {
    data,
    updateData
  }

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  )
}
