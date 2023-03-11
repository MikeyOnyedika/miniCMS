import { useEffect, useState } from "react"
import Styles from '../Config/styles.module.css'
import { useCreateFormInputsFromTemplate } from "../../../hooks/useCreateFormInputsFromTemplate"
import { Field } from "./Field"

export const Fields = ({ updateOverallFormData, fields }) => {
    const [formInputs, setFormInputs] = useState(null)
    const [formData, setFormData] = useState(null)

    useEffect(() => {
        console.log("fields form data", formData)
        updateOverallFormData((prev) => {
            return { ...prev, fields: formData }
        })

        // runs once to generate forminputs while setting their initial state
        if (fields != null && formData === null) {
            setFormInputs((prev) => {
                return fields.map((field) => <Field updateFieldsData={setFormData} data={field} />)
            })
        }

    }, [formData])


    function addField() {
        setFormInputs((prev) => {
            return [...prev, <Field />]
        })
    }

    // updating overall form data using the local form data whenever the local form data changes
    // useEffect(() => {
    //     updateOverallFormData((prev) => {
    //         return { ...prev, fields: formData }
    //     })
    // }, [formData])

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