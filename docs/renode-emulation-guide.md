# Renode Emulation Guide: Hardware-Free Embedded Linux Development

<div style="background: linear-gradient(135deg, #00c6ff 0%, #0072ff 100%); padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem; color: white;">

**🎯 Purpose**

This guide enables you to practice embedded Linux development on **Zynq-7000 (ZedBoard/PYNQ)** targets without purchasing physical hardware, using [Renode](https://renode.io) — an open-source hardware emulator developed by [Antmicro](https://antmicro.com).

</div>

---

## 1. What is Renode?

**Renode** is an open-source instruction set simulator and hardware emulation framework. Unlike QEMU (which focuses primarily on CPU emulation), Renode was designed to emulate **complete embedded systems** including:

- ARM Cortex-A/R/M processors, RISC-V, PowerPC, Xtensa, SPARC
- Peripheral models: UART, I2C, SPI, GPIO, Timer, Ethernet, DMA
- Board-level platform descriptions (`.repl` files) mapping peripherals to memory addresses
- Multi-node simulations (emulating networks of interconnected devices)

### Renode vs QEMU: When to Use What

| Feature | Renode | QEMU (via Yocto `runqemu`) |
|---|---|---|
| **Zynq-7000 / ZedBoard Support** | ✅ Native platform description | ❌ Not supported |
| **BeagleBone Black (AM335x)** | ❌ Not supported | ✅ via `qemuarm` |
| **Raspberry Pi** | ❌ Not supported | ✅ via `qemuarm64` |
| **Peripheral Emulation** | Full (UART, I2C, SPI, GPIO, Timer) | Partial (virtio devices) |
| **Multi-Device Simulation** | ✅ Network of connected boards | Limited |
| **GDB Integration** | ✅ Built-in GDB server | ✅ via `-s -S` flags |
| **Yocto Integration** | Manual (load kernel + rootfs) | Automatic (`runqemu`) |
| **Install Complexity** | Medium (mono/.NET runtime required) | Low (bundled with Poky) |

---

## 2. Installing Renode

### Ubuntu/Debian (Recommended)

```bash
# Download the latest Renode .deb package
wget https://github.com/renode/renode/releases/latest/download/renode_*.deb

# Install (installs mono runtime dependency automatically)
sudo apt install -y ./renode_*.deb

# Verify installation
renode --version
```

### From Binary Release (Alternative)

```bash
# Download portable release
wget https://github.com/renode/renode/releases/latest/download/renode-*.linux-portable.tar.gz
tar -xzf renode-*.linux-portable.tar.gz
cd renode_*

# Add to PATH
export PATH=$PWD:$PATH
renode --version
```

---

## 3. Core Renode Concepts

### 3.1 Platform Description Files (`.repl`)

A `.repl` (Renode Platform) file describes the hardware architecture of a board: which CPU, what peripherals exist, and how they are mapped into the memory address space.

Example excerpt from `zedboard.repl`:
```
cpu: CPU.ARMv7A @ sysbus
    cpuType: "cortex-a9"
    genericInterruptController: gic

uart0: UART.Cadence @ sysbus 0xE0000000
    -> gic@59

uart1: UART.Cadence @ sysbus 0xE0001000
    -> gic@82
```

### 3.2 Script Files (`.resc`)

A `.resc` (Renode Script) file automates the setup process: creating machines, loading platform descriptions, configuring binaries, and starting the simulation.

### 3.3 The Monitor CLI

Renode provides an interactive command-line interface (the **Monitor**) where you can:
- Create and configure machines
- Load binaries (ELF, raw binary, device tree)
- Start/pause/step execution
- Inspect registers, memory, and peripheral state
- Connect UART analyzers (virtual serial terminals)

---

## 4. Running Linux on ZedBoard in Renode

The ZedBoard is based on the **Xilinx Zynq-7000 SoC** (dual-core ARM Cortex-A9 + FPGA fabric). Renode includes a ready-to-use script for this platform.

### 4.1 Quick Start with Built-in Demo

```bash
# Launch Renode
renode

# In the Renode Monitor, load the ZedBoard script:
(monitor) include @scripts/single-node/zedboard.resc

# Start the simulation
(monitor) start
```

This loads a pre-built Linux kernel and rootfs from Antmicro's servers and boots into a Linux shell via the virtual UART.

### 4.2 Loading Your Own Yocto Image

After building a Yocto image for `MACHINE = "zedboard-zynq7"` or a generic Zynq target, you can load your custom kernel and rootfs into Renode:

**Step 1: Build a Yocto image for Zynq**

You'll need the `meta-xilinx` BSP layer:

```bash
git clone -b kirkstone git://git.yoctoproject.org/meta-xilinx
```

Add to `bblayers.conf` and set in `local.conf`:
```bash
MACHINE = "zedboard-zynq7"
```

```bash
bitbake core-image-minimal
```

**Step 2: Create a custom Renode script**

Create a file `my-zedboard.resc`:

```
:name: MyZedBoard
:description: Custom Yocto Linux on ZedBoard

using sysbus
mach create "MyZedBoard"
machine LoadPlatformDescription @platforms/boards/zedboard.repl

# Show UART terminal
showAnalyzer uart0

# Redirect memory region (required for Zynq boot)
sysbus Redirect 0xC0000000 0x0 0x10000000

# Load your Yocto-built kernel (vmlinux ELF format)
$bin = @/path/to/tmp/deploy/images/zedboard-zynq7/vmlinux

# Load device tree
$dtb = @/path/to/tmp/deploy/images/zedboard-zynq7/zynq-zed.dtb

# Load rootfs (ext2/ext4 image)
$rootfs = @/path/to/tmp/deploy/images/zedboard-zynq7/core-image-minimal-zedboard-zynq7.ext4
```

**Step 3: Run it**

```bash
renode my-zedboard.resc
(monitor) start
```

---

## 5. Debugging with Renode + GDB

Renode includes a built-in GDB server, allowing you to attach `arm-poky-linux-gnueabi-gdb` for source-level debugging of kernel or userspace applications:

```bash
# In Renode Monitor:
(monitor) machine StartGdbServer 3333

# In a separate terminal, connect GDB:
arm-poky-linux-gnueabi-gdb vmlinux
(gdb) target remote :3333
(gdb) break start_kernel
(gdb) continue
```

---

## 6. QEMU Alternatives for Non-Zynq Boards

For boards not supported by Renode, use Yocto's built-in QEMU:

| Target Board | QEMU Machine | Command |
|---|---|---|
| BeagleBone Black (AM335x) | `qemuarm` | `runqemu qemuarm nographic` |
| Raspberry Pi 3/4 | `qemuarm64` | `runqemu qemuarm64 nographic` |
| Generic x86_64 | `qemux86-64` | `runqemu qemux86-64 nographic` |
| Generic MIPS | `qemumips` | `runqemu qemumips nographic` |

---

## 7. Further Reading

| Resource | URL |
|---|---|
| Renode Documentation | [renode.readthedocs.io](https://renode.readthedocs.io/en/latest/) |
| Renode GitHub Repository | [github.com/renode/renode](https://github.com/renode/renode) |
| Supported Boards & Peripherals | [renode.readthedocs.io/supported-boards](https://renode.readthedocs.io/en/latest/introduction/supported-boards.html) |
| ZedBoard Script Source | [zedboard.resc](https://github.com/renode/renode/blob/master/scripts/single-node/zedboard.resc) |
| Antmicro Blog: Renode Tutorials | [antmicro.com/blog](https://antmicro.com/blog/tags/renode/) |

---

<div style="display: flex; justify-content: space-between; margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #e2e8f0;">
<a href="/07-zynq-yocto-dtc-tutorial-guide">← Zynq Curriculum Guide</a>
<a href="/glossary">Glossary of Terms →</a>
</div>
