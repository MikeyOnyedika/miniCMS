import BaseStyles from '../styles.module.css'

export const DropDownListInput = ({
    label,
    required,
    name,
    onChangeHandler,
    options,
    value,
}
) => {
    return (
        <div className={`${BaseStyles.FormGroup} ${BaseStyles.FormGroup___text}`}>
            <label htmlFor={name}>{`${label}${required ? '*' : ''}`}</label>
            <select name={name} id={name} onChange={onChangeHandler} defaultValue={value}>
                {options.map((option, index) => <option value={option.value} key={index} > {option.label} </option>)}
            </select>
        </div>
    )
}
