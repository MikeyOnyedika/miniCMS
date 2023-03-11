import BaseStyles from '../styles.module.css'

export const DateInput = ({
    label,
    required,
    name,
    onChangeHandler,
    value
}) => {
    return (
        <div className={`${BaseStyles.FormGroup} ${BaseStyles.FormGroup___text}`}>
            <label htmlFor={name}>{`${label}${required ? '*' : ''}`}</label>
            <input
                type="date"
                name={name}
                id={name}
                onChange={onChangeHandler}
                value={value.split(" ")[0]}
            />
        </div>
    )
}
