import { FormInput } from '../components/FormInput';
import { useState, useEffect } from 'react';

export function useCreateFormInputsFromTemplate() {
    const [formInputs, setFormInputs] = useState(null);
    const [formData, setFormData] = useState({})
    const [initialFormData, setInitialFormData] = useState(null)
    const [template, setTemplate] = useState(null)

    // changes start here


    function handleOnChange(e) {
        const name = e.target.name;
        const value = e.target.value

        setFormData((prev) => {
            return { ...prev, [name]: value }
        })
    }

    useEffect(() => {
        if (initialFormData) {
            console.log(initialFormData)
            setFormData({ ...initialFormData })
            createFormInputs()
        }
    }, [initialFormData])

    useEffect(() => {
        console.log(formData)
    }, [formData])


    function createFormInputs() {
        const fieldNames = Object.keys(template)
        console.log(formData)
        setFormInputs(
            fieldNames.map((fieldName) => {
                // looks like this { formInputType: "url", required: true, unique: false }
                const fieldValueObj = template[fieldName];
                console.log("fieldValueObj: ", fieldValueObj)
                console.log("inputType: ", fieldValueObj.formInputType)
                return (
                    <FormInput
                        key={fieldName}
                        labelName={fieldValueObj.label}
                        inputType={fieldValueObj.formInputType}
                        required={fieldValueObj.required}
                        placeholder={fieldValueObj.exampleValue}
                        options={fieldValueObj.options}
                        fieldName={fieldName}
                        onChangeHandler={handleOnChange}
                        value={formData ? formData[fieldName] : ""}
                    />
                );
            })
        )
    }

    function generateFormInputs(template, existingFormData) {
        const fieldNames = Object.keys(template);
        setTemplate(template)
        const initFormData = existingFormData || {}
        // do the looping only if the object is empty
        if (Object.keys(initFormData).length === 0) {
            for (let fName of fieldNames) {
                initFormData[fName] = ""
            }
        }
        console.log(initFormData)
        setInitialFormData(initFormData)
    }

    return { formInputs, setInitialFormData, generateFormInputs, formData, initialFormData }
}
