"use client";

import { useEffect, useState } from "react";
import { Persons } from "./types";

export default function Home() {
  type Messages = Message[];
  type Message = {
    user: string;
    text: string;
  };

  const [persons, setPersons] = useState<Persons>({
    personA: {
      name: "織田信長",
      setting:
        "日本の戦国時代の武将の織田信長を演じてください。どんなに非人道的なことをしてでも日本を統一したいと考えています。今は比叡山延暦寺の攻略方法を考えていて、寺院のある山全体を焼き討ちしようと考えています。",
    },
    personB: {
      name: "ソクラテス",
      setting:
        "アテネの哲学者ソクラテスを演じてください。倫理的に間違ったことを言っている人がいれば議論します。",
    },
  });

  const [messages, setMessages] = useState<Messages | undefined>();

  const [loading, setLoading] = useState(false);

  const [limit, setLimit] = useState(5)

  const [apiKey, setApiKey] = useState("")

  const handleSubmit = async (user: string) => {
    setLoading(true);
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/ai-${user}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        persons,
        messages,
        apiKey
      }),
    });

    const result = await res.json();
    if (messages) {
      const newMessages = [...messages, result as Message];
      console.log(newMessages, "new");
      setMessages(newMessages);
    } else {
      setMessages([result]);
    }
    setLoading(false);
  };

  useEffect(() => {
    console.log("message 切り替わり");
    if (!messages || messages.length > limit) return;

    console.log(messages);
    const user =
      messages[messages.length - 1].user == persons.personA.name ? "b" : "a";
    setTimeout(() => handleSubmit(user), 10000);
  }, [messages]);

  return (
    <>
      <div className="flex-1 p:2 sm:p-6">
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          OpenAI APIKey
        </label>
        <input
          onChange={(e) => {
            setApiKey(e.target.value);
          }}
          value={apiKey}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-2"
          required
          placeholder="your APIKEY"
        ></input>
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          登場人物A
        </label>
        <input
          onChange={(e) => {
            setPersons((prevState) => ({
              ...prevState,
              personA: { ...prevState.personA, name: e.target.value },
            }));
          }}
          value={persons.personA.name}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-2"
          required
          placeholder="名前"
        ></input>
        <textarea
          onChange={(e) => {
            setPersons((prevState) => ({
              ...prevState,
              personA: { ...prevState.personA, setting: e.target.value },
            }));
          }}
          value={persons.personA.setting}
          id="message"
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-2"
          placeholder="設定"
        ></textarea>
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          登場人物B
        </label>
        <input
          onChange={(e) => {
            setPersons((prevState) => ({
              ...prevState,
              personB: { ...prevState.personB, name: e.target.value },
            }));
          }}
          value={persons.personB.name}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-2"
          required
          placeholder="名前"
        ></input>
        <textarea
          onChange={(e) => {
            setPersons((prevState) => ({
              ...prevState,
              personB: { ...prevState.personB, setting: e.target.value },
            }));
          }}
          value={persons.personB.setting}
          id="message"
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-2"
          placeholder="設定"
        ></textarea>
        {!loading ? (
          <button
            onClick={() => {
              setMessages(undefined)
              setLimit(5)
              handleSubmit("a")
            }}
            disabled={loading}
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            会話スタート
          </button>
        ) : (
          <button
            disabled={loading}
            type="button"
            className="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
          >
            会話生成中
          </button>
        )}
        {(messages && messages.length > limit) && <button
          onClick={() => {
            setLimit(limit + 5)
            handleSubmit("a")
          }}
          disabled={loading}
          type="button"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          会話を続ける
        </button>
        }
      </div>
      <div className="flex-1 p:2 sm:p-6 justify-between flex flex-col ">
        <div
          id="messages"
          className="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
        >
          {messages?.map((message) => {
            if (message.user == persons.personA.name) {
              return (
                <div className="chat-message" key={message.text}>
                  <div className="flex items-end">
                    <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
                      <div>
                        <span className="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600">
                          {message.text}
                        </span>
                      </div>
                    </div>
                    <img
                      src="https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144"
                      alt="My profile"
                      className="w-6 h-6 rounded-full order-1"
                    />
                  </div>
                </div>
              );
            } else if (message.user == persons.personB.name) {
              return (
                <div className="chat-message" key={message.text}>
                  <div className="flex items-end justify-end">
                    <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end">
                      <div>
                        <span className="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white ">
                          {message.text}
                        </span>
                      </div>
                    </div>
                    <img
                      src="https://images.unsplash.com/photo-1590031905470-a1a1feacbb0b?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144"
                      alt="My profile"
                      className="w-6 h-6 rounded-full order-2"
                    />
                  </div>
                </div>
              );
            }
          })}
        </div>
      </div>
    </>
  );
}
