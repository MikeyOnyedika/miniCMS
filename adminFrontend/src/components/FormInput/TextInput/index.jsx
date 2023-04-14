import BaseStyles from '../styles.module.css'
import { useEffect } from 'react'

export const TextInput = ({
    label,
    inputType,
    required,
    placeholder,
    name,
    onChangeHandler,
    value,
    hidden
}) => {

    useEffect(() => {
        console.log("name: ", name)
        console.log("value: ", value)
        console.log("label: ", label)
    }, [])

    return (
        <div className={`${BaseStyles.FormGroup} ${BaseStyles.FormGroup___text} ${hidden === true ? 'hidden' : ''}`}>
            <label htmlFor={name}>{`${label}${required ? '*' : ''}`}</label>
            <input
                type={inputType}
                name={name}
                id={name}
                placeholder={`e.g ${placeholder}`}
                onChange={onChangeHandler}
                value={value}
            />
        </div>
    )
}
