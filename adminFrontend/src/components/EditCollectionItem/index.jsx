import React from 'react'
import { Wrapper } from '../CollectionItems/styles.module.css'
import { BackButton } from '../BackButton'
import { useParams } from 'react-router-dom'
import { useUserContentContext } from '../../contexts/UserContentProvider'
import capitalize from '../../utils/capitalize'
import Loading from '../Loading'
import { useCreateFormInputsFromTemplate } from '../../hooks/useCreateFormInputsFromTemplate'
import { useEffect } from 'react'
import Styles from '../AddCollectionItem/styles.module.css'
import { RequestState } from '../../utils/consts'
import { FormGroup } from '../FormInput/styles.module.css'
import { Mode } from '../../utils/consts'

export const EditCollectionItem = () => {
    const { collectionId, itemId } = useParams();
    const { collections, addStatusMessage, updateCollectionContent, updateColConStatus, colContents } = useUserContentContext()
    const col = collections.collections.find(col => col._id === collectionId)

    const { formInputs, generateFormInputs, formData, setFormData } = useCreateFormInputsFromTemplate(Mode.EDIT);

    const submitBtnName = "submitBtn"

    useEffect(() => {
        // set form data to an initial value once colContents is gotten from network request
        if (colContents && formData == undefined) {
            setFormData(colContents?.find(item => item._id === itemId))
        }

        // proceed to generate Form Input only when formData is defined
        if (col && formData) {
            generateFormInputs(col.fields)
        }
    }, [col, formData, colContents])

    async function handleFormSubmit(e) {
        // note: formData is not used to get the form values for submittion
        e.preventDefault();
        const form = e.target

        // check for empty field that are required
        const fields = col.fields

        const body = {}
        for (let field in fields) {
            const currentField = fields[field]
            const isRequired = currentField['required']

            if (form[field].value === "" && isRequired) {

                return addStatusMessage({ status: RequestState.FAILED, message: `${currentField.label} is empty` })

            }

            body[field] = form[field].value
        }

        await updateCollectionContent(col.name, body)
        // // clear input fields once item is added
        // if (postColConStatus.isError === false) {
        //   for (let field in body) {
        //     form[field].value = ""
        //   }
        // }
    }

    return (
        <section className={Wrapper}>
            <header>
                <div>
                    <BackButton to={`/dashboard/${collectionId}`} />
                    <h2>
                        {
                            col && (col.name ? capitalize(`Edit a ${col.name}`) : <Loading size={20} />)
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
                                    <input type="submit" name={submitBtnName} value={updateColConStatus.isLoading === true ? "Loading ..." : "Update"}
                                        disabled={updateColConStatus.isLoading === true ? true : false}
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
