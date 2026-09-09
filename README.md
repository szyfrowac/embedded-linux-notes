# Embedded Linux Fundamentals & Buildroot Practical Lab

A modular, publication-quality LaTeX document project for teaching Embedded Linux fundamentals, architecture trade-offs, and practical target system build procedures.

---

## 📁 Repository Structure

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
├── output/                       # Clean build artifacts
│   └── embedded_linux_lecture_notes.pdf # Generated PDF (9 Pages)
└── docs/                         # Additional documentation
    └── overview.md               # Markdown overview artifact
```

---

## 🚀 Building the PDF

To compile the LaTeX source into a PDF document, run:

```bash
make
```

To clean all build artifacts in `output/`:

```bash
make clean
```

---

## 📚 Key Topics Covered

1. **Embedded Linux Ecosystem:** Why Linux dominates IoT/embedded development.
2. **Comparative Paradigms:** Bare Metal, RTOS, Embedded Linux, and Heterogeneous SoCs (MPU + MCU).
3. **Industrial Applications:** Edge gateways, robotics (ROS), SpaceX Falcon 9, and why Raspberry Pi is unsuitable for production.
4. **Build Tool Matrix:** Comparison of Buildroot, Yocto Project (Poky/BitBake), and OpenWRT.
5. **Hands-On Buildroot Lab:** Complete walkthrough targeting STM32MP157D hardware:
   - Host setup & `apt` dependencies.
   - `make st_stm32mp157a_dk1_defconfig` & `make menuconfig`.
   - Cross-compilation execution (`make`).
   - SD card flashing with `lsblk` and `dd`.
   - Target connections (DIP boot switches, ST-Link UART console, serial permissions via `dialout`).
   - Target shell exploration & scripting with `vi`.
6. **Instructor Callouts & Student Assessment:** Hardware nuances (157A vs 157D chip clock frequencies), troubleshooting, and review questions.
