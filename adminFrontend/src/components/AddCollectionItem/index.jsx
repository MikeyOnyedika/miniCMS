import React from 'react'
import Styles from './styles.module.css'
import { Wrapper } from '../CollectionItems/styles.module.css'
import { BackButton } from '../BackButton'
import { useParams } from 'react-router-dom'
import { useUserContentContext } from '../../contexts/UserContentProvider'
import capitalize from '../../utils/capitalize'

export const AddCollectionItem = () => {
  const { collectionId } = useParams();
  const { collections } = useUserContentContext()
  const col = collections.collections.find(col => col.id === collectionId)

  return (
    <section className={Wrapper}>
      <header>
        <div>
          <BackButton to={`/dashboard/${collectionId}`} />
          <h2>{capitalize(`add new ${col.name}`)}</h2>
        </div>
      </header>
    </section>
  )
}
