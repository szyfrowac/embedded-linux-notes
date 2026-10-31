---
title: "BBAppends, FILESPATH & Custom Splash Screens"
lesson:
  module: "Custom recipes, packaging and layers"
  level: Intermediate
  time: "5 min"
---


<div class="fd-panel">

**Learning Objectives**
By the end of this module, you will be able to:
1. Modify upstream recipes safely using `.bbappend` files
2. Manipulate the `FILESEXTRAPATHS` variable to override upstream source files
3. Apply these concepts to replace the default Yocto boot splash screen with a custom image
4. Utilize `bitbake-layers show-appends` to audit active modifications

</div>

:::note[Prerequisites]
- Completed [Devshell Debugging](../cmake-recipes-and-devshell-debugging/)
- A custom layer (`meta-custom`) added to `bblayers.conf`
:::

---

## 1. The Power of `.bbappend`

You are building a custom embedded device and you realize the SSH server (`dropbear`) provided by OE-Core has a default configuration file that doesn't meet your security requirements.

**The Wrong Way:** You open `poky/meta/recipes-core/dropbear/dropbear_2022.82.bb` and edit it directly. When the next Yocto release comes out, your changes are overwritten or cause massive Git merge conflicts.

**The Yocto Way:** You create a `.bbappend` file in your *custom layer*.

A `.bbappend` file acts like a patch for a `.bb` recipe. BitBake parses the original `.bb` file first, and then parses the `.bbappend`, allowing you to override variables and append tasks cleanly from outside the original layer.

### Rule of BBAppends
The `.bbappend` filename must exactly match the base `.bb` filename.
- Base: `dropbear_2022.82.bb`
- Append: `dropbear_2022.82.bbappend`
*(You can also use the wildcard `%` for versioning: `dropbear_%.bbappend`)*

---

## 2. Overriding Files with `FILESEXTRAPATHS`

When a recipe fetches local files using `file://`, it searches directories listed in the `FILESPATH` variable. 

By default, the original layer's directories are searched first. If you want BitBake to use *your* custom configuration file instead of the original one, you must prepend your layer's directory to the search path.

You do this using the `FILESEXTRAPATHS` variable inside your `.bbappend`.

```bash
# In meta-custom/recipes-core/dropbear/dropbear_%.bbappend

# 1. Prepend our layer's files/ directory to the search path.
# Notice the := operator (immediate expansion) and the :prepend operator.
# The trailing colon (:) is critical! It acts as a directory separator.
FILESEXTRAPATHS:prepend := "${THISDIR}/files:"

# 2. Add extra configuration flags to the original recipe
EXTRA_OECONF += "--disable-weak-ciphers"
```

Now, if you place a file named `dropbear.default` inside `meta-custom/recipes-core/dropbear/files/`, BitBake will use yours instead of the one in OE-Core!

---

## 3. Practical Example: Customizing the Splash Screen

Let's apply these concepts to replace the default Yocto Project boot splash screen with your company's logo.

The recipe responsible for the splash screen in Yocto is `psplash`.

### Step 1: Create the BBAppend Structure

Inside your custom layer, mirror the directory structure of the original recipe:
```bash
mkdir -p meta-custom/recipes-core/psplash/files/
```

Create the append file `meta-custom/recipes-core/psplash/psplash_%.bbappend`:
```bash
# Prioritize our files/ directory
FILESEXTRAPATHS:prepend := "${THISDIR}/files:"

# We define a new custom logo. The psplash recipe uses the SPLASH_IMAGES variable.
# We append our custom image definition to it.
SPLASH_IMAGES:append = " file://custom-logo.png;outsuffix=custom"
```

### Step 2: Provide the Custom Image

Create a PNG image named `custom-logo.png` and place it in the `files/` directory you just created.

*Note: The image should not have an alpha channel (transparency) as the framebuffer might not support it cleanly.*

### Step 3: Build and Test

If you have `psplash` installed in your image, rebuild it:
```bash
bitbake core-image-minimal
```
Boot the image in QEMU. You should see your custom logo during the boot process instead of the Yocto logo!

---

## 4. Auditing Appends

As your project grows, you might have dozens of `.bbappend` files modifying core recipes. If a build suddenly breaks, it can be hard to track down which append is causing the issue.

BitBake provides a command to list all active appends:

```bash
bitbake-layers show-appends
```

**Output Example:**
```text
State of append files:
dropbear_2022.82.bb:
  /path/to/meta-custom/recipes-core/dropbear/dropbear_%.bbappend
psplash_git.bb:
  /path/to/meta-raspberrypi/recipes-core/psplash/psplash_%.bbappend
  /path/to/meta-custom/recipes-core/psplash/psplash_%.bbappend
```
*Notice how `psplash` has two appends applied! One from `meta-raspberrypi` and one from your `meta-custom`.*

---

## 5. Course Conclusion

Congratulations! 🎉 You have completed the 16-Day Embedded Linux and Yocto Masterclass.

You now possess the skills to:
- Architect custom embedded Linux distributions
- Navigate the OpenEmbedded build system and BitBake engine
- Write custom recipes and `.bbappend` files
- Integrate third-party BSP layers for hardware bring-up
- Debug complex C/C++ cross-compilation failures

**Next Steps:**
Check out the [Renode Emulation Guide](../renode-emulation-guide/) to learn how to boot full Zynq-7000 FPGA-SoC Linux images entirely in software, or review the [BitBake Cheat Sheet](../cheat-sheet/) for a quick reference on your next project.

