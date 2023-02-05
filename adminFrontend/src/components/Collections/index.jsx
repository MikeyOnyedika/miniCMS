import Styles from './styles.module.css'
import { useUserContentContext } from '../../contexts/UserContentProvider'
import capitalize from '../../utils/capitalize'
import { Link, useOutlet } from 'react-router-dom'
import Loading from '../Loading'

export const Collections = () => {
  const { collections, getColStatus } = useUserContentContext()
  console.log("collections: ", collections)
  console.log("getColStatus: ", getColStatus)

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
            {
              collections === null ? (
                <Loading />
              ) : (
                getColStatus.isError === false ? (
                  collections.length === 0 ? (
                    <p>No items added to this collection yet</p>
                  ) : (collections.map(col => {
                    return (
                      <Link to={`/dashboard/${col._id}`} className={Styles.CollectionBtn} key={col._id}>
                        <p>{capitalize(col.name)}</p>
                      </Link >
                    )
                  }))

                ) : (
                  <h3>Sorry, something went wrong : {getColStatus.errorMsg}</h3>
                )
              )
            }
          </div>
        </section>
      }
    </>
  )
}
