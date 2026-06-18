type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
};

type ChatWindowProps = {
  messages: Message[];
  isLoading: boolean;
  currentUserName: string;
};

export default function ChatWindow({
  messages,isLoading,currentUserName
}: ChatWindowProps) {
  return (
    <div
      style={{
        flex: 1,
        padding: "20px",
        overflowY: "auto"
      }}
    >
      {messages.map((message, index) => (
        <div
          key={index}
          style={{
            marginBottom: "20px"
          }}
        >
          <div
            style={{
              fontWeight: "bold",
              marginBottom: "5px"
            }}
          >
            {message.role === "user"
              ? `👤 ${currentUserName} (User)`
              : "🤖 ನೆರವುAI"}

            <span
              style={{
                opacity: 0.6,
                marginLeft: "8px",
                fontWeight: "normal"
              }}
            >
              • {message.timestamp}
            </span>
          </div>

          <div
            style={{
              backgroundColor:
                message.role === "user"
                  ? "#E8F0FE"
                  : "#F5F7FB",
              padding: "12px",
              borderRadius: "8px"
            }}
          >
            {message.content}
          </div>
        </div>
      ))}
      {isLoading && (
        <div
          style={{
            marginBottom: "20px"
          }}
        >
          <div
            style={{
              fontWeight: "bold",
              marginBottom: "5px"
            }}
          >
            🤖 ನೆರವುAI

            <span
              style={{
                opacity: 0.6,
                marginLeft: "8px",
                fontWeight: "normal"
              }}
            >
              typing...
            </span>
          </div>
        </div>
      )}
    </div>
  );
}