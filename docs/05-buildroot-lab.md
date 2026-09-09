# 05. Hands-On Practical Lab: Building Embedded Linux with Buildroot

This lab demonstrates how to construct, cross-compile, flash, and boot a minimalist, custom embedded Linux distribution targeting the **STMicroelectronics STM32MP157D-DK1 Discovery Kit**.

---

## Phase 1: Host System Preparation

Build automation requires a Linux host environment (Ubuntu, Debian, Linux Mint, or WSL2/Docker).

### Step 1.1: Install Mandatory Host Packages
Update package indexes and install mandatory host compilation utilities:

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y build-essential libncurses5-dev libncursesw5-dev \
                    bison flex git rsync unzip bc wget cpio libssl-dev
```

### Step 1.2: Obtain Buildroot Source Code
Create a dedicated working directory and clone the official Buildroot repository:

```bash
mkdir -p ~/projects && cd ~/projects
git clone https://git.buildroot.net/buildroot
cd buildroot
```

---

## Phase 2: Target Configuration

### Step 2.1: Inspect and Apply Board Defconfig
Buildroot ships with pre-defined configurations inside the `configs/` directory. Inspect the available configurations for STM32 hardware:

```bash
ls configs/ | grep stm32
```

Apply the default configuration for the STM32MP157 Discovery Kit:

```bash
make st_stm32mp157a_dk1_defconfig
```

*Note: This command generates a localized `.config` file containing all architecture, toolchain, kernel, and package parameters.*

### Step 2.2: Customize via Menuconfig
Launch the ncurses graphical menu interface to review or modify build options:

```bash
make menuconfig
```

Within `menuconfig`, engineers can configure:
- **Target Architecture:** ARM (little endian), Cortex-A7, NEON/VFPv4 floating point.
- **Toolchain:** Cross-compiler selection (GCC version, C library: `glibc`/`musl`/`uClibc`).
- **Kernel:** Linux kernel version, device tree sources (.dts).
- **Target Packages:** Adding lightweight tools (e.g., Python, dropbear SSH, i2c-tools).
- **Filesystem Images:** Ext4 rootfs, tarballs, and raw SD card image options.

Select **Exit** to return to the shell terminal.

---

## Phase 3: Cross-Compilation & Build Artifact Inspection

### Step 3.1: Execute Build
Initiate the compilation process:

```bash
make
```

::: tip INSTRUCTOR NOTE: WHAT BUILDROOT PERFORMS DURING COMPILATION
During `make`, Buildroot autonomously executes:
1. Downloads host build tools and target source archives.
2. Cross-compiles the host cross-toolchain (`arm-linux-gnueabihf-gcc`).
3. Compiles First Stage Bootloader (TF-A) and Second Stage Bootloader (U-Boot).
4. Compiles the Linux Kernel image (`zImage`) and Device Tree Blob (`stm32mp157a-dk1.dtb`).
5. Builds BusyBox and populates the root filesystem structure (`/bin`, `/etc`, `/lib`).
6. Packs everything into output partition files and a raw `sdcard.img`.
:::

### Step 3.2: Inspect Build Artifacts
Once compilation completes, navigate to the output directory:

```bash
ls -lh output/images/
```

Key files present:
- `sdcard.img`: Complete partitioned disk image ready to flash.
- `zImage`: Compressed Linux kernel binary.
- `stm32mp157a-dk1.dtb`: Compiled hardware Device Tree Blob.
- `rootfs.ext4`: Root filesystem partition file.

---

## Phase 4: Flashing Image to SD Card

### Step 4.1: Identify Raw Storage Block Device
Insert an SD card into the host computer. Identify its node using `lsblk`:

```bash
lsblk
```

Identify the **raw block device name** (e.g., `/dev/mmcblk2` or `/dev/sdb`). Unmount any auto-mounted partition nodes:

```bash
sudo umount /dev/mmcblk2p* 2>/dev/null || true
```

::: danger DANGER: RAW DISK OVERWRITE RISK WITH DD
The `dd` utility performs bit-for-bit raw block copies. Specifying the wrong target drive (e.g., `of=/dev/sda`) will overwrite your host operating system drive, destroying all data without warning!
- Always target the raw disk node (`/dev/mmcblk2`), NOT a specific partition (`/dev/mmcblk2p1`).
- Double-check device size against `lsblk` output before pressing Enter.
:::

### Step 4.2: Flash Image with dd
Execute raw bit-for-bit flashing to the target SD card:

```bash
sudo dd if=output/images/sdcard.img of=/dev/mmcblk2 bs=1M status=progress
sync
```

Safely remove the SD card from the host.

---

## Phase 5: Hardware Target Connection & Serial Console Setup

::: info STM32MP157D-DK1 HARDWARE CONFIGURATION
- **Boot Switches:** Set DIP switches `BOOT0` and `BOOT2` to **ON** to enforce booting from the MicroSD card slot.
- **Serial Console Connector:** Connect a Micro-USB cable from the host PC to the onboard ST-LINK USB port. The onboard ST-Link acts as a USB-to-UART bridge connected to UART4.
- **Power Supply:** Connect a dedicated 5V / 3A USB-C cable to the power connector port.
:::

### Step 5.1: Configure Host User Serial Permissions
Serial devices (`/dev/ttyACM0` or `/dev/ttyUSB0`) on Linux host machines are restricted to the `dialout` group. Add your host user to this group to prevent permission errors:

```bash
sudo usermod -aG dialout $USER
groups $USER
```

*Note: You must log out and log back in (or run `newgrp dialout`) for group changes to take effect.*

### Step 5.2: Open Serial Terminal with picocom
Launch `picocom` at 115200 baud rate:

```bash
picocom -b 115200 /dev/ttyACM0
```

Press the target board's **RESET** button. The serial terminal will display the full boot sequence: TF-A loader $\rightarrow$ U-Boot initialization $\rightarrow$ Linux Kernel boot log $\rightarrow$ init system startup.

---

## Phase 6: Target Bootup, Inspection, and Target Scripting

Once booted, the Buildroot minimal OS presents a login prompt:

```bash
buildroot login: root
```

*Note: Default Buildroot images use username `root` with no password required.*

### Step 6.1: Explore Target Filesystem
Inspect the system environment directly on the target hardware:

```bash
# Check running kernel version
uname -a

# Inspect memory footprint
free -h

# Inspect mounted filesystems
df -h

# Verify CPU information
cat /proc/cpuinfo
```

Notice that the entire operating system consumes less than 30-50 MB of storage space and boots in under 3-5 seconds!

### Step 6.2: Create and Execute a Test Script on Target
Embedded Linux provides standard POSIX shell scripting capabilities via BusyBox:

```bash
vi test.sh
```

Press `i` to enter insert mode in `vi`, then add:

```bash
#!/bin/sh
echo "---------------------------------------"
echo "  Hello from Custom Embedded Linux!   "
echo "  Board: STM32MP157D Discovery Kit    "
echo "---------------------------------------"
```

Press `Esc`, type `:wq` and press Enter to save and exit. Grant execution permissions and run the script:

```bash
chmod +x test.sh
./test.sh
```

### Step 6.3: Exit Host Serial Terminal Session
To disconnect from the target serial console in `picocom`, press:

**`Ctrl + A`** followed by **`Ctrl + X`**
