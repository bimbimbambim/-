# Project Architecture: Schedule Pro (Commercial Grade)

## 1. Architecture Overview
The application is built using a **Modular Clean Architecture** with a clear separation of concerns, following SOLID principles and the MVVM (Model-View-ViewModel) pattern.

- **Presentation Layer (UI):** Built with React and Tailwind CSS. State is managed via specialized Zustand stores (ViewModels).
- **Domain Layer (Business Logic):** Pure TypeScript logic for the Rule Engine and the Scheduling Algorithm.
- **Data Layer (Services):** Modular services for Excel parsing, exporting, and persistence.
- **Cross-Cutting Concerns:** Logging, configuration system, and error handling integrated across all layers.

## 2. Folder Structure
```text
/src
  /assets         # Static assets (fonts, images, icons)
  /components     # Atomic UI components
    /ui           # Base Apple-style components (Buttons, Inputs, Cards)
    /layout       # Shared layout components (Sidebar, Navbar)
  /engine         # Core logic
    /rules        # Rule Engine (Hard/Soft constraints)
    /algorithm    # Genetic Algorithm implementation
    /worker       # Web Workers for background processing
  /features       # Domain-specific modules
    /dashboard    # Overview & Stats
    /generator    # Generation interface & Progress
    /history      # Past generations & Templates
    /settings     # App & Logic configuration
  /services       # Infrastructure services
    /excel        # ExcelJS wrappers for Import/Export
    /storage      # LocalStorage & Auto-save logic
    /logging      # Structured logging system
  /store          # Zustand state management
  /types          # Global TypeScript interfaces
  /utils          # Helper functions & constants
```

## 3. Tech Stack
- **Framework:** React 18 + TypeScript + Vite (for lightning-fast builds).
- **Styling:** Tailwind CSS + Framer Motion (for Apple-like fluid animations).
- **State Management:** Zustand (with Persist middleware).
- **Excel Processing:** `exceljs` (supports styling, templates, and large files).
- **Icons:** `lucide-react`.
- **Testing:** `vitest`.
- **Development Tools:** ESLint, Prettier.

## 4. Scheduling Logic (Genetic Algorithm)
The generator uses a **Genetic Algorithm (GA)** optimized for the Constraint Satisfaction Problem (CSP).

- **Population:** A set of potential schedules (chromosomes).
- **Fitness Function:** Evaluates schedules based on:
    - **Hard Constraints (Mandatory):** 100% conflict-free (no overlaps for teachers/rooms).
    - **Soft Constraints (Preferences):** Optimizing for teacher "windows", balanced workload, and room proximity.
- **Selection & Crossover:** Best-performing schedules are merged to create new "offspring".
- **Mutation:** Small random changes are introduced to prevent the algorithm from getting stuck in local optima.
- **Concurrency:** Runs in a **Web Worker** to keep the UI responsive at 60fps.

## 5. Rule Storage & Configuration
- **Structure:** Rules are stored as a weighted JSON schema.
- **Templates:** Supports saving "Rule Sets" for different scenarios (e.g., "Full Semester", "Exam Week").
- **Customization:** Users can toggle rules and adjust their "Penalty Weights" to influence the GA's priorities.

## 6. Excel Interaction System
- **Parser:** A robust engine that maps dynamic Excel columns to internal data models (Teachers, Rooms, Subjects).
- **Exporter:** Uses a "Template Injection" approach. It loads a user-provided Excel template and injects the schedule data while **preserving all original formatting** (colors, borders, fonts, formulas).

## 7. Apple-like UI/UX Design
- **Visuals:**
    - Backdrop blur (Glassmorphism).
    - Minimalist typography (Inter/SF Pro).
    - Subdued color palette with vibrant action accents.
    - Responsive Dark/Light theme.
- **Interactions:**
    - Spring-based animations for all transitions.
    - High-frequency UI feedback (Progress indicators, Haptic-like visual cues).
    - Modern Notification system (Toasts).
- **Features:**
    - Splash screen during load.
    - Smooth view transitions.
    - Persistent settings and generation history.
