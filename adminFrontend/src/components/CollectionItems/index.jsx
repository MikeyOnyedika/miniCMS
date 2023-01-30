import React from 'react'
import Styles from './styles.module.css'
import { FaTrash, FaPlus, FaEdit } from 'react-icons/fa'
import { IconContext } from 'react-icons'
import { useParams } from 'react-router-dom'
import { useUserContentContext } from '../../contexts/UserContentProvider'
import capitalize from '../../utils/capitalize'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import Loading from '../Loading'
import { BackButton } from '../BackButton'


export const CollectionItems = () => {
  // get the actual collection from it's id
  const { collectionId } = useParams()
  console.log(collectionId)
  const { collections, getCollections, getCollectionContents, getColConStatus, colContents } = useUserContentContext()
  // TODO: persist collections across page refresh
  const col = collections.collections.find(col => col.id === collectionId)

  useEffect(() => {
    if (collections.isLoading === false) {
      getCollectionContents(col?.name)
    }
  }, [collections.isLoading])


  useEffect(() => {
    console.log("collection items: ", colContents)
  }, [colContents])

  return (
    <section className={Styles.Wrapper}>
      {
        col?.name && (
          <header>
            <div>
              <BackButton to={"/dashboard"} />
              <h2>{capitalize(col.name)}</h2>
            </div>
            <Link className={Styles.CreateBtn} to={`/dashboard/${col.id}/new`}>
              <FaPlus /> new
            </Link>
          </header>
        )
      }

      <div className={Styles.ColConRowWrapper}>
        {
          getColConStatus.isLoading === true ? (
            <Loading />
          ) : getColConStatus.isError === false ? (
            colContents === null ? <Loading /> : colContents.length === 0 ? (
              <p>No items added to this collection yet</p>
            ) : (
              <>
                {
                  colContents.map(row => {
                    console.log("row: ", row)
                    const propValueArray = []
                    for (let i in row) {
                      propValueArray.push(<span><span><b>{i.toLocaleLowerCase()}:</b></span> <span>{row[i]}</span></span>)
                    }

                    return (
                      <div className={Styles.ColConRow}>
                        {propValueArray}
                        <div className={Styles.ColConRow__SettingsPanelWrapper}>
                          <div className={Styles.SettingsPanelWrapper__Background}></div>
                          <div className={Styles.SettingsPanelWrapper__Panel}>
                            <IconContext.Provider value={{ className: Styles.ColEditBtn }}>
                              <FaEdit />
                            </IconContext.Provider>
                            <IconContext.Provider value={{ className: Styles.ColDeleteBtn }}>
                              <FaTrash />
                            </IconContext.Provider>
                          </div>
                        </div>
                      </div>
                    )
                  })}

              </>
            )
          )
            : (
              <h3>Sorry something went wrong: {getColConStatus.errorMsg}</h3>
            )

        }
      </div>

      <div>
        <button className={Styles.DeleteBtn}>
          <FaTrash /> delete
        </button>
      </div>
    </section >
  )
}
