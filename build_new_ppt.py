import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

# Theme Colors
BG_COLOR = RGBColor(15, 23, 42)        # Slate 900
CARD_COLOR = RGBColor(30, 41, 59)      # Slate 800
BORDER_COLOR = RGBColor(71, 85, 105)    # Slate 600
CYAN_ACCENT = RGBColor(6, 182, 212)     # Cyber Cyan
GREEN_ACCENT = RGBColor(16, 185, 129)   # Emerald Green
TEXT_MAIN = RGBColor(241, 245, 249)     # Off-white
TEXT_MUTED = RGBColor(148, 163, 184)    # Cool Gray

def set_slide_background(slide):
    background = slide.background
    fill = background.fill
    fill.solid()
    fill.fore_color.rgb = BG_COLOR

def create_header(slide, title_text, section_text=None):
    # Section indicator (small text above header)
    if section_text:
        txBox = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.7), Inches(0.4))
        tf = txBox.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
        p = tf.paragraphs[0]
        p.text = section_text.upper()
        p.font.name = "Orbitron"
        p.font.size = Pt(10)
        p.font.bold = True
        p.font.color.rgb = GREEN_ACCENT
        p.font.letter_spacing = Pt(2)
        
    # Main Header Title
    txBox2 = slide.shapes.add_textbox(Inches(0.8), Inches(0.7), Inches(11.7), Inches(0.8))
    tf2 = txBox2.text_frame
    tf2.word_wrap = True
    tf2.margin_left = tf2.margin_right = tf2.margin_top = tf2.margin_bottom = 0
    p2 = tf2.paragraphs[0]
    p2.text = title_text
    p2.font.name = "Orbitron"
    p2.font.size = Pt(24)
    p2.font.bold = True
    p2.font.color.rgb = CYAN_ACCENT

def add_title_slide(prs, title, subtitle):
    # Blank slide layout
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_background(slide)
    
    # Outer decorative frame
    frame = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.5), Inches(0.5), Inches(12.333), Inches(6.5))
    frame.fill.background()
    frame.line.color.rgb = BORDER_COLOR
    frame.line.width = Pt(1.5)
    
    # Text container shape
    box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.5), Inches(1.5), Inches(10.333), Inches(4.5))
    box.fill.solid()
    box.fill.fore_color.rgb = CARD_COLOR
    box.line.color.rgb = CYAN_ACCENT
    box.line.width = Pt(2)
    
    # Title Text
    txBox = slide.shapes.add_textbox(Inches(2.0), Inches(2.2), Inches(9.333), Inches(1.5))
    tf = txBox.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    p.text = title
    p.font.name = "Orbitron"
    p.font.size = Pt(36)
    p.font.bold = True
    p.font.color.rgb = CYAN_ACCENT
    
    # Divider line
    divider = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(4.5), Inches(3.8), Inches(4.333), Inches(0.04))
    divider.fill.solid()
    divider.fill.fore_color.rgb = GREEN_ACCENT
    divider.line.fill.background()
    
    # Subtitle Text
    txBox2 = slide.shapes.add_textbox(Inches(2.0), Inches(4.2), Inches(9.333), Inches(1.2))
    tf2 = txBox2.text_frame
    tf2.word_wrap = True
    p2 = tf2.paragraphs[0]
    p2.alignment = PP_ALIGN.CENTER
    p2.text = subtitle
    p2.font.name = "Space Grotesk"
    p2.font.size = Pt(16)
    p2.font.color.rgb = TEXT_MAIN

def add_section_divider(prs, section_num, section_title, desc):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_background(slide)
    
    # Left accent block
    block = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(2.2), Inches(0.15), Inches(3.1))
    block.fill.solid()
    block.fill.fore_color.rgb = CYAN_ACCENT
    block.line.fill.background()
    
    # Text container
    txBox = slide.shapes.add_textbox(Inches(1.2), Inches(2.0), Inches(11.0), Inches(3.5))
    tf = txBox.text_frame
    tf.word_wrap = True
    
    p1 = tf.paragraphs[0]
    p1.text = f"SECTION {section_num:02d}"
    p1.font.name = "Orbitron"
    p1.font.size = Pt(14)
    p1.font.bold = True
    p1.font.color.rgb = GREEN_ACCENT
    p1.font.letter_spacing = Pt(3)
    
    p2 = tf.add_paragraph()
    p2.text = section_title
    p2.font.name = "Orbitron"
    p2.font.size = Pt(40)
    p2.font.bold = True
    p2.font.color.rgb = CYAN_ACCENT
    p2.space_before = Pt(10)
    
    p3 = tf.add_paragraph()
    p3.text = desc
    p3.font.name = "Space Grotesk"
    p3.font.size = Pt(16)
    p3.font.color.rgb = TEXT_MUTED
    p3.space_before = Pt(20)

def add_two_column_slide(prs, section, title, left_text, right_bullets_title, right_bullets):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_background(slide)
    create_header(slide, title, section)
    
    # Left Column Text Box
    left_box = slide.shapes.add_textbox(Inches(0.8), Inches(1.8), Inches(5.6), Inches(4.8))
    tf_l = left_box.text_frame
    tf_l.word_wrap = True
    
    p_l = tf_l.paragraphs[0]
    p_l.text = left_text
    p_l.font.name = "Space Grotesk"
    p_l.font.size = Pt(15)
    p_l.font.color.rgb = TEXT_MAIN
    p_l.line_spacing = 1.3
    
    # Right Column Card Wrapper
    card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.8), Inches(5.7), Inches(4.8))
    card.fill.solid()
    card.fill.fore_color.rgb = CARD_COLOR
    card.line.color.rgb = BORDER_COLOR
    card.line.width = Pt(1)
    
    # Right Column Text
    right_box = slide.shapes.add_textbox(Inches(7.1), Inches(2.0), Inches(5.1), Inches(4.4))
    tf_r = right_box.text_frame
    tf_r.word_wrap = True
    
    p_r_title = tf_r.paragraphs[0]
    p_r_title.text = right_bullets_title
    p_r_title.font.name = "Orbitron"
    p_r_title.font.size = Pt(16)
    p_r_title.font.bold = True
    p_r_title.font.color.rgb = CYAN_ACCENT
    p_r_title.space_after = Pt(15)
    
    for bullet in right_bullets:
        p_b = tf_r.add_paragraph()
        p_b.text = "•  " + bullet
        p_b.font.name = "Space Grotesk"
        p_b.font.size = Pt(13)
        p_b.font.color.rgb = TEXT_MAIN
        p_b.space_after = Pt(12)
        p_b.line_spacing = 1.2

def add_grid_slide(prs, section, title, items):
    # items should be list of dict: [{'title': x, 'desc': y, 'accent': True/False}]
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_background(slide)
    create_header(slide, title, section)
    
    # Grid parameters (2x2)
    lefts = [Inches(0.8), Inches(6.8)]
    tops = [Inches(1.8), Inches(4.4)]
    width = Inches(5.733)
    height = Inches(2.3)
    
    for i, item in enumerate(items[:4]):
        col = i % 2
        row = i // 2
        
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, lefts[col], tops[row], width, height)
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_COLOR
        card.line.color.rgb = CYAN_ACCENT if item.get('accent') else BORDER_COLOR
        card.line.width = Pt(1.5 if item.get('accent') else 1)
        
        txBox = slide.shapes.add_textbox(lefts[col] + Inches(0.3), tops[row] + Inches(0.2), width - Inches(0.6), height - Inches(0.4))
        tf = txBox.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
        
        p = tf.paragraphs[0]
        p.text = item['title']
        p.font.name = "Orbitron"
        p.font.size = Pt(15)
        p.font.bold = True
        p.font.color.rgb = CYAN_ACCENT
        p.space_after = Pt(8)
        
        p2 = tf.add_paragraph()
        p2.text = item['desc']
        p2.font.name = "Space Grotesk"
        p2.font.size = Pt(12)
        p2.font.color.rgb = TEXT_MAIN
        p2.line_spacing = 1.2

def add_timeline_slide(prs, section, title, steps):
    # steps is list of dict: [{'num': '01', 'title': x, 'desc': y}]
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_background(slide)
    create_header(slide, title, section)
    
    # Horizontal connection line
    line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(1.5), Inches(3.2), Inches(10.333), Inches(0.04))
    line.fill.solid()
    line.fill.fore_color.rgb = BORDER_COLOR
    line.line.fill.background()
    
    # Step card placements
    step_width = Inches(2.6)
    left_positions = [Inches(0.8), Inches(3.8), Inches(6.8), Inches(9.8)]
    
    for i, step in enumerate(steps[:4]):
        # Circle on the line
        circle = slide.shapes.add_shape(MSO_SHAPE.OVAL, left_positions[i] + Inches(1.05), Inches(2.9), Inches(0.6), Inches(0.6))
        circle.fill.solid()
        circle.fill.fore_color.rgb = BG_COLOR
        circle.line.color.rgb = CYAN_ACCENT
        circle.line.width = Pt(2)
        
        # Circle text
        tf_c = circle.text_frame
        p_c = tf_c.paragraphs[0]
        p_c.alignment = PP_ALIGN.CENTER
        p_c.text = step['num']
        p_c.font.name = "Orbitron"
        p_c.font.size = Pt(12)
        p_c.font.bold = True
        p_c.font.color.rgb = CYAN_ACCENT
        
        # Details card below
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left_positions[i], Inches(3.8), step_width, Inches(2.8))
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_COLOR
        card.line.color.rgb = BORDER_COLOR
        card.line.width = Pt(1)
        
        txBox = slide.shapes.add_textbox(left_positions[i] + Inches(0.2), Inches(4.0), step_width - Inches(0.4), Inches(2.4))
        tf = txBox.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
        
        p = tf.paragraphs[0]
        p.text = step['title']
        p.font.name = "Orbitron"
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = GREEN_ACCENT
        p.space_after = Pt(8)
        p.alignment = PP_ALIGN.CENTER
        
        p2 = tf.add_paragraph()
        p2.text = step['desc']
        p2.font.name = "Space Grotesk"
        p2.font.size = Pt(11)
        p2.font.color.rgb = TEXT_MAIN
        p2.line_spacing = 1.2
        p2.alignment = PP_ALIGN.CENTER

def add_diagram_slide(prs, section, title, blocks):
    # blocks: list of dict [{'name': x, 'desc': y}]
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_background(slide)
    create_header(slide, title, section)
    
    # 4 blocks arranged horizontally with connecting arrow labels
    block_width = Inches(2.4)
    left_positions = [Inches(0.8), Inches(3.8), Inches(6.8), Inches(9.8)]
    
    for i, block in enumerate(blocks[:4]):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left_positions[i], Inches(2.2), block_width, Inches(3.8))
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_COLOR
        card.line.color.rgb = CYAN_ACCENT if i == 0 or i == 2 else BORDER_COLOR
        card.line.width = Pt(1.5 if i == 0 or i == 2 else 1)
        
        txBox = slide.shapes.add_textbox(left_positions[i] + Inches(0.2), Inches(2.4), block_width - Inches(0.4), Inches(3.4))
        tf = txBox.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
        
        p = tf.paragraphs[0]
        p.text = block['name']
        p.font.name = "Orbitron"
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = CYAN_ACCENT
        p.space_after = Pt(10)
        p.alignment = PP_ALIGN.CENTER
        
        p2 = tf.add_paragraph()
        p2.text = block['desc']
        p2.font.name = "Space Grotesk"
        p2.font.size = Pt(11)
        p2.font.color.rgb = TEXT_MAIN
        p2.line_spacing = 1.25
        p2.alignment = PP_ALIGN.CENTER
        
        # Add a right-facing connecting arrow if not the last block
        if i < 3:
            arrow = slide.shapes.add_shape(MSO_SHAPE.RIGHT_ARROW, left_positions[i] + block_width + Inches(0.1), Inches(3.9), Inches(0.4), Inches(0.3))
            arrow.fill.solid()
            arrow.fill.fore_color.rgb = GREEN_ACCENT
            arrow.line.fill.background()

def main():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    
    # 1. Slide 1: Main Title Slide
    add_title_slide(
        prs, 
        "VENTURE", 
        "A 3D-Enabled Collaborative E-Commerce & Rental Platform\nReact 19 • WebGL Shaders • Zustand Shared State Store"
    )
    
    # 2. Slide 2: Section 1 Title: Abstract & Problems
    add_section_divider(
        prs, 1, 
        "Abstract & Problem Definition", 
        "Establishing the core objectives, detailing the e-commerce design constraints, and presenting the proposed 3D solution."
    )
    
    # 3. Slide 3: Abstract & Overview
    add_two_column_slide(
        prs, "1. Abstract & Problem Definition",
        "Abstract & Overview",
        "Standard e-commerce architectures present products in flat static media and operate within isolated shopping sessions.\n\n"
        "Venture introduces a responsive, unified client workspace. Users inspect items in rotatable 3D WebGL canvases, "
        "add items with rental flags, invite friends to join collaborative rooms, and monitor projected totals against a strict "
        "Zustand spending store.\n\n"
        "This project bridges premium interactive interfaces, real-time sync, and financial awareness in a single, high-performance portal.",
        "Core Project Features:",
        [
            "Interactive WebGL: Renders dynamic, responsive shapes using React Three Fiber canvas overlays.",
            "Buy or Rent: Integrates customizable pricing configurations based on monthly duration inputs.",
            "Shared Shopping: Enables WebSocket cart sync for collaborative group checkout flows.",
            "Financial Safety: Tracks expenses in memory with automatic threshold toast popups."
        ]
    )
    
    # 4. Slide 4: Problem Statement
    add_two_column_slide(
        prs, "1. Abstract & Problem Definition",
        "Problem Definition & Comparative Analysis",
        "Legacy shopping frameworks create friction points that hurt conversion rates and user engagement:\n\n"
        "• High Return Rates: 2D static images fail to provide depth perception, leading to buyer mismatches.\n"
        "• Segmented Portals: Purchasing and rental systems are segregated, requiring separate apps and transactions.\n"
        "• Silent Overspending: Lack of real-time warning indicators results in unexpected checkout cart shocks.\n"
        "• Siloed Sessions: Social shopping requires tedious external link sharing and manual group calculations.",
        "Venture Innovation Vector:",
        [
            "Rotatable 3D Viewport: Decreases returns by supporting free-angle model manipulation in-browser.",
            "Unified Transaction: Consolidates rent and buy options directly within the product grid layout.",
            "Proactive Guardrails: Displays warning banners at 80% and 100% of defined budget limits.",
            "Live Room Synchronization: Features instant, shared room cart lists via invite codes."
        ]
    )
    
    # 5. Slide 5: Basic Idea & Key Features
    add_grid_slide(
        prs, "1. Abstract & Problem Definition",
        "Basic Idea & Architectural Features",
        [
            {
                "title": "3D Canvas Viewport",
                "desc": "Uses Canvas layers, RoundedBox geometries, and spot light meshes to create smooth spatial preview cards. Background3D spawns 1,500 upward climbing particles.",
                "accent": True
            },
            {
                "title": "Dual Checkout catalog",
                "desc": "Maintains Buy and Rent controls on every item. Employs AI recommendation analysis (tagging items above ₹1,000 as optimal for rentals).",
                "accent": False
            },
            {
                "title": "Collaborative Shared Cart",
                "desc": "Syncs room ids (e.g. 'cart-x789') with initials avatars for Alice & Bob. Allows manual and contact invitation dispatches.",
                "accent": False
            },
            {
                "title": "Smart Budget Manager",
                "desc": "Features reactive limit fields. Compares total spent against user limit, warning at 80% and blocking checkout at 100% capacity.",
                "accent": True
            }
        ]
    )
    
    # 6. Slide 6: Section 2 Title: System Architecture & UX Design
    add_section_divider(
        prs, 2, 
        "System Architecture & Design", 
        "Detailing the decoupled layout layers, design typography, responsive variables, and the client-side state store."
    )
    
    # 7. Slide 7: High-Level Client-Server Architecture
    add_diagram_slide(
        prs, "2. System Architecture & Design",
        "High-Level Client Architecture Flow",
        [
            {
                "name": "WebGL UI Layer",
                "desc": "Renders Canvas components, GlowCube materials, and Glassmorphic buttons inside reactive page wrappers."
            },
            {
                "name": "Zustand State Store",
                "desc": "Maintains theme config, cart array, wishlist logs, budgetLimit, totalExpenses, and active collaborator lists in memory."
            },
            {
                "name": "Transaction Validator",
                "desc": "Checks checkout values against the budget limit. Prompts users with green rental recommendations if values breach limits."
            },
            {
                "name": "WhatsApp Dispatcher",
                "desc": "Constructs structured invoices and passes them via window.open() using target wa.me text APIs."
            }
        ]
    )
    
    # 8. Slide 8: UI/UX Styling & Design System
    add_two_column_slide(
        prs, "2. System Architecture & Design",
        "UI/UX Design System & Theme Control",
        "Venture's layout implements premium glassmorphic styling, responsive layouts, and distinct typography:\n\n"
        "• Header Typography: Renders titles, buttons, and numeric statistics using the 'Orbitron' font family.\n"
        "• Body Typography: Displays explanations, item descriptions, and form inputs using 'Space Grotesk'.\n"
        "• Glassmorphic Panels: Applies frosted cards with semi-transparent backgrounds and thin boundaries to create visual layers.\n"
        "• Theme Toggle: Toggles the '.light-mode' CSS class on the document body to transition variables seamlessly.",
        "Color Palette System Configuration:",
        [
            "Primary Dark Base: Slate-900 (RGB 15, 23, 42) background for high contrast.",
            "Card Wrapper Fill: Slate-800 (RGB 30, 41, 59) surface color.",
            "Cyber Cyan Accent: RGB 6, 182, 212 (#00f0ff) for futuristic glows.",
            "Emerald Green Accent: RGB 16, 185, 129 for budget status codes.",
            "Flipkart Blue: Swap accent used during light mode configurations."
        ]
    )
    
    # 9. Slide 9: Section 3 Title: Methodology & Module-wise Explanation
    add_section_divider(
        prs, 3, 
        "Methodology & Module Breakdown", 
        "Step-by-step technical analysis of the 3D particles, Buy vs Rent features, shared websocket cart, and budget tracking."
    )
    
    # 10. Slide 10: 3D Product Interface & GlowCube Canvas
    add_two_column_slide(
        prs, "3. Methodology & Modules",
        "3D Product Canvas & Anti-Gravity Shaders",
        "The application utilizes hardware-accelerated rendering directly in the DOM to showcase products:\n\n"
        "• GlowCube Component: A custom React Three Fiber RoundedBox mesh styled with spot lighting, OrbitControls, and high-intensity emissive materials (#00f0ff).\n\n"
        "• Anti-Gravity particles: Background3D mounts a Canvas spawning 1,500 individual particles. Position arrays are initialized using useMemo hooks for maximum frame rates.\n\n"
        "• Frame Updates: The useFrame loop moves positions upwards along the Y-axis. When a particle exits the viewport boundaries, its coordinate resets to the bottom.",
        "WebGL Core Rendering Attributes:",
        [
            "Additive Blending: Merges overlapping particle glows on the screen.",
            "DepthWrite False: Prevents visual clipping artifacts between particle shapes.",
            "Size Attenuation: Adjusts particle size based on virtual camera distance.",
            "Adaptive Fog: Automatically shifts fog color from dark (#000) to light (#f1f3f6) on theme updates.",
            "Auto-Rotation: Rotates the camera matrix at 0.05 speed to create ambient movement."
        ]
    )
    
    # 11. Slide 11: Buy or Rent Catalog with AI Insights
    add_grid_slide(
        prs, "3. Methodology & Modules",
        "Buy vs Rent Catalog & AI Nudges",
        [
            {
                "title": "Structured Product List",
                "desc": "Shop.jsx features items (Apple Vision Pro, Segway Ninebot, AirPods Max, DJI Drones) with price, rentPrice, and image parameters.",
                "accent": False
            },
            {
                "title": "AI Recommendation Rules",
                "desc": "Evaluates item cost: if price exceeds ₹1,000, card displays 'AI Analysis: Optimal for short-term rental'. Otherwise, advises outright purchase.",
                "accent": True
            },
            {
                "title": "Interactive Hover Tilts",
                "desc": "Cards leverage Framer Motion spring properties. Hovering triggers a 15-degree Y-rotation and 5-degree X-rotation scale warp.",
                "accent": False
            },
            {
                "title": "Cart Actions Dispatch",
                "desc": "Coordinates state actions: Buy dispatch triggers isRental=false, while Rent buttons inject duration parameters to the cart array.",
                "accent": True
            }
        ]
    )
    
    # 12. Slide 12: Real-time Shared Cart Collaboration
    add_two_column_slide(
        prs, "3. Methodology & Modules",
        "Real-Time Shared Cart Collaboration",
        "Venture implements shared shopping experiences through the cart interface:\n\n"
        "• Session Binding: Connects users to room key ('cart-x789') to join cart updates.\n\n"
        "• Active Collaborator Headers: Maps active users (Alice and Bob) using initials avatars (A, B) and prints the active room population count.\n\n"
        "• Invite Dispatch Form: Allows typing custom emails/phones or choosing mock contacts (Diana Prince, Charlie Brown) to launch invites.\n\n"
        "• Real-Time Toasts: Triggers toast alerts whenever items are added or removed to keep all participants informed.",
        "Collaborative Cart Mechanics:",
        [
            "Unique Session Code: Enables shared shopping rooms without complex setups.",
            "Split Payment Mode: Checkbox triggers split billing UI panels.",
            "Dynamic Math: Computes user's direct 1/3 share of cart total.",
            "Action Synchronization: Updates are shared with all active room members."
        ]
    )
    
    # 13. Slide 13: Smart Budget Tracking & Warn Flags
    add_two_column_slide(
        prs, "3. Methodology & Modules",
        "Smart Budget Tracking & Threshold Warnings",
        "To prevent checkout cart shock, the Cart interface monitors spending limits programmatically:\n\n"
        "• Zustand Limit Keys: Store holds budgetLimit (default ₹5,00,000) and totalExpenses (default ₹4,25,000).\n\n"
        "• Cost Projection Bar: Cart view computes projected totals (Spent + Current Order/Share) and renders a visual progress bar.\n\n"
        "• Interactive Configuration: Dashboard provides fields to change limits, delete transactions, or add custom external expenses.",
        "Intelligent Budget Alerts & Rules:",
        [
            "80% Warning: Alerts at 80% capacity ('⚠️ BUDGET WARNING').",
            "100% Limit: Alerts at 100% capacity ('🚨 BUDGET EXCEEDED').",
            "Smart Advice: Suggests renting instead of buying if limit breached.",
            "Real-Time: Computes cart total dynamically as items change.",
            "Visual Bar: Shifts progress bar from green-to-blue to orange-to-red.",
            "External Logs: Supports manual external item entries."
        ]
    )
    
    # 14. Slide 14: Section 4 Title: Technologies & Database Design
    add_section_divider(
        prs, 4, 
        "Technologies & Data Schemas", 
        "Reviewing the developer dependencies, build tools, database models, and client state fields."
    )
    
    # 15. Slide 15: Tech Stack Matrix
    add_grid_slide(
        prs, "4. Technologies & Data Schemas",
        "Development Stack & Tooling Matrix",
        [
            {
                "title": "React 19 & Vite",
                "desc": "Utilizes React 19 SPA framework alongside Vite builder for fast compilation, asset bundling, and clean client-side routing.",
                "accent": True
            },
            {
                "title": "Zustand v5 Store",
                "desc": "Coordinates local storage states (theme toggles, cart array, wishlist logs, budget limit variables) in centralized memory.",
                "accent": False
            },
            {
                "title": "WebGL 3D Engines",
                "desc": "Combines Three.js, React Three Fiber, and Drei libraries to load canvas frames, custom rounded box shapes, and particle backdrops.",
                "accent": False
            },
            {
                "title": "Framer Motion & Lucide",
                "desc": "Implements fluid spring transitions, fade-in animations, and standard modern UI icon sets on buttons and panels.",
                "accent": True
            }
        ]
    )
    
    # 16. Slide 16: State & Data Schemas
    add_two_column_slide(
        prs, "4. Technologies & Data Schemas",
        "State & Mock Database Models",
        "Data structures are organized to facilitate quick updates inside the Zustand store:\n\n"
        "• Mock Products Schema: Configured with properties: id, name, price, rentPrice, rating, category (Electronics, Mobility, Audio, Gaming, Groceries), color, and image URL.\n\n"
        "• Zustand Store State Model:\n"
        "  - theme: string ('light' or 'dark')\n"
        "  - cart: array containing objects (id, product, isRental, duration)\n"
        "  - wishlist: array of product objects\n"
        "  - budgetLimit: number (limit flag)\n"
        "  - totalExpenses: number (accrued expenses)\n"
        "  - expensesHistory: array (id, name, amount, type, date)",
        "Store Actions & Mutators:",
        [
            "toggleTheme(): Swaps body styling class names.",
            "addToCart(): Adds items to cart array with toast alerts.",
            "removeFromCart(): Filters out selected items by ID.",
            "addExpense(): Appends items to history and checks limit thresholds."
        ]
    )
    
    # 17. Slide 17: Section 5 Title: Implementation Process & Results
    add_section_divider(
        prs, 5, 
        "Implementation, Results & Analysis", 
        "Detailing build roadmaps, WhatsApp checkout verification, challenge solutions, and future scopes."
    )
    
    # 18. Slide 18: Roadmap & WhatsApp Checkout
    add_timeline_slide(
        prs, "5. Implementation & Results",
        "Development Milestones & WhatsApp Checkout Flow",
        [
            {
                "num": "01",
                "title": "Core Setup",
                "desc": "Initializes Vite React project. Installs WebGL packages and Zustand store."
            },
            {
                "num": "02",
                "title": "Layout & 3D Canvas",
                "desc": "Codes Anti-Gravity particles backdrop and styles glassmorphic panels."
            },
            {
                "num": "03",
                "title": "Zustand Logic Sync",
                "desc": "Connects store mutators, budget check progress bars, and split math."
            },
            {
                "num": "04",
                "title": "WhatsApp Checkout",
                "desc": "Compiles order receipt, opens WA send link, logs expenses, and clears cart."
            }
        ]
    )

    prs.save(dst_path)
    print(f"Saved successfully to {dst_path}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        dst_path = sys.argv[1]
    else:
        dst_path = r"c:\Users\balaj\mini project\Venture_Project_Presentation.pptx"
    main()
