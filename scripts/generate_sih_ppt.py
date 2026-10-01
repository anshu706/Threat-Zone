"""Generate SIH 2025 Idea Presentation (6 slides) for Threat Zone."""

from pathlib import Path

from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.util import Inches, Pt

# SIH-style palette
SIH_ORANGE = RGBColor(0xF5, 0x7C, 0x00)
SIH_NAVY = RGBColor(0x1A, 0x23, 0x7E)
SIH_DARK = RGBColor(0x21, 0x21, 0x21)
SIH_GRAY = RGBColor(0x55, 0x55, 0x55)
WHITE = RGBColor(0xFF, 0xFF, 0xFF)
ACCENT = RGBColor(0x02, 0x84, 0xC7)

OUTPUT = Path(__file__).resolve().parents[1] / "Threat_Zone_SIH2025_Presentation.pptx"

TEAM = {
    "ps_id": "[Problem Statement ID]",
    "ps_title": "[Problem Statement Title]",
    "theme": "[Theme — e.g. Clean & Green Technology / Disaster Management]",
    "category": "Software",
    "team_id": "[Team ID]",
    "team_name": "[Your Team Name]",
}


def set_slide_bg(slide, rgb: RGBColor):
    fill = slide.background.fill
    fill.solid()
    fill.fore_color.rgb = rgb


def add_header_bar(slide, title: str, subtitle: str = ""):
    bar = slide.shapes.add_shape(1, Inches(0), Inches(0), Inches(10), Inches(1.05))
    bar.fill.solid()
    bar.fill.fore_color.rgb = SIH_NAVY
    bar.line.fill.background()

    tb = slide.shapes.add_textbox(Inches(0.45), Inches(0.15), Inches(9.1), Inches(0.55))
    tf = tb.text_frame
    tf.text = title
    p = tf.paragraphs[0]
    p.font.size = Pt(22)
    p.font.bold = True
    p.font.color.rgb = WHITE

    if subtitle:
        sb = slide.shapes.add_textbox(Inches(0.45), Inches(0.62), Inches(9.1), Inches(0.35))
        sf = sb.text_frame
        sf.text = subtitle
        sp = sf.paragraphs[0]
        sp.font.size = Pt(11)
        sp.font.color.rgb = RGBColor(0xBB, 0xDE, 0xFB)


def add_bullets(slide, items: list[str], top=1.35, left=0.55, width=8.9, height=5.5, size=16):
    box = slide.shapes.add_textbox(Inches(left), Inches(top), Inches(width), Inches(height))
    tf = box.text_frame
    tf.word_wrap = True
    tf.vertical_anchor = MSO_ANCHOR.TOP

    for i, item in enumerate(items):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.text = item
        p.level = 0
        p.font.size = Pt(size)
        p.font.color.rgb = SIH_DARK
        p.space_after = Pt(10)


def add_footer(slide, text: str):
    fb = slide.shapes.add_textbox(Inches(0.45), Inches(6.85), Inches(9.1), Inches(0.35))
    fp = fb.text_frame.paragraphs[0]
    fp.text = text
    fp.font.size = Pt(9)
    fp.font.color.rgb = SIH_GRAY
    fp.alignment = PP_ALIGN.RIGHT


def slide_title(prs: Presentation):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_bg(slide, WHITE)

    # Top band
    band = slide.shapes.add_shape(1, Inches(0), Inches(0), Inches(10), Inches(1.8))
    band.fill.solid()
    band.fill.fore_color.rgb = SIH_ORANGE
    band.line.fill.background()

    title = slide.shapes.add_textbox(Inches(0.5), Inches(0.25), Inches(9), Inches(0.7))
    tp = title.text_frame.paragraphs[0]
    tp.text = "SMART INDIA HACKATHON 2025"
    tp.font.size = Pt(28)
    tp.font.bold = True
    tp.font.color.rgb = WHITE
    tp.alignment = PP_ALIGN.CENTER

    sub = slide.shapes.add_textbox(Inches(0.5), Inches(0.95), Inches(9), Inches(0.5))
    sp = sub.text_frame.paragraphs[0]
    sp.text = "Idea Submission Presentation"
    sp.font.size = Pt(14)
    sp.font.color.rgb = WHITE
    sp.alignment = PP_ALIGN.CENTER

    details = [
        f"Problem Statement ID: {TEAM['ps_id']}",
        f"Problem Statement Title: {TEAM['ps_title']}",
        f"Theme: {TEAM['theme']}",
        f"PS Category: {TEAM['category']}",
        f"Team ID: {TEAM['team_id']}",
        f"Team Name: {TEAM['team_name']}",
        "",
        "Project: Threat Zone",
        "Tagline: Model blast and fire risk at Indian refineries",
    ]
    add_bullets(slide, details, top=2.15, size=17)

    badge = slide.shapes.add_shape(1, Inches(3.2), Inches(5.85), Inches(3.6), Inches(0.55))
    badge.fill.solid()
    badge.fill.fore_color.rgb = SIH_NAVY
    badge.line.fill.background()
    bt = badge.text_frame
    bt.text = "VCE & BLEVE Hazard Visualizer"
    bp = bt.paragraphs[0]
    bp.font.size = Pt(13)
    bp.font.bold = True
    bp.font.color.rgb = WHITE
    bp.alignment = PP_ALIGN.CENTER


def slide_proposed_solution(prs: Presentation):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_bg(slide, WHITE)
    add_header_bar(
        slide,
        "Proposed Solution",
        "Describe your Idea / Solution / Prototype",
    )
    add_bullets(
        slide,
        [
            "Idea Title: Threat Zone — Interactive Industrial Safety Platform",
            "",
            "• Web-based tool to model VCE (Vapor Cloud Explosion) and BLEVE (Boiling Liquid Expanding Vapor Explosion) hazards",
            "• Live satellite map with physics-based hazard zone rings at 10 major Indian oil, gas & petrochemical sites",
            "• Instant recalculation of TNT equivalent, overpressure, thermal flux & safe evacuation distance",
            "",
            "How it addresses the problem:",
            "• Replaces complex spreadsheet/manual consequence analysis with an interactive visual tool",
            "• Helps HSE teams, operators & emergency responders see blast/fire impact zones in seconds",
            "• Plain-language safety guidance for evacuation, PPE & structural vulnerability",
            "",
            "Innovation & uniqueness:",
            "• India-specific facility presets (Jamnagar, Mumbai, Kochi, etc.) with live weather & workforce context",
            "• Client-side physics engine — no backend dependency, works in control rooms & field tablets",
            "• Distance-decay charts + environmental sensitivity comparison in one dashboard",
        ],
    )
    add_footer(slide, f"@SIH Idea submission — Template 2 | {TEAM['team_name']}")


def slide_technical_approach(prs: Presentation):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_bg(slide, WHITE)
    add_header_bar(slide, "Technical Approach", "Technologies, frameworks & methodology")
    add_bullets(
        slide,
        [
            "Tech Stack (Frontend-only SPA):",
            "• React 19 + TypeScript + Vite 8",
            "• Leaflet / react-leaflet — satellite GIS map & hazard zone overlays",
            "• Recharts — overpressure & thermal distance-decay graphs",
            "• GSAP — UI animations; Custom CSS design system",
            "",
            "Core Modules:",
            "• physics.ts — VCE blast (TNT equivalent, overpressure zones Z1–Z4)",
            "• physics.ts — BLEVE fireball (thermal radiation, flash fraction)",
            "• regions.ts — 10 Indian refinery/petrochemical facility coordinates",
            "",
            "Methodology / Flow:",
            "1. User selects facility + scenario (liquid trapping, BLEVE, etc.)",
            "2. Adjusts pressure, temperature, volume, ambient conditions",
            "3. Physics engine computes hazard radii in real time",
            "4. Map renders blast/thermal rings; charts & advisories update instantly",
            "",
            "Architecture: Browser → React UI → Client Physics Engine → Map + Charts (No server/DB)",
        ],
        size=15,
    )
    add_footer(slide, f"@SIH Idea submission — Template 3 | {TEAM['team_name']}")


def slide_feasibility(prs: Presentation):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_bg(slide, WHITE)
    add_header_bar(slide, "Feasibility and Viability", "Analysis, risks & mitigation")
    add_bullets(
        slide,
        [
            "Feasibility:",
            "• Built entirely with open-source stack (React, Leaflet, Recharts)",
            "• Runs on any modern browser — no special hardware required",
            "• Prototype already functional with live map, simulator & analytics sections",
            "• Scalable to add more facilities, API weather feeds & ERP integration",
            "",
            "Potential challenges & risks:",
            "• Physics models are simplified — not a substitute for full PHA/HAZOP studies",
            "• Map tiles require internet connectivity for satellite imagery",
            "• Regulatory acceptance needs validation against industry standards (e.g. TNO Yellow Book)",
            "",
            "Mitigation strategies:",
            "• Clear disclaimer: planning & training tool only",
            "• Calibrate models against published consequence analysis benchmarks",
            "• Offline tile caching & export to PDF for incident reports",
            "• Partner with process safety teams at target refineries for field validation",
        ],
        size=15,
    )
    add_footer(slide, f"@SIH Idea submission — Template 4 | {TEAM['team_name']}")


def slide_impact(prs: Presentation):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_bg(slide, WHITE)
    add_header_bar(slide, "Impact and Benefits", "Target audience & outcomes")
    add_bullets(
        slide,
        [
            "Target audience:",
            "• Process Safety Engineers & HSE Managers at Indian refineries",
            "• Plant Operations Teams & Emergency First Responders",
            "• Industrial safety trainees & academic institutions",
            "",
            "Benefits:",
            "• Faster hazard zone visualization during drills & what-if analysis",
            "• Improved emergency preparedness with clear evacuation radius guidance",
            "• Reduced dependency on expensive desktop consequence modeling software",
            "• Better communication between technical teams and non-technical stakeholders",
            "",
            "Social / economic / environmental impact:",
            "• Supports safer operations at high-risk hydrocarbon facilities across India",
            "• Potential reduction in incident severity through better preparedness",
            "• Aligns with Make in India & Atmanirbhar Bharat — indigenous safety tooling",
            "• Contributes to SDG 9 (Industry & Infrastructure) & SDG 11 (Safe cities/communities)",
        ],
        size=15,
    )
    add_footer(slide, f"@SIH Idea submission — Template 5 | {TEAM['team_name']}")


def slide_references(prs: Presentation):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_bg(slide, WHITE)
    add_header_bar(slide, "Research and References", "Sources & related work")
    add_bullets(
        slide,
        [
            "Reference standards & literature:",
            "• TNO Green Book / Yellow Book — Methods for determination of possible damage (CPR 14E)",
            "• CCPS — Guidelines for Vapor Cloud Explosion, Pressure Vessel Burst, BLEVE & Flash Fire",
            "• API 752 / API 753 — Management of hazards associated with location of process plant buildings",
            "• OSHA PSM & Indian OISD standards for oil & gas installations",
            "",
            "Technical references:",
            "• Baker-Strehlow-Tang VCE overpressure correlation",
            "• BLEVE fireball diameter & surface emissive power models (CCPS / TNO)",
            "• Leaflet.js documentation — https://leafletjs.com",
            "• React + Vite documentation — https://react.dev",
            "",
            "Similar solutions studied:",
            "• PHAST / SAFETI (commercial consequence analysis)",
            "• ALOHA (EPA hazard modeling — limited VCE/BLEVE for refineries)",
            "• Gap: No India-focused, browser-based, interactive VCE/BLEVE visualizer for operators",
        ],
        size=14,
    )
    add_footer(slide, f"@SIH Idea submission — Template 6 | {TEAM['team_name']}")


def main():
    prs = Presentation()
    prs.slide_width = Inches(10)
    prs.slide_height = Inches(7.5)

    slide_title(prs)
    slide_proposed_solution(prs)
    slide_technical_approach(prs)
    slide_feasibility(prs)
    slide_impact(prs)
    slide_references(prs)

    prs.save(str(OUTPUT))
    print(f"Saved: {OUTPUT}")


if __name__ == "__main__":
    main()
