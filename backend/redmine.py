import requests


def headers(api_key: str):
    return {
        "X-Redmine-API-Key": api_key
    }


def get_current_user(redmine_url: str, api_key: str):
    response = requests.get(
        f"{redmine_url}/users/current.json",
        headers=headers(api_key)
    )

    response.raise_for_status()

    return response.json()


def get_tickets(redmine_url: str, api_key: str):
    response = requests.get(
        f"{redmine_url}/issues.json",
        headers=headers(api_key)
    )

    response.raise_for_status()

    return response.json()


def get_ticket(
    redmine_url: str,
    api_key: str,
    ticket_id: int
):
    response = requests.get(
        f"{redmine_url}/issues/{ticket_id}.json?include=journals",
        headers=headers(api_key)
    )

    response.raise_for_status()

    return response.json()


def push_comment(
    redmine_url: str,
    api_key: str,
    ticket_id: int,
    comment: str
):
    payload = {
        "issue": {
            "notes": comment
        }
    }

    response = requests.put(
        f"{redmine_url}/issues/{ticket_id}.json",
        headers={
            "X-Redmine-API-Key": api_key,
            "Content-Type": "application/json"
        },
        json=payload
    )

    response.raise_for_status()

    return {"success": True}

def get_assigned_tickets(
    redmine_url: str,
    api_key: str
):
    response = requests.get(
        f"{redmine_url}/issues.json",
        headers=headers(api_key),
        params={
            "assigned_to_id": "me",
            "sort": "updated_on:desc",
            "limit": 3
        }
    )

    response.raise_for_status()

    data = response.json()

    return [
        {
            "id": issue["id"],
            "subject": issue["subject"]
        }
        for issue in data["issues"]
    ]