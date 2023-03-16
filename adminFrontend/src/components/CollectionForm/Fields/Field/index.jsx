import { useEffect } from "react"
import { useCreateFormInputsFromTemplate } from "../../../../hooks/useCreateFormInputsFromTemplate"
import Styles from './styles.module.css'
import { checkObjectsEqual, toCamelCase } from "../../../../utils/formUtils"

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
                { value: "", label: "Select a content type" },
                { value: "string", label: "String" },
                { value: "date", label: "Date" },
                { value: "number", label: "Number" },
                { value: "boolean", label: "Boolean" },
            ]
        },
    ]

    const placeholderInit = {
        name: "placeholder",
        label: "Placeholder Text",
        required: true,
        type: "string",
        placeholder: "placeholder text",
    }

    useEffect(() => {
        // runs once to render fields while also setting the initial value for formData through the generateFormInputs() 
        if (data != null && formData == null) {
            generateFieldInputs(data)
        }

    }, [data, formData])

    useEffect(() => {
        if (formData != null) {
            // only update the parent data if it's n0t the same as the form Data. I.e only if an actul prop in formData has a different value
            if (checkObjectsEqual(formData, data) === false) {
                // make sure the last updated property of this field  is 'type' 
                if (lastUpdatedInput === "type") {
                    generateFieldInputs(formData)
                } else if (lastUpdatedInput === "name") {
                    const nameInCamelCase = toCamelCase(formData.name)
                    generateFieldInputs({ ...formData, name: nameInCamelCase })
                }

                // update the formData from the parent component 
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
            } else {
                // console.log("they are equal, no update")
            }
        }
    }, [lastUpdatedInput, formData, data])

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
                    type: "drop-down-list",
                    options: [
                        { value: "TRUE", label: "TRUE" },
                        { value: "FALSE", label: "FALSE" }
                    ],
                },
            ], fData)
        } else if (fData.type === "string") {
            generateFormInputs([
                ...formInputsInit,
                placeholderInit,
                {
                    name: "defaultValue",
                    label: "Default Value",
                    required: false,
                    type: "string",
                    placeholder: "some default value"
                },
            ], fData)
        } else if (fData.type === "date") {
            generateFormInputs([
                ...formInputsInit,
                {
                    name: "defaultValue",
                    label: "Default Value",
                    required: false,
                    type: "drop-down-list",
                    options: [
                        { value: "NONE", label: "NONE" },
                        { value: "CURRENT_TIMESTAMP", label: "CURRENT_TIMESTAMP" }
                    ],
                },
            ], fData)
        } else if (fData.type === "number") {
            generateFormInputs([
                ...formInputsInit,
                placeholderInit,
                {
                    name: "defaultValue",
                    label: "Default Value",
                    required: false,
                    type: "number",
                    placeholder: "enter default number",
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
        })
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