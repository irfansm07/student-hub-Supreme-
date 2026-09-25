"""
ui_components.py — Smart Resume AI
Clean, reusable UI building blocks.
All visual styling lives in style/style.css.
"""
import streamlit as st


# ──────────────────────────────────────────────
# Styles (no-op — CSS is loaded globally in app.py)
# ──────────────────────────────────────────────
def apply_modern_styles():
    """Styles are loaded from style/style.css in app.py."""
    pass


# ──────────────────────────────────────────────
# Page Header
# ──────────────────────────────────────────────
def page_header(title: str, subtitle: str = None):
    """Consistent page header with optional subtitle."""
    sub_html = f'<p class="header-subtitle">{subtitle}</p>' if subtitle else ""
    st.markdown(
        f"""
        <div class="page-header animate-fade-up">
            <h1 class="header-title">{title}</h1>
            {sub_html}
        </div>
        """,
        unsafe_allow_html=True,
    )


# ──────────────────────────────────────────────
# Hero Section (Home page)
# ──────────────────────────────────────────────
def hero_section(title: str, subtitle: str = None, description: str = None):
    """Large centred hero banner for the home page."""
    if description and not subtitle:
        subtitle, description = description, None

    sub_html  = f'<div class="header-subtitle">{subtitle}</div>'  if subtitle  else ""
    desc_html = f'<p class="header-description">{description}</p>' if description else ""

    st.markdown(
        f"""
        <div class="page-header hero-header animate-fade-up">
            <h1 class="header-title">{title}</h1>
            {sub_html}
            {desc_html}
        </div>
        """,
        unsafe_allow_html=True,
    )


# ──────────────────────────────────────────────
# Feature Card (used in Home feature grid)
# ──────────────────────────────────────────────
def feature_card(icon: str, title: str, description: str):
    """Single feature card. Wrap multiple cards in a .feature-grid div."""
    st.markdown(
        f"""
        <div class="feature-card">
            <div class="feature-icon">
                <i class="{icon}"></i>
            </div>
            <h3>{title}</h3>
            <p>{description}</p>
        </div>
        """,
        unsafe_allow_html=True,
    )


# ──────────────────────────────────────────────
# Stat Card
# ──────────────────────────────────────────────
def stat_card(label: str, value, icon: str = "fas fa-chart-bar", color: str = None):
    """Metric / statistic display card."""
    color_style = f"color: {color};" if color else ""
    st.markdown(
        f"""
        <div class="stat-card">
            <div class="stat-icon" style="{color_style}"><i class="{icon}"></i></div>
            <div class="stat-value" style="{color_style}">{value}</div>
            <div class="stat-label">{label}</div>
        </div>
        """,
        unsafe_allow_html=True,
    )


# ──────────────────────────────────────────────
# Section Divider
# ──────────────────────────────────────────────
def section_divider(label: str = ""):
    """Labelled horizontal rule to break up sections."""
    st.markdown(
        f"""
        <div class="section-divider">
            <span class="divider-label">{label}</span>
        </div>
        """,
        unsafe_allow_html=True,
    )


# ──────────────────────────────────────────────
# Badge / Pill
# ──────────────────────────────────────────────
def badge(text: str, variant: str = "accent") -> str:
    """Return HTML for an inline badge. variant: accent|success|warning|error."""
    return f'<span class="badge badge-{variant}">{text}</span>'


# ──────────────────────────────────────────────
# Upload Hint (empty state)
# ──────────────────────────────────────────────
def upload_hint(message: str = "Upload your resume to get started"):
    """Empty-state placeholder shown before a file is uploaded."""
    st.markdown(
        f"""
        <div class="upload-hint">
            <div class="upload-icon"><i class="fas fa-cloud-upload-alt"></i></div>
            <p>{message}</p>
        </div>
        """,
        unsafe_allow_html=True,
    )


# ──────────────────────────────────────────────
# Score Display
# ──────────────────────────────────────────────
def score_display(score: int, label: str = "Resume Score"):
    """Large centred score circle."""
    # Pick color based on score
    if score >= 80:
        color = "var(--success)"
    elif score >= 60:
        color = "var(--warning)"
    else:
        color = "var(--error)"

    st.markdown(
        f"""
        <div class="score-circle">
            <div class="score-number" style="color:{color};">{score}<span style="font-size:1.5rem;font-weight:400;color:var(--text-muted);">/100</span></div>
            <div class="score-label">{label}</div>
        </div>
        """,
        unsafe_allow_html=True,
    )


# ──────────────────────────────────────────────
# Skill Pills row
# ──────────────────────────────────────────────
def skill_pills(skills: list):
    """Render a row of skill pill badges."""
    pills = "".join(f'<span class="skill-pill">{s}</span>' for s in skills)
    st.markdown(f'<div style="margin-top:0.5rem;">{pills}</div>', unsafe_allow_html=True)


# ──────────────────────────────────────────────
# Role Info Box (Analyzer)
# ──────────────────────────────────────────────
def role_info_box(role_name: str, description: str, required_skills: list):
    """Display job role info card in the analyzer."""
    pills = "".join(f'<span class="skill-pill">{s}</span>' for s in required_skills)
    st.markdown(
        f"""
        <div class="role-info-box">
            <h3>{role_name}</h3>
            <p>{description}</p>
            <div style="margin-top:0.5rem;">{pills}</div>
        </div>
        """,
        unsafe_allow_html=True,
    )


# ──────────────────────────────────────────────
# Step Indicator / Header (Guided Flow)
# ──────────────────────────────────────────────
def step_header(step_num: int, total_steps: int, title: str, subtitle: str = ""):
    """Displays a clean guided step header with progress tag."""
    sub_text = f'<div style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 0.2rem;">{subtitle}</div>' if subtitle else ""
    st.markdown(
        f"""
        <div style="background: var(--bg-card-solid); border: 1px solid var(--border-accent); border-radius: var(--radius-md); padding: 1rem 1.25rem; margin: 1.25rem 0 1.5rem 0;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 0.35rem;">
                <span class="badge badge-accent" style="font-weight: 800; font-size: 0.72rem; letter-spacing: 0.08em;">STEP {step_num} OF {total_steps}</span>
            </div>
            <h3 style="margin: 0; color: var(--text-primary); font-size: 1.2rem; font-weight: 700;">{title}</h3>
            {sub_text}
        </div>
        """,
        unsafe_allow_html=True
    )


# ──────────────────────────────────────────────
# Back to Hub Breadcrumb Button
# ──────────────────────────────────────────────
def back_to_hub_button():
    """Renders a top breadcrumb button to return to the Hub Overview."""
    col_back, _ = st.columns([1, 4])
    with col_back:
        if st.button("← Back to Feature Hub", key="btn_back_to_hub", use_container_width=True):
            st.session_state.page = "home"
            st.rerun()
    st.markdown("<br>", unsafe_allow_html=True)


# ──────────────────────────────────────────────
# Feature Showcase Banner (Home Page)
# ──────────────────────────────────────────────
def feature_showcase_banner(
    icon: str,
    badge_label: str,
    title: str,
    what_it_does: str,
    how_it_helps: str,
    key_tags: list,
    cta_label: str,
    target_page: str,
    key: str
):
    """Renders a full-width crisp showcase banner for a core feature on the Home screen."""
    tags_html = "".join([f'<span class="skill-pill">{t}</span>' for t in key_tags])
    
    col_card, col_action = st.columns([2.5, 1])
    with col_card:
        st.markdown(
            f"""
            <div class="feature-card" style="border-left: 4px solid var(--accent); margin-bottom: 0.75rem; padding: 1.75rem;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 0.5rem;">
                    <div class="feature-icon" style="margin: 0; width: 44px; height: 44px; font-size: 1.25rem;">
                        <i class="{icon}"></i>
                    </div>
                    <div>
                        <span class="badge badge-accent">{badge_label}</span>
                        <h2 style="font-size: 1.35rem; margin: 0.2rem 0 0 0; color: var(--text-primary);">{title}</h2>
                    </div>
                </div>
                
                <div style="margin-top: 1rem; font-size: 0.95rem; line-height: 1.6;">
                    <p style="margin: 0 0 0.5rem 0; color: var(--text-primary);">
                        <strong style="color: var(--accent);">📌 What it does:</strong> {what_it_does}
                    </p>
                    <p style="margin: 0 0 0.8rem 0; color: var(--text-secondary);">
                        <strong style="color: var(--success);">💡 How it helps you:</strong> {how_it_helps}
                    </p>
                </div>
                
                <div style="margin-top: 0.5rem;">{tags_html}</div>
            </div>
            """,
            unsafe_allow_html=True
        )

    with col_action:
        st.markdown(
            """
            <div style="height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: stretch; padding: 1rem 0;">
            """,
            unsafe_allow_html=True
        )
        if st.button(cta_label, key=key, type="primary", use_container_width=True):
            st.session_state.page = target_page
            st.rerun()
        st.markdown("</div>", unsafe_allow_html=True)


# ──────────────────────────────────────────────
# Legacy stubs (kept for compatibility)
# ──────────────────────────────────────────────
def about_section(*args, **kwargs):
    pass

def metric_card(label, value, delta=None, icon=None):
    stat_card(label, value, icon or "fas fa-chart-bar")

def render_analytics_section(*args, **kwargs):
    pass

def render_activity_section(*args, **kwargs):
    pass

def render_suggestions_section(*args, **kwargs):
    pass