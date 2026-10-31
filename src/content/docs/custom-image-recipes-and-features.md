---
title: "Custom Image Recipes & Image Features"
lesson:
  module: "Custom recipes, packaging and layers"
  level: Intermediate
  time: "5 min"
---


<div class="fd-panel">

**Learning Objectives**
By the end of this module, you will be able to:
1. Inherit `core-image` to create a custom image recipe instead of appending to `local.conf`
2. Group software using package groups and standard Yocto conventions
3. Utilize `IMAGE_FEATURES` to easily enable high-level functionalities like SSH servers
4. Generate and inspect `.manifest` files to audit installed packages
5. Define default passwords or SSH root access for development images

</div>

:::note[Prerequisites]
- Completed [BitBake Operators & Layer Creation](../bitbake-operators-and-layer-creation/)
- Created the `meta-custom` layer from the previous lab
:::

---

## 1. Why Create a Custom Image Recipe?

Up to this point, we have built the default `core-image-minimal` provided by OE-Core, and to add packages, we modified `IMAGE_INSTALL:append` in `local.conf`. 

**This is an anti-pattern for production!** 
`local.conf` is designed for *local build machine settings* (like CPU cores, downloads directories, and target machine), not for defining the contents of the final product. 

If you commit your project to Git, `local.conf` is usually ignored (via `.gitignore`), meaning other developers won't get your package additions. The correct approach is to create a custom **Image Recipe** inside your custom layer.

---

## 2. Writing a Custom Image Recipe

Let's create a custom image that includes a text editor (`nano`), network tools (`curl`), and an SSH server.

Create a new file in your layer:
`meta-custom/recipes-core/images/my-custom-image.bb`

```bash
SUMMARY = "My Custom Embedded Linux Distribution"
DESCRIPTION = "A production-ready image based on core-image-minimal but with networking and debug tools."

# Inherit the base image logic from OE-Core
inherit core-image

# Add our custom packages to the root filesystem
IMAGE_INSTALL += " \
    nano \
    curl \
    iproute2 \
"

# Enable high-level image features
IMAGE_FEATURES += " \
    ssh-server-dropbear \
    debug-tweaks \
"
```

### Building Your Image
Instead of building `core-image-minimal`, you now instruct BitBake to build your new recipe:

```bash
bitbake my-custom-image
```

---

## 3. The Power of `IMAGE_FEATURES`

The `IMAGE_FEATURES` variable allows you to enable broad classes of functionality without having to know the names of the individual underlying packages. The `core-image` class translates these features into the correct `IMAGE_INSTALL` lists.

| Feature | Description |
|---|---|
| `ssh-server-dropbear` | Installs the lightweight Dropbear SSH server. |
| `ssh-server-openssh` | Installs the full OpenSSH server suite. |
| `x11-base` | Installs a basic X11 graphical server. |
| `tools-debug` | Installs gdb, strace, and other debugging tools. |
| `tools-sdk` | Installs a full compiler toolchain (gcc, make) on the target board itself. |
| `debug-tweaks` | Crucial for development! Allows passwordless root login (empty password). **Remove this before production!** |

---

## 4. Package Groups

Instead of listing 50 individual networking utilities in `IMAGE_INSTALL`, Yocto uses **Package Groups** (previously known as tasks). These are meta-packages that depend on a logical grouping of other packages.

For example, to install a complete suite of networking tools, you can just add:
```bash
IMAGE_INSTALL += "packagegroup-core-full-cmdline"
```

You can view the available package groups in `meta/recipes-core/packagegroups/`.

---

## 5. Security: Handling Root Passwords

By default, Yocto images lock the `root` account unless `debug-tweaks` is enabled in `IMAGE_FEATURES`, which sets an empty password. 

For production, you must remove `debug-tweaks` and set a secure password. You can do this by inheriting `extrausers` in your image recipe:

```bash
# In your my-custom-image.bb
inherit extrausers

# Set root password to "root" (hash generated using openssl passwd -6)
EXTRA_USERS_PARAMS = "usermod -p '\$6\$xyz123\$hashedpasswordstring' root;"
```

---

## 6. Hands-On Lab Exercises

:::tip[LAB 7.1: Create Your First Custom Image]
1. Inside your `meta-myproject` layer (from the [BitBake operators and layer creation](../bitbake-operators-and-layer-creation/) lesson), create the folder structure: `mkdir -p recipes-core/images/`.
2. Create `my-custom-image.bb` and populate it with `nano`, `htop`, and the Dropbear SSH server.
3. Build the image: `bitbake my-custom-image`.
4. Run it in QEMU: `runqemu qemuarm nographic slirp`.
5. **Test Linux Application Compatibility**:
   - Log in as `root`.
   - Run `htop`. You should see the interactive system monitor. This proves that the Linux kernel's `/proc` filesystem and standard C libraries are functioning perfectly on your custom image! Press `q` to exit.
   - Run `nano test.txt`, type a message, and press `Ctrl+X` then `Y` to save. This proves the root filesystem is writable and fully operational.
:::

:::tip[LAB 7.2: Analyzing the Manifest File]
How do you prove to your security team exactly which open-source packages are in your final image? You look at the `.manifest` file!
1. Navigate to `tmp/deploy/images/qemuarm/`.
2. Locate the file ending in `.manifest` (e.g., `my-custom-image-qemuarm.manifest`).
3. Open it. This file lists every single IPK/RPM package installed in the rootfs along with its exact version architecture. This is critical for SBOM (Software Bill of Materials) generation.
:::

---

## 7. Further Reading

| Resource | URL |
|---|---|
| Customizing Images | [docs.yoctoproject.org/dev-manual/customizing-images.html](https://docs.yoctoproject.org/dev-manual/customizing-images.html) |
| Image Features Reference | [docs.yoctoproject.org/ref-manual/features.html#image-features](https://docs.yoctoproject.org/ref-manual/features.html#image-features) |

---

