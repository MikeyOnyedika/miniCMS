import React, { useEffect } from 'react'
import { Wrapper } from '../CollectionItems/styles.module.css'
import { BackButton } from '../BackButton'
import { useParams } from 'react-router-dom'
import Styles from './styles.module.css'
import { useCollectionFormParts } from '../../hooks/useCollectionFormParts'
import { useUserContentContext } from '../../contexts/UserContentProvider'
import { useNavigate } from 'react-router-dom'
import { RequestState } from '../../utils/consts'

export const CollectionForm = () => {
  const navigate = useNavigate()
  const urlParams = useParams();
  let path;

  if (urlParams.collectionId === undefined) { // /dashboard/collections/new 
    path = "new"
  } else { // /dashboard/collections/edit/:collectionId
    path = urlParams.collectionId
  }

  const { collections, updateCollection, updateColStatus, addCollection, addColStatus, addStatusMessage } = useUserContentContext()
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
          navigate("/404")
        }
      }
    }
  }, [collections])

  async function handleFormSubmit(e) {
    e.preventDefault()
    // console.log(formData)

    // validate inputs first
    if (formData.name === "") {
      addStatusMessage({ status: RequestState.FAILED, message: `Collection name is not provided` })
      return;
    }

    if (formData.fields.length === 0) {
      addStatusMessage({ status: RequestState.FAILED, message: `At least one field must be added to continue` })
      return;
    }

    for (let field of formData.fields) {
      // make sure the required properties are provided
      const name = field.name;
      const label = field.label;
      const contentType = field.type

      if (name === "") {
        addStatusMessage({ status: RequestState.FAILED, message: `One of the fields does not have a valid value for 'Name'` })
        return
      }
      if (label === "") {
        addStatusMessage({ status: RequestState.FAILED, message: `One of the fields does not have a valid value for 'Label'` })
        return
      }
      if (contentType === "") {
        addStatusMessage({ status: RequestState.FAILED, message: `One of the fields does not have a valid value for 'Content Type'` })
        return
      }

      // check for props specific to certain content types
      if (contentType === "string") {
        if (field.placeholder === "") {
          addStatusMessage({ status: RequestState.FAILED, message: `One of the fields does not have a valid value for 'Placeholder'` })
          return
        }
      }
    }

    // TODO: clear form inputs once new collection is added to database 
    if (path === "new") {
      const response = await addCollection(formData)
      console.log(response)
      if (response.success === true) {
        console.log("Ressetting inputs")
        // TODO: FIND OUT what populates formData again after it is cleared
        // TODO: why doesn't this clear the input fields????!!!   
        generateFormParts()
      }
    } else {

    }
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
