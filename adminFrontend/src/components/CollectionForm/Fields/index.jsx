import React from 'react'
import { useEffect, useState } from "react"
import Styles from '../Config/styles.module.css'
import { Field } from "./Field"
import { v4 as uuidv4 } from 'uuid'

export const Fields = ({ updateOverallFormData, fields }) => {
    const [formInputs, setFormInputs] = useState(null)
    const [formData, setFormData] = useState(fields)

    useEffect(() => {
        updateOverallFormData((prev) => {
            return { ...prev, fields: formData }
        })


        // runs once to generate forminputs for preexisting formdata 
        if (formData != undefined) {
            // console.log("formData:: ", formData)
            setFormInputs(
                formData.map((field) => <Field updateFieldsData={setFormData} data={field} key={field._id} />)
            )
        }

    }, [formData])

    function addField() {
        // add a new field object which will map to a new field input
        setFormData(prev => {
            return [...prev, { _id: uuidv4(), name: "", label: "", required: false, type: "", placeholder: "", defaultValue: "" }]
        })
    }

    return (
        <section className={Styles.SectionWrapper}>
            <h3>Fields</h3>
            <div className={Styles.SectionWrapper__FormInputs}>
                {formInputs}
                <button onClick={addField}>
                    Add New Field
                </button>
            </div>
        </section>
    )
}