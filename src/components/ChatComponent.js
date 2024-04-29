import React, { useEffect, useState, useRef } from "react";
import Message from "./Message";
import SendMessage from "./SendMessage";
import Logo from "../img/logo.png";
import { db } from "../firebase";
import Modal from "./Modal";
import {
  query,
  collection,
  orderBy,
  onSnapshot,
  limit,
} from "firebase/firestore";

const ChatComponent = ({ experiment, clientID }) => {
  const [messages, setMessages] = useState([]);
  const [isSurvey, setIsSurvey] = useState(true);
  const scroll = useRef();

  useEffect(() => {
    // check if answered first survey

    // check if enswered second survey

    const q = query(
      collection(db, experiment.exp_id),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      const fetchedMessages = [];
      QuerySnapshot.forEach((doc) => {
        fetchedMessages.push({ ...doc.data(), id: doc.id });
      });
      const sortedMessages = fetchedMessages.sort(
        (a, b) => a.createdAt - b.createdAt
      );
      setMessages(sortedMessages);
    });
    return () => unsubscribe;
  }, [experiment]);

  return (
    <>
      <div className="w-full flex items-center justify-between p-5 bg-slate-300 fixed">
        {experiment && (
          <div className="flex flex-col gap-1">
            <h1 className="text-4xl text-black mx-2">
              {experiment.exp_subject}
            </h1>
          </div>
        )}
        <img src={Logo} alt="logo" className="w-20 h-20 mr-5" />
      </div>
      <div className="bg-gray-400 h-screen">
        <main>
          <div className="px-5 bg-gray-400 pb-20 pt-36">
            {messages?.map((message) => (
              <Message key={message.id} message={message} />
            ))}
          </div>
          {/* when a new message enters the chat, the screen scrolls down to the scroll div */}
          <span ref={scroll}></span>
          <SendMessage scroll={scroll} id={experiment.exp_id} />
        </main>
      </div>
      {experiment && isSurvey && (
        <Modal
          text={"Before we start,"}
          experiment={experiment}
          clientID={clientID}
          setSurvey={setIsSurvey}
        />
      )}
    </>
  );
};

export default ChatComponent;