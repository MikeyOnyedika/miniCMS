import React from 'react'
import Styles from './styles.module.css'
import { FaTrash, FaPlus, FaEdit } from 'react-icons/fa'
import { IconContext } from 'react-icons'
import { useNavigate, useOutlet, useParams } from 'react-router-dom'
import { useUserContentContext } from '../../contexts/UserContentProvider'
import capitalize from '../../utils/capitalize'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import Loading from '../Loading'
import { BackButton } from '../BackButton'
import { parseDateTimeInFormData } from '../../utils/formUtils'


export const CollectionItems = () => {
  // get the actual collection from it's id
  const { collectionId } = useParams()
  const { collections, getCollectionContents, getColConStatus, deleteCollectionContent, delColConStatus, colContents, delColStatus, deleteCollection } = useUserContentContext()
  const col = collections?.find(col => col._id === collectionId)
  const outlet = useOutlet()
  const navigate = useNavigate()

  useEffect(() => {
    if (collections !== null) {
      getCollectionContents(col?.name)
    }else{
      navigate("/404")
    }
  }, [collections])

  function handleDeleteItem(collectionName, itemId) {
    deleteCollectionContent(collectionName, itemId)
  }

  async function handleDelCol(collectionId) {
    console.log("attempt delete")
    await deleteCollection(collectionId)
    navigate("/dashboard/collections")
  }


  return (
    outlet || <section className={Styles.Wrapper}>
      <header>
        <div>
          <BackButton to={"/dashboard/collections"} />
          <h2>
            {
              col?.name ? capitalize(col.name) : <Loading size={20} />
            }
          </h2>
        </div>
        <Link className={Styles.CreateBtn}
          to={col?.name ? `/dashboard/collections/${col._id}/new` : '#'}
        >
          <FaPlus /> new
        </Link>
      </header>

      <div className={Styles.ColConRowWrapper}>
        {
          colContents === null ? (
            <Loading />
          ) : getColConStatus.isError === false ? (
            colContents.length === 0 ? (
              <p>No items added to this collection yet</p>
            ) : (
              <>
                {
                  colContents.map((row, index) => {
                    const propValueArray = []
                    const parsedRow = parseDateTimeInFormData(col.fields, row)
                    for (let prop in parsedRow) {
                      propValueArray.push(
                        <span key={prop + index}>
                          <span>
                            <b>{prop.toLocaleLowerCase()}:</b>
                          </span>
                          <span>
                            {parsedRow[prop].toString()}
                          </span>
                        </span>
                      )
                    }

                    return (
                      <div className={Styles.ColConRow} key={index}>
                        {propValueArray}
                        <div className={Styles.ColConRow__SettingsPanelWrapper}>
                          <div className={Styles.SettingsPanelWrapper__Background}></div>
                          <div className={Styles.SettingsPanelWrapper__Panel}>
                            <Link to={`/dashboard/collections/${col._id}/edit/${parsedRow._id}`}>
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
                                  <FaTrash onClick={() => handleDeleteItem(col.name, parsedRow._id)} />
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

      <div className={Styles.BtnGroup}>
        <Link to={`/dashboard/collections/edit/${collectionId}`} className={Styles.EditBtn}>
         <FaEdit/> Edit
        </Link>
        {
          delColStatus?.isLoading ? (
            <Loading size={20} />
          ) : (
            <button className={Styles.DeleteBtn} onClick={() => handleDelCol(col._id)}>
              <FaTrash /> delete
            </button>
          )
        }
      </div>
    </section >
  )
}
