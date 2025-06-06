import { useCallback, useEffect, useRef, useState } from 'react'

export const useStateWithCallback = (initialState) => {
   const [state, setState] = useState(initialState);
   const cbref = useRef();

   const updateState = useCallback((newState, cb) => {
      cbref.current = cb;
      setState((prev) => {
         return typeof(newState) === 'function' ? newState(prev) : newState;
      });
   }, [setState]);

   useEffect(() => {
      if (cbref.current) {
         cbref.current();
         cbref.current = null;
      }
   }, [state]);

   return [state, updateState];
}
