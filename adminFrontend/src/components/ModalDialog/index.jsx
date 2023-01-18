import Styles from './styles.module.css'
import { useRef,  useState } from 'react'
const ModalDialog = ({ title, btnGroup, mainContent, hide }) => {
    const modalRef = useRef();
    const [fadeId, setFadeId] = useState("")


    const fade = () => {
        if (modalRef.current !== null) {

            if (parseFloat(modalRef.current.style.opacity) < 0) {
                clearInterval(fadeId)
                if (hide != null) {
                    hide();
                }
                return;
            }
            modalRef.current.style.opacity -= 0.05;
        }
    }

    function disappearModal() {
        if (fadeId !== "") {

            clearInterval(fadeId)
        } else {

            modalRef.current.style.opacity = "1"
            setFadeId(setInterval(fade, 5))
        }
    }

    function onProceed() {
        disappearModal()
        btnGroup.proceedBtnOnClick();
    }

    function onCancel() {
        disappearModal();
        btnGroup.cancelBtnOnClick();
    }

    return (
        <>
            <div className={Styles.Modal_Wrapper} >
                <div className={Styles.Modal__Background} ></div>
                <div className={Styles.Modal} ref={modalRef}>
                    <section className={Styles.Modal__Head}>
                        <p className={Styles.Modal__Title}>{title}</p>
                    </section>
                    <section className={Styles.Modal__Body}>
                        <div className={Styles.Modal__MainContent}>
                            {mainContent}
                        </div>
                    </section>
                    <section className={Styles.Modal__BtnGroup}>
                        <button onClick={onProceed}>{btnGroup.proceedBtnText}</button>
                        <button onClick={onCancel}>{btnGroup.cancelBtnText}</button>
                    </section>
                </div>
            </div>
        </>
    )
}

export default ModalDialog