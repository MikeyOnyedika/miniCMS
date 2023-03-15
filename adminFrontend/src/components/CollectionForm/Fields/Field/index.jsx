import { useEffect } from "react"
import { useCreateFormInputsFromTemplate } from "../../../../hooks/useCreateFormInputsFromTemplate"
import Styles from './styles.module.css'

export const Field = ({ updateFieldsData, data }) => {
    const { formData, formInputs, generateFormInputs, lastUpdatedInput } = useCreateFormInputsFromTemplate()

    const formInputsInit = [
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
    ]

    useEffect(() => {
        // runs once to render fields while also setting the initial value for formData through the generateFormInputs() 
        if (data != null && formData == null) {
            generateFormInputs([
                ...formInputsInit,
                {
                    name: "defaultValue",
                    label: "Default Value",
                    required: false,
                    type: "string",
                    placeholder: "enter default value",
                    hidden: true
                },
            ], data)
        }
    }, [data, formData])


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

    useEffect(() => {
        if (formData != null) {
            // make sure the last updated property of this field  was 'type' 
            // TODO: INFINITE RENDERING HERE. FIX IT
            if (lastUpdatedInput === "type") {
                generateFieldInputs(formData)
                console.log(formData)
            }
        }
    }, [lastUpdatedInput])

    function generateFieldInputs(fData) {
        if (fData.type === "") {
            generateFormInputs([
                ...formInputsInit
            ], fData)
        } else if (fData.type === "boolean") {
            generateFormInputs([
                ...formInputsInit,
                {
                    name: "defaultValue",
                    label: "Default Value",
                    required: false,
                    type: "boolean",
                    hidden: false
                },
            ], fData)
        } else if (fData.type === "string") {
            generateFormInputs([
                ...formInputsInit,
                {
                    name: "defaultValue",
                    label: "Default Value",
                    required: false,
                    type: "string",
                    hidden: false,
                    placeholder: "some default value"
                },
            ], fData)
        } else if (formData.type === "date") {
            generateFormInputs([
                ...formInputsInit,
                {
                    name: "defaultValue",
                    label: "Default Value",
                    required: false,
                    type: "date",
                    hidden: false,
                },
            ], fData)
        } else if (fData.type === "number") {
            generateFormInputs([
                ...formInputsInit,
                {
                    name: "defaultValue",
                    label: "Default Value",
                    required: false,
                    type: "number",
                    placeholder: "enter default number",
                    hidden: false,
                },
            ], fData)
        }
    }

    function removeField() {
        updateFieldsData((prev) => {
            return prev.filter((field) => {
                if (field._id !== formData._id) {
                    return true
                } else {
                    return false
                }
            })
            // console.log(prev)
            return prev
        })
        // console.log(data)
    }


    return (
        <div className={Styles.Wrapper}>
            <div className={Styles.Field}>
                <button onClick={removeField}>-</button>
                <div className={Styles.FieldInputs}>
                    {formInputs}
                </div>
            </div>
            <div className={Styles.Line}></div>
        </div>
    )
}