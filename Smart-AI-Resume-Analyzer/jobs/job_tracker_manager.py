"""
Job Application Tracker Manager
Handles database storage and operations for student job applications,
pipeline status transitions, and recruitment funnel analytics.
"""

import sqlite3
from datetime import datetime
from typing import List, Dict, Optional, Any
from config.database import get_database_connection


def init_job_tracker_table():
    """Create the job_applications table if it doesn't exist."""
    conn = get_database_connection()
    cursor = conn.cursor()
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS job_applications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        company TEXT NOT NULL,
        role_title TEXT NOT NULL,
        stage TEXT NOT NULL DEFAULT 'Saved',
        location TEXT DEFAULT '',
        workplace_type TEXT DEFAULT 'Remote',
        salary TEXT DEFAULT '',
        job_url TEXT DEFAULT '',
        applied_date TEXT DEFAULT '',
        deadline TEXT DEFAULT '',
        contact_person TEXT DEFAULT '',
        notes TEXT DEFAULT '',
        priority TEXT DEFAULT 'Medium',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    conn.commit()
    conn.close()



def add_job_application(data: Dict[str, Any]) -> int:
    """Add a new job application record and sync to Supabase."""
    conn = get_database_connection()
    cursor = conn.cursor()
    record = {
        "company": data.get("company", "").strip(),
        "role_title": data.get("role_title", "").strip(),
        "stage": data.get("stage", "Saved"),
        "location": data.get("location", "").strip(),
        "workplace_type": data.get("workplace_type", "Remote"),
        "salary": data.get("salary", "").strip(),
        "job_url": data.get("job_url", "").strip(),
        "applied_date": data.get("applied_date", datetime.now().strftime("%Y-%m-%d")),
        "deadline": data.get("deadline", ""),
        "contact_person": data.get("contact_person", "").strip(),
        "notes": data.get("notes", "").strip(),
        "priority": data.get("priority", "Medium"),
    }
    cursor.execute('''
    INSERT INTO job_applications 
    (company, role_title, stage, location, workplace_type, salary, job_url, applied_date, deadline, contact_person, notes, priority, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    ''', (
        record["company"], record["role_title"], record["stage"], record["location"],
        record["workplace_type"], record["salary"], record["job_url"], record["applied_date"],
        record["deadline"], record["contact_person"], record["notes"], record["priority"]
    ))
    new_id = cursor.lastrowid
    conn.commit()
    conn.close()

    try:
        from config.supabase_client import supabase_insert
        supabase_insert("job_applications", record)
    except Exception as s_err:
        print(f"Supabase sync warning: {s_err}")

    return new_id


def get_all_applications(stage_filter: Optional[str] = None, search_query: Optional[str] = None) -> List[Dict[str, Any]]:
    """Retrieve applications with optional filtering."""
    conn = get_database_connection()
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    query = "SELECT * FROM job_applications WHERE 1=1"
    params = []

    if stage_filter and stage_filter != "All":
        query += " AND stage = ?"
        params.append(stage_filter)

    if search_query:
        query += " AND (company LIKE ? OR role_title LIKE ? OR location LIKE ? OR notes LIKE ?)"
        wildcard = f"%{search_query.strip()}%"
        params.extend([wildcard, wildcard, wildcard, wildcard])

    query += " ORDER BY CASE priority WHEN 'High' THEN 1 WHEN 'Medium' THEN 2 WHEN 'Low' THEN 3 ELSE 4 END, id DESC"

    cursor.execute(query, params)
    rows = cursor.fetchall()
    results = [dict(row) for row in rows]
    conn.close()
    return results


def update_job_stage(app_id: int, new_stage: str) -> bool:
    """Update only the pipeline stage of an application and sync to Supabase."""
    conn = get_database_connection()
    cursor = conn.cursor()
    cursor.execute('''
    UPDATE job_applications 
    SET stage = ?, updated_at = CURRENT_TIMESTAMP 
    WHERE id = ?
    ''', (new_stage, app_id))
    conn.commit()
    conn.close()

    try:
        from config.supabase_client import supabase_update
        supabase_update("job_applications", "id", app_id, {"stage": new_stage})
    except Exception as s_err:
        print(f"Supabase sync warning: {s_err}")

    return True


def delete_job_application(app_id: int) -> bool:
    """Delete an application record and sync to Supabase."""
    conn = get_database_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM job_applications WHERE id = ?", (app_id,))
    conn.commit()
    conn.close()

    try:
        from config.supabase_client import supabase_delete
        supabase_delete("job_applications", "id", app_id)
    except Exception as s_err:
        print(f"Supabase sync warning: {s_err}")

    return True


def get_tracker_metrics() -> Dict[str, Any]:
    """Calculate pipeline conversion metrics."""
    conn = get_database_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT stage, COUNT(*) FROM job_applications GROUP BY stage")
    counts = dict(cursor.fetchall())
    conn.close()

    total = sum(counts.values())
    saved = counts.get("Saved", 0)
    applied = counts.get("Applied", 0)
    interviewing = counts.get("Interviewing", 0)
    offer = counts.get("Offer", 0)
    rejected = counts.get("Rejected", 0)

    # Calculation of rates
    total_active = applied + interviewing + offer
    interview_rate = round((interviewing + offer) / max(applied + interviewing + offer, 1) * 100, 1) if (applied + interviewing + offer) > 0 else 0
    offer_rate = round(offer / max(total, 1) * 100, 1) if total > 0 else 0

    return {
        "total": total,
        "saved": saved,
        "applied": applied,
        "interviewing": interviewing,
        "offer": offer,
        "rejected": rejected,
        "interview_rate": interview_rate,
        "offer_rate": offer_rate
    }
