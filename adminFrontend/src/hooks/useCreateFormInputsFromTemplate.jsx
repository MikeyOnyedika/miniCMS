import { FormInput } from '../components/FormInput';
import { useState, useEffect, useCallback } from 'react';
import { parseDateTime, parseDateTimeInFormData } from '../utils/formUtils';

export function useCreateFormInputsFromTemplate() {
    const [formInputs, setFormInputs] = useState(null);
    const [formData, setFormData] = useState(null)
    const [template, setTemplate] = useState(null)

    // changes start here
    function handleOnChange(e) {
        const name = e.target.name;
        let value

        if (e.target.type === "checkbox" || e.target.type === "radio") {
            value = e.target.checked
        } else {
            value = e.target.value
        }


        setFormData((prev) => {
            return { ...prev, [name]: value }
        })
    }

    useEffect(() => {
        if (formData) {
            createFormInputs()
        }
    }, [formData])


    const createFormInputs = useCallback(() => {
        const fieldNames = Object.keys(template)
        setFormInputs(
            fieldNames.map((fieldName) => {
                // looks like this { formInputType: "url", required: true, unique: false }
                const fieldValueObj = template[fieldName];
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

    }, [template, formData])

    function generateFormInputs(template, existingFormData) {
        const fieldNames = Object.keys(template);
        setTemplate(template)
        let initFormData = existingFormData || {}
        // do the looping only if the object is empty
        if (Object.keys(initFormData).length === 0) {
            for (let fName of fieldNames) {
                initFormData[fName] = ""
            }
        } else {
            // parse the datetime-local string returned from the database so that the appropriate form input can use it
            initFormData = parseDateTimeInFormData(template, initFormData)
        }
        setFormData(initFormData)
    }

    return { formInputs, generateFormInputs, formData }
}
