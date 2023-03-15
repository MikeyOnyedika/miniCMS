import React, { useEffect } from 'react'
import { Wrapper } from '../CollectionItems/styles.module.css'
import { BackButton } from '../BackButton'
import { useParams } from 'react-router-dom'
import Styles from './styles.module.css'
import { useCollectionFormParts } from '../../hooks/useCollectionFormParts'
import { useUserContentContext } from '../../contexts/UserContentProvider'

export const CollectionForm = () => {
  const urlParams = useParams();
  let path;

  if (urlParams.collectionId === undefined) { // /dashboard/collections/new 
    path = "new"
  } else { // /dashboard/collections/edit/:collectionId
    path = urlParams.collectionId
  }

  const { collections } = useUserContentContext()
  const { formParts, formData, generateFormParts } = useCollectionFormParts()

  useEffect(() => {
    if (path === "new") {
      generateFormParts()
    } else {
      if (collections) {
        const col = collections.find(collection => collection._id === path)
        if (col != null) {
          generateFormParts(col)
        } else {
          // TODO: STATUS OUT THAT COLLECTION DOES NOT EXIST AND GIVE US A 404
        }
      }
    }
  }, [collections])

  async function handleFormSubmit(e) {
    e.preventDefault()
    // console.log(formData)
    console.log(formData)
  }


  return (
    <section className={Wrapper}>
      <header>
        <div>
          <BackButton to={`/dashboard/collections`} />
          <h2>
            {
              path === "new" ? (
                <>
                  <>
                    create new Collection: {" "}
                  </>
                  <span>{formData.name}</span>
                </>
              ) : (
                <>
                  <>
                    edit collection: {" "}
                  </>
                  <span>{formData.name}</span>
                </>
              )
            }
          </h2>
        </div>
      </header>

      <div className={Styles.FormWrapper}>
        <form onSubmit={handleFormSubmit} className={Styles.Form}>
          {formParts?.map((formPart, index) => <React.Fragment key={index}>{formPart}</React.Fragment>)}

          <section className={Styles.Form__section}>
            <div>
              {
                // render different <button>  depending on whether we're adding or editing collection item
                path === "new" ? (
                  <button type="submit" name="submitBtn" disabled={false ? true : false}
                  >{false ? "Loading ..." : "+ Create"}  </button>
                ) : (
                  <button type="submit" name="submitBtn" disabled={false ? true : false}
                  >{false ? "Loading ..." : "Edit"}  </button>
                )
              }
            </div>
          </section>
        </form>
      </div>
    </section >
  )
}
