---
title: "Glossary of Embedded Linux & Yocto Terms"
---


A comprehensive reference of all terminology used across the 16-Day Masterclass, sourced from official [Yocto Project documentation](https://docs.yoctoproject.org/ref-manual/terms.html).

---

## A

**Append File (`.bbappend`)**: A file that extends or overrides an existing recipe without modifying the original. Must match the recipe name (e.g., `busybox_%.bbappend` extends any version of `busybox`). See [FILESEXTRAPATHS, splash screens and bbappends](../filespath-splashscreen-and-bbappends/).

**Autotools**: The GNU build system (`autoconf`, `automake`, `libtool`) used by many open-source projects. In Yocto, use `inherit autotools` to automatically handle `./configure && make && make install`. See [Autotools and CMake build systems](../autotools-and-cmake-build-systems/).

## B

**`BB_NUMBER_THREADS`**: Configuration variable in `local.conf` controlling how many BitBake tasks execute in parallel. Typically set to the number of CPU cores.

**BitBake**: The task execution engine at the heart of the Yocto build system. Written in Python, BitBake parses recipes, resolves dependency graphs, fetches source code, and orchestrates the entire build pipeline. See [Yocto foundations and fast emulation](../embedded-linux-yocto-foundations/).

**Board Support Package (BSP)**: A collection of metadata (machine configuration, kernel patches, bootloader recipes, device tree files) that enables Yocto to build images for a specific hardware platform. See [BSP layers, releases and WIC images](../yocto-releases-bsp-layers-wic/).

**Bootloader**: The first software executed after CPU power-on reset. Initializes critical hardware (clocks, DRAM) and loads the Linux kernel. Common bootloaders: U-Boot, Barebox. See [BeagleBone Black (AM335x)](../beaglebone-black-hardware-bringup/).

## C

**Class (`.bbclass`)**: A shared module of build logic that recipes can inherit using `inherit <class>`. Examples: `autotools`, `cmake`, `core-image`, `kernel`. See [Autotools and CMake build systems](../autotools-and-cmake-build-systems/).

**CMake**: A cross-platform build system generator. In Yocto, use `inherit cmake`. See [Autotools and CMake build systems](../autotools-and-cmake-build-systems/), [CMake recipes and devshell debugging](../cmake-recipes-and-devshell-debugging/).

**Cross-Compiler**: A compiler that runs on one architecture (host, e.g., x86_64) but generates binaries for a different architecture (target, e.g., ARM). See [Yocto foundations and fast emulation](../embedded-linux-yocto-foundations/).

## D

**`DEPENDS`**: Specifies build-time dependencies. Lists recipe names that must be built before the current recipe. Populates `recipe-sysroot` with headers and libraries. See [DEPENDS and RDEPENDS](../recipe-dependencies-depends-rdepends/).

**`DESTDIR` / `${D}`**: The staging directory representing the target root filesystem. `do_install` copies files here, and `do_package` splits them into packages. See [Writing C applications and simple recipes](../writing-recipes-and-c-apps/).

**Device Tree Blob (`.dtb`)**: A binary data structure describing hardware peripherals (memory-mapped registers, interrupt assignments, bus topology) to the Linux kernel. Compiled from Device Tree Source (`.dts`) files using `dtc`. See [BeagleBone Black (AM335x)](../beaglebone-black-hardware-bringup/).

**Devshell**: An interactive development shell launched with `bitbake -c devshell <recipe>`. Provides a terminal with all cross-compilation environment variables pre-set. See [CMake recipes and devshell debugging](../cmake-recipes-and-devshell-debugging/).

**`DL_DIR`**: The directory where BitBake stores downloaded source archives and git repositories. Defaults to `build/downloads/`. Can be shared across builds.

## E

**`EXTRA_IMAGE_FEATURES`**: Set in `conf/local.conf` to inject image features across all local builds without modifying image recipes. See [Custom image recipes and features](../custom-image-recipes-and-features/).

**`EXTRA_OECONF`**: Passes additional arguments to `./configure` when using `inherit autotools`. See [Autotools and CMake build systems](../autotools-and-cmake-build-systems/).

**`EXTRA_OECMAKE`**: Passes additional `-D` definitions to `cmake` when using `inherit cmake`. See [Autotools and CMake build systems](../autotools-and-cmake-build-systems/).

## F

**`FILESEXTRAPATHS`**: Extends the search path for local files referenced in `SRC_URI`. Critical for `.bbappend` files. See [FILESEXTRAPATHS, splash screens and bbappends](../filespath-splashscreen-and-bbappends/).

**`FILES:${PN}`**: Lists file patterns belonging to the main runtime package. Resolving `[installed-vs-shipped]` errors requires adding missing paths here. See [Package splitting: installed vs shipped](../package-splitting-and-installed-vs-shipped/).

## I

**`IMAGE_FEATURES`**: A high-level variable enabling predefined feature sets in image recipes (e.g., `ssh-server-dropbear`, `debug-tweaks`, `read-only-rootfs`). See [Custom image recipes and features](../custom-image-recipes-and-features/).

**`IMAGE_INSTALL`**: Lists packages to include in the root filesystem image. Use `:append` syntax to add packages. See [Yocto foundations and fast emulation](../embedded-linux-yocto-foundations/).

## L

**Layer**: A directory of related metadata (recipes, classes, configuration) that can be added to or removed from a build. Prefixed with `meta-` (e.g., `meta-raspberrypi`, `meta-ti`, `meta-xilinx`). See [Yocto architecture, workflow and state](../yocto-architecture-terminology-workflow/).

**`LIC_FILES_CHKSUM`**: A mandatory recipe variable containing the checksum of the software's license file. BitBake verifies this checksum to detect unintended license changes. See [Writing C applications and simple recipes](../writing-recipes-and-c-apps/).

## M

**`MACHINE`**: Defines the target hardware platform. Set in `conf/local.conf`. Examples: `qemuarm`, `beaglebone-yocto`, `raspberrypi3`, `zedboard-zynq7`. See [Yocto foundations and fast emulation](../embedded-linux-yocto-foundations/).

**Metadata**: The collective term for all configuration files (`.conf`), recipes (`.bb`), appends (`.bbappend`), and classes (`.bbclass`).

## O

**`oe_runmake`**: A Yocto helper function that executes `make` with cross-compilation variables automatically passed. See [Build logs and debugging Makefiles](../build-logs-debugging-makefiles/).

**OpenEmbedded-Core (OE-Core)**: The core metadata layer (`meta/`) containing fundamental recipes, classes, and configuration for building embedded Linux. See [Yocto foundations and fast emulation](../embedded-linux-yocto-foundations/).

## P

**`PACKAGES`**: Variable listing all output packages generated by a recipe, in left-to-right priority order. See [Package splitting: installed vs shipped](../package-splitting-and-installed-vs-shipped/).

**`PARALLEL_MAKE`**: Sets the `-j` flag for `make` commands. Controls compilation parallelism within a single recipe.

**Poky**: The Yocto Project reference distribution combining BitBake + OE-Core + meta-poky + meta-yocto-bsp. See [Yocto foundations and fast emulation](../embedded-linux-yocto-foundations/).

## R

**`RDEPENDS`**: Specifies runtime dependencies. Lists package names that must be present on the target system. See [DEPENDS and RDEPENDS](../recipe-dependencies-depends-rdepends/).

**Recipe (`.bb`)**: A file containing instructions for building a single software package. Defines where to fetch source code, how to compile it, and how to package the output. See [Writing C applications and simple recipes](../writing-recipes-and-c-apps/).

**Renode**: An open-source hardware emulator supporting Zynq-7000/ZedBoard and other platforms. See [Renode Guide](../renode-emulation-guide/).

**Root Filesystem (rootfs)**: The complete directory hierarchy (`/bin`, `/etc`, `/lib`, `/usr`) that Linux mounts as `/` after booting. See [Yocto foundations and fast emulation](../embedded-linux-yocto-foundations/).

## S

**Shared State Cache (`sstate-cache`)**: A directory storing compiled build artifacts keyed by input hash. Allows BitBake to skip rebuilding unchanged recipes, dramatically reducing build times. See [Yocto architecture, workflow and state](../yocto-architecture-terminology-workflow/).

**`SOLIBS` / `SOLIBSDEV`**: Variables controlling how versioned (`.so.1.0`) and unversioned (`.so`) shared libraries are assigned to packages. See [Static and shared libraries](../static-and-dynamic-shared-libraries/).

**`SRC_URI`**: Specifies the location(s) of source code, patches, and local files for a recipe. Supports `http://`, `git://`, `file://`, and other fetcher protocols. See [Writing C applications and simple recipes](../writing-recipes-and-c-apps/).

**`SRCREV`**: Specifies the exact Git commit hash to checkout. Ensures reproducible builds. See [Git sources and patching](../git-repositories-and-source-patching/).

## T

**Toolchain**: The cross-compiler, binutils, C library, and kernel headers used to compile software for the target architecture. See [Yocto foundations and fast emulation](../embedded-linux-yocto-foundations/).

## W

**WIC (`.wic`)**: A tool and disk image format that creates pre-partitioned, bootable SD card images. Configured via `.wks` (kickstart) files. See [BSP layers, releases and WIC images](../yocto-releases-bsp-layers-wic/).

**`WORKDIR`**: The temporary build directory for a recipe under `tmp/work/<arch>/<pn>/<pv>/`. Contains fetched sources, build outputs, and task logs. See [Writing C applications and simple recipes](../writing-recipes-and-c-apps/).
