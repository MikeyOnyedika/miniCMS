import React, { useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import PageNotFound from '../pages/PageNotFound'

function ConditionalRoute({ renderIf, children, go }) {
  const navigate = useNavigate();

  
  useEffect(() => {
    if (go !== undefined) {

      if (go.if === true) {
        navigate({ pathname: go.to })
      }
    }

  })

  if (renderIf !== true) {
    return <PageNotFound />
  }
  return children
}

export default ConditionalRoute