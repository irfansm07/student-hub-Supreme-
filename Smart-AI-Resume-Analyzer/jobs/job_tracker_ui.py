"""
Job Application Tracker & Kanban Dashboard UI.
Inspired by Muatasim-Aswad/job-tracker.
Provides visual Kanban board, lifecycle tracking, funnel metrics, and CSV export.
"""

import streamlit as st
import pandas as pd
from datetime import datetime
from ui_components import page_header, stat_card, section_divider, badge, step_header, back_to_hub_button
from jobs.job_tracker_manager import (
    init_job_tracker_table,
    get_all_applications,
    add_job_application,
    update_job_stage,
    delete_job_application,
    get_tracker_metrics
)

STAGES = ["Saved", "Applied", "Interviewing", "Offer", "Rejected"]

STAGE_CONFIG = {
    "Saved": {"icon": "📌", "label": "Saved / Wishlist", "color": "var(--text-secondary)"},
    "Applied": {"icon": "📨", "label": "Applied", "color": "var(--info)"},
    "Interviewing": {"icon": "📞", "label": "Interviewing", "color": "var(--accent)"},
    "Offer": {"icon": "🎉", "label": "Offer Received", "color": "var(--success)"},
    "Rejected": {"icon": "🛑", "label": "Archived / Rejected", "color": "var(--error)"}
}


def render_job_tracker():
    """Render the full Job Tracker and Kanban workspace."""
    init_job_tracker_table()
    back_to_hub_button()

    page_header(
        "📌 Job & Internship Application Tracker",
        "A calm, visual workspace to track every application from saved to interview to final offer."
    )

    # ── STEP 1: FUNNEL METRICS ──
    step_header(1, 3, "Your Recruitment Funnel Health", "Real-time statistics calculated directly from your actual tracked applications.")

    metrics = get_tracker_metrics()
    c1, c2, c3, c4, c5 = st.columns(5)
    with c1:
        stat_card("Total Tracked", metrics["total"], icon="fas fa-briefcase")
    with c2:
        stat_card("Applied", metrics["applied"], icon="fas fa-paper-plane", color="var(--info)")
    with c3:
        stat_card("Interviewing", metrics["interviewing"], icon="fas fa-user-tie", color="var(--accent)")
    with c4:
        stat_card("Offers", metrics["offer"], icon="fas fa-trophy", color="var(--success)")
    with c5:
        stat_card("Interview Rate", f"{metrics['interview_rate']}%", icon="fas fa-chart-line", color="var(--accent)")

    st.markdown("<br>", unsafe_allow_html=True)

    # ── STEP 2: LOG NEW OPPORTUNITIES ──
    step_header(2, 3, "Add New Job Opportunity", "Log a new role, deadline, or recruiter contact to your pipeline.")


    # Top Controls: Add New Application + Search / Filter
    with st.expander("➕ Track New Job Opportunity", expanded=False):
        with st.form("add_job_form", clear_on_submit=True):
            f_col1, f_col2, f_col3 = st.columns(3)
            with f_col1:
                company = st.text_input("Company Name *", placeholder="e.g. Google, Amazon, Startup Inc.")
                role_title = st.text_input("Job Title / Role *", placeholder="e.g. Software Engineer Intern, Data Analyst")
                stage = st.selectbox("Current Stage", STAGES, index=0)

            with f_col2:
                location = st.text_input("Location", placeholder="e.g. San Francisco, CA / Remote")
                workplace_type = st.selectbox("Workplace Type", ["Remote", "Hybrid", "Onsite"])
                salary = st.text_input("Salary / Compensation", placeholder="e.g. $110k/yr or $45/hr")

            with f_col3:
                job_url = st.text_input("Job Listing URL", placeholder="https://careers.company.com/...")
                applied_date = st.date_input("Application Date", datetime.now()).strftime("%Y-%m-%d")
                deadline = st.text_input("Next Deadline / Follow-up", placeholder="e.g. 2026-10-15 or Interview date")

            n_col1, n_col2 = st.columns([2, 1])
            with n_col1:
                notes = st.text_area("Notes & Interview Prep", placeholder="Referral contact, key skills mentioned in JD, interview questions...", height=80)
            with n_col2:
                priority = st.select_slider("Priority Level", options=["Low", "Medium", "High"], value="High")
                contact_person = st.text_input("Recruiter / Referral Contact", placeholder="Name & email")

            submit_btn = st.form_submit_button("💼 Save Application to Tracker", type="primary", use_container_width=True)

            if submit_btn:
                if not company.strip() or not role_title.strip():
                    st.error("Please fill in both Company Name and Job Title.")
                else:
                    new_id = add_job_application({
                        "company": company,
                        "role_title": role_title,
                        "stage": stage,
                        "location": location,
                        "workplace_type": workplace_type,
                        "salary": salary,
                        "job_url": job_url,
                        "applied_date": str(applied_date),
                        "deadline": deadline,
                        "contact_person": contact_person,
                        "notes": notes,
                        "priority": priority
                    })
                    st.success(f"Added **{role_title}** at **{company}** to your pipeline!")
                    st.rerun()

    # ── STEP 3: PIPELINE & KANBAN BOARD ──
    st.markdown("<br>", unsafe_allow_html=True)
    step_header(3, 3, "Your Visual Application Pipeline", "Advance your job cards across stages as you progress: Saved → Applied → Interviewing → Offer.")

    # Search and Filter Toolbar
    bar_col1, bar_col2, bar_col3 = st.columns([2, 1, 1])
    with bar_col1:
        search_query = st.text_input("🔍 Search opportunities", placeholder="Search by company, role, location, or keywords...")

    with bar_col2:
        stage_filter = st.selectbox("Filter Stage", ["All"] + STAGES, index=0)
    with bar_col3:
        view_mode = st.radio("View Layout", ["📌 Kanban Board", "📋 List View"], horizontal=True)

    applications = get_all_applications(stage_filter=stage_filter, search_query=search_query)

    if not applications and not search_query and stage_filter == "All":
        st.info("ℹ️ Your application pipeline is currently empty. Click **'➕ Track New Job Opportunity'** above to log your real job applications, interview stages, and offers.")

    # VIEW 1: KANBAN BOARD
    if view_mode == "📌 Kanban Board":

        st.markdown("<br>", unsafe_allow_html=True)
        kanban_cols = st.columns(len(STAGES))

        for idx, stage_name in enumerate(STAGES):
            cfg = STAGE_CONFIG[stage_name]
            stage_apps = [a for a in applications if a["stage"] == stage_name]

            with kanban_cols[idx]:
                # Column Header
                st.markdown(f"""
                <div style="background: var(--bg-card-solid); border: 1px solid var(--border-accent); border-radius: var(--radius-md); padding: 0.75rem 0.5rem; text-align: center; margin-bottom: 0.75rem;">
                    <span style="font-size: 1.1rem;">{cfg['icon']}</span>
                    <strong style="color: {cfg['color']}; font-size: 0.85rem; margin-left: 4px;">{cfg['label']}</strong>
                    <div style="margin-top: 2px;"><span class="badge badge-accent" style="font-size: 0.7rem;">{len(stage_apps)}</span></div>
                </div>
                """, unsafe_allow_html=True)

                if not stage_apps:
                    st.markdown("""
                    <div style="text-align: center; padding: 1.5rem 0.5rem; color: var(--text-muted); font-size: 0.8rem; border: 1px dashed var(--border); border-radius: var(--radius-md);">
                        Empty
                    </div>
                    """, unsafe_allow_html=True)

                for app in stage_apps:
                    app_id = app["id"]
                    priority = app.get("priority", "Medium")
                    badge_cls = "badge-error" if priority == "High" else ("badge-warning" if priority == "Medium" else "badge-accent")

                    st.markdown(f"""
                    <div class="report-card" style="padding: 1rem; margin-bottom: 0.65rem; border-left: 3px solid {cfg['color']}; font-size: 0.85rem;">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.25rem;">
                            <strong style="color: var(--accent); font-size: 0.95rem; line-height: 1.2;">{app['company']}</strong>
                            <span class="badge {badge_cls}">{priority}</span>
                        </div>
                        <div style="color: var(--text-primary); font-weight: 600; margin-bottom: 0.35rem;">{app['role_title']}</div>
                        {f'<div style="color: var(--text-secondary); font-size: 0.78rem;"><i class="fas fa-map-marker-alt"></i> {app["location"]}</div>' if app.get('location') else ''}
                        {f'<div style="color: var(--success); font-weight: 600; font-size: 0.78rem;"><i class="fas fa-money-bill-wave"></i> {app["salary"]}</div>' if app.get('salary') else ''}
                        {f'<div style="color: var(--text-muted); font-size: 0.75rem; margin-top: 0.3rem;"><i class="fas fa-calendar-alt"></i> Applied: {app["applied_date"]}</div>' if app.get('applied_date') else ''}
                        {f'<div style="background: rgba(255,255,255,0.03); border-radius: 4px; padding: 4px 6px; margin-top: 0.4rem; color: var(--text-secondary); font-size: 0.75rem;">{app["notes"][:75]}...</div>' if app.get('notes') else ''}
                    </div>
                    """, unsafe_allow_html=True)

                    # Quick stage shift buttons
                    btn_prev, btn_next, btn_del = st.columns([1, 1, 0.7])
                    curr_stage_idx = STAGES.index(stage_name)

                    with btn_prev:
                        if curr_stage_idx > 0:
                            prev_stage = STAGES[curr_stage_idx - 1]
                            if st.button("◀", key=f"prev_{app_id}", help=f"Move back to {prev_stage}", use_container_width=True):
                                update_job_stage(app_id, prev_stage)
                                st.rerun()

                    with btn_next:
                        if curr_stage_idx < len(STAGES) - 1:
                            next_stage = STAGES[curr_stage_idx + 1]
                            if st.button("▶", key=f"next_{app_id}", help=f"Advance to {next_stage}", use_container_width=True):
                                update_job_stage(app_id, next_stage)
                                st.rerun()

                    with btn_del:
                        if st.button("🗑", key=f"del_{app_id}", help="Delete application", use_container_width=True):
                            delete_job_application(app_id)
                            st.rerun()

    # VIEW 2: LIST / TABLE VIEW
    else:
        st.markdown("<br>", unsafe_allow_html=True)
        if applications:
            df = pd.DataFrame(applications)
            display_cols = ["company", "role_title", "stage", "priority", "location", "salary", "applied_date", "deadline", "contact_person"]
            available_cols = [c for c in display_cols if c in df.columns]
            rename_map = {
                "company": "Company",
                "role_title": "Role Title",
                "stage": "Stage",
                "priority": "Priority",
                "location": "Location",
                "salary": "Compensation",
                "applied_date": "Applied Date",
                "deadline": "Next Deadline",
                "contact_person": "Contact"
            }
            df_display = df[available_cols].rename(columns=rename_map)
            st.dataframe(df_display, use_container_width=True, hide_index=True)
        else:
            st.info("No applications match your search or filter.")

    # Export Section
    st.markdown("<br>", unsafe_allow_html=True)
    section_divider("Backup & Data Export")
    if applications:
        export_df = pd.DataFrame(applications)
        csv_data = export_df.to_csv(index=False).encode('utf-8')
        st.download_button(
            label="📥 Export Applications to CSV",
            data=csv_data,
            file_name=f"job_applications_tracker_{datetime.now().strftime('%Y%m%d')}.csv",
            mime="text/csv",
            use_container_width=False
        )
