import BaseStyles from '../styles.module.css'

export const DropDownListInput = ({
    label,
    required,
    name,
    onChangeHandler,
    options,
    value,
}) => {
    return (
        <div className={`${BaseStyles.FormGroup} ${BaseStyles.FormGroup___text}`}>
            <label htmlFor={name}>{`${label}${required ? '*' : ''}`}</label>
            <select name={name} id={name} onChange={onChangeHandler} defaultValue={value}>
                {
                    // first check if options is an array, if so, show those options. if not, check if it's null (null is used to show that it's still loading)
                    options instanceof Array ? (
                        options.map((option, index) => (
                            <option value={option.value} key={index} > {option.label} </option>
                        ))
                    ) : (
                        options === null ? (
                            <div className={BaseStyles.Loading}>
                                Loading...
                            </div>
                        ) : (
                            new Error("Options can only be a string or an array of objects")
                        )
                    )
                }
            </select>
        </div>
    )
}
