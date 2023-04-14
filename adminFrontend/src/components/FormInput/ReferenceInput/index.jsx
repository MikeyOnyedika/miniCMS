import BaseStyles from '../styles.module.css';
import Styles from './styles.module.css'
import { useEffect, useState } from 'react'
import { useCollectionsContents } from '../../../hooks/useCollectionsContents';
import { USER_COLLECTION_URL_BASE } from '../../../utils/baseURL';
import { useUserContentContext } from '../../../contexts/UserContentProvider';

export const ReferenceInput = ({ name, label, required, placeholder, of, value, onChangeHandler }) => {
    const [search, setSearch] = useState("")
    const [focused, setFocused] = useState(false)
    const [selectedItem, setSelectedItem] = useState(null)
    const [timeoutId, setTimeoutId] = useState(null)

    const { addStatusMessage } = useUserContentContext()
    // Notice how colContents is gotten directly from useCollectionsContents() instead of the usual 
    // useUserContentContext() which exposes a useCollectionsContents() but is in the global context? We need colContents whose scope 
    // is in the context of this component as opposed a global colContents. This is because if colContents is modified here using the 
    // getCollectionContents() from the global context, it will change the value of colContents that is used by CollectionItems 
    // component and that's bad!!
    const { getCollectionContents, colContents, getColConStatus } = useCollectionsContents(USER_COLLECTION_URL_BASE, addStatusMessage)


    // set initial value of <input> using the already existing value
    useEffect(() => {
        if (value?._id !== "") {
            setSelectedItem(value)
        }
    }, [value])


    useEffect(() => {
        // get the items of that collection
        getCollectionContents(of)
    }, [of])

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (search !== "") {
                // perform search
            }
        }, 250)

        return () => {
            clearTimeout(timeout)
        }
    }, [search])


    // TODO: MAKE SURE TO CHANGE THE SOURCE OF PRIMARYfIELD so that it comes from THE TEMPLATE OF A COLLECTION
    const primaryField = "name"

    function handleItemSelect(name, item) {
        setSelectedItem(item)
        onChangeHandler(name, item._id)
    }

    function handleEdit() {
        setSelectedItem(null)
        setFocused(true)
    }

    function handleInputChange(e) {
        selectedItem === null ? (
            setSearch(e.target.value)
        ) : (
            onChangeHandler(e, selectedItem._id)
        )
    }

    function closeSearchResults() {
        setFocused(false)
    }

    function handleOpenResults() {
        if (timeoutId !== null) {
            clearTimeout(timeoutId)
        } else {
            setFocused(true)
        }
    }

    // close the Results (ul) on next tick by using setTimeout. This is necessary because we need to first check if a  ResultItem (a li) has received focus as blur event fires before the new focus event
    function handleCloseResults(e) {
        setTimeoutId(
            setTimeout(closeSearchResults)
        )
    }

    function handleSelectUsingKeyboard(e, item) {
        const keyCode = e.keyCode
        // 13 == the enter key
        if (keyCode === 13) {
            handleItemSelect(e, item)
        }
    }


    return (
        <div className={`${BaseStyles.FormGroup} `}>
            <div
                className={`${BaseStyles.FormGroup} ${BaseStyles.FormGroup___text} ${Styles.Wrapper}`}
                onFocus={() => setFocused(true)}
                onBlur={(e) => handleCloseResults(e)}
            >
                <label htmlFor={name}>{`${label}${required ? '*' : ''}`}</label>
                <div className={Styles.SearchInputContainer}>
                    <div className={Styles.SearchControls} tabIndex={0}>
                        <input id={name}
                            className={Styles.SearchInput}
                            name={name}
                            type="text"
                            value={selectedItem !== null ? (
                                selectedItem[primaryField]
                            ) : (
                                search
                            )}
                            onChange={(e) => handleInputChange(e)}
                            placeholder={placeholder}
                            autoComplete="off"
                            readOnly={selectedItem === null ? false : true}
                            onFocus={() => handleOpenResults()}
                        />
                    </div>
                    <button onClick={() => handleEdit()} type="button" className={Styles.EditBtn} tabIndex={0}>
                        Edit
                    </button>
                </div>
                {
                    (focused && selectedItem == null) && (
                        <ul className={Styles.Results} tabIndex={0} onFocus={() => handleOpenResults()}>
                            {
                                getColConStatus.isLoading === true ? (
                                    <p>Loading...</p>
                                ) : (
                                    getColConStatus.isError === false ? (

                                        colContents.map((item) => (
                                            <li className={Styles.ResultItem} key={item._id}
                                                onClick={(e) => handleItemSelect(name, item)}
                                                onKeyDown={(e) => handleSelectUsingKeyboard(e, item)}
                                                onFocus={() => handleOpenResults()}
                                                tabIndex={0}
                                            >
                                                <p className={Styles.PrimaryValue}>{item[primaryField]}</p>
                                                <p className={Styles.ItemId}>{item._id}</p>
                                            </li>
                                        ))
                                    ) : (
                                        <p>Error!!!</p>
                                    )
                                )
                            }
                        </ul>
                    )
                }
            </div>
        </div>
    );
};
