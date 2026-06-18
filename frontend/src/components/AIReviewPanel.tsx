type AIResponse = {
  state: string;
  question: string;
  improved_comment: string;
  missing_details: string[];
//   action_items: string[];
    action_items: {
    type: string;
    description: string;
    }[];
  timeline_summary: string;
};

type Props = {
  response: AIResponse | null;
};

export default function AIReviewPanel({
  response
}: Props) {

  if (!response) {
    return null;
  }

  if (
    response.state ===
    "clarification_needed"
  ) {
    return (
      <div
        style={{
          backgroundColor: "white",
          margin: "20px",
          padding: "20px",
          borderRadius: "12px"
        }}
      >
        <h2>
          ⚠ Clarification Required
        </h2>

        <p>
          Additional information is
          needed before a final
          comment can be generated.
        </p>

        <h3>
          Missing Details
        </h3>

        <ul>
          {response.missing_details?.map(
            (
              item: string,
              index: number
            ) => (
              <li key={index}>
                {item}
              </li>
            )
          )}
        </ul>

        {response.improved_comment && (
          <>
            <h3
              style={{
                marginTop: "20px"
              }}
            >
              Current Draft
            </h3>

            <div
              style={{
                backgroundColor:
                  "#F5F7FB",
                padding: "12px",
                borderRadius: "8px",
                whiteSpace:
                  "pre-wrap"
              }}
            >
              {
                response.improved_comment
              }
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "white",
        margin: "20px",
        padding: "20px",
        borderRadius: "12px"
      }}
    >
      <h2>
        ✓ Ready For Review
      </h2>

      <h3>
        Improved Comment
      </h3>

      <div
        style={{
          backgroundColor: "#F5F7FB",
          padding: "12px",
          borderRadius: "8px",
          whiteSpace: "pre-wrap"
        }}
      >
        {response.improved_comment}
      </div>

      {response.action_items?.length >
        0 && (
        <>
          <h3
            style={{
              marginTop: "20px"
            }}
          >
            Action Items
          </h3>

          <ul>
            {response.action_items.map(
                (
                    item,
                    index
                ) => (
                    <li key={index}>
                    {item.description}
                    </li>
                )
                )}
          </ul>
        </>
      )}

      {response.timeline_summary && (
        <>
          <h3>
            Timeline Summary
          </h3>

          <div>
            {
              response.timeline_summary
            }
          </div>
        </>
      )}
    </div>
  );
}