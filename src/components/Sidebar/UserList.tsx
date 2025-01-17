interface UserListProps {
  users: string[];
  selectedUser: string;
  onSelectUser: (user: string) => void;
  isLoading: boolean;
}

export const UserList: React.FC<UserListProps> = ({
  users,
  selectedUser,
  onSelectUser,
  isLoading,
}) => {
  return (
    <div className="h-screen bg-gray-900 w-72 p-4 flex flex-col">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white px-4">Conversations</h2>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-400">Loading users...</p>
        </div>
      ) : (
        <div className="overflow-y-auto flex-1">
          {users.map((user) => (
            <div
              key={user}
              onClick={() => onSelectUser(user)}
              className={`
                mb-2 p-4 rounded-xl cursor-pointer transition-all duration-200
                ${
                  selectedUser === user
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }
              `}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                  <span className="text-lg font-medium text-white">
                    {user.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium">{user}</p>
                  <p className="text-sm text-gray-400">Online</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
