---
title: "Demystifying Device Trees (DTS, DTB, DTC)"
lesson:
  module: "Architecture paradigms and fundamentals"
  level: Beginner
  time: "10 min"
---


<div class="fd-panel">

**Learning Objectives**
By the end of this module, you will be able to:
1. Explain the historical problem Device Trees solve in the ARM ecosystem
2. Read and interpret the syntax of a Device Tree Source (`.dts`) file
3. Manually compile a `.dts` into a binary blob (`.dtb`) using the Device Tree Compiler (`dtc`)
4. Understand how the bootloader passes the DTB to the Linux kernel

</div>

:::note[Prerequisites]
- Completed [BusyBox Deep Dive](../busybox-deep-dive/)
:::

---

## 1. The Hardware Discovery Problem

If you install Linux on an Intel or AMD desktop PC (x86 architecture), the kernel doesn't need to be told where the USB ports, PCIe slots, or RAM modules are physically wired on the motherboard. It asks the **BIOS/UEFI** and the **ACPI** tables. The hardware is self-discoverable.

**Embedded ARM processors (SoCs) do not have a BIOS or ACPI.**

Historically, before 2011, Linux kernel developers had to write thousands of lines of hardcoded C structs for *every single ARM board ever manufactured*. If you designed a new BeagleBone clone with the LED wired to a different pin, you had to recompile the entire Linux kernel. Linus Torvalds famously got so frustrated with this mess that he mandated a change.

The solution adopted was the **Device Tree**.

---

## 2. What is a Device Tree?

A Device Tree is a strict data structure that describes the physical hardware layout of a board to the operating system. 

Instead of hardcoding hardware addresses into the Linux kernel C code, the kernel is compiled completely ignorant of the board it will run on. During boot, the bootloader (like U-Boot) hands the kernel a **binary file** (the Device Tree) that says:
*"You have 512MB of RAM at address 0x80000000, a UART serial port at 0x44E09000, and an LED wired to GPIO pin 5."*

This allows the exact same Linux Kernel binary (`zImage`) to boot on hundreds of completely different ARM boards.

---

## 3. The 3 D's: DTS, DTC, and DTB

| Acronym | Name | Description |
|---|---|---|
| **DTS** | Device Tree Source | Human-readable text files containing the hardware description. Similar syntax to JSON or C structs. |
| **DTC** | Device Tree Compiler | A command-line tool that parses `.dts` text files and compiles them into binary format. |
| **DTB** | Device Tree Blob | The compiled binary output of the DTC. This is the actual file loaded into RAM by the bootloader and read by the Kernel. |

---

## 4. Reading a Device Tree Source (`.dts`)

A `.dts` file is organized as a tree of **nodes** and **properties**. 
Here is a highly simplified example of a UART serial port node:

```dts
/dts-v1/;

/ {
    model = "TI AM335x BeagleBone Black";
    compatible = "ti,am335x-bone-black", "ti,am335x-bone", "ti,am33xx";

    cpus {
        cpu@0 {
            compatible = "arm,cortex-a8";
        };
    };

    uart0: serial@44e09000 {
        compatible = "ti,am3352-uart", "ti,omap3-uart";
        reg = <0x44e09000 0x2000>;
        interrupts = <72>;
        status = "okay";
    };
};
```

### Key Concepts in the Syntax
1. **Nodes (`serial@44e09000`)**: Represent physical devices. The text before the `@` is the generic name. The text after is the base memory address of the hardware register.
2. **Labels (`uart0:`)**: A variable name you can use to reference this node elsewhere in the file.
3. **`compatible`**: The most important property! This tells the Linux kernel exactly which C driver file to load for this piece of hardware.
4. **`reg`**: The physical memory address and length (`0x2000` bytes) assigned to this hardware block.
5. **`status`**: Can be `"okay"` (enabled) or `"disabled"`. SoCs have hundreds of peripherals; most are disabled by default to save power unless a board actually wires them up.

---

## 5. Compiling with `dtc`

In Yocto, BitBake compiles the device trees automatically during the `do_compile` phase of the `linux-yocto` (kernel) recipe. However, as an embedded engineer, you will frequently compile them manually while prototyping hardware.

### Installing DTC on your host
```bash
sudo apt install device-tree-compiler
```

### Compiling (DTS -> DTB)
```bash
dtc -I dts -O dtb -o am335x-boneblack.dtb am335x-boneblack.dts
```

### Decompiling (DTB -> DTS)
If you are handed a `.dtb` blob without the source code, you can reverse-engineer it!
```bash
dtc -I dtb -O dts -o decompiled.dts unknown-board.dtb
```

---

## 6. How the Bootloader uses the DTB

Let's revisit the BeagleBone boot sequence from the [BeagleBone Black (AM335x)](../beaglebone-black-hardware-bringup/) lesson. 

When U-Boot takes control of the system, it reads the SD card and loads **two** files into RAM:
1. `zImage` (The Linux Kernel) loaded at address `0x82000000`
2. `am335x-boneblack.dtb` (The Device Tree Blob) loaded at address `0x88000000`

U-Boot then issues the command to start the kernel, passing the address of the DTB as an argument:
```bash
# U-Boot prompt command: bootz <kernel_addr> - <dtb_addr>
U-Boot> bootz 0x82000000 - 0x88000000
```
The kernel wakes up, looks at `0x88000000`, parses the hardware map, and begins loading the appropriate `compatible` drivers.

---

## 7. Hands-On Lab Exercises

:::tip[LAB 18.1: Locate the Compiled DTB]
1. Navigate to your Yocto deploy directory for the BeagleBone build from the [BeagleBone Black](../beaglebone-black-hardware-bringup/) or [WIC images](../yocto-releases-bsp-layers-wic/) lessons:
   `build/tmp/deploy/images/beaglebone/`
2. Run `ls *.dtb`. You will see `am335x-boneblack.dtb`. This is the exact blob WIC copies into the FAT32 boot partition of your SD card image.
:::

:::tip[LAB 18.2: Reverse Compile the Blobs]
1. Ensure the `dtc` tool is installed on your Ubuntu host (`sudo apt install device-tree-compiler`).
2. Run `dtc -I dtb -O dts -o my_dts_file.dts am335x-boneblack.dtb`
3. Open `my_dts_file.dts` in VS Code or `nano`.
4. Search (CTRL+F) for `leds`. Look at how the GPIO pins are mapped to the physical blue LEDs on the BeagleBone!
:::

---

## 8. Further Reading

| Resource | URL |
|---|---|
| Device Tree Usage Guide (eLinux) | [elinux.org/Device_Tree_Usage](https://elinux.org/Device_Tree_Usage) |
| Linux Kernel DT Bindings | [kernel.org/doc/Documentation/devicetree/bindings/](https://www.kernel.org/doc/Documentation/devicetree/bindings/) |

---

