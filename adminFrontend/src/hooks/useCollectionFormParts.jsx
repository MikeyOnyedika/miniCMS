import React, { useState, useEffect } from 'react'
import { General } from '../components/CollectionForm/General'
import { Config } from '../components/CollectionForm/Config'
import { Fields } from '../components/CollectionForm/Fields'

export const useCollectionFormParts = () => {
    const [formData, setFormData] = useState({})
    const [formParts, setFormParts] = useState([])

    useEffect(() => {
        console.log(formData.name)
        console.log(formData.fields)
        console.log(formData.config)
        
        setFormParts([
            <General updateOverallFormData={setFormData} name={formData.name} />,
            <Fields updateOverallFormData={setFormData} fields={formData.fields} />,
            <Config updateOverallFormData={setFormData} config={formData.config} />
        ])
    }, [formData])

    function generateFormParts(existingCollectionData) {
        const initFormData = existingCollectionData || {}
        console.log(initFormData)
        if (Object.keys(initFormData).length === 0) {
            initFormData.name = ""
            initFormData.fields = []
            initFormData.config = { timestamps: false }
        }
        setFormData(initFormData)
    }

    return {
        formParts,
        formData,
        generateFormParts
    }
}


