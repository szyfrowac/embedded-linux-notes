---
title: "Static & Dynamic Shared Libraries"
lesson:
  module: "Custom recipes, packaging and layers"
  level: Intermediate
  time: "5 min"
---


<div class="fd-panel">

**Learning Objectives**
By the end of this module, you will be able to:
1. Distinguish between static (`.a`) and dynamic (`.so`) libraries in Linux
2. Write a Yocto recipe that compiles and packages a dynamic shared library
3. Fix the `non-symlink .so` QA error when packaging unversioned libraries
4. Understand how `ALLOW_EMPTY` forces the creation of package groups

</div>

:::note[Prerequisites]
- Completed [Package Splitting & Installed-vs-Shipped](../package-splitting-and-installed-vs-shipped/)
:::

---

## 1. Static vs. Dynamic Libraries

When you write a C application, you often rely on external code (like `printf` from `glibc` or image parsing from `libpng`).

- **Static Libraries (`.a`)**: The external code is copied directly into your final executable binary during the linking phase. Your binary becomes large, but it is standalone.
- **Dynamic Shared Libraries (`.so`)**: The external code remains in a separate file on the filesystem (e.g., `/usr/lib/libpng.so`). When your application runs, the Linux OS dynamically loads the library into memory. Multiple applications can share the exact same `.so` file in RAM, saving massive amounts of memory and disk space.

Embedded Linux systems almost exclusively use **Dynamic Shared Libraries** to conserve storage and RAM.

---

## 2. Packaging Shared Libraries in Yocto

Let's assume you write a recipe that compiles `libmylib.so` and installs it to `/usr/lib/`. 

According to Yocto's default package splitting rules (from the [Package splitting: installed vs shipped](../package-splitting-and-installed-vs-shipped/) lesson):
- `libmylib.so.1.0` (The actual binary) -> Goes into `${PN}`
- `libmylib.so.1` (Symlink to binary) -> Goes into `${PN}`
- `libmylib.so` (Symlink used during compile-time) -> Goes into `${PN}-dev`

This default behavior is designed for *versioned* libraries (libraries that have `.1.0` appended to them).

### The Unversioned Library Problem

Sometimes, a poorly written Makefile will output an *unversioned* library: `libmylib.so` (with no `.1.0` suffix). It is the actual binary, not a symlink.

If you install `libmylib.so`, Yocto's default rules see the `.so` extension and aggressively shove it into the `${PN}-dev` package. 

When you install your main package (`${PN}`) onto the target board, it will be missing the library! Even worse, BitBake will throw a QA error.

### Example QA Error
```text
ERROR: QA Issue: -dev package contains non-symlink .so: 
mylibrary-dev path '/work/.../packages-split/mylibrary-dev/usr/lib/libmylib.so'
```

### The Fix

You must explicitly tell Yocto to pull `.so` files out of the `-dev` package and put them back into the main package.

```bash
# In your recipe.bb

# 1. Force the main package to take the .so file
FILES:${PN} += "${libdir}/lib*.so"

# 2. Prevent the -dev package from stealing it back
FILES:${PN}-dev:remove = "${libdir}/lib*.so"
```

*(Note: `${libdir}` evaluates to `/usr/lib`)*

---

## 3. Library-Only Recipes & `ALLOW_EMPTY`

If you write a recipe that *only* produces a library (`.so`) and headers (`.h`), it won't produce any standard binaries (`/usr/bin/`).

Yocto has a strict rule: **If a package is completely empty, do not generate the `.ipk/.rpm` file.**

However, you might want to generate the empty `${PN}` package anyway, just so other recipes can depend on it logically. To bypass the rule, use `ALLOW_EMPTY`:

```bash
# Force BitBake to generate the mylibrary.rpm file even if it contains 0 files
ALLOW_EMPTY:${PN} = "1"
```

---

## 4. Hands-On Lab Exercises

:::tip[LAB 12.1: Fix a Broken Library Recipe]
1. Create a recipe named `brokenlib_1.0.bb`.
2. Write a `do_compile` task that uses `gcc -shared -fPIC dummy.c -o libdummy.so` to generate an unversioned library.
3. Write a `do_install` task to install it into `${D}${libdir}`.
4. Try to build it: `bitbake brokenlib`. It will fail with the `non-symlink .so` QA error.
5. Apply the `FILES:${PN}` and `FILES:${PN}-dev:remove` fix from Section 2.
6. Rebuild and verify the error disappears.
:::

---

## 5. Further Reading

| Resource | URL |
|---|---|
| Library Packaging Rules | [docs.yoctoproject.org/dev-manual/packages.html#handling-library-packaging](https://docs.yoctoproject.org/dev-manual/packages.html) |

---

