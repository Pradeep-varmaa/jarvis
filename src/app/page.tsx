'use client'
import React, { useEffect, useRef, useState } from 'react'
import style from './page.module.css'
import { AudioOutlined } from '@ant-design/icons'
import { FaTelegramPlane } from "react-icons/fa";

const Homepage = () => {

  const [command, setCommand] = useState('')
  const [messages, setMessages] = useState([
    { sender: "jarvis", text: "Hello! I'm Jarvis 👋" }
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getResponse = async (userCommand?: string) => {
    const cmd = userCommand || command;
    setCommand('')
    setMessages(prev => [...prev, { sender: "user", text: cmd }]);
    const req = await fetch('http://127.0.0.1:5000/jarvis', {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({ command: command })
    })
    const res = await req.json()
    setCommand('')
    setMessages(prev => [...prev, { sender: "jarvis", text: res.response }]);
    console.log("res : ", res.response)
  }

  const handlecommand = async (e: React.FormEvent) => {
    e.preventDefault()
    await getResponse()

  }

  const listen = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.log("Browser not supported")
      return
    }
    // console.log("Listening.....")

    const recognition = new SpeechRecognition();

    recognition.start()
    recognition.onresult = (event: any) => {
      console.log(event)
      const text = event.results[0][0].transcript
      // setCommand(text)
      getResponse(text)
    }
  };

  return (
    <div className={style.container}>
      <div className={style.mic_sym} onClick={listen}>
        <AudioOutlined />
      </div>
      <div className={style.chatContainer}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={
              msg.sender === "user"
                ? style.userMessage
                : style.botMessage
            }
          >
            {msg.text}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <div>
        <form action="" onSubmit={handlecommand} className={style.form}>
          <input className={style.input} type="text" name='command' id='command' placeholder='Ask Jarvis' value={command} onChange={(e) => { setCommand(e.target.value) }} />
          <button type='submit' className={style.button}><FaTelegramPlane size={24} color="#ffffff" /> Send</button>
        </form>
      </div>
    </div>
  )
}

export default Homepage
