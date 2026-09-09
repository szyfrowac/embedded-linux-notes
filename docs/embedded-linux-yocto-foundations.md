# Embedded Linux Foundations & Yocto Quickstart

<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem; color: white;">

**🎯 Learning Objectives**

By the end of this module, you will be able to:
1. Identify the four essential elements of every embedded Linux system
2. Explain what the Yocto Project is and why it exists
3. Describe the relationship between Poky, BitBake, and OpenEmbedded-Core
4. Set up a host build environment and compile your first image
5. Boot a custom ARM Linux image inside QEMU without any physical hardware

</div>

::: info PREREQUISITES
- A Linux host machine (Ubuntu 22.04 or 24.04 LTS recommended)
- At least **50 GB free disk space** and **8 GB RAM** (16 GB recommended)
- Basic command-line familiarity (navigating directories, editing files, running commands)
- No embedded hardware required — we use QEMU emulation throughout this module
:::

---

## 1. The Four Essential Elements of Embedded Linux

Every embedded Linux system — whether it powers a drone, an industrial PLC, a medical device, or a smart home gateway — is assembled from exactly **four foundational building blocks**. Understanding these blocks is the key to understanding everything else in this course.

![Yocto Project Ecosystem Architecture](/yocto_ecosystem_arch.png)

### 1.1 Toolchain

The **toolchain** is the collection of software development tools used to compile, link, and debug code for the target hardware. Since embedded targets (ARM, RISC-V, MIPS) have different CPU architectures than your development PC (x86_64), you need a **cross-compiler** — a compiler that runs on x86_64 but generates binaries for ARM.

A complete toolchain includes:

| Component | Purpose | Example |
|---|---|---|
| **Cross-Compiler** | Translates C/C++ source code to target machine code | `arm-poky-linux-gnueabi-gcc` |
| **Binutils** | Assembler, linker, object file utilities | `arm-poky-linux-gnueabi-ld`, `ar`, `objdump` |
| **C Library** | Standard POSIX API implementation for target | `glibc`, `musl`, `uClibc-ng` |
| **GDB** | Remote debugger for target applications | `arm-poky-linux-gnueabi-gdb` |
| **Kernel Headers** | Linux kernel API definitions for userspace | `linux-libc-headers` |

::: tip EVERYTHING DEPENDS ON THE TOOLCHAIN
The toolchain is the very first thing that must be built. The bootloader, kernel, and every userspace library are compiled using it. If the toolchain is misconfigured, nothing else will work.
:::

### 1.2 Bootloader

The **bootloader** is the first software to execute after the CPU's power-on reset. Its job is to initialize the bare minimum hardware (clock PLLs, DRAM controllers, storage interfaces) and load the Linux kernel into memory.

The most widely used bootloader in embedded Linux is **Das U-Boot** (Universal Boot Loader). U-Boot supports hundreds of board configurations and provides an interactive command-line shell for debugging boot issues.

**Key bootloader responsibilities:**
- Initialize CPU clock tree and power management IC (PMIC)
- Configure external DRAM memory controller timing parameters
- Initialize storage interfaces (eMMC, SD/MMC, NAND, NOR, SPI flash)
- Load the Linux kernel image (`zImage` or `Image`) and Device Tree Blob (`.dtb`) into RAM
- Pass boot arguments (`bootargs`) and transfer execution to the kernel entry point

### 1.3 Linux Kernel

The **Linux kernel** is the core operating system. It provides:

- **Process scheduling** — preemptive multitasking across multiple CPU cores
- **Memory management** — virtual memory via the Memory Management Unit (MMU), `mmap`, page faults
- **Device drivers** — hardware abstraction through `/dev`, `/sys`, and `/proc` filesystems
- **Networking stack** — TCP/IP, UDP, IPv6, netfilter, WiFi (cfg80211/mac80211)
- **Filesystem support** — ext4, squashfs, UBIFS (for raw NAND), tmpfs, overlayfs

The kernel is configured using **Kconfig** (`make menuconfig`) and compiled for the specific target SoC. A crucial companion file is the **Device Tree Blob (`.dtb`)**, which describes the hardware peripherals (UARTs, I2C buses, SPI controllers, GPIO pins) to the kernel at boot time, eliminating the need to hard-code board details into kernel source code.

### 1.4 Root Filesystem (rootfs)

The **root filesystem** is the userspace environment that the kernel mounts after boot. It contains:

```
/
├── bin/          # Essential system binaries (busybox, sh, ls, mount)
├── etc/          # System configuration files (network, services, init)
├── lib/          # Shared libraries (libc.so, libm.so, libpthread.so)
├── usr/
│   ├── bin/      # Non-essential user binaries (htop, nano, python3)
│   └── lib/      # Additional shared libraries
├── dev/          # Device nodes (dynamically populated by udev/mdev)
├── proc/         # Virtual filesystem exposing kernel process info
├── sys/          # Virtual filesystem exposing kernel device model (sysfs)
├── tmp/          # Temporary file storage (tmpfs)
└── var/          # Variable data: logs, caches, spool directories
```

::: info THE 5TH ELEMENT: YOUR APPLICATION
The four elements above form a bootable Linux system, but it does nothing useful by itself. The **5th element** is your custom application stack — whether it's a drone flight controller, an industrial SCADA interface, or a video streaming pipeline. Combined with the core four elements, this forms a complete **Embedded Linux Image**.
:::

---

## 2. What is the Yocto Project?

> *"The Yocto Project is an open source collaboration project that helps developers create custom Linux-based systems that are designed for embedded products regardless of the product's hardware architecture."*
> — [Official Yocto Project Documentation](https://docs.yoctoproject.org/overview-manual/yp-intro.html)

The name "Yocto" comes from the SI metric prefix $y = 10^{-24}$ — the smallest officially recognized unit prefix — symbolizing the project's goal of building the smallest possible Linux system tailored to your hardware.

### 2.1 Key Features (from Official Documentation)

| Feature | Description |
|---|---|
| **Widely Adopted Across Industry** | Used by Intel, AMD, Texas Instruments, NXP, Qualcomm, Xilinx/AMD, Broadcom, and thousands of product companies |
| **Architecture Agnostic** | Supports ARM (32/64-bit), x86, x86_64, MIPS, PowerPC, and RISC-V |
| **Flexible & Extensible** | Layer-based architecture allows adding, removing, or overriding any component without modifying core metadata |
| **Customizable Output** | Produces bootable images (`.wic`, `.sdimg`, `.ext4`), package feeds (`.ipk`, `.rpm`, `.deb`), and SDKs |
| **Reproducible Builds** | Given the same inputs (layer revisions, configuration), produces bit-for-bit identical outputs |
| **License Compliance** | Automated license manifest generation and source code archival for legal compliance |

### 2.2 Challenges (Be Aware)

The Yocto Project documentation officially acknowledges these challenges:

- **Steep learning curve** — understanding metadata, BitBake syntax, layer interactions, and task execution requires significant study
- **Build times** — initial full builds can take **2–4 hours** on a modern workstation (subsequent incremental builds are much faster thanks to shared state cache)
- **Disk space** — a single build can consume **30–100+ GB** of disk space
- **Debugging complexity** — when recipes fail, diagnosing the root cause requires understanding the task execution model

### 2.3 Yocto vs Buildroot vs OpenWrt

| Criterion | Yocto Project | Buildroot | OpenWrt |
|---|---|---|---|
| **Primary Use Case** | Custom product-grade Linux distributions | Quick prototyping & small images | Network routers & access points |
| **Build System** | BitBake + OE-Core (Python-based) | GNU Make + Kconfig | GNU Make + Kconfig |
| **Output Format** | Full image + package feeds + SDK | Single monolithic image | Single image with opkg packages |
| **Package Management** | rpm, deb, ipk (on-target updates) | No on-target package manager | opkg package manager |
| **Layer Architecture** | Yes (modular, extensible, shareable) | No (single tree) | Feeds (limited layering) |
| **Binary Reproducibility** | Yes (with locked revisions) | Partial | Partial |
| **Learning Curve** | High | Low–Medium | Medium |
| **Ideal For** | Complex products, long lifecycle, multiple hardware targets | Simple systems, rapid prototyping | Network appliances |

---

## 3. The Poky Reference Distribution

**Poky** is the reference distribution of the Yocto Project. Think of it as a complete, working example that demonstrates how to use the Yocto build system. You clone Poky, configure it for your target hardware, and BitBake produces a bootable Linux image.

![Poky Reference Distribution](/poky-reference-distribution.png)

### 3.1 What's Inside Poky?

Poky combines three major open-source projects:

1. **BitBake** — The task execution engine (written in Python). BitBake parses recipe files, resolves dependency graphs, fetches source code, and orchestrates the entire build pipeline. It is analogous to `make`, but far more powerful and designed specifically for cross-compilation.

2. **OpenEmbedded-Core (OE-Core / `meta/`)** — The core metadata layer containing ~850 fundamental recipes for building a complete Linux system (toolchain, kernel, busybox, systemd, glibc, dbus, and more), along with ~100 `.bbclass` files providing shared build logic.

3. **`meta-yocto-bsp`** — The Board Support Package layer providing machine configurations for QEMU emulators (`qemux86-64`, `qemuarm`, `qemuarm64`, `qemumips`) and reference hardware (BeagleBone, generic x86).

---

## 4. Setting Up the Host Build Environment

::: warning HOST OS REQUIREMENT
The Yocto Project officially supports Ubuntu and Fedora as host operating systems. **Ubuntu 22.04 LTS or 24.04 LTS** is strongly recommended for this course. macOS and Windows (WSL2) have limited/experimental support.
:::

### 4.1 Install Required Host Packages

```bash
# Update host package indexes
sudo apt update && sudo apt upgrade -y

# Install mandatory Yocto Project build dependencies
sudo apt install -y \
    gawk wget git diffstat unzip texinfo gcc build-essential \
    chrpath socat cpio python3 python3-pip python3-pexpect \
    xz-utils debianutils iputils-ping python3-git \
    python3-jinja2 libegl1-mesa libsdl1.2-dev pylint xterm \
    python3-subunit mesa-common-dev zstd liblz4-tool \
    file locales libacl1

# Ensure UTF-8 locale is configured (required by BitBake)
sudo locale-gen en_US.UTF-8
```

### 4.2 Configure Git Identity (Required)

BitBake uses Git internally. Configure your identity:

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

---

## 5. Building and Running Your First ARM Image in QEMU

This is the hands-on core of Day 1. We will clone Poky, configure a QEMU ARM target, build a minimal Linux image, and boot it — all without any physical hardware.

### Step 1: Clone the Poky Repository

```bash
cd ~
mkdir yocto-masterclass && cd yocto-masterclass
# Clone Poky at the Kirkstone LTS release branch
git clone -b kirkstone https://git.yoctoproject.org/git/poky
cd poky
```

::: info GIT PROTOCOL VS HTTPS
We use the `https://` protocol here because the native `git://` protocol (port 9418) is frequently blocked by corporate firewalls or ISPs.
:::

::: tip CHOOSING A RELEASE BRANCH
Yocto release branches are named after celestial/scientific terms: **Dunfell** (3.1 LTS), **Kirkstone** (4.0 LTS), **Scarthgap** (5.0 LTS). Always use an LTS (Long Term Support) branch for production work. See the [official release page](https://wiki.yoctoproject.org/wiki/Releases) for the latest.
:::

### Step 2: Initialize the Build Environment

```bash
source oe-init-build-env
```

This script:
- Creates the `build/` directory (if it doesn't exist)
- Generates default `conf/local.conf` and `conf/bblayers.conf`
- Adds BitBake and helper scripts to your `$PATH`
- Changes your working directory into `build/`

### Step 3: Configure the Target Machine

Edit `conf/local.conf` to target ARM emulation:

```bash
# Set MACHINE to ARM QEMU emulator
MACHINE = "qemuarm"
```

### Step 4: Start the Build

```bash
# Build the minimal console-only image
bitbake core-image-minimal
```

::: warning FIRST BUILD TAKES TIME
The initial build downloads all source code (~5 GB), builds the cross-toolchain from scratch, compiles the Linux kernel, and assembles the rootfs. Expect **1.5–4 hours** depending on your CPU and internet speed. Subsequent builds with `sstate-cache` take only minutes.
:::

### Step 5: Boot the Image in QEMU

```bash
# Launch QEMU with graphical window
runqemu qemuarm

# Or: text-only serial console (no GUI required)
runqemu qemuarm nographic
```

**Expected output** (serial console):
```
Poky (Yocto Project Reference Distro) 4.0.x qemuarm /dev/ttyAMA0

qemuarm login: root
root@qemuarm:~# uname -a
Linux qemuarm 5.15.x #1 SMP ... armv7l GNU/Linux
root@qemuarm:~# cat /etc/os-release
ID=poky
NAME="Poky (Yocto Project Reference Distro)"
VERSION="4.0.x (kirkstone)"
```

*To exit `nographic` QEMU session: Press `Ctrl+A` then `X`.*

---

## 6. Customizing the Root Filesystem

To include additional packages in your image without modifying recipe files, append to `IMAGE_INSTALL` in `conf/local.conf`:

```bash
# Append packages to the root filesystem
IMAGE_INSTALL:append = " i2c-tools nano dropbear htop"
```

::: danger COMMON SYNTAX MISTAKE
The space before `i2c-tools` in `:append` is **mandatory**. Without it, the package name gets concatenated with the previous value (e.g., `packagegroup-core-booti2c-tools`) and BitBake throws a confusing error. This is the single most common beginner mistake in Yocto.
:::

Rebuild:
```bash
bitbake core-image-minimal
```

---

## 7. Standard Yocto Reference Images

Yocto provides several pre-built image recipes for different use cases:

| Image Recipe | Contents | Typical Size | Use Case |
|---|---|---|---|
| `core-image-minimal` | BusyBox, basic init, kernel | ~8 MB rootfs | Starting point for all custom images |
| `core-image-base` | Minimal + full hardware support packages | ~30 MB rootfs | Hardware validation & testing |
| `core-image-full-cmdline` | Feature-rich console with coreutils, bash, networking | ~150 MB rootfs | Development & debugging |
| `core-image-sato` | Full Matchbox/X11 graphical desktop environment | ~300 MB rootfs | GUI application development |
| `core-image-weston` | Wayland/Weston compositor-based graphical environment | ~250 MB rootfs | Modern graphics stack |

---

## 8. Hands-On Lab Exercises

::: tip LAB 1.1: Image Comparison
1. Build `core-image-minimal` for `qemuarm`
2. Build `core-image-sato` for `qemux86-64`
3. Compare the `.manifest` files in `tmp/deploy/images/` — count the number of packages in each
4. Note the build time and disk space difference between them
:::

::: tip LAB 1.2: Add a Custom Package
1. Add `IMAGE_INSTALL:append = " python3 curl"` to `conf/local.conf`
2. Rebuild `core-image-minimal`
3. Boot in QEMU and run `python3 --version` and `curl --help` to verify installation
:::

---

## 9. Further Reading & Official References

| Resource | URL |
|---|---|
| Yocto Project Quick Build Guide | [docs.yoctoproject.org/brief-yoctoprojectqs](https://docs.yoctoproject.org/brief-yoctoprojectqs/index.html) |
| Yocto Overview & Concepts Manual | [docs.yoctoproject.org/overview-manual](https://docs.yoctoproject.org/overview-manual/yp-intro.html) |
| BitBake User Manual | [docs.yoctoproject.org/bitbake](https://docs.yoctoproject.org/bitbake.html) |
| Supported Host Distributions | [docs.yoctoproject.org/ref-manual/system-requirements](https://docs.yoctoproject.org/ref-manual/system-requirements.html) |

---

<div style="display: flex; justify-content: space-between; margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #e2e8f0;">
<span></span>
<a href="/day2-yocto-architecture-terminology-workflow">Day 2: Architecture & Terminology →</a>
</div>
