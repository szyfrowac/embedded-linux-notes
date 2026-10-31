---
title: "Devshell Debugging"
lesson:
  module: "Custom recipes, packaging and layers"
  level: Intermediate
  time: "5 min"
---


<div class="fd-panel">

**Learning Objectives**
By the end of this module, you will be able to:
1. Explain the purpose of the `devshell` task in BitBake
2. Open an interactive cross-compilation terminal for any recipe
3. Manually execute configuration and compilation steps to debug complex failures
4. Rapidly iterate on C/C++ code without running full BitBake cycles

</div>

:::note[Prerequisites]
- Completed [Autotools & CMake Build Systems](../autotools-and-cmake-build-systems/)
:::

---

## 1. The Debugging Dilemma

When writing recipes for complex C/C++ projects, things often break during `do_configure` or `do_compile`. 

The traditional debugging loop is slow and painful:
1. Run `bitbake myrecipe`
2. Build fails.
3. Hunt down `log.do_compile` in the `tmp/work/...` directory.
4. Read the log, guess the fix, modify the recipe or `.patch` file.
5. Run `bitbake -c clean myrecipe`
6. Run `bitbake myrecipe` again and wait for it to unpack and configure all over again.

There is a vastly superior way to debug: **The Developer Shell (`devshell`)**.

---

## 2. Introducing `bitbake -c devshell`

The `devshell` task pauses the BitBake build process immediately after `do_patch` (source code is unpacked and patched) and before `do_configure`.

It then opens a brand new terminal window on your host machine.

```bash
bitbake -c devshell myrecipe
```

### What makes the Devshell special?

This isn't a normal terminal. BitBake has meticulously injected **hundreds of cross-compilation environment variables** into this shell.

- The `CC` variable points to the Yocto cross-compiler, not your host's GCC.
- The `CFLAGS` and `LDFLAGS` are fully populated.
- The `PATH` is prepended with Yocto's native tools.
- The `PKG_CONFIG_PATH` points to the `recipe-sysroot`, not your host's `/usr/lib`.

You are effectively standing inside the matrix. If you type `make`, it will cross-compile for the target architecture (e.g., ARM) perfectly.

---

## 3. Interactive Debugging Workflow

Once the Devshell terminal pops open, you are placed directly inside the recipe's source directory (`${S}`).

Here is how you use it to debug a broken build:

### Step 1: Manually Configure
If the recipe inherits Autotools, manually run the configure script to see exactly why it is failing:
```bash
./configure ${EXTRA_OECONF}
```

### Step 2: Manually Compile
If the configuration succeeds, run `make` manually.
```bash
make -j8
```
Since you are in an interactive terminal, if `make` fails with a C syntax error, you can use `vim` or `nano` right there in the terminal to edit the source code (`.c` file) and immediately run `make` again. 

### Step 3: Capture the Fix
Once you successfully compile the code in the devshell, you know exactly what changes were required. 
1. Use `git diff` inside the devshell to see what C code you changed.
2. Save that diff as a `.patch` file (as learned in the [Git sources and patching](../git-repositories-and-source-patching/) lesson).
3. Exit the devshell (type `exit` or `Ctrl+D`).
4. Add the `.patch` to your recipe's `SRC_URI`.
5. Run a clean BitBake build to verify.

---

## 4. Troubleshooting Devshell Terminals

By default, BitBake tries to spawn the devshell using `xterm` or `gnome-terminal`. If you are running Yocto inside a headless server, a Docker container, or over SSH without X11 forwarding, the devshell will fail to open.

### The Headless Fallback: `tmux`

You can force BitBake to use `tmux` (a terminal multiplexer) instead of a graphical terminal window. This works perfectly over SSH.

Install `tmux` on your host:
```bash
sudo apt install tmux
```

Tell BitBake to use it in your `conf/local.conf`:
```bash
OE_TERMINAL = "tmux"
```

Now, when you run `bitbake -c devshell myrecipe`, a tmux session will take over your current terminal window.

---

## 5. Hands-On Lab Exercises

:::tip[LAB 15.1: Explore the Matrix]
1. Run `bitbake -c devshell busybox`.
2. A new terminal will appear (or tmux session).
3. Type `echo $CC` to see the cross-compiler binary.
4. Type `env | grep SYSROOT` to see how the environment isolates the build.
5. Type `exit` to close the devshell.
:::

---

## 6. Further Reading

| Resource | URL |
|---|---|
| Using a Development Shell | [docs.yoctoproject.org/dev-manual/development-shell.html](https://docs.yoctoproject.org/dev-manual/development-shell.html) |

---

