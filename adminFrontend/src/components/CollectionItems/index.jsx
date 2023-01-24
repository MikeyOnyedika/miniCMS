import React from 'react'
import Styles from './styles.module.css'
import { FaArrowLeft, FaTrash, FaPlus } from 'react-icons/fa'
import { useParams } from 'react-router-dom'
import { useUserContentContext } from '../../contexts/UserContentProvider'
import capitalize from '../../utils/capitalize'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import Loading from '../Loading'

export const CollectionItems = () => {
  // get the actual collection from it's id
  const { collectionId } = useParams()
  console.log(collectionId)
  const { collections, getCollectionContents, getColConStatus, colContents } = useUserContentContext()
  const col = collections.collections.find(col => col.collectionId === collectionId)

  useEffect(() => {
    getCollectionContents()
  }, [])


  useEffect(() => {
    console.log("colContents: ", colContents)
  }, [colContents])

  return (
    <section className={Styles.Wrapper}>
      <div>
        <div>
          <Link to={"/dashboard"}>
            <FaArrowLeft />
          </Link>
          <h2>{capitalize(col.collectionName)}</h2>
        </div>
        <Link className={Styles.CreateBtn} >
          <FaPlus /> new
        </Link>
      </div>

      <div>
        {
          getColConStatus.isLoading === true ? (
            <Loading />
          ) : getColConStatus.isError === false ? (
            <p>hello</p>
          ) : (
            <h3>Sorry something went wrong: { getColConStatus.errorMsg }</h3>
          )

        }
      </div>

      <div>
        <button className={Styles.DeleteBtn}>
          <FaTrash /> delete
        </button>
      </div>
    </section>
  )
}
