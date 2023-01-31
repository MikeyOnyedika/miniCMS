import { Link } from "react-router-dom"
import { FaArrowLeft } from "react-icons/fa"
import { IconContext } from 'react-icons'
import Styles from './styles.module.css'

export function BackButton({ to }) {
    return (
        <div className={Styles.Wrapper}>
            <Link to={to}>
                <IconContext.Provider value={{ color: 'var(--accent-clr)', className: Styles.Arrow }} >
                    <FaArrowLeft/>
                </IconContext.Provider>
            </Link>
        </div>
    )
}