import { useEffect, useState } from 'react';
import {useDispatch} from 'react-redux';
import {setAuth} from '../store/authSlice';
import axios from 'axios';

export const useLoadingWithRefresh = () => {
   const [loading, setLoading] = useState(true);
   const dispatch = useDispatch();

   useEffect(() => {
      const fun = async () => {
         try {
            const {data} = await axios.get(`${process.env.REACT_APP_API_URL}/api/refresh`, {withCredentials: true});
            dispatch(setAuth(data.user));
            setLoading(false);
         } catch (error) {
            console.log(error);
            setLoading(false);
         }
      };
      fun();
   }, [dispatch]);

  return ( loading );
}
