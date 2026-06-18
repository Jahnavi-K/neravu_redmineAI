import os
from redminelib import Redmine
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from models import (
    LoginRequest,
    ImproveCommentRequest,
    PushCommentRequest
)

from redmine import (
    get_current_user,
    get_tickets,
    get_ticket,
    push_comment,
    get_assigned_tickets
)

from llm import improve_comment


load_dotenv()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# REDMINE_URL = os.getenv("REDMINE_URL")
# REDMINE_API_KEY = os.getenv("REDMINE_API_KEY")
CURRENT_CONFIG = {
    "redmine_url": os.getenv("REDMINE_URL"),
    "api_key": os.getenv("REDMINE_API_KEY")
}


@app.get("/")
def health():
    return {
        "status": "ok"
    }


@app.post("/login")
def login(
    payload: LoginRequest
):
    user = get_current_user(
        payload.redmine_url,
        payload.api_key
    )

    return {
        "success": True,
        "user": user["user"]
    }


@app.get("/tickets")
def tickets():
   return get_tickets(
    CURRENT_CONFIG["redmine_url"],
    CURRENT_CONFIG["api_key"]
    )


@app.get("/ticket/{ticket_id}")
def ticket(
    ticket_id: int
):
    return get_ticket(
        CURRENT_CONFIG["redmine_url"],
        CURRENT_CONFIG["api_key"],
        ticket_id
    )

@app.get("/assigned-tickets")
def assigned_tickets():

    return get_assigned_tickets(
        CURRENT_CONFIG["redmine_url"],
        CURRENT_CONFIG["api_key"]
    )

@app.post("/comment/improve")
def improve(
    payload: ImproveCommentRequest
):
    # return improve_comment(
    #     payload.draft_comment
    # )
    ticket = get_ticket(
        CURRENT_CONFIG["redmine_url"],
        CURRENT_CONFIG["api_key"],
        payload.ticket_id
    )
    issue = ticket["issue"]
    description = issue.get("description", "")
    comments = []
    for journal in issue.get("journals", []):
        notes = journal.get("notes")
        if notes:
            comments.append(notes)
    recent_comments = comments[-5:]
    ticket_context = f"""
    Subject:
    {issue.get("subject")}

    Tracker:
    {issue.get("tracker", {}).get("name")}

    Priority:
    {issue.get("priority", {}).get("name")}

    Status:
    {issue.get("status", {}).get("name")}

    Description:
    {description}
    
    Recent Comments:
    {recent_comments}
    """

    return improve_comment(
        ticket_context=ticket_context,
        draft_comment=payload.draft_comment
    )


@app.post("/ticket/{ticket_id}/comment")
def add_comment(
    ticket_id: int,
    payload: PushCommentRequest
):
    return push_comment(
        CURRENT_CONFIG["redmine_url"],
        CURRENT_CONFIG["api_key"],
        ticket_id,
        payload.comment
    )

@app.post("/settings")
def update_settings(
    payload: LoginRequest
):

    user = get_current_user(
        payload.redmine_url,
        payload.api_key
    )

    CURRENT_CONFIG["redmine_url"] = payload.redmine_url
    CURRENT_CONFIG["api_key"] = payload.api_key

    return {
        "success": True,
        "user": user["user"]
    }