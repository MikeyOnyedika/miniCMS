import React from 'react'
import {RingLoader} from 'react-spinners'

const LoadingScreen = () => {
    return (

        <div
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '1rem',
            }}
        >
            <p
                style={{
                    color: 'var(--secondary-clr-dark)',
                    fontSize: '2rem',
                }}
            >
                Please Wait...
            </p>
            <RingLoader
                color={'var(--secondary-clr)'}
                loading={true}
                cssOverride={{ backgroundColor: 'white' }}
            />
        </div>
    )

}

export default LoadingScreen