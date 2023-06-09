'use client'

import { filters } from '@/utils/filters'
import { createContext, useContext, useEffect, useState } from 'react'

const FiltersContext = createContext()

export function useFilterContext () {
  return useContext(FiltersContext)
}

export function FiltersProvider ({ children }) {
  const [activeFilter, setActiveFilter] = useState('none')

  const updateFilter = (filter) => {
    setActiveFilter(filter)
    localStorage.setItem('activeFilter', filter)
  }

  useEffect(() => {
    const activeFilter = localStorage.getItem('activeFilter')
    if (activeFilter && filters[activeFilter]) {
      setActiveFilter(activeFilter)
    }
  }, [])

  const value = {
    activeFilter,
    updateFilter
  }

  return (
    <FiltersContext.Provider value={value}>
      {children}
    </FiltersContext.Provider>
  )
}
