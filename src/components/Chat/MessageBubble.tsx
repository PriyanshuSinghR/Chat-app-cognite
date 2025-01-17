import { Message } from "@/types/chat";

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwnMessage,
}) => {
  const formatTimestamp = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} mb-4`}
    >
      <div
        className={`
          max-w-[70%] p-4 rounded-2xl
          ${
            isOwnMessage
              ? "bg-blue-600 text-white"
              : "bg-gray-800 text-gray-100"
          }
        `}
      >
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">{message.sender}</span>
        </div>
        <p className="mt-1 text-sm leading-relaxed">{message.message}</p>
        <p className="mt-2 text-xs opacity-70">
          {formatTimestamp(message.timestamp)}
        </p>
      </div>
    </div>
  );
};
