---
layout: home

hero:
  name: "Embedded Linux & Yocto Masterclass"
  text: "Complete 16-Day Professional Tutorial"
  tagline: "Build production-grade embedded Linux distributions from scratch. No hardware required — learn with QEMU & Renode emulation."
  actions:
    - theme: brand
      text: 🚀 Start the Masterclass
      link: /prerequisites-and-setup
    - theme: alt
      text: ⚡ Cheat Sheet
      link: /cheat-sheet
    - theme: alt
      text: 🖥️ Renode Guide
      link: /renode-emulation-guide

features:
  - icon: 🐧
    title: Complete Linux Ecosystem
    details: From toolchain to rootfs — master the four essential elements of embedded Linux and understand when to choose Linux over RTOS or bare metal.
  - icon: 📦
    title: 16-Day Yocto Deep Dive
    details: Master Poky, BitBake operators, custom recipes, image features, package splitting, shared libraries, Autotools, CMake, devshell, and bbappends.
  - icon: 🖥️
    title: No Hardware Required
    details: Complete every lab exercise using QEMU (ARM, x86) or Renode (ZedBoard/Zynq-7000). Optional hardware guides included for BeagleBone Black & Raspberry Pi.
  - icon: 🛠️
    title: Production-Ready Skills
    details: Learn build optimization, license compliance, dependency management, source patching, custom splash screens, and professional layer architecture.
---

## Course Structure

This tutorial is organized into three parts, progressing from fundamentals to production-ready Yocto expertise.

---

### 📋 Getting Started

- [Prerequisites & Host Setup Guide](/prerequisites-and-setup) — **Start here!**

---

### Part I: Embedded Linux & Buildroot Fundamentals

| Module | Topic |
|---|---|
| [01. Linux Ecosystem](/01-introduction) | Why Linux dominates embedded systems |
| [02. Architecture Paradigms](/02-paradigms) | Bare Metal vs RTOS vs Linux vs AMP |
| [03. Industrial Applications](/03-applications) | Real-world embedded Linux use cases |
| [04. Build Methods](/04-build-methods) | Buildroot vs Yocto vs OpenWrt comparison |
| [05. Buildroot Lab](/05-buildroot-lab) | Hands-on Buildroot image build |
| [06. Instructor Notes](/06-instructor-notes) | Teaching tips and common student pitfalls |

---

### Part II: Complete 16-Day Yocto & Hardware Masterclass

| Day | Topic | Key Skills |
|---|---|---|
| [Day 1](/embedded-linux-yocto-foundations) | Yocto Foundations & QEMU | Poky, BitBake, `core-image-minimal`, QEMU ARM |
| [Day 2](/yocto-architecture-terminology-workflow) | Architecture & Terminology | `local.conf`, `bblayers.conf`, build workflow, `sstate-cache` |
| [Day 3](/beaglebone-black-hardware-bringup) | BeagleBone Black Bring-Up | AM335x boot, SD card, serial console, **QEMU alternative** |
| [Day 4](/yocto-releases-bsp-layers-wic) | Releases, BSP Layers & WIC | Release branches, `meta-ti`, `.wic` disk images |
| [Day 5](/raspberry-pi-hardware-bringup) | Raspberry Pi Bring-Up | VideoCore boot, `meta-raspberrypi`, **QEMU alternative** |
| [Day 6](/bitbake-operators-and-layer-creation) | BitBake Operators & Layers | `=`, `:=`, `?=`, `:append`, `bitbake-layers create-layer` |
| [Day 7](/custom-image-recipes-and-features) | Custom Image Recipes | `inherit core-image`, `IMAGE_FEATURES`, manifest files |
| [Day 8](/writing-recipes-and-c-apps) | Writing Recipes & C Apps | `SRC_URI`, `do_compile`, `do_install`, `${D}`, `${bindir}` |
| [Day 9](/build-logs-debugging-makefiles) | Build Logs & Makefiles | `log.do_compile`, `bbnote/bbwarn`, `oe_runmake` |
| [Day 10](/git-repositories-and-source-patching) | Git Repos & Patching | `git://` fetcher, `SRCREV`, `.patch` files, `do_patch` |
| [Day 11](/package-splitting-and-installed-vs-shipped) | Package Splitting | `PACKAGES`, `FILES:${PN}`, `[installed-vs-shipped]` |
| [Day 12](/static-and-dynamic-shared-libraries) | Shared Libraries | `.a`, `.so`, `ALLOW_EMPTY`, `SOLIBS`, `SOLIBSDEV` |
| [Day 13](/recipe-dependencies-depends-rdepends) | Dependencies | `DEPENDS`, `RDEPENDS`, `recipe-sysroot`, `bitbake -g` |
| [Day 14](/autotools-and-cmake-build-systems) | Autotools & CMake | `inherit autotools/cmake`, `EXTRA_OECONF/OECMAKE` |
| [Day 15](/cmake-recipes-and-devshell-debugging) | CMake & Devshell | `bitbake -c devshell`, interactive cross-compilation |
| [Day 16](/filespath-splashscreen-and-bbappends) | BBAppends & Splash | `FILESEXTRAPATHS`, `psplash`, `.bbappend`, `show-appends` |

---

### Part III: Advanced Deep Dives

| Day | Topic | Key Skills |
|---|---|---|
| [Day 17](/busybox-deep-dive) | BusyBox Deep Dive | Symlinks, `busybox-menuconfig`, replacing GNU Coreutils |
| [Day 18](/device-trees-dts-dtb-dtc) | Device Trees (DTS/DTB) | Hardware description, syntax, `dtc` compilation |
| [Day 19](/kernel-configuration-menuconfig) | Kernel & Menuconfig | `.cfg` fragments, `virtual/kernel`, `menuconfig` |
| [Day 20](/uboot-tftp-nfs-booting) | U-Boot, TFTP & NFS | `bootcmd`, network booting for rapid development |
| [Day 21](/init-systems-and-systemd) | Systemd & Init Systems | PID 1, `.service` files, auto-starting applications |

---

### 🔧 Hardware & Emulation

| Guide | Description |
|---|---|
| [Zynq/PYNQ/ZedBoard Curriculum](/07-zynq-yocto-dtc-tutorial-guide) | Device Trees, DTC, and FPGA-SoC bring-up for Xilinx Zynq-7000 |
| [🖥️ Renode Emulation Guide](/renode-emulation-guide) | Run ZedBoard Linux images in Renode without physical hardware |

---

### 📖 Quick Reference

| Resource | Description |
|---|---|
| [⚡ BitBake Cheat Sheet](/cheat-sheet) | All essential commands, variables, and operators on one page |
| [📚 Glossary of Terms](/glossary) | A-Z reference of Yocto, BitBake, and embedded Linux terminology |
| [🔍 Troubleshooting FAQ](/troubleshooting-faq) | Common build errors and step-by-step solutions |
