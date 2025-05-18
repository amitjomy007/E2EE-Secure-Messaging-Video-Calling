'use client';
import {useSocket} from "../context/socketProvider";
import { useState } from "react";
export default function Page() {
  const {sendMessage,messages} = useSocket();
  const [message,setMessage] = useState('');
  return (
    <>
    <h1>Chat here</h1>
    <div>
      <input onChange={(e) => {setMessage(e.target.value)}} placeholder="Enter your message" />
      <button onClick={() => {sendMessage(message)}}>Send Message</button>
    </div>
    <div>
      { messages.map((message,index) => (<h5 key={index}>msg: {message}</h5>) )}
    </div>
    </>
  )
}
