import { useEffect } from 'react';
import { useAuthContext } from '../contexts/AuthProvider';
import { useState } from 'react';

export const TOKEN_STATE = {
  INVALID: 'invalid',
  VALID: 'valid',
  NOT_SET_YET: 'notSetYet'
}

export function useCheckToken() {
  const [isCheckingToken, setIsCheckingToken] = useState(true);
  const { getAdminInfo } = useAuthContext();
  const [isTokenValid, setIsTokenValid] = useState(TOKEN_STATE.NOT_SET_YET);

  async function checkToken() {
    setIsTokenValid(TOKEN_STATE.NOT_SET_YET)
    setIsCheckingToken(true);
    const response = await getAdminInfo();

    if (response.success === true) {
      setIsTokenValid(TOKEN_STATE.VALID);
    } else {
      setIsTokenValid(TOKEN_STATE.INVALID);
    }
    setIsCheckingToken(false);
  }

  useEffect(() => {
    checkToken();
  }, []);

  return {
    isTokenValid,
    isCheckingToken,
    retryCheckToken: checkToken,
  };
}
