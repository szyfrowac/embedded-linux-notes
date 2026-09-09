# Kernel Configuration & Fragments (.cfg)

<div style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem; color: white;">

**🎯 Learning Objectives**

By the end of this module, you will be able to:
1. Explain the role of `virtual/kernel` in Yocto
2. Launch and navigate the Linux Kernel `menuconfig` graphical interface
3. Enable or disable kernel modules and built-in drivers (`=m` vs `=y`)
4. Create Configuration Fragments (`.cfg`) and apply them via a `.bbappend`

</div>

::: info PREREQUISITES
- Completed [Day 18: Device Trees (DTS/DTB)](/device-trees-dts-dtb-dtc)
:::

---

## 1. The Kernel Virtual Provider

Different hardware platforms require vastly different Linux kernels. If you build for QEMU, Yocto uses the `linux-yocto` recipe. If you build for the BeagleBone, it uses `linux-ti-staging`. If you build for the Raspberry Pi, it uses `linux-raspberrypi`.

To prevent every image recipe from hardcoding the specific kernel name, Yocto uses a **virtual provider**.

Image recipes simply depend on `virtual/kernel`. 
Your `local.conf` or machine definition file (`raspberrypi4.conf`) tells BitBake which actual recipe satisfies `virtual/kernel` for that specific machine:

```bash
# Example from a machine.conf file
PREFERRED_PROVIDER_virtual/kernel = "linux-raspberrypi"
```

---

## 2. Using `menuconfig`

The Linux Kernel is the most configurable piece of software on the planet. There are over 15,000 different settings (drivers, network protocols, filesystems) you can toggle on or off. 

These settings are stored in a hidden file called `.config` inside the kernel build directory. To edit this file safely, the Linux Kernel provides a curses-based GUI tool called `menuconfig`.

In Yocto, you can launch this tool for your specific kernel using BitBake:

```bash
cd build/

# We use the virtual provider name so we don't need to know if it's linux-yocto or linux-ti
bitbake -c menuconfig virtual/kernel
```

### The Three States of a Driver

When you navigate the menu, you will see options wrapped in brackets: `[ ]` or `< >`. 
Pressing the **Spacebar** cycles through the states:

1. **`[ ]` Disabled:** The code for this driver will not be compiled. The feature will not exist on your device.
2. **`[*] / <*>` Built-in (y):** The driver is compiled *directly into the `zImage` kernel binary*. It is permanently loaded into RAM as soon as the system boots. Used for critical things (like the root filesystem driver or CPU scheduler).
3. **`<M>` Module (m):** The driver is compiled as a separate `.ko` (Kernel Object) file on the disk (e.g., in `/lib/modules/`). It is only loaded into RAM when you plug in the specific hardware (like a USB Wi-Fi dongle). This saves RAM but slows down boot time slightly.

---

## 3. Creating Kernel Configuration Fragments

Just like BusyBox, if you make changes in `menuconfig` and then run `bitbake -c clean virtual/kernel`, your changes are permanently destroyed.

You must save your changes to a `.cfg` file (Configuration Fragment) in your custom layer.

### Step 1: Isolate your changes
Let's say you enabled the `CAN` bus networking protocol in `menuconfig`. 
The `menuconfig` tool actually modifies the `.config` file to say:
```text
CONFIG_CAN=m
CONFIG_CAN_RAW=m
CONFIG_CAN_BCM=m
```

Instead of saving the entire 15,000-line `.config` file (which is a maintenance nightmare when upgrading to a newer kernel), you create a tiny text file containing *only the lines you changed*.

Create a file named `enable-canbus.cfg` inside your custom layer (`meta-custom/recipes-kernel/linux/files/`):
```text
# enable-canbus.cfg
CONFIG_CAN=m
CONFIG_CAN_RAW=m
CONFIG_CAN_BCM=m
```

### Step 2: Write the `.bbappend`
Create a `.bbappend` for the kernel recipe. If you are building for QEMU (`linux-yocto`), the append must match that name.

```bash
# meta-custom/recipes-kernel/linux/linux-yocto_%.bbappend

# Tell BitBake where to find the fragment
FILESEXTRAPATHS:prepend := "${THISDIR}/files:"

# Add the fragment to the SRC_URI
SRC_URI += "file://enable-canbus.cfg"
```

When BitBake builds the kernel, it will take the default upstream `.config` file and merge your `.cfg` fragment over the top of it.

---

## 4. Hands-On Lab Exercises

::: tip LAB 19.1: Enable a USB Ethernet Driver
Let's simulate needing support for a specific USB-to-Ethernet adapter.
1. Run `bitbake -c menuconfig virtual/kernel`.
2. Press `/` to open the search bar. Search for `USB_RTL8152`.
3. The search results will show you exactly which menu path to navigate to find the driver (usually under Device Drivers -> Network device support -> USB Network Adapters).
4. Navigate there and press **M** to compile the Realtek RTL8152 driver as a module (`<M>`).
5. Save and Exit.
:::

::: tip LAB 19.2: Generate a Fragment Automatically
Instead of manually typing out `.cfg` files, Yocto provides a tool to calculate the exact difference between the default kernel config and your new modifications.
1. Make sure you saved your changes in Lab 19.1.
2. Run `bitbake -c diffconfig virtual/kernel`.
3. BitBake will print the path to a newly generated `fragment.cfg` file containing only your `CONFIG_USB_RTL8152=m` change!
4. You can copy this file into your layer.
:::

---

## 5. Further Reading

| Resource | URL |
|---|---|
| Kernel Configuration in Yocto | [docs.yoctoproject.org/kernel-dev/common.html#changing-the-configuration](https://docs.yoctoproject.org/kernel-dev/common.html#changing-the-configuration) |

---

<div style="display: flex; justify-content: space-between; margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #e2e8f0;">
<a href="/day18-device-trees-dts-dtb-dtc">← Day 18: Device Trees</a>
<a href="/day20-uboot-tftp-nfs-booting">Day 20: U-Boot & Network Booting →</a>
</div>
