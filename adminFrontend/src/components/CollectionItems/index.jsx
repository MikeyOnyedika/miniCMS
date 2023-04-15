import React from 'react'
import Styles from './styles.module.css'
import { FaTrash, FaPlus, FaEdit } from 'react-icons/fa'
import { useNavigate, useOutlet, useParams } from 'react-router-dom'
import { useUserContentContext } from '../../contexts/UserContentProvider'
import capitalize from '../../utils/capitalize'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import Loading from '../Loading'
import { BackButton } from '../BackButton'
import { parseDateTimeInFormData } from '../../utils/formUtils'
import { ColItemWrapper } from '../ColItemWrapper'


export const CollectionItems = () => {
	const { collectionId } = useParams()
	const { collections, getCollectionContents, getColConStatus, colContents, delColStatus, deleteCollection } = useUserContentContext()

	const col = collections?.find(col => col._id === collectionId)
	const outlet = useOutlet()
	const navigate = useNavigate()

	useEffect(() => {
		if (collections !== null) {
			getCollectionContents(col?.name)
		} else {
			navigate("/404")
		}
	}, [collections])

	async function handleDelCol(collectionId) {
		await deleteCollection(collectionId)
		navigate("/dashboard/collections")
	}

	console.log(colContents)


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
					getColConStatus.isLoading ? (
						<Loading />
					) : (getColConStatus.isError === false && colContents !== null)? (
						colContents.length === 0 ? (
							<p>No items added to this collection yet</p>
						) : (
							colContents.map((row) => {
								const parsedRow = parseDateTimeInFormData(col.fields, row)
								return <ColItemWrapper item={parsedRow} key={row._id} index={row._id} col={col} />
							})
						)
					)
						: (
							<h3>Sorry something went wrong: {getColConStatus.errorMsg}</h3>
						)

				}
			</div>

			<div className={Styles.BtnGroup}>
				<Link to={`/dashboard/collections/edit/${collectionId}`} className={Styles.EditBtn}>
					<FaEdit /> Edit
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
