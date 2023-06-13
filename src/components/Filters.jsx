'use client'

import { useFiltersStore } from '@/stores/globalStore'
import { filters, formatFilterName } from '@/utils/filters'
import { useEffect, useState } from 'react'
import Dropdown from 'react-bootstrap/Dropdown'

export default function Filters () {
  const [filterLabel, setFilterLabel] = useState('Filter')
  const activeFilter = useFiltersStore(state => state.filter)
  const updateFilter = useFiltersStore(state => state.updateFilter)
  const filterKeys = Object.keys(filters)

  useEffect(() => {
    setFilterLabel(activeFilter === filterKeys[0] ? 'Filter' : formatFilterName(activeFilter))
  }
  , [activeFilter, filterKeys])

  return (
    <Dropdown as='section' className='mb-2 d-inline-block'>
      <Dropdown.Toggle id='filter-dropdown-button' variant='secondary'>
        {
            filterLabel
          }
      </Dropdown.Toggle>

      <Dropdown.Menu variant='dark'>
        {
            filterKeys.map((filter) => {
              return (
                <Dropdown.Item
                  key={filter}
                  active={activeFilter === filter}
                  onClick={() => updateFilter(filter)}
                >
                  {
                    formatFilterName(filter)
                  }
                </Dropdown.Item>
              )
            }
            )
          }
      </Dropdown.Menu>
    </Dropdown>
  )
}
