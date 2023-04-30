import React from 'react'
import { UserContext } from '../context/userContext';

export const useUser = () => {
    const context = React.useContext(UserContext);
    if(!context) {
        throw new Error('Component doesnt have access to useUser')
    }
    return context;
}