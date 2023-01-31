import { ClipLoader } from 'react-spinners'

const Loading = ({ size }) => {
    return (
        <div>
            <ClipLoader
                color={'var(--secondary-clr)'}
                loading={true}
                cssOverride={{ backgroundColor: 'white' }}
                size={size || 50}

            />
        </div>
    )
}

export default Loading