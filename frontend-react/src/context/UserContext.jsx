

import React, { createContext, useState, useEffect } from 'react';


const UserContext = createContext();


// export const useUser = () => useContext(UserContext);


export const UserProvider = ({ children }) => {
    
    const [user, setUser] = useState(null);


    // Load user data from loacal storage in refresh page case and set it in user context
    useEffect(() => {

        const savedUser = localStorage.getItem('user');

        if (savedUser) {

            const parsedUser = JSON.parse(savedUser); 

            setUser(parsedUser);
            // console.log('Loaded user from localStorage:', parsedUser);
        }
    }, [setUser]);
    
    // Update userContext when localStorage change
    useEffect(() => {
        if (user) {
            if (0 < Object.keys(user).length) {
                localStorage.setItem('user', JSON.stringify(user));
            }
        }
    }, [user]);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};


export default UserProvider
export {UserContext};