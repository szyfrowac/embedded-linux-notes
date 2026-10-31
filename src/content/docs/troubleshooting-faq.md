---
title: "Troubleshooting FAQ"
---


Common build errors, their root causes, and step-by-step solutions.

---

## Build Environment Issues

### `ERROR: OE-core's config sanity checker detected a potential misconfiguration`

**Cause:** Missing host packages or incorrect locale settings.

**Fix:**
```bash
# Install all required packages
sudo apt install -y gawk wget git diffstat unzip texinfo gcc build-essential \
    chrpath socat cpio python3 python3-pip python3-pexpect \
    xz-utils debianutils iputils-ping python3-git python3-jinja2

# Ensure UTF-8 locale
sudo locale-gen en_US.UTF-8
export LANG=en_US.UTF-8
```

---

### `ERROR: No space left on device`

**Cause:** Disk full during build. A full Yocto build can consume 50–100 GB.

**Fix:**
```bash
# Check disk usage
df -h .

# Enable rm_work to delete intermediate build files
echo 'INHERIT += "rm_work"' >> conf/local.conf

# Clean specific recipe build artifacts
bitbake -c cleansstate <recipe-name>

# Nuclear option: clean everything
rm -rf tmp/work/*
```

---

## Recipe Errors

### `ERROR: Nothing PROVIDES '<package-name>'`

**Cause:** The recipe for `<package-name>` doesn't exist in any layer listed in `bblayers.conf`, or the layer containing it hasn't been added.

**Fix:**
```bash
# Search for the recipe across all available layers
bitbake-layers show-recipes "*<package-name>*"

# If the recipe is in a layer not yet added:
bitbake-layers add-layer /path/to/meta-layer

# Verify layers
bitbake-layers show-layers
```

---

### `ERROR: <recipe> do_fetch: Fetcher failure... Unable to find file`

**Cause:** Source download failed. Could be network issues, expired URL, or firewall blocking.

**Fix:**
```bash
# Retry with verbose output
bitbake -c fetch <recipe> -v

# If behind a corporate proxy, configure in local.conf:
# HTTP_PROXY = "http://proxy.company.com:8080"

# If upstream URL is dead, configure a mirror:
echo 'PREMIRRORS:prepend = "https://.*/.* https://downloads.yoctoproject.org/mirror/sources/ \n"' >> conf/local.conf
```

---

### `ERROR: <recipe> do_compile: oe_runmake failed`

**Cause:** Compilation error in the recipe's source code.

**Fix:**
```bash
# View the detailed compilation log
cat tmp/work/*/<recipe>/<version>-*/temp/log.do_compile

# Use devshell for interactive debugging
bitbake -c devshell <recipe>

# Inside devshell, try compiling manually:
${CC} ${CFLAGS} ${LDFLAGS} source.c -o output
```

---

### `ERROR: QA Issue: installed-vs-shipped [installed-vs-shipped]`

**Cause:** Files were installed by `do_install` into `${D}` but no package claims them via `FILES:${PN}`.

**Fix:** See [Package splitting: installed vs shipped](../package-splitting-and-installed-vs-shipped/) for detailed explanation.

```bash
# Add the missing files to your recipe:
FILES:${PN} += "${sysconfdir}/myconfig.conf ${datadir}/mydata/*"
```

---

### `ERROR: <recipe> do_package_qa: QA Issue: -dev package contains non-symlink .so`

**Cause:** An unversioned shared library (`.so` without version suffix) is being put in the `-dev` package, but it's needed at runtime.

**Fix:** See [Static and shared libraries](../static-and-dynamic-shared-libraries/).

```bash
# Add to your recipe:
FILES:${PN} += "${libdir}/lib*.so"
FILES:${PN}-dev:remove = "${libdir}/lib*.so"
```

---

## License Errors

### `ERROR: <recipe> do_populate_lic: QA Issue: ... could not find ... license`

**Cause:** `LIC_FILES_CHKSUM` doesn't match the actual license file content. The license file may have been updated upstream.

**Fix:**
```bash
# Find the correct checksum
md5sum tmp/work/*/<recipe>/<version>-*/LICENSE

# Update in recipe:
LIC_FILES_CHKSUM = "file://LICENSE;md5=<new_checksum>"
```

---

## QEMU / Emulation Issues

### `runqemu: command not found`

**Cause:** Build environment not initialized.

**Fix:**
```bash
source oe-init-build-env
```

### QEMU: `Could not access KVM kernel module: No such file or directory`

**Cause:** KVM not available (running in a VM without nested virtualization).

**Fix:**
```bash
# Disable KVM in runqemu (use software emulation)
runqemu qemuarm nographic slirp
```

---

## Performance Tips

| Tip | Configuration | Impact |
|---|---|---|
| Enable shared state cache | Default (automatic) | Skips unchanged recipes on rebuild |
| Use `rm_work` | `INHERIT += "rm_work"` | Reduces disk usage by 70% |
| Increase parallel tasks | `BB_NUMBER_THREADS = "16"` | Speeds up overall build |
| Increase make parallelism | `PARALLEL_MAKE = "-j 16"` | Speeds up individual recipe compilation |
| Share downloads directory | `DL_DIR = "/shared/downloads"` | Avoids re-downloading across builds |
| Share sstate cache | `SSTATE_DIR = "/shared/sstate"` | Speeds up builds on shared servers |
