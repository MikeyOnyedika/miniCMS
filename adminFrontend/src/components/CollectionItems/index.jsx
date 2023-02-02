import React from 'react'
import Styles from './styles.module.css'
import { FaTrash, FaPlus, FaEdit } from 'react-icons/fa'
import { IconContext } from 'react-icons'
import { useOutlet, useParams } from 'react-router-dom'
import { useUserContentContext } from '../../contexts/UserContentProvider'
import capitalize from '../../utils/capitalize'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import Loading from '../Loading'
import { BackButton } from '../BackButton'


export const CollectionItems = () => {
  // get the actual collection from it's id
  const { collectionId } = useParams()
  const { collections, getCollections, getCollectionContents, getColConStatus, deleteCollectionContent, delColConStatus, colContents } = useUserContentContext()
  const col = collections.collections.find(col => col._id === collectionId)
  const outlet = useOutlet()

  useEffect(() => {
    if (collections.isLoading === false) {
      getCollectionContents(col?.name)
    }
  }, [collections.isLoading])

  function handleDeleteItem(collectionName, itemId) {
    deleteCollectionContent(collectionName, itemId)
  }


  return (
    outlet || <section className={Styles.Wrapper}>
      <header>
        <div>
          <BackButton to={"/dashboard"} />
          <h2>
            {
              col?.name ? capitalize(col.name) : <Loading size={20} />
            }
          </h2>
        </div>
        <Link className={Styles.CreateBtn}
          to={col?.name ? `/dashboard/${col._id}/new` : '#'}
        >
          <FaPlus /> new
        </Link>
      </header>

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
                  colContents.map((row, index) => {
                    const propValueArray = []
                    for (let i in row) {
                      propValueArray.push(<span key={i + index}><span><b>{i.toLocaleLowerCase()}:</b></span> <span>{row[i]}</span></span>)
                    }

                    return (
                      <div className={Styles.ColConRow} key={index}>
                        {propValueArray}
                        <div className={Styles.ColConRow__SettingsPanelWrapper}>
                          <div className={Styles.SettingsPanelWrapper__Background}></div>
                          <div className={Styles.SettingsPanelWrapper__Panel}>
                            <Link to={`/dashboard/${col._id}/${row._id}`}>
                              <IconContext.Provider value={{ className: Styles.ColEditBtn }}>
                                {
                                  <FaEdit />
                                }
                              </IconContext.Provider>
                            </Link>
                            <IconContext.Provider value={{ className: Styles.ColDeleteBtn }}>
                              {
                                delColConStatus.isLoading ? (
                                  <Loading size={20} />
                                ) : (
                                  <FaTrash onClick={() => handleDeleteItem(col.name, row._id)} />
                                )
                              }
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
