import { useEffect, useState } from 'react';

const PREFIX = 'admin-dashboard-app-';
export const useSessionStorage = (key, initialValue = null) => {
  const prefixedKey = PREFIX + key;
  const [value, setValue] = useState(() => {
    // try to get the value from sessionStorage
    let jsonValue = null;
    jsonValue = sessionStorage.getItem(prefixedKey);

    // return it if there's actual data stored with that key
    if (jsonValue !== null) {
      return JSON.parse(jsonValue);
    }
    // if jsonValue does not exist, it means this is the first time we are trying to store this particular value. So, we can use the initial Value provided
    if (typeof initialValue === 'function') {
      return initialValue();
    } else {
      return initialValue;
    }
  });

  useEffect(() => {
    // anytime the value or key changes, update the value in localstorage
    let _value = '';
    if (value === null || value === undefined || value === '') {
      _value = '';
    } else {
      _value = value;
    } 

    sessionStorage.setItem(prefixedKey, JSON.stringify(_value));
  }, [prefixedKey, value]);

  return [value, setValue];
};
