# 07. Practical Curriculum Guide: Yocto, Device Trees & Zynq Bring-Up

This guide outlines a structured, hands-on learning roadmap for teaching juniors how to build custom Embedded Linux systems, write/modify Device Trees (`.dts`/`.dtsi`), and master the Yocto Project targeting **Xilinx Zynq-7000 hardware (ZedBoard, PYNQ-Z1, or PYNQ-Z2)**.

---

## 📺 Recommended Video Reference Library

When teaching juniors, recommend these specific video courses and channels organized by domain:

### Category 1: Device Tree (DTS, DTB, DTC & Overlays)
1. **Bootlin (formerly Free Electrons) – Device Tree for Unix Developers:**
   - *Presenter:* Thomas Petazzoni / Grégory Clément.
   - *Why it's essential:* Explains hardware description syntax, node hierarchy, memory maps (`reg`), interrupt controllers, clock bindings, and how the Linux kernel parses DTBs at boot.
2. **FastBit Embedded Brain Academy (Kiran Nayak) – Linux Device Driver & Device Tree:**
   - *Why it's essential:* Detailed line-by-line breakdown of editing `.dts` files, compiling with `dtc` (`dtc -I dts -O dtb -o devicetree.dtb system.dts`), and inspecting `/proc/device-tree` on target hardware.
3. **Low Level Learning – What is a Device Tree in Linux?**
   - *Why it's essential:* A concise 10-minute conceptual primer ideal for juniors before diving into complex syntax.

### Category 2: Yocto Project & OpenEmbedded
1. **Bootlin – Yocto Project & OpenEmbedded Training (Full Video Series + Slides):**
   - *Why it's essential:* The industry standard training course covering Poky, BitBake syntax, `.bb` recipes, `.bbappend` overrides, layer creation (`meta-custom`), and `conf/local.conf`.
2. **BOPV (YouTube) – Yocto Linux #1: Initial Setup and ZedBoard Bring-Up:**
   - *Why it's essential:* A direct, practical video series walking through setting up Yocto specifically for the Xilinx ZedBoard (Zynq Z7020) using `meta-xilinx`.
3. **Digi-Key / Shawn Hymel – Introduction to Embedded Linux Series:**
   - *Why it's essential:* Excellent high-level overview of bootloaders (U-Boot), kernel compilation, root filesystem generation, and system initialization.

### Category 3: Xilinx Zynq-7000 (ZedBoard / PYNQ) Hardware Bring-Up
1. **Xilinx / AMD Developer Community Talks:**
   - *Focus:* Hardware Handoff (`.xsa` / `.hdf`) from Vivado to Yocto/PetaLinux, First Stage Bootloader (FSBL), U-Boot second-stage bootloader, and FPGA bitstream loading.
2. **PYNQ Official Tutorials (pynq.io):**
   - *Focus:* How `meta-xilinx` and `meta-pynq` layers configure UIO drivers, DMA, and FPGA overlays on PYNQ-Z1 / PYNQ-Z2 boards.

---

## 🛣️ Step-by-Step 4-Phase Junior Training Roadmap

Structure your practical labs into 4 sequential phases so students build confidence progressively:

```
[Phase 1: Linux Boot & DT Basics] ──> [Phase 2: Vivado Hardware Handoff] ──> [Phase 3: Yocto Build System] ──> [Phase 4: FPGA Overlay & DTC]
```

### Phase 1: Manual Device Tree Compilation & Inspection
- **Goal:** Understand hardware description without complex build systems.
- **Hands-On Tasks:**
  1. Decompile an existing board DTB:
     ```bash
     dtc -I dtb -O dts -o decompiled.dts system.dtb
     ```
  2. Edit `decompiled.dts` to modify a serial port baud rate or add a dummy memory-mapped peripheral node.
  3. Recompile with `dtc`:
     ```bash
     dtc -I dts -O dtb -o custom_system.dtb decompiled.dts
     ```
  4. Inspect runtime hardware representation in Linux via `/sys/firmware/devicetree/base` and `/proc/device-tree`.

---

### Phase 2: Vivado Block Design to Hardware Handoff (`.xsa`)
- **Goal:** Understand how hardware registers in FPGA logic map to Linux memory.
- **Hands-On Tasks:**
  1. Create a basic Zynq-7000 processing system design in Vivado for ZedBoard or PYNQ-Z1/Z2.
  2. Add AXI GPIO peripherals connected to onboard LEDs and pushbuttons.
  3. Export Hardware Definition (`.xsa` / Xilinx Shell Archive).
  4. Understand how Xilinx Device Tree Generator (DTG) converts `.xsa` block address maps into Device Tree nodes (`axi_gpio` at `0x41200000`).

---

### Phase 3: Yocto System Construction (`meta-xilinx`)
- **Goal:** Build a custom, minimal Linux distribution for ZedBoard / PYNQ using Yocto.
- **Hands-On Tasks:**
  1. Clone Yocto Poky (`kirkstone` or `scarthgap` release):
     ```bash
     git clone -b scarthgap git://git.yoctoproject.org/poky
     cd poky
     git clone -b scarthgap git://git.yoctoproject.org/meta-xilinx
     ```
  2. Initialize environment:
     ```bash
     source oe-init-build-env build-zynq
     ```
  3. Configure `conf/bblayers.conf` to include `meta-xilinx-bsp`.
  4. Configure `conf/local.conf`:
     ```bitbake
     MACHINE = "zedboard-zynq7" # Or "pynq-z1-zynq7"
     ```
  5. Build minimal image:
     ```bash
     bitbake core-image-minimal
     ```
  6. Flash generated `BOOT.BIN`, `zImage`, `system.dtb`, and `rootfs.ext4` to MicroSD card.

---

### Phase 4: Device Tree Append (`.bbappend`) & UIO Driver Lab
- **Goal:** Grant user-space applications direct access to FPGA registers via UIO (Userspace I/O) and Device Tree overrides.
- **Hands-On Tasks:**
  1. Create a custom Yocto layer: `meta-junior-lab`.
  2. Write a `device-tree.bbappend` recipe to inject custom node definitions:
     ```dts
     &axi_gpio_0 {
         compatible = "generic-uio";
         status = "okay";
     };
     ```
  3. Rebuild image and boot on board.
  4. Write a C program in Linux using `mmap()` on `/dev/uio0` to toggle hardware LEDs directly from user-space!

---

## 📌 Target Board Quick Comparison (ZedBoard vs. PYNQ-Z1/Z2)

| Feature / Board | ZedBoard (Avnet) | PYNQ-Z1 / PYNQ-Z2 (TUL) |
| :--- | :--- | :--- |
| **SoC Silicon** | Xilinx Zynq-7000 (XC7Z020-1CLG484C) | Xilinx Zynq-7000 (XC7Z020-1CLG400C) |
| **CPU Cores** | Dual ARM Cortex-A9 @ 667 MHz | Dual ARM Cortex-A9 @ 650 MHz |
| **RAM** | 512 MB DDR3 | 512 MB DDR3 |
| **Yocto Machine Name** | `MACHINE = "zedboard-zynq7"` | `MACHINE = "pynq-z1-zynq7"` / `pynq-z2-zynq7` |
| **Boot Jumpers** | MIO[5:3] set to `011` (SD Card) | JP5 set to `SD` position |
| **Serial Console** | Micro-USB UART (CY7C64225 bridge) | Micro-USB FTDI UART bridge @ 115200 baud |

---

::: tip INSTRUCTOR RECOMMENDATION FOR JUNIORS
Start juniors with **Phase 1 (Manual Device Tree editing with `dtc`)** BEFORE introducing Yocto. If they jump straight into Yocto or PetaLinux, the automated scripts hide how U-Boot loads `system.dtb` into memory. Once they manually edit a `.dts` and compile it with `dtc`, Yocto recipes (`.bbappend`) will make complete sense!
:::
