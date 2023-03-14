import { useCreateFormInputsFromTemplate } from "../../../hooks/useCreateFormInputsFromTemplate"
import { useEffect } from "react"
import Styles from '../Config/styles.module.css'

export const General = ({ updateOverallFormData, name }) => {
    const { formInputs, generateFormInputs, formData } = useCreateFormInputsFromTemplate()

    // updating overall form data using the local form data whenever the local form data changes
    useEffect(() => {
        updateOverallFormData((prev) => {
            return { ...prev, name: formData?.name }
        })

        // runs once to generate forminputs while setting their initial state
        if (name != null && formData === null) {
            generateFormInputs([
                {
                    name: "name",
                    label: "Collection Name",
                    required: true,
                    type: "string",
                    placeholder: "book"
                }
            ], { name })
        }
    }, [formData, name])

    return (
        <section className={Styles.SectionWrapper}>
            <h3>General</h3>
            <div className={Styles.SectionWrapper__FormInputs}>
                {formInputs}
            </div>
        </section>
    )
}