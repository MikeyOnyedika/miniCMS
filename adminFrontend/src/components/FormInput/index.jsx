import Styles from './styles.module.css';

export function FormInput({
    labelName,
    inputType,
    required,
    placeholder,
    fieldName,
    options,
}) {
    switch (inputType) {
        case 'text':
        case 'email':
        case 'password':
        case 'url':
        case 'number':
        case 'tel':
            return (
                <div className={`${Styles.FormGroup} ${Styles.FormGroup___text}`}>
                    <label htmlFor={fieldName}>{`${labelName}${required ? '*' : ''}`}</label>
                    <input
                        type={inputType}
                        name={fieldName}
                        id={fieldName}
                        placeholder={`e.g ${placeholder}`}
                    />
                </div>
            );
        case 'textarea':
            return (
                <div className={Styles.FormGroup}>
                    <label htmlFor={fieldName}>{`${labelName}${required ? '*' : ''}`}</label>
                    <textarea
                        id={fieldName}
                        name={fieldName}
                        placeholder={`e.g ${placeholder}`}
                    ></textarea>
                </div>
            );
        case 'select':
            return (
                <div className={Styles.FormGroup}>
                    <label htmlFor={labelName}>{`${labelName}${required ? '*' : ''}`}</label>
                    <select id={labelName} name={fieldName} required={required}>
                        {options.map((option) => (
                            <option key={option.id} value={option.value}>
                                {option.text}
                            </option>
                        ))}
                    </select>
                </div>
            );
        case 'checkbox':
            return (
                <div className={`${Styles.FormGroup} ${Styles.FormGroup___row} `}>
                    <label htmlFor={fieldName}>{`${labelName}${required ? '*' : ''}`}</label>
                    <input type={inputType} name={fieldName} id={fieldName} checked={placeholder === "on" ? true : false}
                    // value={placeholder === "on" ? true : false} 
                    />
                </div>
            );
        case 'date':
        case 'datetime-local':
            return (
                <div className={`${Styles.FormGroup} ${Styles.FormGroup___row} `}>
                    <label htmlFor={fieldName}>{`${labelName}${required ? '*' : ''}`}</label>
                    <input type={inputType} name={fieldName} id={fieldName} />
                </div>
            );
        case 'radio':
            return (
                <div className={`${Styles.FormGroup} ${Styles.FormGroup___radioGroup}`}>
                    <label>{`${labelName}${required ? '*' : ''}`}</label>
                    {options.map((option) => {
                        const inputId = fieldName + option.id;
                        return (
                            <div key={option.id}>
                                <label htmlFor={`${inputId}`}>{option.text}</label>
                                <input
                                    defaultChecked={option.checked}
                                    type={inputType}
                                    value={option.value}
                                    name={fieldName}
                                    id={`${inputId}`}
                                />
                            </div>
                        );
                    })}
                </div>
            );
        default:
            throw new Error('no matching input type');
    }
}
