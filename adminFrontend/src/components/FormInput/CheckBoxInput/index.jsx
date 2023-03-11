import BaseStyles from '../styles.module.css'

export const CheckBoxInput = ({
    label,
    required,
    name,
    onChangeHandler,
    value
}) => {
    return (
        <div className={`${BaseStyles.FormGroup} ${BaseStyles.FormGroup___row}`}>
            <label htmlFor={name}>{`${label}${required ? '*' : ''}`}</label>
            <input
                type="checkbox"
                name={name}
                id={name}
                onChange={onChangeHandler}
                checked={value}
            />
        </div>
    )
}
