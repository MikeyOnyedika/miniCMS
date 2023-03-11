import BaseStyles from '../styles.module.css'

export const TextInput = ({
    label,
    inputType,
    required,
    placeholder,
    name,
    onChangeHandler,
    value
}) => {
    return (
        <div className={`${BaseStyles.FormGroup} ${BaseStyles.FormGroup___text}`}>
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
