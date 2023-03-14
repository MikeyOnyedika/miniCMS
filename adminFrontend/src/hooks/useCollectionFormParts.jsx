import React, { useState, useEffect } from 'react'
import { General } from '../components/CollectionForm/General'
import { Config } from '../components/CollectionForm/Config'
import { Fields } from '../components/CollectionForm/Fields'
import { v4 as uuidv4 } from 'uuid'

export const useCollectionFormParts = () => {
    const [formData, setFormData] = useState({})
    const [formParts, setFormParts] = useState([])

    useEffect(() => {
        if (formData.config != null && formData.name != null && formData.fields != null) {
            setFormParts([
                <General updateOverallFormData={setFormData} name={formData.name} />,
                <Fields updateOverallFormData={setFormData} fields={formData.fields} />,
                <Config updateOverallFormData={setFormData} config={formData.config} />
            ])
        }
    }, [formData])

    function generateFormParts(existingCollectionData) {
        let initFormData = existingCollectionData || {}
        if (Object.keys(initFormData).length === 0) {
            initFormData.name = ""
            initFormData.fields = []
            initFormData.config = { timestamps: false }

        }
        if (initFormData.fields.length > 0) {
            // include an _id property to identify each field
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


