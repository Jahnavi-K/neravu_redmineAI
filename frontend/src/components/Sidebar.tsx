import { useState, useEffect } from "react";
import api from "../services/api";
import SettingsModal from "./SettingsModal";

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
  type SidebarProps = {
    setTicket: React.Dispatch<
      React.SetStateAction<Ticket | null>
    >;
    resetConversation: () => void;
    isOpen: boolean;
    setIsOpen: React.Dispatch<
      React.SetStateAction<boolean>
    >;
  };
// export default function Sidebar({ setTicket }: SidebarProps) {
export default function Sidebar({  setTicket,  resetConversation,  isOpen,  setIsOpen}: SidebarProps) {
    const [ticketId, setTicketId] = useState("");
    const [recentTickets, setRecentTickets] =
    useState<number[]>(() => {
    return JSON.parse(
      localStorage.getItem("recent_tickets") || "[]"
    );
    });
    const [assignedTickets, setAssignedTickets] =
    useState<
    { id: number; subject: string }[]
      >([]);
    const [showSettings, setShowSettings] =
    useState(false);
    const fetchTicket = async () => {
      // requestIdRef.current++;
      resetConversation();
    try {
      const response = await api.get(
        `/ticket/${ticketId}`
      );

      console.log(response.data);

      setTicket(response.data.issue);
      const recent =
        JSON.parse(
          localStorage.getItem("recent_tickets") || "[]"
        );

      const updated = [
        response.data.issue.id,
        ...recent.filter(
          (id: number) =>
            id !== response.data.issue.id
        )
      ].slice(0, 3);

      localStorage.setItem(
        "recent_tickets",
        JSON.stringify(updated)
      );
      setRecentTickets(updated);
    } catch (error) {
      console.error(error);
      alert("Unable to fetch ticket");
      }
    };
      const loadRecentTicket = async (
        id: number
      ) => {
        resetConversation();
        // requestIdRef.current++;
        setTicket(null);
        try {
          const response =
            await api.get(`/ticket/${id}`);

          setTicket(response.data.issue);

          const recent =
            JSON.parse(
              localStorage.getItem("recent_tickets") || "[]"
            );

          const updated = [
            id,
            ...recent.filter(
              (ticketId: number) =>
                ticketId !== id
            )
          ].slice(0, 3);

          localStorage.setItem(
            "recent_tickets",
            JSON.stringify(updated)
          );

          setRecentTickets(updated);

        } catch (error) {
          console.error(error);
        }
      };
      useEffect(() => {
        const fetchAssignedTickets = async () => {
          try {
            const response =
              await api.get("/assigned-tickets");

            setAssignedTickets(response.data);
          } catch (error) {
            console.error(error);
          }
        };

        fetchAssignedTickets();
      }, []);

    return (
    <>
  <div
        style={{
        // width: "220px",
        width: isOpen ? "270px" : "70px",
        transition: "0.3s",
        overflow: "hidden",
        backgroundColor: "#1E3A5F",
        color: "white",
        padding: "20px",
        height: "100%",
        display: "flex",
        flexDirection: "column"
        }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: isOpen
            ? "flex-end"
            : "center",
          marginBottom: "10px"
        }}
      >
        <button
          onClick={() =>
            setIsOpen(!isOpen)
          }
          style={{
            background: "none",
            border: "none",
            color: "white",
            cursor: "pointer",
            fontSize: "20px"
          }}
        >
          {isOpen ? "◀" : "▶"}
        </button>
      </div>
      {!isOpen && (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "30px",
              marginBottom: "40px"
            }}
          >
            <div
              style={{
                color: "#6EA8FF",
                fontWeight: "bold",
                fontSize: "22px",
                lineHeight: "34px",
                textAlign: "center"
              }}
            >
              ನೆ
              <br />
              ರ
              <br />
              ವು
              {/* N
              <br />
              E
              <br />
              R
              <br />
              A
              <br />
              V
              <br />
              U */}
            </div>
          </div>

          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.3)",
              marginBottom: "25px"
            }}
          />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              alignItems: "center"
            }}
          >
            {recentTickets.map((id) => (
              <button
                key={id}
                onClick={() => loadRecentTicket(id)}
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "50%",
                  border: "none",
                  backgroundColor: "#355C8A",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "12px"
                }}
              >
                #{id}
              </button>
            ))}
          </div>

          <div
            style={{
              marginTop: "auto"
            }}
          >
            <button
              onClick={() => setShowSettings(true)}
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                border: "none",
                backgroundColor: "#4F86C6",
                color: "white",
                cursor: "pointer",
                fontSize: "18px"
              }}
            >
              ⚙
            </button>
          </div>
        </>
      )}
      {isOpen && (
      <>
      <div
        style={{
          textAlign: "center",
          marginBottom: "30px"
        }}
      >
        <h1
          style={{
            color: "#6EA8FF",
            fontSize: "34px",
            fontWeight: "bold",
            marginBottom: "4px"
          }}
        >
          ನೆರವು
          {/* NERAVU */}
        </h1>

        <p
          style={{
            fontSize: "15px",
            opacity: 0.75
          }}
        >
          AI-powered Redmine Companion
        </p>
      </div>
      <h3
        style={{
          fontSize: "15px",
          textTransform: "uppercase",
          letterSpacing: "1px",
          opacity: 0.8,
          marginBottom: "10px"
        }}
      >
        Ticket Search
      </h3>

      <input
        placeholder="Ticket ID"
        value={ticketId}
        onChange={(e) =>
          setTicketId(e.target.value)
        }
        style={{
          width: "100%",
          padding: "10px",
          fontSize: "15px",
          borderRadius: "8px",
          border: "none"
        }}
      />

      <br />
      <br />

      <button
        onClick={fetchTicket}
        style={{
          width: "100%",
          padding: "15px",
          border: "none",
          borderRadius: "8px",
          backgroundColor: "#2E7D32",
          color: "white",
          cursor: "pointer",
          fontSize: "15px",
          fontWeight: "bold"
        }}
      >
        Fetch Ticket
      </button>

      <hr style={{ margin: "20px 0" }} />

      <h4
        style={{
        fontSize: "15px",
        textTransform: "uppercase",
        letterSpacing: "1px",
        opacity: 0.8,
        marginBottom: "10px"
      }}
      >
        Recent Tickets
      </h4>

      <div
        style={{
          display: "flex",
          gap: "8px",
          flexWrap: "wrap"
        }}
      >
        {recentTickets.map((id) => (
          <button
            key={id}
            onClick={() => loadRecentTicket(id)}
            style={{
              border: "none",
              borderRadius: "16px",
              padding: "6px 12px",
              backgroundColor: "#355C8A",
              color: "white",
              cursor: "pointer",
              fontSize: "13px"
            }}
          >
            #{id}
          </button>
        ))}
      </div>

        <hr style={{ margin: "20px 0" }} />

        <h4
        style={{
          fontSize: "15px",
          textTransform: "uppercase",
          letterSpacing: "1px",
          opacity: 0.8,
          marginBottom: "10px"
        }}
      >
        Assigned Tickets
      </h4>

      {assignedTickets.map((ticket) => (
        <div
          key={ticket.id}
          onClick={() =>
            loadRecentTicket(ticket.id)
          }
          style={{
            backgroundColor: "#355C8A",
            borderRadius: "8px",
            padding: "8px",
            marginBottom: "8px",
            cursor: "pointer",
            fontSize: "15px"
          }}
        >
          <div>
            #{ticket.id}
          </div>

          <div
            style={{
              marginTop: "4px",
              opacity: 0.9
            }}
          >
            {ticket.subject}
          </div>
        </div>
      ))}

      <div
        style={{
          marginTop: "auto"
        }}
      >
        <button
          onClick={() => setShowSettings(true)}
          style={{
            width: "100%",
            padding: "12px",
            border: "none",
            borderRadius: "8px",
            backgroundColor: "#4F86C6",
            color: "white",
            cursor: "pointer",
            fontSize: "18px",
            fontWeight: "bold"
          }}
        >
          ⚙ Settings
        </button>
      </div>
      </>
      )}
    </div>

    {showSettings && (
      <SettingsModal
        onClose={() => setShowSettings(false)}
      />
    )}
  </>
);
}