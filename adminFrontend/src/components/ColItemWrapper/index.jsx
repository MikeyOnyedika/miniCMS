import Styles from '../CollectionItems/styles.module.css'
import Loading from "../Loading"
import { FaTrash, FaEdit } from 'react-icons/fa'
import { ColItem } from "./ColItem"
import { IconContext } from 'react-icons'
import { useUserContentContext } from "../../contexts/UserContentProvider"
import { Link } from "react-router-dom"

export const ColItemWrapper = ({ item, index, col }) => {
  const isItemEmpty = Object.keys(item).length <= 0

  const { deleteCollectionContent, delColConStatus } = useUserContentContext()

  function handleDeleteItem(collectionName, itemId) {
    deleteCollectionContent(collectionName, itemId)
  }

  return (
    <div className={Styles.ColConRow} key={index}>
      {
        isItemEmpty === false && <ColItem item={item} />
      }
      <div className={Styles.ColConRow__SettingsPanelWrapper}>
        <div className={Styles.SettingsPanelWrapper__Background}></div>
        <div className={Styles.SettingsPanelWrapper__Panel}>
          <Link to={`/dashboard/collections/${col._id}/edit/${item._id}`}>
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
                <FaTrash onClick={() => handleDeleteItem(col.name, item._id)} />
              )
            }
          </IconContext.Provider>
        </div>
      </div>
    </div>
  )
}

