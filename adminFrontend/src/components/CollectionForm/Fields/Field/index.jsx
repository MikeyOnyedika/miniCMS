import { useEffect } from "react"
import { useCreateFormInputsFromTemplate } from "../../../../hooks/useCreateFormInputsFromTemplate"
import Styles from './styles.module.css'

export const Field = ({ updateFieldsData, data }) => {
    const { formData, formInputs, generateFormInputs } = useCreateFormInputsFromTemplate()

    useEffect(() => {
        // runs once to render fields with their initial data
        if (data != null && formData == null) {
            generateFormInputs([
                {
                    name: "name",
                    label: "Name",
                    required: true,
                    type: "string",
                    placeholder: "",
                },
                {
                    name: "label",
                    label: "Label",
                    required: true,
                    type: "string",
                    placeholder: "",
                }
            ], data)
        }
    }, [data])


    useEffect(() => {
        if (formData != null) {
            updateFieldsData((prev) => {
                //  have add an extra _id property on a field to be used to identify a field
                return prev.map((field) => {
                    if (field._id === formData._id) {
                        return { ...formData }
                    } else {
                        return field
                    }
                })
            })
        }
    }, [formData])


    return (
        <div className={Styles.Wrapper}>
            {formInputs}
        </div>
    )
}