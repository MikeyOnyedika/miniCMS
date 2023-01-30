import { useEffect } from 'react'
import Styles from './styles.module.css'
import { useUserContentContext } from '../../contexts/UserContentProvider'
import capitalize from '../../utils/capitalize'
import { Link, useOutlet } from 'react-router-dom'
import Loading from '../Loading'

export const Collections = () => {
  const { collections } = useUserContentContext()

  const outlet = useOutlet()


  return (
    <>
      {
        outlet || <section className={Styles.Wrapper}>
          <header className={Styles.Header}>
            <h2>Collections</h2>
            <div>
              <button> + new</button>
            </div>
          </header>

          <div className={Styles.Collections}>
            {collections.isLoading === true ? (
              <Loading />
            ) : collections.isError === false ? (
              collections.collections.length === 0 ? (
                <p>No items added to this collection yet</p>
              ) : (collections.collections.map(collection => {

                return (
                  <Link to={`/dashboard/${collection.id}`} className={Styles.CollectionBtn} key={collection.id}>
                    <p>{capitalize(collection.name)}</p>
                  </Link >
                )
              }))
            ) : (
              <h3>Sorry, something went wrong : {collections.errorMsg}</h3>
            )}
          </div>
        </section>
      }
    </>
  )
}
