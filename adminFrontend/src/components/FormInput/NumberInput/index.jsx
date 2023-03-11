import BaseStyles from '../styles.module.css'

export const NumberInput = ({
    label,
    required,
    name,
    placeholder,
    onChangeHandler,
    value
}
) => {
    return (
        <div className={`${BaseStyles.FormGroup} ${BaseStyles.FormGroup___text}`}>
            <label htmlFor={name}>{`${label}${required ? '*' : ''}`}</label>
            <input
                type="number"
                name={name}
                id={name}
                onChange={onChangeHandler}
                value={value}
                placeholder={placeholder}
            />
        </div>
    )
}
