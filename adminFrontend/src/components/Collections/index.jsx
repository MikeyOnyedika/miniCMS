import { useEffect } from 'react'
import Styles from './styles.module.css'
import { useUserContentContext } from '../../contexts/UserContentProvider'
import capitalize from '../../utils/capitalize'
import { Link } from 'react-router-dom'

export const Collections = () => {
  const { collections, getCollections } = useUserContentContext()

  useEffect(() => {
    getCollections()
  }, [])


  return (
    <section className={Styles.Wrapper}>
      <header className={Styles.Header}>
        <h2>Collections</h2>
        <div>
          <button> + new</button>
        </div>
      </header>

      <div className={Styles.Collections}>
        {collections.isLoading === false && collections.isError === false &&
          collections.collections.map(collection => {
           
            return (
              <Link to={`/dashboard/${collection.collectionId}`} className={Styles.CollectionBtn}>
                <p>{capitalize(collection.collectionName)}</p>
              </Link>
            )
          })
        }
      </div>
    </section>
  )
}
