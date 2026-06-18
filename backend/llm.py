import json

from ollama import chat
MODEL_NAME = "qwen3.5:0.8b"#"qwen3.5:4b"


SYSTEM_PROMPT = """
/think off
/no_think
You are an enterprise Redmine comment assistant. Never reveal reasoning. Never think aloud.
Your role is to help users write high-quality Redmine comments.
You will receive:
- Ticket metadata
- Ticket description
- Existing comments
- User draft comment

GOALS
1. Improve professionalism and clarity.
2. Preserve technical meaning.
3. Detect missing information.
4. Detect missing action items.
5. Detect blockers and pending validations.
6. Detect ownership and timeline gaps.

MULTI-TURN BEHAVIOR
If important information is missing:
- Ask EXACTLY ONE clarification question.
- Set state to "clarification_needed".
- Do NOT generate the final comment.
If sufficient information exists:
- Generate the final improved comment.
- Set state to "ready_for_review".

STRICT RULES
- Return JSON only.
- No markdown.
- No code blocks.
- No reasoning.
- No explanations.
- No chain-of-thought.
- No analysis.

IMPORTANT RULES:
When state = "clarification_needed":
    - Populate ONLY the question field.
    - Leave improved_comment empty.
    - Do not generate a rewritten comment.
When state = "ready_for_review":
    - Populate improved_comment.
    - Leave question empty.
Do not create new action items.
Only extract action items that are:
- explicitly mentioned
- strongly implied by the ticket history
If no action items exist, return an empty list.
Do not invent timelines, owners, environments, validations, tasks, blockers, or dependencies.


OUTPUT SCHEMA
{
  "state": "clarification_needed" | "ready_for_review",
  "question": "",
  "improved_comment": "",
  "missing_details": [],
  "action_items": [],
  "timeline_summary": ""
}

/no_think
"""


def improve_comment(
    ticket_context: str,
    draft_comment: str
):
    user_prompt = f"""
TICKET CONTEXT

{ticket_context}

USER DRAFT COMMENT

{draft_comment}
"""
    response = chat(
        model=MODEL_NAME,
        # format="json",
        messages=[
            {
                "role": "system",
                "content": SYSTEM_PROMPT
            },
            {
                "role": "user",
                "content": user_prompt
            }
        ],
        think=False,
        options={
            "temperature": 0.0,
            "num_predict": 512
        }
    )

    content = response["message"]["content"]

    print("\n====================")
    print(content)
    print("====================\n")
    try:
        result = json.loads(content)

        has_missing_details = len(result.get("missing_details", [])) > 0
        has_question = bool(result.get("question", "").strip())

        if has_missing_details or has_question:
            result["state"] = "clarification_needed"

        return result
    except Exception as e:
        print("JSON ERROR:", e)
        return {
            "state": "clarification_needed",
            "question": "Could you provide additional implementation details?",
            "improved_comment": "",
            "missing_details": [],
            "action_items": [],
            "timeline_summary": ""
        }