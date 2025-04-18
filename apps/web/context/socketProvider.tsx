'use client';

//all the Socket provider contexts should be in client side 
//part of frontend so yeah

import React, { useCallback , useEffect } from "react";
import {io} from "socket.io-client";  //this s for client side 

interface SocketProviderProps {
    children? : React.ReactNode;
}

interface ISocketContext {
    sendMessage: (msg:string) => any;
};

const SocketContext = React.createContext<ISocketContext | null>(null);


export const SocketProvider: React.FC<SocketProviderProps> = ({children}) => {

    const sendMessage : ISocketContext['sendMessage'] = useCallback((msg)=> {
        console.log("sendMessage: ", msg);
    },[]);

    useEffect(() => {
        const _socket = io('http://localhost:8000');
        return () => {
            _socket.disconnect();
        };
    },[]);
    return (
        <SocketContext.Provider value={null}>{children}</SocketContext.Provider>
    );
};

//the above code is typescript equivalent of doig the below in javasccript

// 'use client'; 

// import React, { createContext } from 'react';

// const SocketContext = createContext(null);

// export const SocketProvider = ({ children }) => {
//   return (
//     <SocketContext.Provider value={null}>
//       {children}
//     </SocketContext.Provider>
//   );
// };
