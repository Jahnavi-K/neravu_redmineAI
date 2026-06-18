type Ticket = {
  id: number;
  subject: string;
  status: {
    name: string;
  };
  priority: {
    name: string;
  };
  tracker: {
    name: string;
  };
};

type TicketHeaderProps = {
  ticket: Ticket | null;
};

export default function TicketHeader({
  ticket,
}: TicketHeaderProps) {

  if (!ticket) {
    return (
      <div
        style={{
          padding: "20px",
          backgroundColor: "white",
          borderBottom: "1px solid #ddd"
        }}
      >
        <h2>No ticket selected</h2>
      </div>
    );
  }

 return (
  <div
    style={{
      padding: "24px",
      backgroundColor: "white",
      borderBottom: "1px solid #DDE5EF",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
    }}
  >
    <div
      style={{
        fontSize: "14px",
        color: "#666",
        marginBottom: "9px"
      }}
    >
      {ticket.tracker.name} #{ticket.id}
    </div>

    <h1
      style={{
        fontSize: "32px",
        color: "#1E3A5F",
        marginBottom: "20px"
      }}
    >
      {ticket.subject}
    </h1>

    <div
      style={{
        display: "flex",
        gap: "12px"
      }}
    >
      <div
        style={{
          backgroundColor: "#E8F0FE",
          color: "#1E3A5F",
          padding: "6px 14px",
          borderRadius: "20px",
          fontWeight: "bold"
        }}
      >
        {ticket.status.name}
      </div>

      <div
        style={{
          backgroundColor: "#FFF3CD",
          color: "#7A5A00",
          padding: "6px 14px",
          borderRadius: "20px",
          fontWeight: "bold"
        }}
      >
        {ticket.priority.name}
      </div>

      <div
        style={{
          backgroundColor: "#E8F5E9",
          color: "#2E7D32",
          padding: "6px 14px",
          borderRadius: "20px",
          fontWeight: "bold"
        }}
      >
        {ticket.tracker.name}
      </div>
    </div>
  </div>
);
}