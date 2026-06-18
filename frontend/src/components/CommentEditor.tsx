import { useState } from "react";

type Props = {
  ticketLoaded: boolean;
  onImprove: (
    draftComment: string
  ) => void;
  onPush: () => void;
  generatedComment: string;
  // resetCounter: number;
  setGeneratedComment:
    React.Dispatch<
      React.SetStateAction<string>
    >;

  activeTab:
    | "original"
    | "generated";

  setActiveTab:
    React.Dispatch<
      React.SetStateAction<
        "original" | "generated"
      >
    >;
};

export default function CommentEditor({
 onImprove,
  onPush,
  generatedComment,
  setGeneratedComment,
  activeTab,
  setActiveTab,
  ticketLoaded,
  // resetCounter
}: Props) {
  const [comment, setComment] =
    useState("");
    // useEffect(() => {
    //   setComment("");
    // }, [resetCounter]);
  if (!ticketLoaded) {
    return (
      <div
        style={{
          backgroundColor: "white",
          margin: "20px",
          padding: "40px",
          borderRadius: "12px",
          textAlign: "center",
          color: "#666"
        }}
      >
        Select a ticket to begin.
      </div>
    );
  }
  
  // const [activeTab, setActiveTab] =
  //   useState<
  //     "original" | "generated"
  //   >("original");
  return (
    <div
      style={{
        backgroundColor: "white",
        padding: "20px",
        margin: "20px",
        borderRadius: "12px"
      }}
    >
      <h3>Draft Comment</h3>
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "15px"
        }}
      >
        <button
          onClick={() =>
            setActiveTab("original")
          }
          style={{
            padding: "8px 16px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            backgroundColor:
              activeTab === "original"
                ? "#1E3A5F"
                : "#E5E7EB",
            color:
              activeTab === "original"
                ? "white"
                : "black"
          }}
        >
          Original
        </button>
        
        {generatedComment.trim() !== "" && (
        <button
          onClick={() =>
            setActiveTab("generated")
          }
          style={{
            padding: "8px 16px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            backgroundColor:
              activeTab === "generated"
                ? "#2E7D32"
                : "#E5E7EB",
            color:
              activeTab === "generated"
                ? "white"
                : "black"
          }}
        >
          Generated
        </button>
        )}
      </div>

      <textarea
        // value={comment}
        // value={
        //   activeTab === "original"
        //     ? comment
        //     : generatedComment
        // }
        value={
          activeTab === "original"
            ? comment
            : generatedComment
        }
        onChange={(e) => {

          if (
            activeTab === "original"
          ) {
            setComment(
              e.target.value
            );
          } else {
            setGeneratedComment(
              e.target.value
            );
          }
        }}
        style={{
          width: "100%",
          height: "150px"
        }}
      />

      <br />
      <br />

      {/* {activeTab ===
        "original" && (
          <button
            onClick={() =>
              onImprove(comment)
            }
            style={{
              padding: "10px 18px",
              border: "none",
              borderRadius: "8px",
              backgroundColor: "#1E3A5F",
              color: "white",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            Improve Comment
          </button>
        )} */}
        {activeTab ===
"original" ? (

  <button
    onClick={() =>
        onImprove(comment)
      }
      style={{
        padding: "10px 18px",
        border: "none",
        borderRadius: "8px",
        backgroundColor:
          "#1E3A5F",
        color: "white",
        cursor: "pointer",
        fontWeight: "bold"
      }}
    >
      Improve Comment
      </button>
        ) : (
      <button
        onClick={onPush}
        style={{
          padding: "10px 18px",
          border: "none",
          borderRadius: "8px",
          backgroundColor:
            "#2E7D32",
          color: "white",
          cursor: "pointer",
          fontWeight: "bold"
        }}
      >
        Push To Redmine
      </button>

    )}
    </div>
  );
}