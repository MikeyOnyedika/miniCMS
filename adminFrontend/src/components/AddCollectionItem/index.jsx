import React from 'react'
import { Wrapper } from '../CollectionItems/styles.module.css'
import { BackButton } from '../BackButton'
import { useParams } from 'react-router-dom'
import { useUserContentContext } from '../../contexts/UserContentProvider'
import capitalize from '../../utils/capitalize'
import Loading from '../Loading'
import { useCreateFormInputsFromTemplate } from '../../hooks/useCreateFormInputsFromTemplate'
import { useEffect } from 'react'
import { template } from '../../data/sampleCollectionTemplate'
import Styles from './styles.module.css'

export const AddCollectionItem = () => {
  const { collectionId } = useParams();
  const { collections, addStatusMessage, SUCCESS, FAILED } = useUserContentContext()
  const col = collections.collections.find(col => col.id === collectionId)
  const [formInputs, generateFormInputs] = useCreateFormInputsFromTemplate();

  useEffect(() => {
    console.log(col)
    if (col) {
      generateFormInputs(template.fields)
    }
  }, [col])

  function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target

    // check for empty field that are required
    const fields = template.fields
    for (let field in fields) {
      // TODO: validate that all  fields are not empty. Then show error message for required fields that are empty or don't have a valid value
      
      if (form[field].value === "") {
        return addStatusMessage({ status: FAILED, message: `${fields[field].label} is empty` })

      }
    }

    // TODO: submit the form to create a new item in the collection
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
        <form onSubmit={handleFormSubmit} className={Styles.Form}>
          {
            col?.name && (
              <>
                {formInputs}
              </>
            )
          }
        </form>
      </div>
    </section>
  )
}
