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
                    placeholder: "title",
                },
                {
                    name: "label",
                    label: "Label",
                    required: true,
                    type: "string",
                    placeholder: "Title",
                },
                {
                    name: "required",
                    label: "Required",
                    required: true,
                    type: "boolean",
                },
                {
                    name: "type",
                    label: "Content Type",
                    required: true,
                    type: "drop-down-list",
                    options: [
                        { value: "", label: "Select a conent type" },
                        { value: "string", label: "String" },
                        { value: "date", label: "Date" },
                        { value: "number", label: "Number" },
                        { value: "boolean", label: "Boolean" },
                    ]
                },
                {
                    name: "placeholder",
                    label: "Placeholder Text",
                    required: true,
                    type: "string",
                    placeholder: "placeholder text",
                },
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
            <div className={Styles.Field}>
                {formInputs}
            </div>
            <div className={Styles.Line}></div>
        </div>
    )
}