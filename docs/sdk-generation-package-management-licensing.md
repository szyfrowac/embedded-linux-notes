# Cross-SDK Generation, On-Device Package Management & Licensing

This module covers generating Extensible SDKs (eSDK) for application developers, setting up target package managers (`opkg`, `apt`, `rpm`), and managing software licensing compliance in commercial Yocto builds.

---

## 1. Why Generate a Cross-SDK?

Application developers working on software for an embedded board (e.g., C/C++ developers building a Qt UI or computer vision pipeline) **should not need to install Yocto, BitBake, or multi-gigabyte build environments on their workstations**.

### The Solution: Yocto SDK Toolchain Installer
Yocto generates a self-extracting shell script (`.sh`) containing:
- Cross-compiler toolchain (`arm-linux-gnueabihf-gcc`).
- Sysroot header files and pre-compiled libraries matching the exact target rootfs (`glibc`, `openssl`, `opencv`).
- Environment setup script (`environment-setup-cortexa9t2hf-neon-poky-linux-gnueabi`).

---

## 2. Generating & Installing the Standard SDK

### Step 1: Generate SDK Script with BitBake
```bash
# Generate SDK for core-image-minimal
bitbake core-image-minimal -c populate_sdk
```

Build artifact generated in `tmp/deploy/sdk/`:
- `poky-glibc-x86_64-core-image-minimal-cortexa9t2hf-neon-toolchain-4.0.sh`

### Step 2: Install SDK on Developer Workstation
```bash
# Execute self-extracting script
sh poky-glibc-x86_64-core-image-minimal-cortexa9t2hf-neon-toolchain-4.0.sh
```
*(Default installation directory: `/opt/poky/4.0`)*

### Step 3: Compile Code using the SDK
```bash
# Source environment script to export cross-compiler paths
source /opt/poky/4.0/environment-setup-cortexa9t2hf-neon-poky-linux-gnueabi

# Verify cross-compiler executable
$CC --version

# Cross-compile your application directly
$CC my_app.c -o my_app
```

---

## 3. On-Device Package Management (`opkg`, `apt`, `rpm`)

By default, Yocto creates monolithic OS images without on-device package managers. To allow over-the-air package updates (`opkg update && opkg install myapp`) directly on deployed target devices:

### Step 1: Enable Package Management in `local.conf`
```bitbake
# Enable package management feature
EXTRA_IMAGE_FEATURES += "package-management"

# Select IPK package manager (lightweight Opkg for embedded)
PACKAGE_CLASSES = "package_ipk"
```

### Step 2: Build Package Repositories on Host
```bash
bitbake package-index
```
*Generates HTTP package feed archives under `tmp/deploy/ipk/`.*

---

## 4. License Compliance Management in Yocto

Commercial hardware products must strictly track open-source software licenses (GPLv2, GPLv3, MIT, BSD, Apache-2.0) to prevent legal copyright non-compliance.

### Auditing Licenses
Yocto automatically audits every recipe compiled during build and generates license reports in `tmp/deploy/licenses/`.

### Restricting Non-Commercial or Commercial-Restrictive Licenses
To prohibit specific license types (e.g., preventing GPLv3 software in products with locked hardware bootloaders):

```bitbake
# Blacklist GPLv3 packages from being built
INCOMPATIBLE_LICENSE = "GPLv3 GPLv3+"
```

### Accepting Commercial/Proprietary Licenses
Some BSP drivers (e.g., VideoCore, Wi-Fi firmware) require explicit acceptance of commercial end-user license agreements (EULA):

```bitbake
LICENSE_FLAGS_ACCEPTED = "commercial synaptics"
```
