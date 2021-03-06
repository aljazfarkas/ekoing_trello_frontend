import React, { useState } from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil'
import client from '../../api/client'
import { listItemState, listState } from '../../state/listState'
import { ListOfTasks } from '../../types/types'
import BasicInput from '../Form/BasicInput'

type ListInputProps = {
  board_id: number
  setEdit: (edit: boolean) => void
  list?: ListOfTasks | null
}

const ListInput = ({ board_id, setEdit, list }: ListInputProps) => {
  const [currentList, setCurrentList] = useRecoilState(listItemState(list))
  const [name, setName] = useState<string>(currentList ? currentList.name : '')
  const [error, setError] = useState<string | null>(null)
  const setLists = useSetRecoilState(listState)

  const saveList = async () => {
    setError(null)
    if (name.trim().length < 2) {
      setError("Ime seznama bi naj imelo vsaj 2 črki minimum")
      return
    }
    try {
      let res: any
      if (list) {
        res = await client.put(`/lists/${list.id}`, {
          name,
          board_id,
        })
      } else {
        res = await client.post('/lists', {
          name,
          board_id,
        })
      }

      if (list) {
        setCurrentList({ id: list.id, name })
      } else {
        setLists((old: ListOfTasks[]) => {
          return old.concat(res.data.data)
        })
      }

      setName('')
      setEdit(false)
    } catch (e) {
      console.log('Save list error', e)
      if (e.response && e.response.data) {
        setError(e.response.data)
      } else {
        setError(e.message)
      }
    }
  }
  return (
    <BasicInput
      name="list"
      type="text"
      placeholder="Vnesi ime seznama"
      className="mb-4 w-full"
      value={name}
      onChange={(e) => setName(e.target.value)}
      error={error || ''}
      onBlur={() => {
        setEdit(false)
        setError(null)
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault()
          saveList()
        }
      }}
      autoFocus={true}
    />
  )
}

export default React.memo(ListInput)
