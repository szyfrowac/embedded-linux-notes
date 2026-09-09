# BitBake Task Execution, `devtool` Workflow & Application Development

This module explores the internal BitBake task execution pipeline, cleaning/rebuilding recipes, and using `devtool` for rapid iterative software development without full rebuilds.

---

## 1. BitBake Task Pipeline Execution

Every recipe processed by BitBake runs a series of sequential task methods prefixed with `do_`:

```
[do_fetch] ──> [do_unpack] ──> [do_patch] ──> [do_configure] ──> [do_compile] ──> [do_install] ──> [do_package] ──> [do_rootfs]
```

### Key BitBake Task Commands

```bash
# List all tasks available for a recipe
bitbake recipe-name -c listtasks

# Execute a specific task only (e.g., fetch sources)
bitbake recipe-name -c fetch

# Clean recipe build directory (removes tmp/work staging)
bitbake recipe-name -c clean

# Force clean ALL downloaded source tarballs, sstate cache & build artifacts
bitbake recipe-name -c cleansstate

# Force re-compilation of a modified recipe
bitbake recipe-name -c compile -f
```

---

## 2. Rapid Iterative Development with `devtool`

Building recipes through `bitbake` during active software development can be slow. The **`devtool` command line tool** simplifies editing source code, building, and deploying directly to a running target hardware board via SSH.

```
+-------------------------------------------------------------------------+
| devtool add     : Automatically generates a recipe from Git/source URL  |
| devtool modify  : Extracts recipe source code for local editing          |
| devtool build   : Compiles modified code locally in seconds             |
| devtool deploy  : Installs compiled binaries directly onto live board   |
| devtool finish  : Generates patches & updates recipe in layer           |
+-------------------------------------------------------------------------+
```

---

## 3. Step-by-Step `devtool` Hands-On Workflow

### Step 1: Create or Modify a Recipe with `devtool`
```bash
# Extract source code for an existing recipe to workspace/sources/
devtool modify myapp
```

This checks out the source code into `workspace/sources/myapp/`. You can now edit the C/C++ or Python source files using standard IDEs (`vscode`, `vim`).

### Step 2: Test Build Locally
```bash
devtool build myapp
```
*(Takes seconds instead of minutes because only modified source files are recompiled!)*

### Step 3: Deploy Directly to Target Hardware Board
If your target board (BeagleBone, Raspberry Pi, or Zynq) is connected over Ethernet:
```bash
devtool deploy-target myapp root@192.168.1.50
```
*The compiled binary is immediately updated on the physical board over SSH!*

### Step 4: Commit Changes Back to Yocto Layer
Once testing is complete, commit source changes in Git inside `workspace/sources/myapp/` and run:
```bash
devtool finish myapp meta-custom
```
*`devtool` automatically generates a patch file (`.patch`), updates `SRC_URI` in `myapp.bb`, and removes workspace temporary files!*

---

## 4. Packaging Custom C Application Example

### Project Code (`files/sensor_reader.c`)
```c
#include <stdio.h>
#include <unistd.h>

int main() {
    printf("=========================================\n");
    printf("  Embedded Linux Sensor Reader v1.0      \n");
    printf("=========================================\n");
    while(1) {
        printf("[INFO] Telemetry OK - Reading Sensors...\n");
        sleep(2);
    }
    return 0;
}
```

### Recipe (`recipes-apps/sensor/sensor-reader_1.0.bb`)
```bitbake
SUMMARY = "Custom Telemetry Sensor Reader App"
LICENSE = "MIT"
LIC_FILES_CHKSUM = "file://${COMMON_LICENSE_DIR}/MIT;md5=0835ade698e0bcf8506ecda2f7b4f302"

SRC_URI = "file://sensor_reader.c"

S = "${WORKDIR}"

do_compile() {
    ${CC} ${CFLAGS} ${LDFLAGS} sensor_reader.c -o sensor_reader
}

do_install() {
    install -d ${D}${bindir}
    install -m 0755 sensor_reader ${D}${bindir}
}
```
