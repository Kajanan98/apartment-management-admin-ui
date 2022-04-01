import React, { createContext, useContext, useEffect, useState } from 'react'

const loading = (
    'loading...'
)

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem('token'))
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'))
    const [loginStatus, setLoginStatus] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        localStorage.setItem('user', JSON.stringify(user));
    }, [user]);

    useEffect(() => {
        localStorage.setItem('token', token || '');
        if (token) {
            setIsLoading(true);
            setLoginStatus(true)
            setIsLoading(false);
        } else {
            setIsLoading(true);
            setLoginStatus(false)
            setIsLoading(false);
        }
    }, [token]);

    function customFetch(url, { method = 'GET', headers = {}, ...rest } = {}) {
        return fetch(process.env.REACT_APP_API_HOST + url, {
            method,
            headers: { "Authorization": "Bearer " + token, ...headers, },
            ...rest
        })
            .then(res => {
                if (res.status !== 200 && res.status !== 304) {
                    throw Error('could not fetch data')
                }
                return res.json()
            })
    }

    function login(email, password) {
        return fetch(process.env.REACT_APP_API_HOST + `/employee/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })
            .then(response => {
                if (response.status === 401) {
                    throw Error("Invalid credientials")
                } else {
                    return response.json()
                }
            })
            .then(data => {
                // if (data.status) {
                setIsLoading(true)
                setUser(data.user)
                setToken(data.accessToken)
                console.log('Token set')
                // }
                return data;
            });
    }

    function logout() {
        setUser(null);
        setToken(null)
        return true;
    }

    const value = {
        user,
        login,
        logout,
        customFetch,
        loginStatus,
    }

    return (
        <AuthContext.Provider value={value} >
            {isLoading ? loading : children}
        </AuthContext.Provider>
    )
}