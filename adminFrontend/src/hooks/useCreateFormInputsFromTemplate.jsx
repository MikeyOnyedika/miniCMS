import { useState, useEffect, useCallback } from 'react';
import { parseDateTimeInFormData } from '../utils/formUtils';
import { TextInput } from '../components/FormInput/TextInput'
import { NumberInput } from '../components/FormInput/NumberInput'
import { CheckBoxInput } from '../components/FormInput/CheckBoxInput';
import { DateInput } from '../components/FormInput/DateInput'
import { DropDownListInput } from '../components/FormInput/DropDownListInput';

export function useCreateFormInputsFromTemplate() {
    const [formInputs, setFormInputs] = useState(null);
    const [formData, setFormData] = useState(null)
    const [fields, setFields] = useState(null)
    const [lastUpdatedInput, setLastUpdatedInput] = useState(null)

    // changes start here
    function handleOnChange(e) {
        const name = e.target.name;
        let value
        // make sure we update the lastUpdatedInput only when the last updated input actually becomes a different value and not just whenever formData changes
        if (lastUpdatedInput !== name) {
            setLastUpdatedInput(name)
        }

        if (e.target.type === "checkbox" || e.target.type === "radio") {
            value = e.target.checked
        } else if (e.target.type === "date") {
            console.log("date value: ", e.target.value)
            value = e.target.value ?? ""
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
        setFormInputs(
            fields.map((field, index) => {
                switch (field.type) {
                    case 'string':
                        return (
                            <TextInput
                                key={field.name + index}
                                label={field.label}
                                required={field.required}
                                placeholder={field.placeholder}
                                name={field.name}
                                onChangeHandler={handleOnChange}
                                value={formData ? formData[field.name] : ""}
                                hidden={field.hidden || false}
                            />

                        )
                    case 'number':
                        return (
                            <NumberInput
                                key={field.name + index}
                                label={field.label}
                                required={field.required}
                                placeholder={field.placeholder}
                                name={field.name}
                                onChangeHandler={handleOnChange}
                                value={formData ? formData[field.name] : ""}
                            />
                        )
                    case "boolean":
                        return (
                            <CheckBoxInput
                                key={field.name + index}
                                label={field.label}
                                required={field.required}
                                name={field.name}
                                onChangeHandler={handleOnChange}
                                value={formData ? formData[field.name] : ""}
                            />
                        )
                    case "date":
                        return (
                            <DateInput
                                key={field.name + index}
                                label={field.label}
                                required={field.required}
                                name={field.name}
                                onChangeHandler={handleOnChange}
                                value={formData ? formData[field.name] : ""}
                            />
                        )
                    case "drop-down-list":
                        return (
                            <DropDownListInput
                                key={field.name + index}
                                label={field.label}
                                required={field.required}
                                name={field.name}
                                onChangeHandler={handleOnChange}
                                options={field.options}
                                value={formData ? formData[field.name] : ""}
                            />
                        )

                    default:
                        throw new Error("No matching content type")
                }
            })
        )
    }, [fields, formData])

    function generateFormInputs(fields, existingFormData) {
        setFields(fields)
        let initFormData = existingFormData || {}
        // do the looping only if the object is empty
        if (Object.keys(initFormData).length === 0) {
            fields.forEach(field => {
                initFormData[field.name] = ""
            })
        } else {
            // parse the datetime-local or date string returned from the database so that the appropriate form input can use it since rows of data may have a timestamp like created-at
            initFormData = parseDateTimeInFormData(fields, initFormData)
        }
        setFormData(initFormData)
    }

    return { formInputs, generateFormInputs, formData, setFormData, lastUpdatedInput }
}
