'use client'

import { useFilterContext } from '@/contexts/filtersContext'
import { filters, getFormattedName } from '@/utils/filters'
import Dropdown from 'react-bootstrap/Dropdown'

export default function Filters () {
  const { activeFilter, updateFilter } = useFilterContext()
  const filterKeys = Object.keys(filters)

  return (
    <section className='mb-2'>
      <Dropdown>
        <Dropdown.Toggle id='dropdown-button-dark-example1' variant='secondary'>
          {
            activeFilter === filterKeys[0] ? 'Filter' : getFormattedName(activeFilter)
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
                    getFormattedName(filter)
                  }
                </Dropdown.Item>
              )
            }
            )
          }
        </Dropdown.Menu>
      </Dropdown>
    </section>
  )
}
