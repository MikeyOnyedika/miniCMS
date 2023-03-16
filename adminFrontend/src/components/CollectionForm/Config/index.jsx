import { useCreateFormInputsFromTemplate } from "../../../hooks/useCreateFormInputsFromTemplate"
import { useEffect } from "react"
import Styles from './styles.module.css'

export const Config = ({ updateOverallFormData, config }) => {
    const { formInputs, generateFormInputs, formData, setFormData } = useCreateFormInputsFromTemplate()

    // updating overall form data using the local form data whenever the local form data changes
    useEffect(() => {
        updateOverallFormData((prev) => {
            return { ...prev, config: formData }
        })

        if (config != null && config?.timestamps != null && formData === null) {
            generateFormInputs([
                {
                    name: "timestamps",
                    label: "Include timestamps",
                    type: "boolean",
                    defaultValue: config.timestamps
                }
            ], config)
        }
    }, [formData, config])

    return (
        <section className={Styles.SectionWrapper}>
            <h3>Config</h3>
            <div className={Styles.SectionWrapper__FormInputs}>
                {formInputs}
            </div>
        </section>
    )
}