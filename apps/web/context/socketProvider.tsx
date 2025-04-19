'use client';

//all the Socket provider contexts should be in client side 
//part of frontend so yeah

import React, { useCallback , useContext, useEffect } from "react";
import {io} from "socket.io-client";  //this s for client side 


//initial understanding is this but not fully correct/ didn't understand all v1
// thsi v1 has no relation to commit version if it comes in future


//interface for SocketProvider component props
//interface for IsocketContext : which are a function sendmessage and messages an array of strings
// SocketContext : a context of type ISocketContext or null
//exports useSocket which uses the socketContext 
//exports SocketProvider component with SockerProviderProps as the props 
// what do they do with the children? that is tpart of the component inside, but wehre do we 
//define that this children goes to the inside
// why do you write children in export if it is already there in interface definition why
// why is const sendmessage inside the export statement of  socketprovider ? it should be separate right
//why is useEffect also inside?
//we should define this before and send it in export right
interface SocketProviderProps {
    children? : React.ReactNode;
}

interface ISocketContext {
    sendMessage: (msg:string) => any;
    messages:string[];
};

const SocketContext = React.createContext<ISocketContext | null>(null);

export const useSocket = () => {
    const state = useContext(SocketContext);
    if(!state) throw new Error("state is undefined");
    return state;
}

//i understood more now v2
//basically exporting socketprovider which is a react component which is also a function(not sure abt this line tho), which returns a sendMessage , useEffect and some tsx react code

//thsi is of the form (all of these does the same thing)
//expost const something : type = ({props}) = > { code }
//expost const something : type = ({props}) : type_of_return  { code }
//read this below code as
// <export> <const> <var> : <type> = <function(props)> => { code }
// export a constant called socketprovider : ---it is of type React Component <with generic type Socket Provider props> --- and the function takes children as props and returns this code
//here tyhpe of children is already defined from interface 
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
        <SocketContext.Provider value={{sendMessage}}>{children}</SocketContext.Provider>
    );
};
