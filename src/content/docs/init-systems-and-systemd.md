---
title: "Systemd & Init Systems"
lesson:
  module: "Kernel, bootloaders and system init"
  level: Advanced
  time: "5 min"
---


<div class="fd-panel">

**Learning Objectives**
By the end of this module, you will be able to:
1. Explain what PID 1 is and the role of an Init System in Linux
2. Switch a Yocto build from SysVinit to Systemd
3. Write a Systemd `.service` file to auto-start a custom C application on boot
4. Package the service file in a Yocto recipe using `systemd.bbclass`

</div>

:::note[Prerequisites]
- Completed [Bootloaders: U-Boot & Network Booting](../uboot-tftp-nfs-booting/)
:::

---

## 1. What happens after the Kernel boots?

In the [BeagleBone Black (AM335x)](../beaglebone-black-hardware-bringup/) lesson, we traced the boot sequence up to the point where the Linux Kernel takes over. 

Once the Kernel finishes initializing the hardware drivers, it mounts the root filesystem (from the SD card or NFS) and looks for the very first user-space program to execute. This program is called the **Init System**. 

The Init System is assigned Process ID 1 (**PID 1**). Its sole job is to spawn every other process in the system (the network manager, the SSH server, the graphical interface, and your custom applications).

### SysVinit vs Systemd

- **SysVinit:** The traditional UNIX init system. It uses sequential bash scripts located in `/etc/init.d/` to start services one by one. It is very simple and lightweight, which is why it is the default init system in Yocto's `core-image-minimal`.
- **Systemd:** The modern Linux standard (used by Ubuntu, Debian, RedHat). It starts services in parallel, tracks their dependencies, manages logging (journald), and restarts applications if they crash. It is complex and heavy, but incredibly powerful for production embedded devices.

---

## 2. Switching Yocto to Systemd

Because Systemd offers crash-recovery and dependency management, most commercial embedded Linux products use it over SysVinit.

To switch your Yocto build to use Systemd, you modify your `conf/local.conf` (or your custom distribution configuration):

```bash
# In conf/local.conf

# Use systemd as the init manager
INIT_MANAGER = "systemd"

# Prevent sysvinit scripts from being installed if both exist
DISTRO_FEATURES_BACKFILL_CONSIDERED = "sysvinit"

# Ensure journald (logging) is persistent across reboots
VOLATILE_LOG_DIR = "no"
```

---

## 3. Auto-Starting an Application on Boot

Let's say you want the `helloworld` C application we built in the [Writing C applications and simple recipes](../writing-recipes-and-c-apps/) lesson to start automatically the moment the board turns on, and restart automatically if it crashes.

### Step 1: Write a Systemd Service File
Create a file named `helloworld.service` in your recipe's `files/` directory:

```ini
# meta-custom/recipes-example/helloworld/files/helloworld.service
[Unit]
Description=Hello World Daemon
After=network.target

[Service]
Type=simple
# The path to our binary
ExecStart=/usr/bin/helloworld
# If the app crashes, restart it automatically
Restart=on-failure
RestartSec=5

[Install]
# Start this app when the multi-user system is ready
WantedBy=multi-user.target
```

### Step 2: Update the Yocto Recipe
We need to tell Yocto to install this `.service` file and register it with Systemd.

```bash
# meta-custom/recipes-example/helloworld/helloworld_1.0.bb
SUMMARY = "A simple Hello World C application"
LICENSE = "MIT"
LIC_FILES_CHKSUM = "..."

SRC_URI = "file://helloworld.c \
           file://helloworld.service \
          "

S = "${WORKDIR}"

# Inherit the systemd class to handle the complex registration logic
inherit systemd

# Tell the class the name of our service file
SYSTEMD_SERVICE:${PN} = "helloworld.service"
# Enable it to start automatically on boot
SYSTEMD_AUTO_ENABLE = "enable"

do_compile() {
    ${CC} ${CFLAGS} ${LDFLAGS} helloworld.c -o helloworld
}

do_install() {
    # Install the binary
    install -d ${D}${bindir}
    install -m 0755 helloworld ${D}${bindir}
    
    # Install the systemd service file into the correct directory
    install -d ${D}${systemd_system_unitdir}
    install -m 0644 ${WORKDIR}/helloworld.service ${D}${systemd_system_unitdir}
}
```

---

## 4. Troubleshooting Systemd on the Target

Once you boot your image, you interact with Systemd using the `systemctl` and `journalctl` commands.

```bash
# Check the status of your app
systemctl status helloworld.service

# Stop the app
systemctl stop helloworld.service

# Start the app
systemctl start helloworld.service

# View the log output (e.g., the printf statements from your C code)
journalctl -u helloworld.service
```

---

## 5. Course Completion! 🎓

You have now reached the end of the Advanced Deep Dives section! 

You possess the comprehensive knowledge required to take a bare metal board, configure the hardware (Device Trees), compile a tailored kernel (Menuconfig), load it rapidly over the network (U-Boot/TFTP), and construct a resilient, production-ready filesystem (Yocto/Systemd).

