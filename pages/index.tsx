import Head from 'next/head';
import { FormEvent, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

interface messageInterface {
  message: string;
}

export default function Home() {
  const [message, setMessage] = useState('');
  const [socket, setSocket] = useState() as any;
  const [username, setUsername] = useState('');
  const [messageList, setMessageList] = useState<messageInterface[]>([]);
  
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    socket.emit('send-chat-message', message);
    appendMessage('Vose: '+message);
    setMessage('');
  }

  function appendMessage(message: string) {
    setMessageList(arr => ([...arr, {message}]));
  }

  useEffect(() => {
    fetch('/api/socketio').finally(() => {
      let tempSocket = io();
      setSocket(tempSocket);

      let socket = tempSocket;
      socket.on('chat-message', (data) => {
        appendMessage(`${data.name}: ${data.message}`);
      });

      socket.on('user-connected', (name: string) => {
        appendMessage(`${name} entrou`);
      });

      const name = prompt('Qual seu nome?');
      socket.emit('new-user', name);
      setUsername(name);
      appendMessage('Você entrou no bate-papo uol')
    })
  }, []);

  return (
    <div id="message-container">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div id="message-container">
        {messageList.map((item, index) => {
          return <div key={index}>{item.message}</div>
        })}
      </div>
      <form id="send-container" onSubmit={handleSubmit}>
        <input type="text" id="message-input"value={message} onChange={e => {setMessage(e.target.value)}} />
        <button type="submit" id="send-button">Send</button>
      </form>

      <style jsx>{`
        body {
          padding: 0;
          margin: 0;
          display: flex;
          justify-content: center;
        }

        #message-container {
          width: 80%;
          max-width: 1200px;
        }

        #message-container div {
          background - color: #CCC;
          padding: 5px;
        }

        #message-container div:nth-child(2n) {
          background - color: #FFF;
        }

        #send-container {
          position: fixed;
          padding-bottom: 30px;
          bottom: 0;
          background-color: white;
          max-width: 1200px;
          width: 80%;
          display: flex;
        }

        #message-input {
          flex - grow: 1;
        }
      `}</style>
    </div>
  )
}
