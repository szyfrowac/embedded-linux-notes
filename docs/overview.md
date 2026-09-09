# Embedded Linux Fundamentals & Hands-On Buildroot Guide

A modular, publication-quality LaTeX document project for teaching **Embedded Linux Fundamentals, Hardware Paradigms, Build Automation Systems, and Target System Deployment**.

---

## Document Artifacts

- **Project Root Directory:** [`embedded_linux_lecture_notes/`](file:///home/phanikar/BITS/3-2/Projects/Kria/embedded_linux_lecture_notes/)
- **Master LaTeX Entrypoint:** [`src/main.tex`](file:///home/phanikar/BITS/3-2/Projects/Kria/embedded_linux_lecture_notes/src/main.tex)
- **Preamble & Styling:** [`src/preamble.tex`](file:///home/phanikar/BITS/3-2/Projects/Kria/embedded_linux_lecture_notes/src/preamble.tex)
- **Compiled PDF Output:** [`output/embedded_linux_lecture_notes.pdf`](file:///home/phanikar/BITS/3-2/Projects/Kria/embedded_linux_lecture_notes/output/embedded_linux_lecture_notes.pdf) *(9 Pages, Publication Quality)*

---

## Modular Subfolder Structure

```
embedded_linux_lecture_notes/
├── Makefile                      # Top-level build script (make pdf, make clean)
├── README.md                     # Project documentation & build guide
├── src/                          # Modular LaTeX source files
│   ├── main.tex                  # Master entrypoint document
│   ├── preamble.tex              # Packages, color palette, custom tcolorboxes
│   └── sections/                 # Individual lecture modules
│       ├── 01_introduction.tex   # Section 1: Embedded Linux Ecosystem
│       ├── 02_paradigms.tex       # Section 2: Bare Metal vs RTOS vs Linux vs AMP
│       ├── 03_applications.tex   # Section 3: Industrial Uses vs Raspberry Pi
│       ├── 04_build_methods.tex   # Section 4: Image Strategies & Build Systems
│       ├── 05_buildroot_lab.tex   # Section 5: Step-by-Step Hands-On Buildroot Lab
│       └── 06_instructor_notes.tex# Section 6: Pedagogical Notes & Student Exercises
├── scripts/                      # Helper & automation scripts
│   └── generate_tex.py           # Python generator script
├── output/                       # Clean compilation target directory
│   └── embedded_linux_lecture_notes.pdf # Generated PDF
└── docs/                         # Documentation
    └── overview.md               # Markdown documentation overview
```
