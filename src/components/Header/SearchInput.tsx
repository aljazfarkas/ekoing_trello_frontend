import React, { useState } from 'react'
import { DebounceInput } from 'react-debounce-input'
import { MdSearch } from 'react-icons/md'

type SearchInputProps = {
  placeholder: string
  search: (query: string) => void
  className?: string
  debounceTimeout?: number
}

const SearchInput = ({
  placeholder,
  search,
  className,
  debounceTimeout = 100,
}: SearchInputProps) => {
  const [query, setQuery] = useState('')

  return (
    <div
      className={`rounded-lg shadow-md h-10 flex justify-between items-center p-1 ${className}`}
    >
      <DebounceInput
        style={{ minWidth: 0 }}
        className="mx-2 w-full"
        minLength={2}
        placeholder={placeholder}
        debounceTimeout={debounceTimeout}
        onChange={(e) => {
          setQuery(e.target.value)
          search(e.target.value)
        }}
      />
      <button
        className="bg-orange rounded-lg h-full px-4 hover:bg-orange-darker text-white text-sm"
        onClick={() => search(query)}
      >
        <MdSearch />
      </button>
    </div>
  )
}

export default SearchInput
