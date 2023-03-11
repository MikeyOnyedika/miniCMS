import { useCreateFormInputsFromTemplate } from "../../../hooks/useCreateFormInputsFromTemplate"
import { useEffect } from "react"
import Styles from './styles.module.css'

export const Config = ({ updateOverallFormData }) => {
    const { formInputs, generateFormInputs, formData, setFormData } = useCreateFormInputsFromTemplate()

    // updating overall form data using the local form data whenever the local form data changes
    useEffect(() => {
        updateOverallFormData((prev) => {
            return { ...prev, config: formData }
        })
    }, [formData])

    useEffect(() => {
        generateFormInputs([
            {
                name: "timestamps",
                label: "Include timestamps",
                type: "boolean",
                defaultValue: false
            }
        ])
    }, [])

    return (
        <section className={Styles.SectionWrapper}>
            <h3>Config</h3>
            <div className={Styles.SectionWrapper__FormInputs}>
                {formInputs}
            </div>
        </section>
    )
}