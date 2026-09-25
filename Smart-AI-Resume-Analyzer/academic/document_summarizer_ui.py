"""
Document Summarizer UI for Student Hub.
Provides document upload (PDF, TXT, DOCX), text pasting, customizable summary modes,
interactive analytics, and export options.
"""

import streamlit as st
import io
from utils.document_summarizer import DocumentSummarizer
from ui_components import page_header, stat_card, section_divider, badge, step_header, back_to_hub_button

def render_document_summarizer():
    """Render the Document & Notes Summarizer interface."""
    back_to_hub_button()

    page_header(
        "📑 AI Document & Notes Summarizer",
        "A guided, 3-step tool to turn lengthy study materials into crisp, actionable notes."
    )

    summarizer = DocumentSummarizer()

    # ── STEP 1: UPLOAD OR PASTE MATERIAL ──
    step_header(1, 3, "Input Your Study Document", "Upload a PDF, Word doc, or paste your lecture notes and textbook text below.")

    input_tab1, input_tab2 = st.tabs(["📁 Upload Document (PDF / DOCX / TXT)", "✍️ Paste Text / Notes"])
    
    document_text = ""
    source_name = "Pasted Text"

    with input_tab1:
        uploaded_file = st.file_uploader(
            "Choose a document to summarize",
            type=["pdf", "txt", "docx", "doc"],
            help="Supports PDFs, Word docs, and plain text notes",
            key="doc_summarizer_uploader"
        )
        if uploaded_file is not None:
            source_name = uploaded_file.name
            with st.spinner("Reading and extracting document content..."):
                document_text, _ = summarizer.extract_text(uploaded_file)
                if document_text:
                    st.success(f"Extracted {len(document_text.split())} words from **{source_name}**")
                else:
                    st.error("Could not extract readable text from this file. Ensure it is not an empty or password-protected scan.")

    with input_tab2:
        pasted_input = st.text_area(
            "Paste your notes, essay, or article text here:",
            height=160,
            placeholder="Paste raw text, study guides, articles, or lecture transcripts here...",
            key="doc_summarizer_pasted"
        )
        if pasted_input.strip() and not document_text:
            document_text = pasted_input.strip()
            source_name = "Pasted Notes"

    # ── STEP 2: CHOOSE SUMMARY PREFERENCES ──
    st.markdown("<br>", unsafe_allow_html=True)
    step_header(2, 3, "Choose Your Summary Format", "Select the type of summary you need for your study session.")

    col1, col2 = st.columns(2)
    with col1:
        summary_mode = st.selectbox(
            "What kind of output do you need?",
            [
                "Executive Overview (Concise high-level summary)",
                "Key Bullet Points (Crisp takeaways for quick review)",
                "Study Notes & Flashcards (Core concepts & definitions)",
                "Comprehensive Synthesis (Detailed complete study notes)"
            ],
            index=0
        )
    with col2:
        summary_length = st.selectbox(
            "Target Length",
            ["Short (Quick TL;DR)", "Medium (Standard)", "Detailed (In-depth review)"],
            index=1
        )

    with st.expander("⚙️ Advanced AI Key (Optional)", expanded=False):
        custom_api_key = st.text_input(
            "Google Gemini API Key",
            type="password",
            placeholder="Leave blank to use fast built-in local NLP engine",
            help="Optional: Enter your API key if you want Gemini generative rewriting."
        )

    # Action Button
    st.markdown("<br>", unsafe_allow_html=True)
    col_btn, _ = st.columns([1.2, 2])
    with col_btn:
        generate_clicked = st.button("🚀 Step 3: Generate Summary", type="primary", use_container_width=True)

    if generate_clicked:
        if not document_text.strip():
            st.warning("⚠️ Please upload a document or paste some text in Step 1 first.")
            return

        mode_key = "executive"
        if "Bullet" in summary_mode:
            mode_key = "bullet_points"
        elif "Study" in summary_mode:
            mode_key = "study_notes"
        elif "Comprehensive" in summary_mode:
            mode_key = "comprehensive"

        len_key = "medium"
        if "Short" in summary_length:
            len_key = "short"
        elif "Detailed" in summary_length:
            len_key = "detailed"

        with st.spinner("Processing document and generating structured notes..."):
            result = summarizer.generate_summary(
                text=document_text,
                mode=mode_key,
                length=len_key,
                api_key=custom_api_key.strip() if custom_api_key else None
            )

            st.session_state["latest_summary_result"] = result
            st.session_state["latest_summary_source"] = source_name

    # ── STEP 3: DISPLAY RESULTS ──
    if "latest_summary_result" in st.session_state:
        result = st.session_state["latest_summary_result"]
        source = st.session_state.get("latest_summary_source", "Document")
        stats = result.get("stats", {})

        st.markdown("<br>", unsafe_allow_html=True)
        step_header(3, 3, "Your Structured Study Summary", f"Generated from {source}. Review, copy, or download below.")

        # Metrics bar
        m1, m2, m3, m4 = st.columns(4)
        with m1:
            stat_card("Original Words", stats.get("original_words", 0), icon="fas fa-file-alt")
        with m2:
            stat_card("Summary Words", stats.get("summary_words", 0), icon="fas fa-compress-arrows-alt")
        with m3:
            stat_card("Compression", f"{stats.get('compression_pct', 0)}%", icon="fas fa-chart-pie", color="var(--accent)")
        with m4:
            stat_card("Time Saved", f"~{stats.get('read_time_saved_min', 0)} min", icon="fas fa-clock", color="var(--success)")

        st.markdown("<br>", unsafe_allow_html=True)


        # Tabs for different views of the output
        view_tab1, view_tab2, view_tab3 = st.tabs(["📝 Formatted Summary", "💡 Key Takeaways", "🎓 Study Flashcards & Terms"])

        with view_tab1:
            st.markdown(f"### Summary of *{source}*")
            st.markdown(f"""
            <div class="report-card" style="font-size: 1.05rem; line-height: 1.8;">
                {result.get('summary', '')}
            </div>
            """, unsafe_allow_html=True)

        with view_tab2:
            st.markdown("### 📌 Bullet-Point Takeaways")
            bullets = result.get("bullets", [])
            if bullets:
                for b in bullets:
                    st.markdown(f"""
                    <div class="role-info-box" style="margin: 0.5rem 0; padding: 0.85rem 1.2rem;">
                        <span style="color: var(--text-primary); font-size: 0.95rem;">{b}</span>
                    </div>
                    """, unsafe_allow_html=True)
            else:
                st.info("No separate bullet points available for this selection.")

        with view_tab3:
            st.markdown("### 🎓 Core Concepts & Study Flashcards")
            notes = result.get("study_notes", [])
            if notes:
                for item in notes:
                    concept = item.get("concept", "")
                    freq = item.get("frequency", 0)
                    ctx = item.get("context", "")
                    st.markdown(f"""
                    <div class="report-card" style="margin-bottom: 0.75rem; border-left: 3px solid var(--accent);">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 0.4rem;">
                            <strong style="color: var(--accent); font-size: 1.1rem;">{concept}</strong>
                            <span class="badge badge-accent">Mentioned {freq}x</span>
                        </div>
                        <p style="margin:0; color: var(--text-secondary); font-size: 0.9rem;">{ctx}</p>
                    </div>
                    """, unsafe_allow_html=True)
            else:
                st.info("No study notes extracted.")

        # Keywords tags
        keywords = result.get("keywords", [])
        if keywords:
            st.markdown("<br>", unsafe_allow_html=True)
            st.markdown("##### 🏷️ Key Topics & Vocabulary")
            pills_html = "".join([f'<span class="skill-pill">{k}</span>' for k in keywords])
            st.markdown(f'<div style="margin-bottom: 1rem;">{pills_html}</div>', unsafe_allow_html=True)

        # Download / Export Section
        st.markdown("<br>", unsafe_allow_html=True)
        col_down1, col_down2 = st.columns([1, 1])

        export_content = f"""SUMMARY OF {source.upper()}
Generated by Student Hub Document Summarizer
--------------------------------------------------
ORIGINAL WORD COUNT: {stats.get('original_words', 0)}
SUMMARY WORD COUNT:  {stats.get('summary_words', 0)}
COMPRESSION:         {stats.get('compression_pct', 0)}%
READING TIME SAVED:  ~{stats.get('read_time_saved_min', 0)} min

SUMMARY:
{result.get('summary', '')}

KEY TAKEAWAYS:
{chr(10).join(result.get('bullets', []))}

KEY TOPICS:
{', '.join(keywords)}
"""
        with col_down1:
            st.download_button(
                label="📥 Download Summary (.TXT)",
                data=export_content,
                file_name=f"summary_{source.replace(' ', '_')}.txt",
                mime="text/plain",
                use_container_width=True
            )

        with col_down2:
            st.download_button(
                label="📥 Download Summary (.MD Markdown)",
                data=f"# Summary of {source}\n\n" + export_content,
                file_name=f"summary_{source.replace(' ', '_')}.md",
                mime="text/markdown",
                use_container_width=True
            )
