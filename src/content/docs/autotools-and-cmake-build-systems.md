---
title: "Autotools & CMake Build Systems"
lesson:
  module: "Custom recipes, packaging and layers"
  level: Intermediate
  time: "5 min"
---


<div class="fd-panel">

**Learning Objectives**
By the end of this module, you will be able to:
1. Understand how Yocto abstracts complex build systems (Autotools, CMake, Meson)
2. Use `inherit autotools` and `inherit cmake` in your recipes
3. Pass custom configuration flags to the underlying build system
4. Troubleshoot common cross-compilation configuration failures

</div>

:::note[Prerequisites]
- Completed [Recipe Dependencies (DEPENDS & RDEPENDS)](../recipe-dependencies-depends-rdepends/)
:::

---

## 1. The Build System Abstraction

In the [C applications](../writing-recipes-and-c-apps/) and [Makefiles](../build-logs-debugging-makefiles/) lessons, you wrote raw `do_compile` and `do_install` tasks to execute compiler strings or `make` manually. 

In the real world of open-source software, projects use sophisticated build systems (like Autotools or CMake) that probe the host environment, generate complex Makefiles, and handle installation paths automatically.

Writing manual `do_compile` functions for these projects in Yocto would be a nightmare. Instead, Yocto provides **Classes** that abstract away the entire process.

---

## 2. Autotools (`inherit autotools`)

The GNU Build System (Autotools) is the standard for legacy open-source C/C++ projects. You know a project uses Autotools if the source code contains a `configure.ac` script and requires you to run `./configure && make && make install`.

To compile an Autotools project in Yocto, you only need one line of code:

```bash
SUMMARY = "An Autotools based application"
SRC_URI = "..."

# This automatically writes the do_configure, do_compile, and do_install tasks!
inherit autotools
```

### Passing Custom Flags

Usually, you need to enable or disable specific features during the `./configure` stage. You do this using the `EXTRA_OECONF` variable.

```bash
# Translates to: ./configure --enable-gui --disable-debug
EXTRA_OECONF = "--enable-gui --disable-debug"
```

### Dealing with Broken Autotools (`autotools-brokensep`)

Standard Autotools creates a separate build directory outside the source tree to keep the source clean (Out-of-tree builds). Sometimes, poorly written `configure.ac` scripts break if they aren't executed directly inside the source tree.

If your Autotools recipe fails during `do_configure` with strange "file not found" errors, try switching to the fallback class:

```bash
inherit autotools-brokensep
```

---

## 3. CMake (`inherit cmake`)

CMake is the modern standard for C/C++ projects. It uses `CMakeLists.txt` files to define the build logic.

Just like Autotools, Yocto completely abstracts CMake compilation:

```bash
SUMMARY = "A modern CMake based application"
SRC_URI = "..."

# This automatically runs `cmake`, `make`, and `make install`
inherit cmake
```

### Passing Custom CMake Definitions

Instead of `./configure` flags, CMake uses definitions passed via `-D`. In Yocto, you pass these using the `EXTRA_OECMAKE` variable.

```bash
# Translates to: cmake -DBUILD_TESTS=OFF -DWITH_SSL=ON ...
EXTRA_OECMAKE = "-DBUILD_TESTS=OFF -DWITH_SSL=ON"
```

---

## 4. Other Build Systems

Yocto supports almost every major build system out of the box via inheritance:

- `inherit meson`: For projects using the Meson build system (ninja).
- `inherit python3targetconfig`: For Python applications (`setup.py`).
- `inherit cargo`: For Rust applications.
- `inherit go`: For Golang applications.

By using these classes, Yocto automatically handles all the grueling cross-compilation environment variables, library search paths, and staging directories.

---

## 5. Hands-On Lab Exercises

:::tip[LAB 14.1: Convert a Recipe to CMake]
Assume you have a `helloworld` project that uses CMake instead of a raw Makefile.
1. Create a `CMakeLists.txt` in your source directory:
   ```cmake
   cmake_minimum_required(VERSION 3.10)
   project(HelloWorld)
   add_executable(helloworld helloworld.c)
   install(TARGETS helloworld DESTINATION bin)
   ```
2. Update your `helloworld_1.0.bb` recipe. Remove the custom `do_compile` and `do_install` blocks entirely.
3. Add `inherit cmake` to the recipe.
4. Run `bitbake -c clean helloworld && bitbake helloworld`. 
5. Verify the compilation succeeds and the binary is packaged!
:::

---

## 6. Further Reading

| Resource | URL |
|---|---|
| Autotools Class Reference | [docs.yoctoproject.org/ref-manual/classes.html#autotools-bbclass](https://docs.yoctoproject.org/ref-manual/classes.html#autotools-bbclass) |
| CMake Class Reference | [docs.yoctoproject.org/ref-manual/classes.html#cmake-bbclass](https://docs.yoctoproject.org/ref-manual/classes.html#cmake-bbclass) |

---

