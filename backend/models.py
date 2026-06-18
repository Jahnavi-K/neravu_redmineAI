from pydantic import BaseModel


class LoginRequest(BaseModel):
    redmine_url: str
    api_key: str


class ImproveCommentRequest(BaseModel):
    ticket_id: int
    draft_comment: str


class PushCommentRequest(BaseModel):
    comment: str