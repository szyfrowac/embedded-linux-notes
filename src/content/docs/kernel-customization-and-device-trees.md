---
title: "Linux Kernel Customization & Device Tree Overlays in Yocto"
lesson:
  module: "Architecture paradigms and fundamentals"
  level: Beginner
  time: "5 min"
---


This module covers modifying the Linux Kernel configuration inside Yocto using `menuconfig`, generating `.cfg` configuration fragments, customizing device tree sources (`.dts`/`.dtsi`), and writing `device-tree.bbappend` files.

---

## 1. Modifying the Linux Kernel Configuration (`menuconfig`)

Yocto builds the kernel via the `virtual/kernel` target recipe. Instead of manually editing `.config` inside `tmp/work/`, use BitBake tasks to configure the kernel safely.

### Step 1: Launch Kernel Menuconfig
```bash
bitbake -c menuconfig virtual/kernel
```
*This opens the standard `ncurses` kernel configuration graphical menu inside your terminal window.*

### Step 2: Enable or Disable Drivers
Navigate through kernel subsystems (e.g., enable CAN bus drivers, SPI controllers, USB Wi-Fi dongle support, or PREEMPT_RT patch settings). Save and exit `menuconfig`.

### Step 3: Diff and Generate a Configuration Fragment (`.cfg`)
```bash
bitbake -c diffconfig virtual/kernel
```
*Outputs a minimal config fragment file named `fragment.cfg` containing **only the lines modified**!*

---

## 2. Integrating Kernel Fragments via `.bbappend`

Create a recipe append file in your custom layer (e.g., `meta-custom/recipes-kernel/linux/linux-yocto_%.bbappend`):

```bitbake
FILESEXTRAPATHS:prepend := "${THISDIR}/files:"

# Add custom config fragment to kernel build
SRC_URI:append = " file://wifi-drivers.cfg"
```

### Example `wifi-drivers.cfg` Fragment
```ini
CONFIG_CFG80211=m
CONFIG_MAC80211=m
CONFIG_ATH_CARDS=m
CONFIG_ATH9K_HTC=m
```

Rebuild the kernel image:
```bash
bitbake virtual/kernel
```

---

## 3. Device Tree Customization in Yocto

The **Device Tree** describes the hardware layout (memory address ranges, interrupts, clocks, pin multiplexing) to the Linux kernel at boot time.

### Where Device Trees Live in Yocto
- Kernel source device trees: `arch/arm/boot/dts/` or `arch/arm64/boot/dts/`.
- BSP layer device tree recipes: `recipes-bsp/device-tree/device-tree.bb`.

---

## 4. Writing a `device-tree.bbappend` Override

To add custom peripheral nodes (e.g., I2C temperature sensors, SPI displays, or generic UIO memory maps) without modifying standard kernel tree files, append to the `device-tree` recipe.

### Structure of `meta-custom/recipes-bsp/device-tree/device-tree.bbappend`

```bitbake
FILESEXTRAPATHS:prepend := "${THISDIR}/files:"

SRC_URI:append = " file://system-user.dtsi"
```

### Example Custom Device Tree Include (`system-user.dtsi`)

```dts
/include/ "system-top.dts"

/ {
    chosen {
        bootargs = "console=ttyPS0,115200 earlycon root=/dev/mmcblk0p2 rw rootwait";
    };

    reserved-memory {
        #address-cells = <1>;
        #size-cells = <1>;
        ranges;

        /* Reserve 16MB RAM for shared memory DMA */
        dma_reserved: buffer@3e000000 {
            compatible = "shared-dma-pool";
            reg = <0x3e000000 0x01000000>;
            no-map;
        };
    };
};

/* Enable I2C-1 controller and add TMP102 temperature sensor node */
&i2c1 {
    status = "okay";
    clock-frequency = <100000>;

    temp_sensor: temp-sensor@48 {
        compatible = "ti,tmp102";
        reg = <0x48>;
    };
};
```

---

## 5. Compiling Device Trees Manually with `dtc`

To inspect or debug compiled Device Tree Blobs (`.dtb`) output by Yocto:

```bash
# Decompile DTB binary back to DTS text
dtc -I dtb -O dts -o decompiled.dts output/images/system.dtb

# Compile modified DTS directly to DTB
dtc -I dts -O dtb -o custom_system.dtb decompiled.dts
```

:::tip[Runtime device tree inspection]
Boot your target hardware and inspect the running Device Tree directly in Linux:
```bash
cat /proc/device-tree/model
cat /sys/firmware/devicetree/base/i2c@40003000/status
```
:::
