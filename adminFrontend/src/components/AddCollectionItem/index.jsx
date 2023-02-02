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
import { template } from '../../data/sampleCollectionTemplate'

export const AddCollectionItem = () => {
  const { collectionId } = useParams();
  const { collections, addStatusMessage, addCollectionContent, postColConStatus } = useUserContentContext()
  const col = collections.collections.find(col => col._id === collectionId)
  const { formInputs, generateFormInputs, initialFormData } = useCreateFormInputsFromTemplate();
  const submitBtnName = "submitBtn"

  useEffect(() => {
    if (col && initialFormData === null) {
      generateFormInputs(template.fields)
    }
  }, [col])

  async function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target

    // check for empty field that are required
    const fields = col.fields
    const body = {}
    for (let field in fields) {
      const currentField = fields[field]
      const isRequired = currentField['required']

      console.log("isRequired: ", isRequired)
      if (form[field].value === "" && isRequired) {

        return addStatusMessage({ status: RequestState.FAILED, message: `${currentField.label} is empty` })

      }

      body[field] = form[field].value

    }

    // TODO: submit the form to create a new item in the collection

    await addCollectionContent(col.name, body)
    // clear input fields once item is added
    if (postColConStatus.isError === false) {
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
                  <input type="submit" name={submitBtnName} value={postColConStatus.isLoading === true ? "Loading ..." : "+ Create"}
                    disabled={postColConStatus.isLoading === true ? true : false}
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
