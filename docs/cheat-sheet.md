# BitBake & Yocto Cheat Sheet

A single-page quick reference for the most frequently used commands, variables, and patterns.

---

## Essential BitBake Commands

### Building

```bash
# Build an image
bitbake core-image-minimal

# Build a single recipe
bitbake busybox

# Build only a specific task
bitbake -c compile busybox
bitbake -c fetch linux-yocto
bitbake -c devshell myrecipe

# Force rebuild (ignore sstate cache)
bitbake -c cleansstate busybox && bitbake busybox

# Clean everything for a recipe
bitbake -c cleanall busybox
```

### Debugging & Inspection

```bash
# Print all variables for a recipe (pipe to grep!)
bitbake -e busybox | grep ^SRC_URI=
bitbake -e core-image-minimal | grep ^IMAGE_INSTALL=

# Show task execution order
bitbake -c listtasks busybox

# Generate dependency graph
bitbake -g core-image-minimal
dot -Tpdf task-depends.dot -o deps.pdf

# Verbose output (show executed shell commands)
bitbake -v busybox

# Debug output (show BitBake internals)
bitbake -DDD busybox
```

### Layer Management

```bash
# Show all registered layers
bitbake-layers show-layers

# Show all available recipes
bitbake-layers show-recipes

# Search for a recipe
bitbake-layers show-recipes "*gpio*"

# Show .bbappend files and targets
bitbake-layers show-appends

# Create a new layer
bitbake-layers create-layer meta-custom

# Add a layer to bblayers.conf
bitbake-layers add-layer ../meta-custom
```

---

## Key Configuration Variables

### `conf/local.conf`

```bash
# Target machine
MACHINE = "qemuarm"

# Parallel execution
BB_NUMBER_THREADS = "8"
PARALLEL_MAKE = "-j 8"

# Package format
PACKAGE_CLASSES = "package_ipk"

# Save disk space
INHERIT += "rm_work"

# Add packages to image
IMAGE_INSTALL:append = " nano htop curl i2c-tools"

# Extra image features (dev builds only!)
EXTRA_IMAGE_FEATURES = "debug-tweaks tools-debug ssh-server-dropbear"

# Custom downloads/sstate directories
DL_DIR = "/opt/yocto/downloads"
SSTATE_DIR = "/opt/yocto/sstate-cache"
```

### `conf/bblayers.conf`

```bash
BBLAYERS ?= " \
  /path/to/poky/meta \
  /path/to/poky/meta-poky \
  /path/to/poky/meta-yocto-bsp \
  /path/to/meta-custom \
  /path/to/meta-raspberrypi \
"
```

---

## Recipe Template (`.bb`)

```bash
SUMMARY = "Short description"
DESCRIPTION = "Detailed description of the package"
LICENSE = "MIT"
LIC_FILES_CHKSUM = "file://${COMMON_LICENSE_DIR}/MIT;md5=0835ade698e0bcf8506ecda2f7b4f302"

SRC_URI = "file://main.c"
S = "${WORKDIR}"

do_compile() {
    ${CC} ${CFLAGS} ${LDFLAGS} ${WORKDIR}/main.c -o myapp
}

do_install() {
    install -d ${D}${bindir}
    install -m 0755 myapp ${D}${bindir}
}
```

---

## Common Variable Quick Reference

| Variable | Purpose | Set In |
|---|---|---|
| `MACHINE` | Target hardware | `local.conf` |
| `DISTRO` | Distribution configuration | `local.conf` |
| `IMAGE_INSTALL` | Packages in rootfs | `local.conf` or image recipe |
| `IMAGE_FEATURES` | High-level feature flags | Image recipe |
| `SRC_URI` | Source locations | Recipe |
| `SRCREV` | Git commit hash | Recipe |
| `S` | Source directory path | Recipe |
| `D` | Install destination (staging) | Automatic |
| `WORKDIR` | Temp build directory | Automatic |
| `DEPENDS` | Build-time dependencies | Recipe |
| `RDEPENDS:${PN}` | Runtime dependencies | Recipe |
| `FILES:${PN}` | Files in main package | Recipe |
| `PACKAGES` | Package split order | Recipe |
| `EXTRA_OECONF` | Autotools configure flags | Recipe |
| `EXTRA_OECMAKE` | CMake definitions | Recipe |
| `EXTRA_OEMAKE` | Make variables | Recipe |
| `FILESEXTRAPATHS` | Extra file search paths | `.bbappend` |
| `BBFILE_PRIORITY` | Layer priority number | `layer.conf` |

---

## BitBake Operators Quick Reference

| Operator | Name | Behavior |
|---|---|---|
| `VAR = "value"` | Assignment | Set at parse time (can be overridden) |
| `VAR ?= "value"` | Default | Set only if not already set |
| `VAR ??= "value"` | Weak default | Lowest priority default |
| `VAR := "value"` | Immediate | Expand variables immediately at parse time |
| `VAR += "value"` | Append (space) | Append with space separator |
| `VAR =+ "value"` | Prepend (space) | Prepend with space separator |
| `VAR:append = "value"` | Append (no space) | Append without space (at end of parsing) |
| `VAR:prepend = "value"` | Prepend (no space) | Prepend without space (at end of parsing) |
| `VAR:remove = "value"` | Remove | Remove specific value from list |

---

## QEMU Quick Reference

```bash
# Boot ARM image
runqemu qemuarm nographic

# Boot ARM64 image
runqemu qemuarm64 nographic

# Boot x86-64 image
runqemu qemux86-64

# Boot with networking (SLIRP user-mode)
runqemu qemuarm nographic slirp

# Exit nographic mode
# Press: Ctrl+A then X
```

---

## File Path Reference

```bash
# Build configuration
build/conf/local.conf          # Machine, parallelism, packages
build/conf/bblayers.conf       # Layer paths

# Build outputs
build/tmp/deploy/images/       # Final images (kernel, rootfs, wic)
build/tmp/deploy/rpm/          # RPM package feeds
build/tmp/deploy/ipk/          # IPK package feeds

# Recipe working directory
build/tmp/work/<arch>/<pn>/<pv>/
    ├── temp/                  # Task logs (log.do_compile, etc.)
    ├── recipe-sysroot/        # Build-time dependency staging
    ├── image/                 # do_install output (${D})
    └── packages-split/        # Package split output
```
