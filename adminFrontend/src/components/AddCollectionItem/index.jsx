import React from 'react'
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

export const AddCollectionItem = () => {
  const { collectionId } = useParams();
  const { collections, addStatusMessage, addCollectionContent, addColConStatus } = useUserContentContext()
  const col = collections.find(col => col._id === collectionId)
  const { formInputs, generateFormInputs, formData } = useCreateFormInputsFromTemplate();
  const submitBtnName = "submitBtn"

  useEffect(() => {
    if (col && formData === null) {
      generateFormInputs(col.fields)
    }
  }, [col, formData])

  async function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target

    //look through the collection template and check for empty field that are required but isn't provided a value in the form
    const fields = col.fields
    const body = {}
    for (let field in fields) {
      const currentField = fields[field]
      const fieldValue = formData[field] 
      const isRequired = currentField['required']

      if (fieldValue === "" && isRequired) {
        return addStatusMessage({ status: RequestState.FAILED, message: `${currentField.label} is empty` })

      }

      body[field] = fieldValue

    }

    // TODO: submit the form to create a new item in the collection

    await addCollectionContent(col.name, body)
    // clear input fields once item is added
    if (addColConStatus.isError === false && addColConStatus.errorMsg !== null ) {
      for (let field in body) {
        form[field].value = ""
      }
    }
  }

  return (
    <section className={Wrapper}>
      <header>
        <div>
          <BackButton to={`/dashboard/${collectionId}`} />
          <h2>
            {
              col?.name ? capitalize(`add new ${col.name}`) : <Loading size={20} />
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
                  <input type="submit" name={submitBtnName} value={addColConStatus.isLoading === true ? "Loading ..." : "+ Create"}
                    disabled={addColConStatus.isLoading === true ? true : false}
                  />
                </div>
              </>
            </form>
          ) : <Loading />
        }
      </div>
    </section>
  )
}
