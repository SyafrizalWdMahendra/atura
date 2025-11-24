import React from "react";
import { MessageProps } from "../types";

export const Message: React.FC<MessageProps> = ({
  text,
  sender,
  timestamp,
}) => {
  const isUser = sender === "user";
  const messageClasses = isUser
    ? "bg-blue-500 text-white w-max text-right rounded-br-none ml-auto"
    : "bg-gray-200 text-gray-800 w-3/4 rounded-bl-none mr-auto";

  return (
    <div className="w-full flex">
      <div
        className={`flex flex-col p-2 rounded-xl shadow-sm border ${messageClasses}`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{text}</p>
        <span
          className={`text-xs mt-1 ${
            isUser ? "text-blue-200" : "text-gray-500"
          } self-end`}
        >
          {timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
};
