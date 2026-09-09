# Creating Custom Layers & Writing Recipes (`.bb` & `.bbappend`)

This module covers creating custom Yocto layers from scratch, understanding recipe syntax (`.bb`), managing source checksums, writing `.bbappend` override files, and integrating custom software into your target image.

---

## 1. Why Create Custom Layers?

In Yocto, **never modify core OpenEmbedded or Poky recipes directly**. Upstream layers (`meta`, `meta-poky`, `meta-ti`, `meta-raspberrypi`) are updated regularly. Any direct edits will be wiped during `git pull` or version upgrades.

### The Modular Layer Approach
Instead, encapsulate all custom recipes, patches, hardware configs, and company-specific applications in a separate custom layer (e.g., `meta-custom` or `meta-product`).

```
meta-custom/
├── conf/
│   └── layer.conf          # Layer configuration (priority, dependencies, compatible Yocto versions)
├── COPYING.MIT             # Layer license
├── README                  # Layer description
└── recipes-example/
    └── myapp/
        ├── files/          # Patches, source code files, init scripts
        │   ├── myapp.c
        │   └── CMakeLists.txt
        └── myapp_1.0.bb    # Recipe file
```

---

## 2. Creating a Custom Layer with `bitbake-layers`

Yocto provides a helper script to generate standard layer directory templates automatically:

```bash
cd ~/projects/poky

# Create a new layer named meta-custom
bitbake-layers create-layer meta-custom

# Add the new layer to conf/bblayers.conf
bitbake-layers add-layer meta-custom

# Verify layer registration
bitbake-layers show-layers
```

---

## 3. Understanding Recipe (`.bb`) Syntax & Key Variables

A recipe (`.bb` file) contains instructions for BitBake on how to fetch, patch, compile, package, and install a specific piece of software.

### Core Variables in a Recipe

```bitbake
SUMMARY = "My Custom C Application"
DESCRIPTION = "A sample C application demonstrating recipe creation in Yocto."
HOMEPAGE = "https://example.com/myapp"

# License specification (Mandatory)
LICENSE = "MIT"
LIC_FILES_CHKSUM = "file://${COMMON_LICENSE_DIR}/MIT;md5=0835ade698e0bcf8506ecda2f7b4f302"

# Source code location (local file, Git URL, or Tarball HTTP link)
SRC_URI = "file://myapp.c"

# Source directory inside build sandbox
S = "${WORKDIR}"

# Target installation directory task
do_install() {
    install -d ${D}${bindir}
    install -m 0755 myapp ${D}${bindir}
}
```

### Key Recipe Variables Explained

| Variable | Description |
| :--- | :--- |
| `PN` | Package Name (derived automatically from recipe filename before `_`). |
| `PV` | Package Version (derived automatically from recipe filename after `_`). |
| `PR` | Package Revision (e.g., `r0`, `r1`). Incremented when modifying build steps. |
| `SRC_URI` | List of source files, remote URLs, or local patches fetched by `do_fetch`. |
| `LIC_FILES_CHKSUM` | MD5 or SHA256 checksum of license text file ensuring compliance. |
| `${D}` | Destination directory staging folder representing the rootfs on host. |
| `${bindir}` | Standard target binary path (`/usr/bin`). |

---

## 4. Writing `.bbappend` Files for Upstream Overrides

To modify an existing recipe from another layer (e.g., modifying `systemd.bb` or `nginx.bb` to add custom config files or patches), write a **Recipe Append file (`.bbappend`)**.

### Naming Rule
The `.bbappend` filename must match the original recipe name exactly (e.g., `busybox_%.bbappend` to match any version of BusyBox).

```bitbake
# Structure of meta-custom/recipes-core/busybox/busybox_%.bbappend

FILESEXTRAPATHS:prepend := "${THISDIR}/files:"

SRC_URI:append = " file://custom-busybox.cfg"
```

::: tip FILESEXTRAPATHS PREPEND
Setting `FILESEXTRAPATHS:prepend := "${THISDIR}/files:"` forces BitBake to search your custom layer's `files/` directory first before checking upstream layer folders!
:::

---

## 5. Inheriting Standard Build Classes

Instead of writing manual compilation steps in `do_compile()`, recipes can inherit standard build system classes:

### Autotools Class
```bitbake
inherit autotools
```
*(Automatically executes `./configure`, `make`, and `make install`)*

### CMake Class
```bitbake
inherit cmake
```
*(Automatically passes cross-compiler flags to `cmake -B build` and builds targets)*

### Python 3 Class
```bitbake
inherit setuptools3
```
*(Automatically compiles and packages Python 3 modules)*

---

## 6. Testing Your Custom Recipe

```bash
# Build custom recipe independently
bitbake myapp

# Add myapp to local.conf
echo 'IMAGE_INSTALL:append = " myapp"' >> conf/local.conf

# Rebuild root filesystem
bitbake core-image-minimal
```
