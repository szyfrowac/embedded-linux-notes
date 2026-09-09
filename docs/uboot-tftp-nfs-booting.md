# Bootloaders: U-Boot & Network Booting (TFTP/NFS)

<div style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem; color: white;">

**🎯 Learning Objectives**

By the end of this module, you will be able to:
1. Explain the role of Das U-Boot and its environment variables
2. Stop the autoboot sequence to interact with the U-Boot command line
3. Configure a host PC to serve the Linux Kernel via TFTP
4. Configure a host PC to serve the Root Filesystem via NFS
5. Drastically reduce your compile-test-debug cycle time

</div>

::: info PREREQUISITES
- Completed [Day 19: Kernel Configuration & Fragments](/kernel-configuration-menuconfig)
- A physical board (like the BeagleBone Black) connected via Ethernet to your host PC
:::

---

## 1. The U-Boot Environment

In Day 3, we learned that U-Boot is the second stage of the bootloader. Its primary job is to initialize the RAM, load the kernel (`zImage`) and device tree (`.dtb`) into RAM, and then execute the kernel.

But how does U-Boot know *where* to load the kernel from? Does it look on the SD card? The eMMC chip? Over the network? 

It decides this by reading its **Environment Variables**.

When you power on your board with a serial console connected, you will see a countdown:
`Hit any key to stop autoboot:  3`

If you press a key before the timer hits 0, you drop into the U-Boot command prompt (`=>`). From here, you can print the environment variables:
```bash
=> printenv
```

### The `bootcmd` Variable
The most important variable is `bootcmd`. When the autoboot timer hits 0, U-Boot simply executes whatever script is stored inside `bootcmd`. 

A typical `bootcmd` for an SD card looks like this:
```bash
bootcmd=fatload mmc 0:1 0x82000000 zImage; fatload mmc 0:1 0x88000000 am335x-boneblack.dtb; bootz 0x82000000 - 0x88000000
```
*(Translation: Load the kernel from the SD card's FAT partition to RAM address 0x82M, load the DTB to 0x88M, then boot them.)*

---

## 2. The Flashing Bottleneck

During development, you will modify your Yocto image frequently (adding new C apps, tuning the kernel, etc.). 

The standard workflow is painful:
1. Run `bitbake core-image-minimal` (takes a few minutes)
2. Eject SD card from PC, insert into Board.
3. Boot the board and test the changes.
4. Discover a bug.
5. Unplug the board, remove SD card, insert into PC.
6. Flash `.wic` image to SD card with `dd` (Takes 5-10 minutes!).
7. Repeat.

This cycle ruins developer productivity. The solution is **Network Booting**. 

---

## 3. TFTP: Loading the Kernel over Ethernet

Instead of storing the `zImage` and `.dtb` on the SD card, you can store them on your Host PC. U-Boot can fetch them over the Ethernet cable using the TFTP (Trivial File Transfer Protocol) in a matter of seconds.

### Step 1: Set up TFTP on your Ubuntu Host
```bash
sudo apt install tftpd-hpa
# The default directory is /srv/tftp
```

### Step 2: Copy your Yocto outputs to the TFTP folder
```bash
cd build/tmp/deploy/images/beaglebone/
sudo cp zImage /srv/tftp/
sudo cp am335x-boneblack.dtb /srv/tftp/
sudo chmod -R 777 /srv/tftp/
```

### Step 3: Tell U-Boot to fetch from the Network
Stop the autoboot on your board and set the network IPs (assuming your PC is `192.168.1.100` and the board is `192.168.1.50`):
```bash
=> setenv ipaddr 192.168.1.50
=> setenv serverip 192.168.1.100
=> tftp 0x82000000 zImage
=> tftp 0x88000000 am335x-boneblack.dtb
=> bootz 0x82000000 - 0x88000000
```
*The kernel will now boot over the network in seconds!*

---

## 4. NFS: Mounting the Rootfs over Ethernet

TFTP solves the kernel bottleneck, but what about the root filesystem containing your C applications? 

You can extract your rootfs to a folder on your Host PC and export that folder over the network using NFS (Network File System). When the kernel boots on the board, instead of mounting `/dev/mmcblk0p2` (the SD card), it mounts the folder on your host PC!

If you modify a C file in Yocto, run `make`, and copy the binary into the NFS folder, it immediately appears on the board without rebooting!

### Step 1: Set up NFS on your Ubuntu Host
```bash
sudo apt install nfs-kernel-server
sudo mkdir -p /srv/nfs/beaglebone
```

### Step 2: Extract the Rootfs
Yocto generates a `.tar.bz2` of the rootfs for exactly this purpose.
```bash
sudo tar -xf build/tmp/deploy/images/beaglebone/core-image-minimal-beaglebone.tar.bz2 -C /srv/nfs/beaglebone
```

### Step 3: Export the folder
Edit `/etc/exports` on your host PC and add:
```text
/srv/nfs/beaglebone *(rw,sync,no_root_squash,no_subtree_check)
```
Restart the server: `sudo systemctl restart nfs-kernel-server`

### Step 4: Tell the Kernel to mount NFS
You tell the kernel where its root filesystem is by modifying the `bootargs` variable in U-Boot.

```bash
=> setenv bootargs "console=ttyO0,115200n8 root=/dev/nfs nfsroot=192.168.1.100:/srv/nfs/beaglebone,v3,tcp rw ip=192.168.1.50"
=> bootz 0x82000000 - 0x88000000
```

---

## 5. Hands-On Lab Exercises

::: tip LAB 20.1: Exploring U-Boot
1. Connect to your board via the Serial Console.
2. Power cycle the board and hit the Spacebar to stop autoboot.
3. Run `printenv`. Look at the sheer volume of variables.
4. Try to trace the execution path. Find `bootcmd`. What script does it run? Find that script. What does it run?
:::

---

## 6. Further Reading

| Resource | URL |
|---|---|
| U-Boot Network Booting | [docs.u-boot.org/en/latest/usage/netboot.html](https://docs.u-boot.org/en/latest/usage/netboot.html) |
| Kernel NFS Root Documentation | [kernel.org/doc/Documentation/filesystems/nfs/nfsroot.txt](https://www.kernel.org/doc/Documentation/filesystems/nfs/nfsroot.txt) |

---

<div style="display: flex; justify-content: space-between; margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #e2e8f0;">
<a href="/day19-kernel-configuration-menuconfig">← Day 19: Kernel Configuration</a>
<a href="/day21-init-systems-and-systemd">Day 21: Init Systems & Systemd →</a>
</div>
