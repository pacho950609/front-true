import React, { useState, useEffect, useMemo } from 'react'
import axios from 'axios';
import { useLocalStorage } from '../hooks/userLocalStorage';
import { useRouter } from 'next/router';

export const API_URL = 'https://ag9bmjsay3.execute-api.us-east-1.amazonaws.com/prod';

export interface User {
    email: string;
    token: string;
}

export const UserContext = React.
    createContext<{
        user: User,
        logIn: (email: string, password:string) => void,
        signUp: (email: string, password:string) => void,
        logOut: () => void 
    }>({ user: null, logIn: null, logOut: null, signUp: null});

export const UserProvider = (props) => {
    const [user, setUser] = useState<User>(null);
    const { setItem, getItem, removeItem } = useLocalStorage();
    const router = useRouter();

    useEffect(() => {
        const user =  getItem('user');
        if (user) {
            setUser(JSON.parse(user));
        } else {
            setUser({
                token: null,
                email: null,
            });
        }
    }, []);

    const logIn = async (email:string, password:string) => {
        const response = await axios.post<{token:string}>(`${API_URL}/login`, {
            email,
            password
        })
        const {token} = response.data;
        const user: User = {
            email,
            token,
        }
        setUser(user)
        setItem('user', JSON.stringify(user));
        router.push(
            {
              pathname: '/',
            },
            undefined,
            { shallow: true },
        );
    }

    const signUp = async (email:string, password:string) => {
        const response = await axios.post<{token:string}>(`${API_URL}/signup`, {
            email,
            password
        })
        const { token } = response.data;
        const user: User = {
            email,
            token,
        }
        setUser(user)
        setItem('user', JSON.stringify(user));
        router.push(
            {
              pathname: '/',
            },
            undefined,
            { shallow: true },
        );
    }

    const logOut = async () => {
        setUser({
            token: null,
            email: null,
        })
        removeItem('user');
        router.push(
            {
              pathname: '/logIn',
            },
            undefined,
            { shallow: true },
        );
    }

    const value = useMemo(() => {
        return {
            user,
            logIn,
            logOut,
            signUp,
        }
    }, [user]);

    return <UserContext.Provider value={value} {...props} />
}