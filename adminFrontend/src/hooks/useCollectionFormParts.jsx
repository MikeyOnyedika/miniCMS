import React, { useState, useEffect } from 'react'
import { General } from '../components/CollectionForm/General'
import { Config } from '../components/CollectionForm/Config'
import { Fields } from '../components/CollectionForm/Fields'
import { v4 as uuidv4 } from 'uuid'

export const useCollectionFormParts = () => {
    const [formData, setFormData] = useState({})
    const [formParts, setFormParts] = useState([])

    useEffect(() => {
        if (formData.config != null && formData.name != null && formData.primaryField != null && formData.fields != null) {
            console.log(formData.primaryField)
            setFormParts([
                <General updateOverallFormData={setFormData} name={formData.name} primaryField={formData.primaryField} />,
                <Fields updateOverallFormData={setFormData} fields={formData.fields} />,
                <Config updateOverallFormData={setFormData} config={formData.config} />
            ])
        }
    }, [formData])


    // the key/value pair stored in formData is first set here!!
    function generateFormParts(existingCollectionData) {
        let initFormData = existingCollectionData || {}
        // initialize the formData properties if initFormData is an empty object
        if (Object.keys(initFormData).length === 0) {
            initFormData.name = ""
            initFormData.primaryField = ""
            initFormData.fields = []
            initFormData.config = { timestamps: false }
        }
        if (initFormData.fields.length > 0) {
            // include an _id property to identify each field
            // TODO: see if these _id values for each field can be added when the data is sent to the backend instead of being added in the frontend here
            initFormData = {
                ...initFormData, fields: initFormData.fields.map(field => {
                    return { _id: uuidv4(), ...field }
                })
            }
        }

        setFormData(initFormData)
    }

    return {
        formParts,
        formData,
        generateFormParts
    }
}


