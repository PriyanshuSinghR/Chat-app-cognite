import { Message } from "@/types/chat";
import { MessageBubble } from "./MessageBubble";
import { MessageInput } from "./MessageInput";

interface ChatWindowProps {
  selectedUser: string;
  messages: Message[];
  currentUserId: string;
  onSendMessage: (message: string) => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  selectedUser,
  messages,
  currentUserId,
  onSendMessage,
}) => {
  return (
    <div className="flex-1 flex flex-col bg-gray-900">
      <div className="p-4 bg-gray-800 border-b border-gray-700">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
              <span className="text-lg font-medium text-white">
                {selectedUser?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {selectedUser || "Select a user"}
              </h2>
              <p className="text-sm text-gray-400">Online</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="text-right">
              <p className="text-md text-white font-medium">{currentUserId}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
              <span className="text-sm font-medium text-white">
                {currentUserId?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400 text-center">
              No messages yet. Start the conversation!
            </p>
          </div>
        ) : (
          messages?.map((message, index) => (
            <MessageBubble
              key={index}
              message={message}
              isOwnMessage={message.sender === currentUserId}
            />
          ))
        )}
      </div>

      <MessageInput onSendMessage={onSendMessage} disabled={!selectedUser} />
    </div>
  );
};
