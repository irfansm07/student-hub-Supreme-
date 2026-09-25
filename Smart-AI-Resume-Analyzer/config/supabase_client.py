import json
import os
import urllib.error
import urllib.request
from typing import Any, Dict, List, Optional

SUPABASE_URL = os.getenv("SUPABASE_URL", "https://gblbesemxedmvdlkrjrh.supabase.co")
SUPABASE_KEY = os.getenv(
    "SUPABASE_KEY",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdibGJlc2VteGVkbXZkbGtyanJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwNjcwNTEsImV4cCI6MjEwNTY0MzA1MX0.6eRUo27mnihMEWLfM0YpZH6Go_NNCq5VWEToAbitZP0",
)


def _headers() -> Dict[str, str]:
    return {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=representation",
    }


def supabase_insert(table: str, data: Dict[str, Any]) -> Optional[List[Dict[str, Any]]]:
    """Insert a record into Supabase table via REST API."""
    url = f"{SUPABASE_URL.rstrip('/')}/rest/v1/{table}"
    body = json.dumps(data).encode("utf-8")
    req = urllib.request.Request(url, data=body, headers=_headers(), method="POST")
    try:
        with urllib.request.urlopen(req) as resp:
            content = resp.read().decode("utf-8")
            return json.loads(content) if content else []
    except Exception as err:
        print(f"[Supabase Sync Error] Insert to '{table}' failed: {err}")
        return None


def supabase_select(table: str, params: Optional[str] = None) -> List[Dict[str, Any]]:
    """Select records from Supabase table via REST API."""
    url = f"{SUPABASE_URL.rstrip('/')}/rest/v1/{table}"
    if params:
        url += f"?{params}"
    req = urllib.request.Request(url, headers=_headers(), method="GET")
    try:
        with urllib.request.urlopen(req) as resp:
            content = resp.read().decode("utf-8")
            return json.loads(content) if content else []
    except Exception as err:
        print(f"[Supabase Sync Error] Select from '{table}' failed: {err}")
        return []


def supabase_update(table: str, match_col: str, match_val: Any, data: Dict[str, Any]) -> bool:
    """Update records in Supabase table."""
    url = f"{SUPABASE_URL.rstrip('/')}/rest/v1/{table}?{match_col}=eq.{match_val}"
    body = json.dumps(data).encode("utf-8")
    req = urllib.request.Request(url, data=body, headers=_headers(), method="PATCH")
    try:
        with urllib.request.urlopen(req):
            return True
    except Exception as err:
        print(f"[Supabase Sync Error] Update in '{table}' failed: {err}")
        return False


def supabase_delete(table: str, match_col: str, match_val: Any) -> bool:
    """Delete record from Supabase table."""
    url = f"{SUPABASE_URL.rstrip('/')}/rest/v1/{table}?{match_col}=eq.{match_val}"
    req = urllib.request.Request(url, headers=_headers(), method="DELETE")
    try:
        with urllib.request.urlopen(req):
            return True
    except Exception as err:
        print(f"[Supabase Sync Error] Delete from '{table}' failed: {err}")
        return False
