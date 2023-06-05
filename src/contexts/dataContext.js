'use client'

import React from 'react'

const DataContext = React.createContext()

export function useDataContext () {
  return React.useContext(DataContext)
}

export function DataProvider ({ children }) {
  const [data, setData] = React.useState(null)

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
