"""
Document Summarizer module for Student Hub.
Inspired by allanninal/document-summarizer with fast local extraction and multi-mode summarization.
Supports PDF, TXT, DOCX, and raw text input.
"""

import os
import re
import math
from typing import Dict, List, Tuple, Optional
import pdfplumber
from docx import Document


class DocumentSummarizer:
    def __init__(self):
        self.stop_words = {
            "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are",
            "aren't", "as", "at", "be", "because", "been", "before", "being", "below", "between", "both",
            "but", "by", "can't", "cannot", "could", "couldn't", "did", "didn't", "do", "does", "doesn't",
            "doing", "don't", "down", "during", "each", "few", "for", "from", "further", "had", "hadn't",
            "has", "hasn't", "have", "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here",
            "here's", "hers", "herself", "him", "himself", "his", "how", "how's", "i", "i'd", "i'll",
            "i'm", "i've", "if", "in", "into", "is", "isn't", "it", "it's", "its", "itself", "let's",
            "me", "more", "most", "mustn't", "my", "myself", "no", "nor", "not", "of", "off", "on",
            "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own",
            "same", "shan't", "she", "she'd", "she'll", "she's", "should", "shouldn't", "so", "some",
            "such", "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then",
            "there", "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this",
            "those", "through", "to", "too", "under", "until", "up", "very", "was", "wasn't", "we",
            "we'd", "we'll", "we're", "we've", "were", "weren't", "what", "what's", "when", "when's",
            "where", "where's", "which", "while", "who", "who's", "whom", "why", "why's", "with",
            "won't", "would", "wouldn't", "you", "you'd", "you'll", "you're", "you've", "your", "yours",
            "yourself", "yourselves", "also", "etc", "use", "used", "using"
        }

    def extract_text(self, uploaded_file) -> Tuple[str, str]:
        """
        Extract text from uploaded file (PDF, TXT, DOCX).
        Returns (extracted_text, filename).
        """
        if uploaded_file is None:
            return "", ""

        filename = getattr(uploaded_file, "name", "document.txt")
        ext = filename.split(".")[-1].lower() if "." in filename else "txt"
        text = ""

        try:
            if ext == "pdf":
                with pdfplumber.open(uploaded_file) as pdf:
                    pages_text = []
                    for page in pdf.pages:
                        p_text = page.extract_text()
                        if p_text:
                            pages_text.append(p_text)
                    text = "\n\n".join(pages_text)
            elif ext in ["docx", "doc"]:
                doc = Document(uploaded_file)
                text = "\n".join([p.text for p in doc.paragraphs if p.text.strip()])
            else:
                # Default text decoding
                raw_bytes = uploaded_file.read() if hasattr(uploaded_file, "read") else uploaded_file
                if isinstance(raw_bytes, str):
                    text = raw_bytes
                else:
                    for encoding in ["utf-8", "latin-1", "cp1252"]:
                        try:
                            text = raw_bytes.decode(encoding)
                            break
                        except Exception:
                            continue
        except Exception as e:
            text = f"Error extracting text from file: {str(e)}"

        return text.strip(), filename

    def clean_text(self, text: str) -> str:
        """Clean raw extracted text while keeping sentence structure."""
        text = re.sub(r"\r\n", "\n", text)
        text = re.sub(r"[ \t]+", " ", text)
        text = re.sub(r"\n{3,}", "\n\n", text)
        return text.strip()

    def split_sentences(self, text: str) -> List[str]:
        """Split text into sentences cleanly."""
        # Normalize ellipses and decimals
        temp = re.sub(r"(\d+)\.(\d+)", r"\1<DECIMAL>\2", text)
        temp = re.sub(r"\b(Dr|Mr|Mrs|Ms|Prof|Inc|Ltd|vs|e\.g|i\.e)\.", r"\1<DOT>", temp, flags=re.IGNORECASE)
        # Split on standard punctuation
        raw_sentences = re.split(r"(?<=[.!?])\s+", temp)
        sentences = []
        for s in raw_sentences:
            s_clean = s.replace("<DECIMAL>", ".").replace("<DOT>", ".").strip()
            if len(s_clean) > 20 and not s_clean.startswith("#"):
                sentences.append(s_clean)
        return sentences

    def extract_keywords(self, text: str, top_n: int = 10) -> List[Tuple[str, int]]:
        """Extract top recurring keywords with frequency."""
        words = re.findall(r"\b[a-zA-Z]{3,}\b", text.lower())
        filtered = [w for w in words if w not in self.stop_words]
        counts: Dict[str, int] = {}
        for w in filtered:
            counts[w] = counts.get(w, 0) + 1
        sorted_kw = sorted(counts.items(), key=lambda x: x[1], reverse=True)
        return sorted_kw[:top_n]

    def summarize_extractive(self, text: str, ratio: float = 0.25, min_sentences: int = 3, max_sentences: int = 12) -> List[str]:
        """
        Fast graph/TF-IDF based extractive summarizer.
        Computes sentence importance based on keyword density, position, and title likeness.
        """
        sentences = self.split_sentences(text)
        if not sentences:
            return [text[:300] + "..." if len(text) > 300 else text]

        if len(sentences) <= min_sentences:
            return sentences

        # Compute word frequencies
        words = re.findall(r"\b[a-zA-Z]{3,}\b", text.lower())
        word_freq: Dict[str, int] = {}
        for w in words:
            if w not in self.stop_words:
                word_freq[w] = word_freq.get(w, 0) + 1

        max_freq = max(word_freq.values()) if word_freq else 1
        for w in word_freq:
            word_freq[w] = word_freq[w] / max_freq

        # Score sentences
        scores: Dict[int, float] = {}
        total_s = len(sentences)

        for i, s in enumerate(sentences):
            s_words = re.findall(r"\b[a-zA-Z]{3,}\b", s.lower())
            if not s_words:
                continue
            
            # Word weight
            w_score = sum(word_freq.get(w, 0) for w in s_words) / (len(s_words) ** 0.5)

            # Position weight: first 15% and last 10% are often informative
            pos_weight = 1.0
            if i < total_s * 0.15:
                pos_weight = 1.35
            elif i > total_s * 0.85:
                pos_weight = 1.15

            # Quotation or structural cues
            cue_weight = 1.0
            if any(cue in s.lower() for cue in ["in conclusion", "furthermore", "importantly", "in summary", "we found", "results show", "key", "main"]):
                cue_weight = 1.25

            scores[i] = w_score * pos_weight * cue_weight

        # Decide sentence count
        target_count = int(total_s * ratio)
        target_count = max(min_sentences, min(target_count, max_sentences))

        # Select top scoring indices preserving original document chronological order
        top_indices = sorted(sorted(scores.keys(), key=lambda idx: scores[idx], reverse=True)[:target_count])
        selected_sentences = [sentences[idx] for idx in top_indices]
        return selected_sentences

    def generate_summary(
        self,
        text: str,
        mode: str = "executive",
        length: str = "medium",
        api_key: Optional[str] = None
    ) -> Dict:
        """
        Generate summary with multiple student-oriented modes:
        - executive: Concise high-level overview
        - bullet_points: Key takeaways & actionable points
        - study_notes: Concepts, definitions, and flashcards
        - comprehensive: In-depth synthesis
        """
        cleaned = self.clean_text(text)
        total_words = len(re.findall(r"\b\w+\b", cleaned))

        if total_words < 20:
            return {
                "summary": "Document text is too brief to summarize (less than 20 words).",
                "bullets": [],
                "study_notes": [],
                "keywords": [],
                "stats": {
                    "original_words": total_words,
                    "summary_words": total_words,
                    "compression_pct": 0,
                    "read_time_saved_min": 0
                }
            }

        # Determine ratio based on length selection
        ratio_map = {
            "short": 0.15,
            "medium": 0.28,
            "detailed": 0.45
        }
        ratio = ratio_map.get(length.lower(), 0.28)

        # Try Gemini AI if API key is provided
        ai_summary = None
        if api_key or os.getenv("GOOGLE_API_KEY"):
            try:
                import google.generativeai as genai
                key_to_use = api_key or os.getenv("GOOGLE_API_KEY")
                genai.configure(api_key=key_to_use)
                model = genai.GenerativeModel("gemini-1.5-flash")

                prompt = f"""
                You are an academic expert and student assistant. Summarize the following document for a student.
                Mode requested: {mode}
                Target Length: {length}

                Format your response clearly:
                1. EXECUTIVE SUMMARY: A well-written overview.
                2. KEY TAKEAWAYS: 4 to 8 crisp bullet points.
                3. STUDY CONCEPTS & FLASHCARDS: 3 to 5 key definitions or Q&A concepts.

                Document text:
                {cleaned[:12000]}
                """
                response = model.generate_content(prompt)
                if response and response.text:
                    ai_summary = response.text.strip()
            except Exception:
                ai_summary = None

        # Fallback / Local high-speed NLP generation
        selected_sentences = self.summarize_extractive(cleaned, ratio=ratio)
        executive_text = " ".join(selected_sentences)

        # Build clean bullet points
        bullets = [f"• {s}" for s in selected_sentences[:8]]

        # Build study notes / concept highlights
        keywords = self.extract_keywords(cleaned, top_n=10)
        study_notes = []
        for kw, count in keywords[:5]:
            # Find a sentence mentioning this keyword
            matching = [s for s in selected_sentences if kw.lower() in s.lower()]
            context = matching[0] if matching else f"Key subject appearing {count} times across the text."
            study_notes.append({
                "concept": kw.capitalize(),
                "frequency": count,
                "context": context
            })

        summary_out = ai_summary if ai_summary else executive_text
        summary_words = len(re.findall(r"\b\w+\b", summary_out))
        compression = round((1 - (summary_words / max(total_words, 1))) * 100, 1)
        if compression < 0:
            compression = 0
        read_time_saved = round((total_words - summary_words) / 200, 1)  # 200 wpm standard reading speed

        return {
            "summary": summary_out,
            "bullets": bullets,
            "study_notes": study_notes,
            "keywords": [kw for kw, _ in keywords],
            "stats": {
                "original_words": total_words,
                "summary_words": summary_words,
                "compression_pct": compression,
                "read_time_saved_min": max(0, read_time_saved)
            }
        }
