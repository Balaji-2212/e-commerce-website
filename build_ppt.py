import io
import sys
from copy import deepcopy
from pptx import Presentation
from pptx.enum.shapes import MSO_SHAPE_TYPE

# Helper to copy shapes from source to target
def copy_slide_content(source_slide, target_slide):
    for shape in source_slide.shapes:
        if shape.shape_type == MSO_SHAPE_TYPE.PICTURE:
            try:
                image_stream = io.BytesIO(shape.image.blob)
                target_slide.shapes.add_picture(
                    image_stream, 
                    shape.left, 
                    shape.top, 
                    shape.width, 
                    shape.height
                )
            except Exception as e:
                new_element = deepcopy(shape.element)
                target_slide.shapes._spTree.insert_element_before(new_element, 'p:extLst')
        else:
            new_element = deepcopy(shape.element)
            target_slide.shapes._spTree.insert_element_before(new_element, 'p:extLst')

def replace_paragraph_text(p, new_text):
    if not p.runs:
        p.text = new_text
        return
    p.runs[0].text = new_text
    while len(p.runs) > 1:
        p._p.remove(p.runs[1]._r)

def find_shape_by_text(slide, query):
    for shape in slide.shapes:
        if shape.has_text_frame and query in shape.text_frame.text:
            return shape
    return None

def replace_simple_text(slide, query, new_text):
    shape = find_shape_by_text(slide, query)
    if shape:
        for p in shape.text_frame.paragraphs:
            replace_paragraph_text(p, new_text)
            break
        return True
    return False

def replace_textbox_paragraphs(slide, query, new_paragraphs):
    shape = find_shape_by_text(slide, query)
    if shape:
        tf = shape.text_frame
        for i, text in enumerate(new_paragraphs):
            if i < len(tf.paragraphs):
                replace_paragraph_text(tf.paragraphs[i], text)
            else:
                p_new = tf.add_paragraph()
                p_new.alignment = tf.paragraphs[i-1].alignment
                p_new.level = tf.paragraphs[i-1].level
                p_new.text = text
                if tf.paragraphs[i-1].runs and p_new.runs:
                    run_new = p_new.runs[0]
                    run_prev = tf.paragraphs[i-1].runs[0]
                    run_new.font.name = run_prev.font.name
                    run_new.font.size = run_prev.font.size
                    run_new.font.bold = run_prev.font.bold
                    run_new.font.italic = run_prev.font.italic
                    try:
                        if run_prev.font.color.type == 1:
                            run_new.font.color.rgb = run_prev.font.color.rgb
                    except Exception:
                        pass
        while len(tf.paragraphs) > len(new_paragraphs):
            p_to_remove = tf.paragraphs[-1]
            p_to_remove._p.getparent().remove(p_to_remove._p)
        return True
    return False

# Classes for rebuilding Slide 9 style
class Style:
    def __init__(self, name, size, bold, italic, color, alignment, level):
        self.name = name
        self.size = size
        self.bold = bold
        self.italic = italic
        self.color = color
        self.alignment = alignment
        self.level = level

def get_p_style(p):
    name, size, bold, italic, color = None, None, None, None, None
    if p.runs:
        run = p.runs[0]
        name = run.font.name
        size = run.font.size
        bold = run.font.bold
        italic = run.font.italic
        try:
            if run.font.color.type == 1:
                color = run.font.color.rgb
        except Exception:
            pass
    return Style(name, size, bold, italic, color, p.alignment, p.level)

def apply_style(p, style, text):
    p.text = text
    p.alignment = style.alignment
    p.level = style.level
    if p.runs and text:
        run = p.runs[0]
        if style.name: run.font.name = style.name
        if style.size: run.font.size = style.size
        if style.bold is not None: run.font.bold = style.bold
        if style.italic is not None: run.font.italic = style.italic
        if style.color: run.font.color.rgb = style.color

def main():
    src_path = r"c:\Users\balaj\mini project\ppt 1.pptx"
    dst_path = r"c:\Users\balaj\mini project\Venture_Project_Presentation.pptx"
    
    prs_src = Presentation(src_path)
    prs_dst = Presentation(src_path)
    
    slides_src = list(prs_src.slides)
    
    # Extract styles from Slide 9 (index 8) main textbox for rebuilds
    slide9_main_tb = slides_src[8].shapes[0].text_frame
    style_title = get_p_style(slide9_main_tb.paragraphs[0])
    style_desc = get_p_style(slide9_main_tb.paragraphs[1])
    style_section = get_p_style(slide9_main_tb.paragraphs[3])
    style_item_head = get_p_style(slide9_main_tb.paragraphs[5])
    style_item_desc = get_p_style(slide9_main_tb.paragraphs[6])
    style_blank = get_p_style(slide9_main_tb.paragraphs[2])
    
    # Clear all slides in destination
    for idx in range(len(prs_dst.slides) - 1, -1, -1):
        rId = prs_dst.slides._sldIdLst[idx].rId
        prs_dst.part.drop_rel(rId)
        del prs_dst.slides._sldIdLst[idx]
        
    print("Cleared destination presentation. Rebuilding slides...")
    
    def rebuild_list_slide(slide, title, desc, section_title, items):
        shape = find_shape_by_text(slide, "Database/Dataset Design:")
        if not shape:
            shape = slide.shapes[0]
        tf = shape.text_frame
        tf.clear()
        
        # 1. Title
        apply_style(tf.paragraphs[0], style_title, title)
        # 2. Desc
        apply_style(tf.add_paragraph(), style_desc, desc)
        # 3. Blank
        apply_style(tf.add_paragraph(), style_blank, "")
        # 4. Section
        apply_style(tf.add_paragraph(), style_section, section_title)
        # 5. Blank
        apply_style(tf.add_paragraph(), style_blank, "")
        
        # 6. Items
        for item_title, item_desc in items:
            p_head = tf.add_paragraph()
            apply_style(p_head, style_item_head, item_title)
            p_desc = tf.add_paragraph()
            apply_style(p_desc, style_item_desc, item_desc)
            p_blank = tf.add_paragraph()
            apply_style(p_blank, style_blank, "")

    # Define the 18 slides configuration
    for slide_idx in range(18):
        print(f"Creating slide {slide_idx+1}/18...")
        
        if slide_idx == 0: # Slide 1: Title Slide
            src_slide = slides_src[0]
            new_slide = prs_dst.slides.add_slide(src_slide.slide_layout)
            copy_slide_content(src_slide, new_slide)
            replace_simple_text(new_slide, "E-Commerce Website Using MERN Stack", "Venture: A 3D-Enabled Collaborative E-Commerce & Rental Platform")
            
        elif slide_idx == 1: # Slide 2: 1. Abstract & Problem Definition - Abstract & Overview
            src_slide = slides_src[1]
            new_slide = prs_dst.slides.add_slide(src_slide.slide_layout)
            copy_slide_content(src_slide, new_slide)
            replace_simple_text(new_slide, "Abstract:", "1. Abstract & Problem Definition: Abstract & Overview")
            abstract_text = (
                "Standard e-commerce applications restrict buyers to static images and isolated carts. "
                "This project details 'Venture', a futuristic web-based e-commerce and rental solution. "
                "The application is built on React 19 and Vite, featuring immersive three-dimensional (3D) product inspection "
                "powered by React Three Fiber and Three.js. Key features include a flexible duration-based 'Rental System', "
                "a real-time 'Shared Cart' collaboration interface for group shopping sessions, and a state-managed "
                "'Smart Budget Mode' (utilizing Zustand) that tracks monthly user spending and triggers threshold alerts. "
                "Venture elevates standard storefronts into engaging, collaborative, and financially aware spaces."
            )
            replace_simple_text(new_slide, "E-commerce applications allow", abstract_text)
            
        elif slide_idx == 2: # Slide 3: 1. Abstract & Problem Definition - Problem Definition
            src_slide = slides_src[3]
            new_slide = prs_dst.slides.add_slide(src_slide.slide_layout)
            copy_slide_content(src_slide, new_slide)
            replace_simple_text(new_slide, "Problem Definition", "1. Abstract & Problem Definition: Problem Definition")
            problems_list = (
                "Static product photographs fail to convey spatial attributes, leading to higher return rates.\n"
                "Absent real-time cooperative shopping features force group buyers to share links externally.\n"
                "Renting and buying processes remain fragmented, requiring multiple platforms and checkouts.\n"
                "Lack of proactive budget controls, which leads to accidental overspending on premium items."
            )
            replace_simple_text(new_slide, "No shared cart for group", problems_list)
            solutions_list = (
                "Enables interactive, rotatable 3D product viewports directly in the catalog using WebGL.\n"
                "Allows instant group cart synchronization using collaborative session sharing hooks.\n"
                "Consolidates outright buying and flexible, month-to-month rentals in a unified UI.\n"
                "Tracks spending limits via Zustand, triggering active warnings at 80% and 100% thresholds."
            )
            replace_simple_text(new_slide, "Buying and renting capabilities", solutions_list)
            
        elif slide_idx == 3: # Slide 4: 1. Abstract & Problem Definition - Basic Idea & Features
            src_slide = slides_src[2]
            new_slide = prs_dst.slides.add_slide(src_slide.slide_layout)
            copy_slide_content(src_slide, new_slide)
            replace_simple_text(new_slide, "Basic Idea & Features", "1. Abstract & Problem Definition: Basic Idea & Features")
            replace_simple_text(new_slide, "A MERN stack-based e-commerce website", "An advanced React 19 e-commerce platform incorporating:")
            replace_simple_text(new_slide, "Product Purchasing", "3D Canvas Catalog")
            replace_simple_text(new_slide, "A complete buying experience", "Uses Three.js and React Three Fiber to render rotatable and zoomable product components.")
            replace_simple_text(new_slide, "Collaborative shopping with group", "Syncs group sessions live using WebSockets (Socket.io) to add/remove shared items.")
            replace_simple_text(new_slide, "A flexible, duration-based product rental system.", "Calculates rental rates dynamically based on monthly selection inputs and base rent metrics.")
            replace_simple_text(new_slide, "Smart tracking with intelligent alerts.", "Monitors spending thresholds in real-time and flashes budget warning banners.")
            
        elif slide_idx == 4: # Slide 5: 2. System Architecture and Design - High-Level Architecture
            src_slide = slides_src[4]
            new_slide = prs_dst.slides.add_slide(src_slide.slide_layout)
            copy_slide_content(src_slide, new_slide)
            replace_simple_text(new_slide, "System Architecture and Design:", "2. System Architecture and Design: High-Level Architecture")
            replace_simple_text(new_slide, "System Architecture", "2. System Architecture")
            replace_simple_text(new_slide, "React.js Frontend", "React, Three.js & Zustand Client")
            replace_simple_text(new_slide, "Browser UI handling user", "Renders the DOM and WebGL Canvas, handles animations using Framer Motion, and tracks client state via Zustand.")
            replace_simple_text(new_slide, "Node.js & Express", "Vite Bundler & Router")
            replace_simple_text(new_slide, "API layer handling requests", "Handles fast local hot-reload dev servers, packages routes with react-router-dom, and compiles production assets.")
            replace_simple_text(new_slide, "MongoDB Database", "Client Memory Store")
            replace_simple_text(new_slide, "Persistent storage for users", "Manages state variables (theme, cart array, wishlist, budget Limit, total Expenses) in unified memory.")
            
        elif slide_idx == 5: # Slide 6: 2. System Architecture and Design - UI/UX & Typography
            src_slide = slides_src[3]
            new_slide = prs_dst.slides.add_slide(src_slide.slide_layout)
            copy_slide_content(src_slide, new_slide)
            replace_simple_text(new_slide, "Problem Definition", "2. System Architecture and Design: UI/UX & Typography")
            ui_ux_details = (
                "Typography System & Aesthetics:\n"
                "• Orbitron: Emphasizes high-tech titles, navigation elements, and dashboard statistics.\n"
                "• Space Grotesk: Renders highly readable body text, descriptors, and billing inputs.\n"
                "• Theme Switcher: Local toggle state swaps between light and dark modes on document body."
            )
            replace_simple_text(new_slide, "No shared cart for group", ui_ux_details)
            canvas_details = (
                "Glassmorphism Design Features:\n"
                "• Renders panels and buttons with frosted glass backgrounds and subtle border lines.\n"
                "• Framer Motion coordinates fade-ins, spring bounces, and exit transition animations.\n"
                "• Light mode switches active body color accents from cyber cyan to Flipkart blue."
            )
            replace_simple_text(new_slide, "Buying and renting capabilities", canvas_details)

        elif slide_idx == 6: # Slide 7: 3. Methodology - SDLC Lifecycle
            src_slide = slides_src[5]
            new_slide = prs_dst.slides.add_slide(src_slide.slide_layout)
            copy_slide_content(src_slide, new_slide)
            replace_simple_text(new_slide, "Methodology  and   Module-wise", "3. Methodology: Agile SDLC Lifecycle")
            methodology_list = (
                "The engineering lifecycle is implemented across six major agile stages:\n"
                "1. Requirement Definition: Identifying React 19 capabilities, 3D assets, and Zustand hooks.\n"
                "2. Architecture & UI/UX Design: Wireframing glassmorphic pages and mapping fonts.\n"
                "3. State Modeling Design: Creating schemas for cart items, wishlist, and budget histories.\n"
                "4. Client Coding Phase: Writing pages (Home, Shop, Cart, Dashboard) and Background3D components.\n"
                "5. Integration & Animations: Connecting Zustand actions, OrbitControls, and Framer Motion effects.\n"
                "6. Verification & Deployment: Testing threshold triggers, checking routes, and packaging via Vite."
            )
            replace_simple_text(new_slide, "1. \nRequirement Analysis", methodology_list)
            replace_simple_text(new_slide, "Phase 1: User Engagement", "Phase 1: Client Interactions")
            p1_details = (
                "User profile navigation\n"
                "3D mesh manipulation (OrbitControls)\n"
                "Catalog filtering (category, search)\n"
                "Shared cart session invite ('cart-x789')"
            )
            replace_simple_text(new_slide, "User registration and login", p1_details)
            replace_simple_text(new_slide, "Phase 2: Order Processing", "Phase 2: Zustand State Updates")
            p2_details = (
                "Saves cart additions with rental flags\n"
                "Evaluates order value against budget limits\n"
                "Logs transactions to expense logs\n"
                "Dispatches formatted text invoice links"
            )
            replace_simple_text(new_slide, "Budget check and alerts", p2_details)
            
        elif slide_idx == 7: # Slide 8: 3. Module-wise Explanation: 3D Product Interface
            src_slide = slides_src[1]
            new_slide = prs_dst.slides.add_slide(src_slide.slide_layout)
            copy_slide_content(src_slide, new_slide)
            replace_simple_text(new_slide, "Abstract:", "3. Module-wise Explanation: 3D Product Interface & GlowCube")
            tf_text = (
                "Standard stores rely on flat images that fail to show details. Venture resolves this by integrating a floating "
                "WebGL canvas using Three.js and React Three Fiber. The Home page mounts a Canvas rendering 'GlowCube'—a custom, "
                "floating RoundedBox with spot lighting, OrbitControls, and emissive color (#00f0ff). "
                "For global aesthetics, the 'Background3D' component spawns 1,500 'AntiGravityParticles' climbing upwards "
                "with size attenuation, additive blending, and theme-adaptive fog. Camera position loops spin slowly "
                "based on clock delta values to keep the backdrop dynamic without blocking the user's primary interface inputs."
            )
            replace_simple_text(new_slide, "E-commerce applications allow", tf_text)
            
        elif slide_idx == 8: # Slide 9: 3. Module-wise Explanation: Rental System Module
            src_slide = slides_src[8]
            new_slide = prs_dst.slides.add_slide(src_slide.slide_layout)
            copy_slide_content(src_slide, new_slide)
            rebuild_list_slide(
                new_slide,
                "3. Module-wise Explanation: Buy & Rent Catalog",
                "Consolidates outright purchases and rental terms in the product grid to provide transactional flexibility.",
                "Key Buy or Rent Capabilities:",
                [
                    ("AI Catalog Analysis:", "Product cards feature an auto-recommendation: if price > ₹1,000, tags advise: 'Optimal for short-term rental'."),
                    ("Mock Products Schema:", "Stores names, pricing (e.g. Apple Vision Pro ₹3,49,900 or ₹15,000/mo), category, ratings, and branding colors."),
                    ("Dual Cart Additions:", "Buy buttons call 'addToCart(product, false)', while Rent buttons pass 'isRental: true' and duration parameters."),
                    ("Interaction Animations:", "Card items utilize spring motion tags, expanding images with rotateX/Y tilts during mouse hovers.")
                ]
            )
            
        elif slide_idx == 9: # Slide 10: 3. Module-wise Explanation: Real-time Shared Cart
            src_slide = slides_src[8]
            new_slide = prs_dst.slides.add_slide(src_slide.slide_layout)
            copy_slide_content(src_slide, new_slide)
            rebuild_list_slide(
                new_slide,
                "3. Module-wise Explanation: Shared Cart Collaboration",
                "Facilitates collaborative group shopping sessions by allowing multiple users to view the same cart instance.",
                "Cooperative Cart Features:",
                [
                    ("Shared Session Identifier:", "Uses a unique room session key ('sharedCartId': 'cart-x789') to connect group shopping participants."),
                    ("Active Collaborator Counters:", "Renders active session participants using initials avatars (e.g., Alice: 'A', Bob: 'B') within the header panel."),
                    ("Invitation Dispatch Desk:", "Features an invite dropdown menu allowing users to select contacts or enter manual email/phone details."),
                    ("Visual Feedback Messages:", "Dispatches interactive toast notifications whenever collaborators modify items in the shared cart.")
                ]
            )
            
        elif slide_idx == 10: # Slide 11: 3. Module-wise Explanation: Smart Budget Tracking
            src_slide = slides_src[8]
            new_slide = prs_dst.slides.add_slide(src_slide.slide_layout)
            copy_slide_content(src_slide, new_slide)
            rebuild_list_slide(
                new_slide,
                "3. Module-wise Explanation: Smart Budget Tracking",
                "Incorporates proactive financial limits and warnings directly inside checkout and dashboard flows.",
                "Intelligent Budget Capabilities:",
                [
                    ("Zustand Memory Store:", "Tracks user budget Limit (default ₹5,00,000) and total Expenses (default ₹4,25,000) variables in state."),
                    ("Projected Total Checks:", "Calculates cost projection before checkout: 'Spent + This Order'. Progress bar maps the percentage utilized."),
                    ("Threshold Warning Overlays:", "Checks alert toggles; alerts trigger at 80% ('⚠️ BUDGET WARNING') and 100% ('🚨 BUDGET EXCEEDED') limits."),
                    ("Green Rental Nudges:", "If limits are exceeded, alerts advise: 'Consider renting instead of buying... renting protects your budget by 85%'.")
                ]
            )
            
        elif slide_idx == 11: # Slide 12: 4. Technologies, Tools, and Frameworks Used
            src_slide = slides_src[6]
            new_slide = prs_dst.slides.add_slide(src_slide.slide_layout)
            copy_slide_content(src_slide, new_slide)
            replace_simple_text(new_slide, "Tools & Technologies", "4. Technologies, Tools, and Frameworks Used")
            replace_simple_text(new_slide, "React.js, Node.js, Express.js", "React.js 19, Zustand v5, Three.js, React Three Fiber (@react-three/fiber), Drei (@react-three/drei), Framer Motion v12, Lucide React, React Router Dom v7")
            replace_simple_text(new_slide, "VS Code, Postman", "Vite Builder, NPM Packages, Git & GitHub, Google Chrome DevTools, Unsplash Images")
            replace_simple_text(new_slide, "4GB RAM", "WebGL 2.0-Supported GPU, Web Browser (Chrome/Firefox/Edge), Node.js Runtime Environment")
            
        elif slide_idx == 12: # Slide 13: 5. Database/Dataset Design
            src_slide = slides_src[8]
            new_slide = prs_dst.slides.add_slide(src_slide.slide_layout)
            copy_slide_content(src_slide, new_slide)
            rebuild_list_slide(
                new_slide,
                "5. State & Data Models",
                "Client-side schemas and variables are managed inside a reactive Zustand store for high-performance updates.",
                "Zustand State Model Collections:",
                [
                    ("Products Schema:", "Saves product data: id, name, price, rentPrice, rating, category, theme color, and image URL."),
                    ("Cart Store Array:", "Holds selected items with dynamic attributes: product details, unique ID, isRental flag, and duration."),
                    ("Collaborators Schema:", "Stores invite configurations: collaborator ID, name, and visual initials avatar (e.g. Alice 'A')."),
                    ("Expense History Array:", "Tracks purchase records: ID, name, cost, type ('Rental' or 'Purchase'), and local date timestamp."),
                    ("Config Flags:", "Persists settings toggles: theme ('light' vs 'dark'), alertAt80 (boolean), and alertAt100 (boolean).")
                ]
            )
            
        elif slide_idx == 13: # Slide 14: 5. Implementation Process & Roadmap
            src_slide = slides_src[7]
            new_slide = prs_dst.slides.add_slide(src_slide.slide_layout)
            copy_slide_content(src_slide, new_slide)
            replace_simple_text(new_slide, "Implementation Progress and Demonstration:", "5. Implementation Process & Roadmap")
            replace_simple_text(new_slide, "Phase 1: Research", "Phase 1: Core Setup")
            replace_simple_text(new_slide, "Literature review, requirement analysis", "Defining project folders, initializing Vite React project, and installing Drei, Fiber, and Zustand.")
            replace_simple_text(new_slide, "Phase 2: Design", "Phase 2: Layout & 3D")
            replace_simple_text(new_slide, "Architecture design, database schema", "Coding the Anti-Gravity particle canvas, configuring OrbitControls camera, and styling glassmorphic grids.")
            replace_simple_text(new_slide, "Phase 3: Implementation", "Phase 3: Logic Sync")
            replace_simple_text(new_slide, "Backend API development", "Implementing state store rules, programming cart proceed logic, and setting up the WhatsApp invoice builder.")
            replace_simple_text(new_slide, "Phase 4: Testing", "Phase 4: QA & Release")
            replace_simple_text(new_slide, "Unit testing", "Testing budget limit calculations, validating theme switches, checking routes, and building bundle.")
            
        elif slide_idx == 14: # Slide 15: 5. Implementation Demonstration - Key Use Cases & Flows
            src_slide = slides_src[7]
            new_slide = prs_dst.slides.add_slide(src_slide.slide_layout)
            copy_slide_content(src_slide, new_slide)
            replace_simple_text(new_slide, "Implementation Progress and Demonstration:", "5. Implementation Demonstration: Invoice & WhatsApp Integration")
            replace_simple_text(new_slide, "Phase 1: Research", "Scenario 1: Checkout")
            replace_simple_text(new_slide, "Literature review, requirement analysis", "User enters address, selects 'Proceed', and reviews subtotal and tax (8%).")
            replace_simple_text(new_slide, "Phase 2: Design", "Scenario 2: Split Billing")
            replace_simple_text(new_slide, "Architecture design, database schema", "Checkbox toggles split checkout, showing user's direct 1/3 share calculation.")
            replace_simple_text(new_slide, "Phase 3: Implementation", "Scenario 3: Invoice Generation")
            replace_simple_text(new_slide, "Backend API development", "Formats text invoice string with item indexes, prices, and shipping address details.")
            replace_simple_text(new_slide, "Phase 4: Testing", "Scenario 4: Send to WhatsApp")
            replace_simple_text(new_slide, "Unit testing", "Calls window.open with wa.me API link to dispatch billing message and empties active cart.")

        elif slide_idx == 15: # Slide 16: 6. Results, Outputs, and Analysis
            src_slide = slides_src[9]
            new_slide = prs_dst.slides.add_slide(src_slide.slide_layout)
            copy_slide_content(src_slide, new_slide)
            results_paragraphs = [
                "6. Results, Outputs, and Analysis",
                "",
                "Results",
                "Created an interactive, glassmorphic frontend utilizing React 19.",
                "Validated dynamic purchase vs rental calculations and billing.",
                "Confirmed active toast warnings at 80% and 100% budget thresholds.",
                "",
                "Outputs",
                "Renders floating product viewports with responsive camera angles.",
                "Encourages financial discipline using budget limit configurations.",
                "WhatsApp API integration enables seamless receipt sharing.",
                "",
                "Analysis",
                "The system achieves:",
                "Consistent 60 FPS WebGL rendering speed for particle canvas components.",
                "Lightweight client state synchronization utilizing a single Zustand store.",
                "Eco-friendly options with rental choices that save up to 85% in cash."
            ]
            replace_textbox_paragraphs(new_slide, "Results,Outputs", results_paragraphs)
            
        elif slide_idx == 16: # Slide 17: 7. Challenges Faced and Solutions
            src_slide = slides_src[10]
            new_slide = prs_dst.slides.add_slide(src_slide.slide_layout)
            copy_slide_content(src_slide, new_slide)
            challenges_paragraphs = [
                "7. Challenges Faced and Solutions:",
                "",
                "Challenge 1: State Synchronicity with Zustand v5.",
                "Solution: Leveraged create store hooks to cleanly dispatch actions (addToCart, addExpense) and handle toast timer resets without blocking page rendering cycles.",
                "",
                "Challenge 2: Multi-Component Rendering Performance.",
                "Solution: Optimized WebGL drawing calls inside AntiGravityParticles by utilizing useMemo hooks for particle vertex arrays and attach buffer attributes.",
                "",
                "Challenge 3: Complex Cost projections & Split Math.",
                "Solution: Implemented conditional state filters inside Cart views to dynamically evaluate split pricing (1/3 share) and calculate projected budget totals."
            ]
            replace_textbox_paragraphs(new_slide, "Challenges Faced and Solutions:", challenges_paragraphs)
            
        elif slide_idx == 17: # Slide 18: 7. Future Scope and Conclusion
            src_slide = slides_src[10]
            new_slide = prs_dst.slides.add_slide(src_slide.slide_layout)
            copy_slide_content(src_slide, new_slide)
            conclusion_paragraphs = [
                "7. Future Scope and Conclusion:",
                "",
                "Future Scope 1: Interactive 3D Model Swapping in Catalog.",
                "Solution: Integrate Drei GLTFLoader hooks to replace static mock images with interactive, rotatable 3D product meshes on each card in the shop.",
                "",
                "Future Scope 2: Automated Calendar Syncing for Rentals.",
                "Solution: Deploy active countdown hooks to alert users of expiring rental devices, complete with extension links and returns booking portals.",
                "",
                "Conclusion:",
                "Venture successfully transforms the retail experience into an immersive, collaborative, and budget-conscious portal. By linking WebGL particle canvases, buy vs rent flexibility, Zustand-based smart budget alerts, and WhatsApp invoice sharing, it provides a high-quality frontend solution."
            ]
            replace_textbox_paragraphs(new_slide, "Challenges Faced and Solutions:", conclusion_paragraphs)

    prs_dst.save(dst_path)
    print(f"Saved successfully to {dst_path}")

if __name__ == "__main__":
    main()
