import { RotateLoader } from 'react-spinners'

const Loading = () => {
    return (
        <div>
            <RotateLoader
                color={'var(--secondary-clr)'}
                loading={true}
                cssOverride={{ backgroundColor: 'white' }}
            />
        </div>
    )
}

export default Loading