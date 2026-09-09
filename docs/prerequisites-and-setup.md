# Prerequisites & Host Setup Guide

<div style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem; color: white;">

**Complete this page before starting Day 1.** It ensures your host machine has all required packages, sufficient resources, and correct configuration for Yocto Project builds.

</div>

---

## 1. System Requirements

### Minimum Requirements

| Resource | Minimum | Recommended | Notes |
|---|---|---|---|
| **Operating System** | Ubuntu 22.04 LTS | Ubuntu 24.04 LTS | Fedora 38+ also supported |
| **CPU** | 4 cores | 8+ cores | More cores = faster parallel builds |
| **RAM** | 8 GB | 16–32 GB | `do_compile` for large packages (kernel, gcc) is memory-intensive |
| **Disk Space** | 50 GB free | 250+ GB free SSD | A full build can consume 30–100 GB; NVMe SSD strongly recommended |
| **Internet** | Required for initial build | Broadband recommended | BitBake downloads ~5 GB of source code on first build |

::: danger DISK SPACE IS THE #1 CAUSE OF BUILD FAILURES
If your disk fills up during a build, BitBake will crash with cryptic I/O errors. Monitor disk usage with `df -h` before and during builds. Enable `INHERIT += "rm_work"` in `conf/local.conf` to reduce usage from ~100 GB to ~15 GB.
:::

---

## 2. Host Package Installation

### Ubuntu 22.04 / 24.04 LTS

```bash
sudo apt update && sudo apt upgrade -y

# Core build tools
sudo apt install -y \
    gawk wget git git-lfs diffstat unzip texinfo gcc g++ build-essential \
    chrpath socat cpio python3 python3-pip python3-pexpect python3-git \
    python3-jinja2 python3-subunit python3-setuptools \
    xz-utils debianutils iputils-ping \
    libegl1-mesa libsdl1.2-dev mesa-common-dev \
    pylint xterm zstd liblz4-tool file locales libacl1 \
    lz4 screen tmux picocom minicom

# Ensure UTF-8 locale
sudo locale-gen en_US.UTF-8
export LANG=en_US.UTF-8
```

### Fedora 38+

```bash
sudo dnf install -y \
    gawk make wget tar bzip2 gzip python3 unzip perl patch \
    diffutils diffstat git cpp gcc gcc-c++ glibc-devel texinfo chrpath \
    ccache perl-Data-Dumper perl-Text-ParseWords perl-Thread-Queue \
    socat python3-pexpect findutils which file cpio \
    python3-pip xz python3-GitPython python3-jinja2 \
    SDL-devel xterm rpcgen mesa-libGL-devel zstd lz4
```

---

## 3. Git Configuration

BitBake uses Git internally for source management. Configure your identity:

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Recommended: increase Git buffer for large repos
git config --global http.postBuffer 1048576000
```

---

## 4. Recommended VS Code Extensions

If using Visual Studio Code as your editor:

| Extension | Purpose |
|---|---|
| **BitBake** (`yocto-project.bitbake`) | Syntax highlighting for `.bb`, `.bbappend`, `.bbclass`, `.conf` files |
| **Device Tree** (`plorefice.devicetree`) | Syntax highlighting for `.dts` and `.dtsi` files |
| **Remote - SSH** (`ms-vscode-remote.remote-ssh`) | Edit files on remote build servers |
| **CMake Tools** (`ms-vscode.cmake-tools`) | CMake project support for Day 14–15 |

---

## 5. Docker-Based Build Environment (Optional)

If you prefer a containerized environment or are on macOS/Windows:

```bash
# Pull the official Yocto CROPS container
docker pull crops/poky

# Run with mounted workspace
docker run -it --rm \
    -v /path/to/your/workspace:/workdir \
    crops/poky \
    --workdir=/workdir
```

::: info CROPS
[CROPS (CROss PlatformS)](https://github.com/crops) provides Docker containers pre-configured with all Yocto build dependencies. This eliminates host OS compatibility issues entirely.
:::

---

## 6. Verify Your Setup

Run this checklist to confirm everything is ready:

```bash
# Check GCC version (must be ≥ 8.0)
gcc --version

# Check Python version (must be ≥ 3.8)
python3 --version

# Check Git version
git --version

# Check available disk space (need ≥ 50 GB)
df -h .

# Check available RAM (need ≥ 8 GB)
free -h
```

---

<div style="display: flex; justify-content: space-between; margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #e2e8f0;">
<span></span>
<a href="/day1-embedded-linux-yocto-foundations">Day 1: Begin the Masterclass →</a>
</div>
