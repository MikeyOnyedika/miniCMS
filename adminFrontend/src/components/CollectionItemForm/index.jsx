import React, { useState } from 'react'
import { Wrapper } from '../CollectionItems/styles.module.css'
import { BackButton } from '../BackButton'
import { useParams } from 'react-router-dom'
import { useUserContentContext } from '../../contexts/UserContentProvider'
import capitalize from '../../utils/capitalize'
import Loading from '../Loading'
import { useCreateFormInputsFromTemplate } from '../../hooks/useCreateFormInputsFromTemplate'
import { useEffect } from 'react'
import Styles from './styles.module.css'
import { RequestState } from '../../utils/consts'
import { FormGroup } from '../FormInput/styles.module.css'

export const CollectionItemForm = () => {
  const urlParams = useParams();
  const { collectionId } = urlParams
  let path;

  // /dashboard/collections/:collectionId/new 
  if (urlParams.itemId === undefined) {
    path = "new"
  } else { // /dashboard/collections/:collectionId/edit/:itemId
    path = urlParams.itemId
  }


  const { collections, addStatusMessage, addCollectionContent, updateCollectionContent, addColConStatus, updateColConStatus, colContents } = useUserContentContext()
  const col = collections.find(col => col._id === collectionId)
  const { formInputs, generateFormInputs, formData, setFormData } = useCreateFormInputsFromTemplate();
  const submitBtnName = "submitBtn"

  const [itemToEdit, setItemToEdit] = useState(null)

  useEffect(() => {
    if (path === "new") {
      if (col && formData === null) {
        generateFormInputs(col.fields)
      }
    } else {
      if (colContents && formData === null) {
        const item = colContents.find(item => item._id === path)
        if (item) {
          setItemToEdit(item)
        }
      }
    }
  }, [col, formData, colContents])


  // use effect runs when editing
  useEffect(() => {
    if (path !== "new") {
      if (itemToEdit && col) {
        // itemToEdit has to be destructured else most of the fields will be empty strings
        generateFormInputs(col.fields, itemToEdit)
      }
    }
  }, [itemToEdit, col])

  async function handleFormSubmit(e) {
    e.preventDefault();

    //look through the collection template and check for empty field that are required but isn't provided a value in the form
    const fields = col.fields
    const body = {}

    for (let field of fields) {
      const fieldValue = formData[field.name]
      const isRequired = field.required

      if (fieldValue === "" && isRequired) {
        return addStatusMessage({ status: RequestState.FAILED, message: `${field.label} is empty` })
      }

      //  set each fieldValue to undefined if it's an empty value. This allows the default value at the backend to kick in and provide the value for this field instead
      if (fieldValue === "") {
        body[field.name] = undefined
      } else {
        body[field.name] = fieldValue
      }
    }

    // add a new item into the collection
    if (path === "new") {
      //  submit the form to create a new item in the collection
      await addCollectionContent(col.name, body)

      // clear input fields once item is added
      if (addColConStatus.isError === false && addColConStatus.errorMsg === null) {
        setFormData((formDataPrev) => {
          const newFormData = {}
          for (let field in body) {
            newFormData[field] = ""
          }
          return newFormData
        })
      }
    } else { // or edit the item
      await updateCollectionContent(col.name, itemToEdit._id, body)
    }
  }

  return (
    <section className={Wrapper}>
      <header>
        <div>
          <BackButton to={`/dashboard/collections/${collectionId}`} />
          <h2>
            {
              col?.name ? capitalize(`${path === "new" ? 'add new' : 'edit this'} ${col.name}`) : <Loading size={20} />
            }
          </h2>
        </div>
      </header>

      <div className={Styles.FormWrapper}>
        <p>Note: * means the field is required</p>
        {
          col?.name ? (
            <form onSubmit={handleFormSubmit} className={Styles.Form}>
              <>
                {formInputs}
                <div className={FormGroup}>
                  {
                    // render different <input type="submit" />  depending on whether we're adding or editing collection item
                    path === "new" ? (
                      <input type="submit" name={submitBtnName} value={addColConStatus.isLoading === true ? "Loading ..." : "+ Create"}
                        disabled={addColConStatus.isLoading === true ? true : false}
                      />
                    ) : (
                      <input type="submit" name={submitBtnName} value={updateColConStatus.isLoading === true ? "Loading ..." : "Edit"}
                        disabled={updateColConStatus.isLoading === true ? true : false}
                      />
                    )
                  }
                </div>
              </>
            </form>
          ) : <Loading />
        }
      </div>
    </section>
  )
}
