import { useState, useRef } from "react";

import Sidebar from "../components/Sidebar";
import TicketHeader from "../components/TicketHeader";
import ChatWindow from "../components/ChatWindow";
import CommentEditor from "../components/CommentEditor";
import api from "../services/api";
// import AIReviewPanel from "../components/AIReviewPanel";
export default function DashboardPage() {

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
  // type AIResponse = {
  //   state: string;
  //   question: string;
  //   improved_comment: string;
  //   missing_details: string[];
  //   action_items: string[];
  //   timeline_summary: string;
  // };
  const [ticket, setTicket] = useState<Ticket | null>(null);
  type Message = {  role: "user" | "assistant";  content: string; timestamp: string;};
  const [messages, setMessages] = useState<Message[]>([]);

  // const [aiResponse, setAiResponse] =
  //   useState<AIResponse | null>(null);
  const [sidebarOpen, setSidebarOpen] =
  useState(true);
  const [generatedComment, setGeneratedComment] =
  useState("");
  // const [activeTicketId, setActiveTicketId] =
  // useState<number | null>(null);
  const requestIdRef =useRef(0);
  const [activeTab, setActiveTab] =
    useState<"original" | "generated">(
      "original"
    );
  const [isLoading, setIsLoading] =
  useState(false);
  // console.log(
  //   localStorage.getItem(
  //     "redmine_user"
  //   ));
  const user =
    JSON.parse(
      localStorage.getItem(
        "redmine_user"
      ) || "{}"
    );
  const currentUserName =
    `${user.firstname || ""} ${user.lastname || ""}`.trim()
    || "User";
  const [resetCounter, setResetCounter] =
  useState(0);
  // useEffect(() => {
  //   setMessages([]);
  //   setGeneratedComment("");
  //   setActiveTab("original");
  // }, [ticket?.id]);
  const resetConversation = () => {
  requestIdRef.current++;
  setMessages([]);
  setGeneratedComment("");
  setActiveTab("original");
};
  const improveComment = async (
    draftComment: string
  ) => {
    // const currentTicketId = ticket?.id;
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: draftComment,
        timestamp:
          new Date().toLocaleTimeString(
            [],
            {
              hour: "2-digit",
              minute: "2-digit"
            }
          )
      }
    ]);
    if (!ticket) {
      alert(
        "Please select a ticket first"
      );
      return;
    }
    try {
      // const requestTicketId = ticket.id;
      const requestId = ++requestIdRef.current;
      setIsLoading(true);
      const response =
        await api.post(
          "/comment/improve",
          {
            ticket_id: ticket.id,
            draft_comment:
              draftComment
          }
        );
        if (
          requestId !==
          requestIdRef.current
        ) {
          console.log(
            "Ignoring stale response"
          );

          return;
        }
        if (
          !response.data.improved_comment &&
          response.data.state ===
            "ready_for_review"
        ) {
          return;
        }
      // console.log(response.data);
      // setAiResponse(response.data);
      // const data = response.data;
      if (
        response.data.state ===
        "ready_for_review"
      ) {
        setGeneratedComment(
          response.data.improved_comment
        );

        setActiveTab("generated");
      }
      let assistantMessage = "";
      console.log(response.data);
      if (
        response.data.state ===
        "clarification_needed"
      ) {
        setGeneratedComment("");
        setActiveTab("original");
        assistantMessage =
          "⚠ Clarification Required\n\n" +
          response.data.missing_details
            .map(
              (detail: string) =>
                `• ${detail}`
            )
            .join("\n");
      } else {
        assistantMessage =
          response.data.improved_comment;
      }
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: assistantMessage,
          timestamp:
            new Date().toLocaleTimeString(
              [],
              {
                hour: "2-digit",
                minute: "2-digit"
              }
            )
        }
      ]);
    } catch (error) {
      console.error(error);
      alert(
        "Unable to improve comment"
      );
    } finally {
    setIsLoading(false);
    }
  };
  const pushComment = async () => {
    if (!ticket) {
      alert(
        "Please select a ticket first"
      );
      return;
    }

    if (
      !generatedComment.trim()
    ) {
      alert(
        "No generated comment available"
      );
      return;
    }

    try {

      await api.post(
        `/ticket/${ticket.id}/comment`,
        {
          comment:
            generatedComment
        }
      );
      setGeneratedComment("");
      setActiveTab("original");
      setResetCounter(
        prev => prev + 1
      );
      alert(
        "Comment pushed to Redmine successfully"
      );

    } catch (error) {

      console.error(error);

      alert(
        "Unable to push comment"
      );
    }
  };
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        backgroundColor: "#F5F7FB"
      }}
    >
      <Sidebar
        setTicket={setTicket}
        resetConversation={resetConversation}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column"
        }}
      >
        <TicketHeader ticket={ticket} />

        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          currentUserName={
            currentUserName
          }
        />

        <CommentEditor
          key={`${ticket?.id}-${resetCounter}`}
          // resetCounter={resetCounter}
          ticketLoaded={ticket !== null}
          onImprove={improveComment}
          onPush={pushComment}
          generatedComment={generatedComment}
          setGeneratedComment={
            setGeneratedComment
          }
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        {/* <AIReviewPanel
          response={aiResponse}
        /> */}
      </div>
    </div>
  );
}