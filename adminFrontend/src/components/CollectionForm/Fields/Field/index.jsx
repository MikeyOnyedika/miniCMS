import { useEffect } from "react"
import { useCreateFormInputsFromTemplate } from "../../../../hooks/useCreateFormInputsFromTemplate"
import Styles from './styles.module.css'

export const Field = ({ updateFieldsData, data }) => {
    const { formData, setFormData, formInputs, generateFormInputs } = useCreateFormInputsFromTemplate()

    useEffect(() => {
        updateFieldsData((prev) => {
            // const appropriateField = prev.find((field) => field.name ===  )

            // make a copy of the array
            const fieldsCopy = [...prev]

       //    find a reference to the appropriate field from the fields copy
           // const appropriateField = fieldsCopy.find((field) => field._id  === formData._id)

   //         return [...prev, {  }]
        })
    }, [formData])

    useEffect(() => {
        console.log("field form data: ", formData)
    }, [formData])


    useEffect(() => {
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
        ])
    }, [])

    return (
        <div className={Styles.Wrapper}>
            {formInputs}
        </div>
    )
}