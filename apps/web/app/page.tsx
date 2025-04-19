'use client';
import {useSocket} from "../context/socketProvider";
import { useState } from "react";
export default function Page() {
  const {sendMessage} = useSocket();
  const [message,setMessage] = useState('');
  return (
    <>
    <h1>Chat here</h1>
    <div>
      <input onChange={(e) => {setMessage(e.target.value)}} placeholder="Enter your message" />
      <button onClick={(e) => {sendMessage(message)}}>Send Message</button>
    </div>
    </>
  )
}