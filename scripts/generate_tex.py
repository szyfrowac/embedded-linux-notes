import os
import subprocess

tex_content = r"""\documentclass[11pt,a4paper]{article}

% --- Core Packages ---
\usepackage[utf8]{inputenc}
\usepackage[T1]{fontenc}
\usepackage{lmodern}
\usepackage[margin=0.75in]{geometry}
\usepackage{xcolor}
\usepackage{tcolorbox}
\tcbuselibrary{skins,breakable,listings}
\usepackage{booktabs}
\usepackage{tabularx}
\usepackage{multirow}
\usepackage{listings}
\usepackage{enumitem}
\usepackage{fancyhdr}
\usepackage{lastpage}
\usepackage{titlesec}
\usepackage{microtype}
\usepackage{caption}
\usepackage{amsmath,amssymb}
\usepackage{hyperref}

% --- Custom Color Palette ---
\definecolor{NavyBlue}{HTML}{1E3A8A}
\definecolor{SlateTeal}{HTML}{0D9488}
\definecolor{AmberOrange}{HTML}{D97706}
\definecolor{DarkCharcoal}{HTML}{1F2937}
\definecolor{CodeBg}{HTML}{F8FAFC}
\definecolor{BoxBgBlue}{HTML}{EFF6FF}
\definecolor{BoxBgGreen}{HTML}{F0FDF4}
\definecolor{BoxBgYellow}{HTML}{FFFBEB}
\definecolor{BoxBgPurple}{HTML}{F5F3FF}
\definecolor{BorderBlue}{HTML}{3B82F6}
\definecolor{BorderGreen}{HTML}{10B981}
\definecolor{BorderYellow}{HTML}{F59E0B}
\definecolor{BorderPurple}{HTML}{8B5CF6}

% --- Hyperlink Setup ---
\hypersetup{
    colorlinks=true,
    linkcolor=NavyBlue,
    citecolor=SlateTeal,
    urlcolor=NavyBlue,
    pdftitle={Embedded Linux Fundamentals \& Custom System Build Guide},
    pdfauthor={Comprehensive Lecture Notes}
}

% --- Header and Footer Formatting ---
\setlength{\headheight}{14pt}
\pagestyle{fancy}
\fancyhf{}
\rhead{\textcolor{NavyBlue}{\textbf{Embedded Linux Fundamentals}}}
\lhead{\textcolor{DarkCharcoal}{\small Lecture \& Hands-On Guide}}
\rfoot{\small Page \thepage\ of \pageref{LastPage}}
\lfoot{\small Embedded Systems Engineering}
\renewcommand{\headrulewidth}{0.6pt}
\renewcommand{\footrulewidth}{0.4pt}

% --- Section Title Styling ---
\titleformat{\section}
  {\color{NavyBlue}\normalfont\Large\bfseries}{\thesection}{1em}{}[{\titlerule[1pt]}]
\titleformat{\subsection}
  {\color{SlateTeal}\normalfont\large\bfseries}{\thesubsection}{1em}{}
\titleformat{\subsubsection}
  {\color{DarkCharcoal}\normalfont\bfseries}{\thesubsubsection}{1em}{}

% --- Custom TColorBoxes ---
\newtcolorbox{conceptbox}[1]{
  colback=BoxBgBlue,
  colframe=BorderBlue,
  fonttitle=\bfseries\color{white},
  coltitle=white,
  title={#1},
  enhanced,
  attach boxed title to top left={yshift=-2mm,xshift=3mm},
  boxed title style={colback=NavyBlue,arc=3mm},
  arc=2mm,
  boxrule=1pt,
  breakable
}

\newtcolorbox{warningbox}[1]{
  colback=BoxBgYellow,
  colframe=BorderYellow,
  fonttitle=\bfseries\color{white},
  coltitle=white,
  title={#1},
  enhanced,
  attach boxed title to top left={yshift=-2mm,xshift=3mm},
  boxed title style={colback=AmberOrange,arc=3mm},
  arc=2mm,
  boxrule=1pt,
  breakable
}

\newtcolorbox{tipbox}[1]{
  colback=BoxBgGreen,
  colframe=BorderGreen,
  fonttitle=\bfseries\color{white},
  coltitle=white,
  title={#1},
  enhanced,
  attach boxed title to top left={yshift=-2mm,xshift=3mm},
  boxed title style={colback=SlateTeal,arc=3mm},
  arc=2mm,
  boxrule=1pt,
  breakable
}

\newtcolorbox{cmdbox}[1]{
  colback=CodeBg,
  colframe=DarkCharcoal,
  fonttitle=\bfseries\color{white},
  coltitle=white,
  title={#1},
  enhanced,
  attach boxed title to top left={yshift=-2mm,xshift=3mm},
  boxed title style={colback=DarkCharcoal,arc=2mm},
  arc=2mm,
  boxrule=1pt,
  breakable
}

\newtcolorbox{takeawaybox}[1]{
  colback=BoxBgPurple,
  colframe=BorderPurple,
  fonttitle=\bfseries\color{white},
  coltitle=white,
  title={#1},
  enhanced,
  attach boxed title to top left={yshift=-2mm,xshift=3mm},
  boxed title style={colback=BorderPurple,arc=3mm},
  arc=2mm,
  boxrule=1pt,
  breakable
}

% --- Code Listing Styling ---
\lstset{
  backgroundcolor=\color{CodeBg},
  basicstyle=\ttfamily\small\color{DarkCharcoal},
  breakatwhitespace=false,
  breaklines=true,
  captionpos=b,
  commentstyle=\color{SlateTeal},
  escapeinside={\%*}{*)},
  keywordstyle=\color{NavyBlue}\bfseries,
  stringstyle=\color{AmberOrange},
  frame=none,
  numbers=left,
  numberstyle=\tiny\color{gray},
  stepnumber=1,
  numbersep=8pt,
  showspaces=false,
  showstringspaces=false,
  showtabs=false,
  tabsize=2
}

\begin{document}

% --- Title Banner ---
\begin{center}
    \tcbset{colback=NavyBlue,colframe=NavyBlue,arc=4mm}
    \begin{tcolorbox}[width=\textwidth,halign=center,valign=center,top=6mm,bottom=6mm]
        {\huge \color{white} \bfseries Embedded Linux Fundamentals \& Hands-On Buildroot Guide}\\[3mm]
        {\large \color{white} Architectural Trade-offs, Build Systems, and Target System Deployment}\\[2mm]
        {\small \color{white} Complete Comprehensive Lecture Notes \& Teaching Reference}
    \end{tcolorbox}
\end{center}

\vspace{2mm}
\tableofcontents
\vspace{4mm}
\hrule
\vspace{6mm}

% ==========================================
% SECTION 1: INTRODUCTION
% ==========================================
\section{Introduction: The Embedded Linux Ecosystem}

One of the defining strengths of the Linux operating system is its modular architecture and unmatched adaptability. When stripped of desktop overhead—such as graphical user interfaces (X11/Wayland), heavy desktop environments, and non-essential background daemons—Linux transforms into a highly compact, resilient operating system capable of running on resource-constrained Single Board Computers (SBCs) and Systems-on-Module (SOMs).

In 2018, an extensive IoT developer survey conducted by the Eclipse Foundation revealed that \textbf{Linux was selected as the primary operating system for IoT and embedded devices by a dominant margin}, eclipsing bare-metal environments, real-time operating systems (RTOS), and proprietary platform OS solutions. 

\begin{conceptbox}{Why Linux Dominates Embedded Systems}
\begin{itemize}[leftmargin=*]
    \item \textbf{High-Level Hardware Abstraction:} Drivers convert raw hardware registers into standard file system nodes (\texttt{/dev}, \texttt{/sys}, \texttt{/proc}), eliminating the need to write bit-manipulation register code for high-level logic.
    \item \textbf{Rich Software Ecosystem:} Access to POSIX APIs, multi-threaded networking stacks (TCP/IP, IPv6, TLS), database engines, web servers, and high-level language runtimes (Python, Node.js, Java, Go).
    \item \textbf{Portability Across Architectures:} Code written against Linux standard C libraries (\texttt{glibc}, \texttt{musl}) compiles seamlessly across ARM, RISC-V, x86, and MIPS hardware platforms.
    \item \textbf{Community \& Vendor Support:} Extensive open-source driver availability for peripheral ICs, Wi-Fi chips, cellular modems, and graphics accelerators.
\end{itemize}
\end{conceptbox}

However, using Linux in embedded hardware requires a fundamental shift in design philosophy. Engineers must choose between competing paradigms: Bare Metal, Real-Time Operating Systems (RTOS), Embedded Linux, or Heterogeneous Multi-Processing (AMP).

% ==========================================
% SECTION 2: COMPARATIVE PARADIGM ANALYSIS
% ==========================================
\section{Comparative Analysis of Embedded Software Architectures}

To select the right architecture for an embedded system, developers must evaluate CPU power, memory constraints, hardware control precision, timing requirements, and software development overhead.

\subsection{1. Bare Metal Programming}
Bare metal development involves executing code directly on hardware without an intermediate operating system or abstraction layer.
\begin{itemize}[leftmargin=*]
    \item \textbf{Target Processors:} 8-bit (e.g., AVR ATmega), 16-bit (e.g., MSP430), and low-end 32-bit Microcontrollers (MCUs) like ARM Cortex-M0/M3.
    \item \textbf{Hardware Access:} Direct register bit-flipping (e.g., \texttt{PORTB |= (1 << 3)}).
    \item \textbf{Advantages:} Ultra-low power consumption, zero OS overhead, microsecond-level micro-deterministic timing (ideal for hard real-time motor control, PWM, and sensor sampling), extremely cheap hardware costs.
    \item \textbf{Disadvantages:} Non-portable code tied tightly to chip register specs, lack of concurrency/multitasking, difficult to implement complex protocols like TCP/IP or TLS.
\end{itemize}

\subsection{2. Real-Time Operating Systems (RTOS)}
An RTOS (e.g., FreeRTOS, NuttX, Zephyr) introduces a kernel scheduler to provide multitasking while retaining low resource usage and high timing predictability.
\begin{itemize}[leftmargin=*]
    \item \textbf{Target Processors:} 32-bit MCUs (ARM Cortex-M4/M7, ESP32, RISC-V).
    \item \textbf{Hardware Access:} Vendor Board Support Packages (BSPs), peripheral HALs, and optional register access.
    \item \textbf{Advantages:} Multithreading with preemptive priority-based scheduling, low memory footprint (tens of kilobytes of RAM), hard/soft real-time capability via hardware timers and interrupts.
    \item \textbf{Disadvantages:} Lacks memory protection (MMU), dynamic file system management, advanced networking stacks, and support for high-level language runtimes.
\end{itemize}

\subsection{3. Embedded General-Purpose OS (Embedded Linux)}
Embedded Linux introduces a full-featured operating system kernel managing hardware resources via virtual memory and driver abstractions.
\begin{itemize}[leftmargin=*]
    \item \textbf{Target Processors:} 32-bit and 64-bit Microprocessors (MPUs) like ARM Cortex-A7/A53/A72, x86-64, RISC-V 64. Requires a Memory Management Unit (MMU).
    \item \textbf{Memory Requirements:} Hundreds of Megahertz to Gigahertz clock speeds, megabytes to gigabytes of external DRAM (DDR3/DDR4), and non-volatile flash (SD Card, eMMC, NAND).
    \item \textbf{Advantages:} Full process isolation, POSIX multithreading, advanced file systems, standard device drivers, network protocols, high-level languages, and rapid development cycles.
    \item \textbf{Disadvantages:} High boot time, significant power draw, large storage footprint, and loss of deterministic real-time control due to kernel preemption and abstraction overhead.
\end{itemize}

\subsection{4. Heterogeneous Multi-Processing (SoC with MPU + MCU)}
Modern chip manufacturers (e.g., STMicroelectronics, NXP, TI) combine the strengths of both worlds onto a single silicon die.
\begin{conceptbox}{Heterogeneous SoC Architecture (e.g., STM32MP1, i.MX8)}
A single silicon chip houses both:
\begin{enumerate}[leftmargin=*]
    \item \textbf{Application Processor Core(s):} ARM Cortex-A (runs Embedded Linux for networking, UI, web servers, databases, and heavy computer vision algorithms).
    \item \textbf{Co-Processor Core(s):} ARM Cortex-M or Cortex-R (runs Bare Metal or an RTOS for hard real-time sensor loops, motor control, and safety monitoring).
\end{enumerate}
Communication between cores is managed via shared SRAM memory and Inter-Processor Communication (IPC) frameworks like \texttt{RPMsg} and \texttt{OpenAMP}.
\end{conceptbox}

\begin{table}[h!]
\centering
\caption{Comprehensive Comparison of Embedded Development Architectures}
\label{tab:arch_comparison}
\small
\begin{tabularx}{\textwidth}{l X X X}
\toprule
\textbf{Feature / Paradigm} & \textbf{Bare Metal} & \textbf{Real-Time OS (RTOS)} & \textbf{Embedded Linux} \\
\midrule
\textbf{Processor Type} & Microcontroller (MCU) & High-end MCU & Microprocessor (MPU) \\
\textbf{MMU Required?} & No & No & Yes \\
\textbf{Clock Speed} & 8 MHz -- 100 MHz & 48 MHz -- 400 MHz & 500 MHz -- 2.0+ GHz \\
\textbf{RAM Requirement} & Bytes to KB & Kilobytes to Megabytes & 128 MB to Gigabytes \\
\textbf{Storage Media} & On-chip Flash & On-chip Flash & SD Card, eMMC, NAND \\
\textbf{Hardware Access} & Register bit-flipping & BSP / Direct Registers & Driver nodes (\texttt{/dev}, \texttt{/sys}) \\
\textbf{Concurrency} & Loop / Interrupts & Preemptive Multithreading & Multi-process \& Multi-thread \\
\textbf{Real-Time Determinism} & Hard Real-Time ($\mu$s) & Hard/Soft Real-Time & Non-deterministic (unless PREEMPT\_RT) \\
\textbf{Language Runtimes} & C, C++, Assembly & C, C++ & C, C++, Python, Java, Go, Rust \\
\textbf{Code Portability} & Very Low & Moderate & Very High \\
\bottomrule
\end{tabularx}
\end{table}

% ==========================================
% SECTION 3: INDUSTRIAL APPLICATIONS
% ==========================================
\section{Industrial \& Commercial Applications of Embedded Linux}

While hobbyists are familiar with the Raspberry Pi, it is crucial to differentiate between educational prototyping hardware and industrial-grade embedded systems.

\subsection{Where Embedded Linux is Deployed}
\begin{itemize}[leftmargin=*]
    \item \textbf{Industrial Networking \& Infrastructure:} Commercial routers, IoT edge gateways, firewalls, and remote telemetry units (RTUs).
    \item \textbf{Aerospace \& Defense:} Autonomous vehicle controllers, mission systems, and spaceflight computers (e.g., SpaceX Falcon 9 rocket flight computers run custom Linux kernels).
    \item \textbf{Robotics \& Automation:} ROS (Robot Operating System) nodes, automated guided vehicles (AGVs), and industrial manipulator arms.
    \item \textbf{Consumer Electronics \& Point-of-Sale (POS):} Smart appliances, interactive kiosks, digital signage, and medical monitoring equipment.
\end{itemize}

\begin{warningbox}{Why the Raspberry Pi is NOT an Industrial Solution}
The Raspberry Pi is an outstanding educational tool and desktop replacement, but it is rarely used in commercial products due to:
\begin{enumerate}[leftmargin=*]
    \item \textbf{Software Bloat:} General-purpose Raspberry Pi OS images contain GUI desktop suites, background daemons, and packages that cause slow boot times and high power draw.
    \item \textbf{Proprietary GPU Boot Architecture:} Booting relies on closed-source VideoCore GPU binary blobs rather than open standard U-Boot flows.
    \item \textbf{Hardware Availability \& Cost:} Lack of long-term industrial supply chain guarantees (10+ year availability required for industrial boards).
\end{enumerate}
\textbf{Production Approach:} Engineers design around System-on-Modules (SOMs) or reference SBC architectures (e.g., STM32MP1, NXP i.MX8, Microchip SAMA5) running a stripped-down, custom-built Linux distribution.
\end{warningbox}

% ==========================================
% SECTION 4: IMAGE CREATION METHODOLOGIES
% ==========================================
\section{Methods for Building Embedded Linux Systems}

There are three primary strategies for bringing up a Linux system on embedded target hardware:

\subsection{Strategy 1: Downloading Pre-Made Vendor Images}
Downloading a binary \texttt{.img} file from a hardware vendor (e.g., Raspberry Pi OS, Ubuntu Server) and writing it to an SD card.
\begin{itemize}[leftmargin=*]
    \item \textbf{Pros:} Fast setup, works immediately out of the box.
    \item \textbf{Cons:} Heavy software bloat, long boot times, high storage footprint, unnecessary power consumption, difficult to maintain across thousands of deployed production units.
\end{itemize}

\subsection{Strategy 2: Manual Source Compilation ("Glutton for Punishment")}
Manually fetching, cross-compiling, and linking toolchains, U-Boot, the Linux kernel, BusyBox, and every required library.
\begin{itemize}[leftmargin=*]
    \item \textbf{Pros:} Maximum theoretical understanding of build steps.
    \item \textbf{Cons:} Extremely tedious, error-prone, months of resolving cross-compiler dependency conflicts. Impractical for production.
\end{itemize}

\subsection{Strategy 3: Automated Build Systems (Buildroot, Yocto, OpenWRT)}
Using specialized embedded build automation suites to generate tailored, minimal root filesystems, kernel binaries, and bootloaders.

\begin{table}[h!]
\centering
\caption{Comparison of Automated Embedded Build Systems}
\label{tab:build_tools}
\small
\begin{tabularx}{\textwidth}{l X X X}
\toprule
\textbf{Metric / Tool} & \textbf{Buildroot} & \textbf{Yocto Project (Poky/BitBake)} & \textbf{OpenWRT} \\
\midrule
\textbf{Primary Design Goal} & Simplicity \& Speed & Enterprise Scalability \& Customization & Networking \& Router Gear \\
\textbf{Build Paradigm} & Single Make-based Makefile & Recipe-based (\texttt{.bb}) Layer system & Package Manager oriented \\
\textbf{Learning Curve} & Very Low (Hours/Days) & High (Weeks/Months) & Moderate \\
\textbf{Host Disk Footprint} & 5 GB -- 15 GB & 50 GB -- 100+ GB & 10 GB -- 20 GB \\
\textbf{Rebuild Behavior} & Rebuilds whole tree on config change & Incremental recipe updates (sstate-cache) & Package feeds update \\
\textbf{Target Update Model} & Monolithic OS image flash & Layered image or package feed & On-device package manager (\texttt{opkg}) \\
\textbf{Best Use Case} & Single-purpose, fixed-function SBCs & Large fleet deployments, complex OS stacks & Network gateways, routers \\
\bottomrule
\end{tabularx}
\end{table}

% ==========================================
% SECTION 5: HANDS-ON STEP-BY-STEP LAB
% ==========================================
\section{Hands-On Practical Lab: Building Embedded Linux with Buildroot}

This lab demonstrates how to construct, cross-compile, flash, and boot a minimalist, custom embedded Linux distribution targeting the \textbf{STMicroelectronics STM32MP157D-DK1 Discovery Kit}.

\subsection{Phase 1: Host System Preparation}
Build automation requires a Linux host environment (Ubuntu, Debian, Linux Mint, or WSL2/Docker).

\begin{cmdbox}{Step 1.1: Install Mandatory Host Packages}
First, update package indexes and install mandatory host compilation utilities:
\begin{lstlisting}[language=bash]
sudo apt update && sudo apt upgrade -y
sudo apt install -y build-essential libncurses5-dev libncursesw5-dev \
                    bison flex git rsync unzip bc wget cpio libssl-dev
\end{lstlisting}
\end{cmdbox}

\begin{cmdbox}{Step 1.2: Obtain Buildroot Source Code}
Create a dedicated working directory and clone the official Buildroot repository:
\begin{lstlisting}[language=bash]
mkdir -p ~/projects && cd ~/projects
git clone https://git.buildroot.net/buildroot
cd buildroot
\end{lstlisting}
\end{cmdbox}

\subsection{Phase 2: Target Configuration}

\begin{cmdbox}{Step 2.1: Inspect and Apply Board Defconfig}
Buildroot ships with pre-defined configurations inside the \texttt{configs/} directory. Inspect the available configurations for STM32 hardware:
\begin{lstlisting}[language=bash]
ls configs/ | grep stm32
\end{lstlisting}
Apply the default configuration for the STM32MP157 Discovery Kit:
\begin{lstlisting}[language=bash]
make st_stm32mp157a_dk1_defconfig
\end{lstlisting}
\textit{Note: This command generates a localized \texttt{.config} file containing all architecture, toolchain, kernel, and package parameters.}
\end{cmdbox}

\begin{cmdbox}{Step 2.2: Customize via Menuconfig}
Launch the ncurses graphical menu interface to review or modify build options:
\begin{lstlisting}[language=bash]
make menuconfig
\end{lstlisting}
Within \texttt{menuconfig}, engineers can configure:
\begin{itemize}[leftmargin=*]
    \item \textbf{Target Architecture:} ARM (little endian), Cortex-A7, NEON/VFPv4 floating point.
    \item \textbf{Toolchain:} Cross-compiler selection (GCC version, C library: \texttt{glibc}/\texttt{musl}/\texttt{uClibc}).
    \item \textbf{Kernel:} Linux kernel version, device tree sources (.dts).
    \item \textbf{Target Packages:} Adding lightweight tools (e.g., Python, dropbear SSH, i2c-tools).
    \item \textbf{Filesystem Images:} Ext4 rootfs, tarballs, and raw SD card image options.
\end{itemize}
Select \textbf{Exit} to return to the shell terminal.
\end{cmdbox}

\subsection{Phase 3: Cross-Compilation \& Build Artifact Inspection}

\begin{cmdbox}{Step 3.1: Execute Build}
Initiate the compilation process:
\begin{lstlisting}[language=bash]
make
\end{lstlisting}
\end{cmdbox}

\begin{tipbox}{Instructor Note: What Buildroot Performs During Compilation}
During \texttt{make}, Buildroot autonomously executes:
\begin{enumerate}[leftmargin=*]
    \item Downloads host build tools and target source archives.
    \item Cross-compiles the host cross-toolchain (\texttt{arm-linux-gnueabihf-gcc}).
    \item Compiles First Stage Bootloader (TF-A) and Second Stage Bootloader (U-Boot).
    \item Compiles the Linux Kernel image (\texttt{zImage}) and Device Tree Blob (\texttt{stm32mp157a-dk1.dtb}).
    \item Builds BusyBox and populates the root filesystem structure (\texttt{/bin}, \texttt{/etc}, \texttt{/lib}).
    \item Packs everything into output partition files and a raw \texttt{sdcard.img}.
\end{enumerate}
\end{tipbox}

\begin{cmdbox}{Step 3.2: Inspect Build Artifacts}
Once compilation completes, navigate to the output directory:
\begin{lstlisting}[language=bash]
ls -lh output/images/
\end{lstlisting}
Key files present:
\begin{itemize}[leftmargin=*]
    \item \texttt{sdcard.img}: Complete partitioned disk image ready to flash.
    \item \texttt{zImage}: Compressed Linux kernel binary.
    \item \texttt{stm32mp157a-dk1.dtb}: Compiled hardware Device Tree Blob.
    \item \texttt{rootfs.ext4}: Root filesystem partition file.
\end{itemize}
\end{cmdbox}

\subsection{Phase 4: Flashing Image to SD Card}

\begin{cmdbox}{Step 4.1: Identify Raw Storage Block Device}
Insert an SD card into the host computer. Identify its node using \texttt{lsblk}:
\begin{lstlisting}[language=bash]
lsblk
\end{lstlisting}
Identify the \textbf{raw block device name} (e.g., \texttt{/dev/mmcblk2} or \texttt{/dev/sdb}). Unmount any auto-mounted partition nodes:
\begin{lstlisting}[language=bash]
sudo umount /dev/mmcblk2p* 2>/dev/null || true
\end{lstlisting}
\end{cmdbox}

\begin{warningbox}{DANGER: Raw Disk Overwrite Risk with \texttt{dd}}
The \texttt{dd} utility performs bit-for-bit raw block copies. Specifying the wrong target drive (e.g., \texttt{of=/dev/sda}) will overwrite your host operating system drive, destroying all data without warning!
\begin{itemize}[leftmargin=*]
    \item Always target the raw disk node (\texttt{/dev/mmcblk2}), NOT a specific partition (\texttt{/dev/mmcblk2p1}).
    \item Double-check device size against \texttt{lsblk} output before pressing Enter.
\end{itemize}
\end{warningbox}

\begin{cmdbox}{Step 4.2: Flash Image with \texttt{dd}}
Execute raw bit-for-bit flashing to the target SD card:
\begin{lstlisting}[language=bash]
sudo dd if=output/images/sdcard.img of=/dev/mmcblk2 bs=1M status=progress
sync
\end{lstlisting}
Safely remove the SD card from the host.
\end{cmdbox}

\subsection{Phase 5: Hardware Target Connection \& Serial Console Setup}

\begin{conceptbox}{STM32MP157D-DK1 Hardware Configuration}
\begin{itemize}[leftmargin=*]
    \item \textbf{Boot Switches:} Set DIP switches \texttt{BOOT0} and \texttt{BOOT2} to \textbf{ON} to enforce booting from the MicroSD card slot.
    \item \textbf{Serial Console Connector:} Connect a Micro-USB cable from the host PC to the onboard ST-LINK USB port. The onboard ST-Link acts as a USB-to-UART bridge connected to UART4.
    \item \textbf{Power Supply:} Connect a dedicated 5V / 3A USB-C cable to the power connector port.
\end{itemize}
\end{conceptbox}

\begin{cmdbox}{Step 5.1: Configure Host User Serial Permissions}
Serial devices (\texttt{/dev/ttyACM0} or \texttt{/dev/ttyUSB0}) on Linux host machines are restricted to the \texttt{dialout} group. Add your host user to this group to prevent permission errors:
\begin{lstlisting}[language=bash]
sudo usermod -aG dialout $USER
groups $USER
\end{lstlisting}
\textit{Note: You must log out and log back in (or run \texttt{newgrp dialout}) for group changes to take effect.}
\end{cmdbox}

\begin{cmdbox}{Step 5.2: Open Serial Terminal with \texttt{picocom}}
Launch \texttt{picocom} at 115200 baud rate:
\begin{lstlisting}[language=bash]
picocom -b 115200 /dev/ttyACM0
\end{lstlisting}
Press the target board's \textbf{RESET} button. The serial terminal will display the full boot sequence: TF-A loader $\rightarrow$ U-Boot initialization $\rightarrow$ Linux Kernel boot log $\rightarrow$ init system startup.
\end{cmdbox}

\subsection{Phase 6: Target Bootup, Inspection, and Target Scripting}

Once booted, the Buildroot minimal OS presents a login prompt:
\begin{lstlisting}[language=bash]
buildroot login: root
\end{lstlisting}
\textit{Note: Default Buildroot images use username \texttt{root} with no password required.}

\begin{cmdbox}{Step 6.1: Explore Target Filesystem}
Inspect the system environment directly on the target hardware:
\begin{lstlisting}[language=bash]
# Check running kernel version
uname -a

# Inspect memory footprint
free -h

# Inspect mounted filesystems
df -h

# Verify CPU information
cat /proc/cpuinfo
\end{lstlisting}
Notice that the entire operating system consumes less than 30-50 MB of storage space and boots in under 3-5 seconds!
\end{cmdbox}

\begin{cmdbox}{Step 6.2: Create and Execute a Test Script on Target}
Embedded Linux provides standard POSIX shell scripting capabilities via BusyBox:
\begin{lstlisting}[language=bash]
vi test.sh
\end{lstlisting}
Press \texttt{i} to enter insert mode in \texttt{vi}, then add:
\begin{lstlisting}[language=bash]
#!/bin/sh
echo "---------------------------------------"
echo "  Hello from Custom Embedded Linux!   "
echo "  Board: STM32MP157D Discovery Kit    "
echo "---------------------------------------"
\end{lstlisting}
Press \texttt{Esc}, type \texttt{:wq} and press Enter to save and exit. Grant execution permissions and run the script:
\begin{lstlisting}[language=bash]
chmod +x test.sh
./test.sh
\end{lstlisting}
\end{cmdbox}

\begin{cmdbox}{Step 6.3: Exit Host Serial Terminal Session}
To disconnect from the target serial console in \texttt{picocom}, press:
\begin{center}
\textbf{\texttt{Ctrl + A}} followed by \textbf{\texttt{Ctrl + X}}
\end{center}
\end{cmdbox}

% ==========================================
% SECTION 6: INSTRUCTOR NOTES & PITFALLS
% ==========================================
\section{Instructor Teaching Notes, Common Pitfalls, \& Student Exercises}

\begin{tipbox}{Pedagogical Insight: Chip Variant Compatibility}
\textbf{The 157A vs 157D Hardware Nuance:}
In this lab, the defconfig \texttt{st\_stm32mp157a\_dk1\_defconfig} was used on an \textbf{STM32MP157D} board.
\begin{itemize}[leftmargin=*]
    \item \textbf{STM32MP157A:} Rated clock frequency up to 650 MHz (no hardware crypto engine).
    \item \textbf{STM32MP157D:} Rated clock frequency up to 800 MHz (includes hardware crypto engine).
\end{itemize}
Because clock setups in the 157A defconfig bootloader run the core at 650 MHz, running the 157A binary image on a 157D chip safely underclocks the hardware. While safe for testing, instructors should emphasize that production builds must match exact chip sub-variants to utilize full performance and peripheral hardware features.
\end{tipbox}

\subsection{Troubleshooting \& Common Student Errors}
\begin{enumerate}[leftmargin=*]
    \item \textbf{Permission Denied on \texttt{/dev/ttyACM0}:}
    Students forget to add their host user account to the \texttt{dialout} group or fail to re-login to update group privileges.
    \item \textbf{No Output on Serial Terminal:}
    Verify physical baud rate (must be set to 115200). Ensure Micro-USB cable supports data communication, not power only.
    \item \textbf{Target Fails to Boot from SD Card:}
    Verify DIP switches \texttt{BOOT0} and \texttt{BOOT2} are flipped to ON. Verify that \texttt{dd} was flashed to the raw disk node (\texttt{/dev/mmcblk2}) and that \texttt{sync} was executed before card extraction.
\end{enumerate}

\subsection{Student Review Questions}
\begin{enumerate}[leftmargin=*]
    \item Contrast bare-metal programming with Embedded Linux in terms of real-time determinism, memory requirements, and code portability.
    \item Explain the function of a Memory Management Unit (MMU) and state why it is mandatory for running standard Embedded Linux.
    \item Describe the architecture of a Heterogeneous Multi-Core SoC (e.g., STM32MP1) and explain how task allocation is divided between MPU and MCU cores.
    \item Compare Buildroot and the Yocto Project. Under what conditions would an engineering team choose Buildroot over Yocto?
    \item Trace the boot sequence of an embedded Linux target from power-on reset to the root login prompt.
\end{enumerate}

\begin{takeawaybox}{Summary of Key Concepts}
Embedded Linux provides an unparalleled ecosystem for building powerful, networked, and portable embedded products. By leveraging automated build frameworks like Buildroot, developers eliminate bloat, minimize hardware footprint, achieve fast boot times, and maintain complete control over every binary included in production devices.
\end{takeawaybox}

\end{document}
"""

file_path = "/home/phanikar/BITS/3-2/Projects/Kria/embedded_linux_lecture_notes.tex"
with open(file_path, "w", encoding="utf-8") as f:
    f.write(tex_content)

print(f"Successfully wrote {file_path}")
