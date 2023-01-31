import { FormInput } from '../components/FormInput';
import { useState } from 'react';

export function useCreateFormInputsFromTemplate() {
    const [formInputs, setFormInputs] = useState(null);

    function generateFormInputs(template) {
        const fieldNames = Object.keys(template);

        setFormInputs(
            fieldNames.map((fieldName) => {
                // looks like this { formInputType: "url", required: true, unique: false }
                const fieldValueObj = template[fieldName];
                console.log("fieldValueObj: ", fieldValueObj)

                return (
                    <FormInput
                        key={fieldName}
                        labelName={fieldValueObj.label}
                        inputType={fieldValueObj.formInputType}
                        required={fieldValueObj.required}
                        placeholder={fieldValueObj.exampleValue}
                        options={fieldValueObj.options}
                        fieldName={fieldName}
                    />
                );
            })
        )
    }

    return [formInputs, generateFormInputs];
}
