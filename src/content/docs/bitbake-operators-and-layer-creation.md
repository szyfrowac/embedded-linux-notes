---
title: "BitBake Operators & Layer Creation"
lesson:
  module: "Custom recipes, packaging and layers"
  level: Intermediate
  time: "5 min"
---


<div class="fd-panel">

**Learning Objectives**
By the end of this module, you will be able to:
1. Explain the order of parsing in BitBake and how variables are expanded
2. Differentiate between `+`, `=`, `?=`, `??=`, and `:=` operators
3. Utilize override syntax (`:append`, `:prepend`, `:remove`) safely
4. Create a custom software layer using the `bitbake-layers` utility
5. Structure a new layer correctly to isolate custom recipes from OE-Core

</div>

:::note[Prerequisites]
- Completed [Raspberry Pi Hardware Bring-Up](../raspberry-pi-hardware-bringup/)
- Familiarity with modifying `local.conf`
:::

---

## 1. BitBake Variable Assignment Operators

BitBake processes all metadata files (`.conf`, `.bbclass`, `.bb`, `.bbappend`) sequentially. When multiple files define the same variable (like `IMAGE_INSTALL`), BitBake uses specific assignment operators to resolve conflicts.

| Operator | Name | Behavior | Example |
|---|---|---|---|
| `=` | **Hard Assignment** | Overwrites any previous value. Set at parse time, but can be overridden later in the parsing queue. | `VAR = "foo"` |
| `?=` | **Soft Default** | Sets the value *only if* it has not been set by a hard assignment before. If multiple `?=` exist, the first one encountered wins. | `VAR ?= "default"` |
| `??=` | **Weak Default** | The lowest priority assignment. If multiple `??=` exist, the *last* one encountered wins. Usually used in core classes. | `VAR ??= "weak"` |
| `:=` | **Immediate Expansion**| Evaluates and locks in the value *immediately* when parsed. Normal variables are expanded lazily at the end. | `VAR := "${OTHER_VAR}"` |
| `+=` | **Append (Space)** | Appends a value with a leading space. | `VAR += "bar"` -> `foo bar` |
| `=+` | **Prepend (Space)** | Prepends a value with a trailing space. | `VAR =+ "bar"` -> `bar foo` |

### Lazy vs. Immediate Expansion

By default, BitBake variables are expanded **lazily** (at the very end of the parsing process). 

```bash
# Example of Lazy Expansion (Default)
A = "apple"
B = "${A}"
A = "orange"
# B evaluates to "orange" because expansion happens at the end

# Example of Immediate Expansion
A = "apple"
C := "${A}"
A = "orange"
# C evaluates to "apple" because it was locked immediately
```

---

## 2. Override Operators (`:append` and `:prepend`)

While `+=` is useful, it is applied strictly in the order BitBake parses files. If you use `+=` in your recipe, but a core class overwrites it with `=` later, your append is lost.

To guarantee your additions are applied, use the override operators. These are guaranteed to be evaluated at the very end of the parsing phase, regardless of where they are defined.

```bash
# Correct way to append packages to an image
IMAGE_INSTALL:append = " busybox-syslog"

# Correct way to prepend a search path
FILESEXTRAPATHS:prepend = "${THISDIR}/files:"

# Removing a specific item from a list
IMAGE_INSTALL:remove = " dropbear"
```

:::caution[Spacing is critical]
Unlike `+=`, the override operators (`:append` and `:prepend`) **DO NOT** automatically add a space! You must include the space inside your quotes, otherwise you will merge strings together (e.g., `busyboxdropbear`).

**Correct:** `IMAGE_INSTALL:append = " curl"`
**Wrong:** `IMAGE_INSTALL:append = "curl"`
:::

---

## 3. Creating a Custom Software Layer

Never put your custom recipes, images, or machine definitions directly into the `meta` (OE-Core) or `meta-yocto-bsp` layers. When you update the Yocto Project to a new release, your changes will be overwritten or cause massive Git conflicts.

Instead, isolate your project into a custom layer.

### Step 1: Create the Layer

The `bitbake-layers` command line tool generates the correct directory structure and boilerplate `layer.conf` file automatically.

```bash
cd /path/to/poky/build
bitbake-layers create-layer ../meta-custom
```

### Step 2: Inspect the Generated `layer.conf`

Open `../meta-custom/conf/layer.conf`:

```bash
# We have a conf and classes directory, add to BBPATH
BBPATH .= ":${LAYERDIR}"

# We have recipes-* directories, add to BBFILES
BBFILES += "${LAYERDIR}/recipes-*/*/*.bb \
            ${LAYERDIR}/recipes-*/*/*.bbappend"

BBFILE_COLLECTIONS += "meta-custom"
BBFILE_PATTERN_meta-custom = "^${LAYERDIR}/"
BBFILE_PRIORITY_meta-custom = "6"

LAYERDEPENDS_meta-custom = "core"
LAYERSERIES_COMPAT_meta-custom = "kirkstone"
```
*Notice how `BBFILE_PRIORITY` determines precedence when two layers provide the same recipe.*

### Step 3: Add the Layer to Your Build

Even though you created the layer, BitBake won't scan it until it's added to `bblayers.conf`.

```bash
bitbake-layers add-layer ../meta-custom
```

Verify it:
```bash
bitbake-layers show-layers
```

---

## 4. Hands-On Lab Exercises

:::tip[LAB 6.1: Using `bitbake -e` to Debug Variables]
The `bitbake -e` command prints the fully expanded environment for a recipe, showing exactly where a variable was modified.
1. Run `bitbake -e core-image-minimal | grep ^IMAGE_INSTALL=`
2. Run `bitbake -e core-image-minimal | grep ^MACHINE=`
3. Try adding `IMAGE_INSTALL:append = " curl"` to your `local.conf`. Run the command again and observe the change.
:::

:::tip[LAB 6.2: Scaffold Your First Layer]
1. Use `bitbake-layers create-layer` to create a new layer named `meta-myproject` in the `poky/` root directory.
2. Add it to your `bblayers.conf`.
3. Create the directories: `mkdir -p ../meta-myproject/recipes-core/images/` (we will use this in the [Custom image recipes and features](../custom-image-recipes-and-features/) lesson).
:::

---

## 5. Further Reading

| Resource | URL |
|---|---|
| BitBake User Manual: Syntax | [docs.yoctoproject.org/bitbake/bitbake-user-manual/bitbake-user-manual-metadata.html](https://docs.yoctoproject.org/bitbake/bitbake-user-manual/bitbake-user-manual-metadata.html) |
| Creating a General Layer | [docs.yoctoproject.org/dev-manual/layers.html](https://docs.yoctoproject.org/dev-manual/layers.html) |

---

