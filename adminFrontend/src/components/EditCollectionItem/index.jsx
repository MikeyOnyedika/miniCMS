import React from 'react'
import { Wrapper } from '../CollectionItems/styles.module.css'
import { BackButton } from '../BackButton'
import { useParams } from 'react-router-dom'
import { useUserContentContext } from '../../contexts/UserContentProvider'
import capitalize from '../../utils/capitalize'
import Loading from '../Loading'
import { useCreateFormInputsFromTemplate } from '../../hooks/useCreateFormInputsFromTemplate'
import { useEffect } from 'react'
import { FormWrapper, Form } from '../AddCollectionItem/styles.module.css'
import { RequestState } from '../../utils/consts'
import { FormGroup } from '../FormInput/styles.module.css'
import { template } from '../../data/sampleCollectionTemplate'
import { useState } from 'react'

export const EditCollectionItem = () => {
    const { collectionId, itemId } = useParams();
    const { collections, addStatusMessage, updateCollectionContent, updateColConStatus, colContents } = useUserContentContext()
    const col = collections.collections.find(col => col._id === collectionId)
    const { formInputs, generateFormInputs, formData } = useCreateFormInputsFromTemplate();
    const submitBtnName = "submitBtn"
    const [itemToEdit, setItemToEdit] = useState(null)

    useEffect(() => {
        if (colContents && formData === null) {
            const item = colContents.find(item => item._id === itemId)
            if (item) {
                setItemToEdit(item)
            }
        }
    }, [colContents, formData])


    useEffect(() => {
        if (itemToEdit) {
            // itemToEdit has to be destructured else most of the fields will be empty strings
            generateFormInputs(template.fields, itemToEdit)
        }
    }, [itemToEdit])

    async function handleFormSubmit(e) {
        e.preventDefault();
        const form = e.target

        // check for empty field that are required
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

        await updateCollectionContent(col.name, itemToEdit._id, body)
    }

    return (
        <section className={Wrapper}>
            <header>
                <div>
                    <BackButton to={`/dashboard/${collectionId}`} />
                    <h2>
                        {
                            col?.name ? capitalize(`edit this ${col.name}`) : <Loading size={20} />
                        }
                    </h2>
                </div>
            </header>

            <div className={FormWrapper}>
                <p>Note: * means the field is required</p>
                {
                    col?.name ? (
                        <form onSubmit={handleFormSubmit} className={Form}>
                            <>
                                {formInputs}
                                <div className={FormGroup}>
                                    <input type="submit" name={submitBtnName} value={updateColConStatus.isLoading === true ? "Loading ..." : "Edit"}
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
