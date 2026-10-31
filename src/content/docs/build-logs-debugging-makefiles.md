---
title: "Build Logs, Debugging & Makefiles"
lesson:
  module: "Custom recipes, packaging and layers"
  level: Intermediate
  time: "5 min"
---


<div class="fd-panel">

**Learning Objectives**
By the end of this module, you will be able to:
1. Locate and interpret BitBake task execution logs (`log.do_*`)
2. Use Python-based messaging functions (`bbnote`, `bbwarn`, `bbfatal`) inside recipes
3. Understand how `oe_runmake` acts as a wrapper around the standard `make` command
4. Troubleshoot common `do_compile` failures related to Makefiles

</div>

:::note[Prerequisites]
- Completed [Writing Recipes & C Applications](../writing-recipes-and-c-apps/)
:::

---

## 1. Finding and Reading Build Logs

When a recipe fails to compile (e.g., a syntax error in your C code), BitBake will halt the entire build process and print a red error message to the console. However, the console output is often truncated. To find the *actual* compiler error (like `error: expected ';' before '}'`), you must look at the task logs.

Every task executed by BitBake generates a detailed log file inside the recipe's temporary `temp/` directory.

### Locating the Logs

The path format is:
`build/tmp/work/<architecture>/<recipe-name>/<version>/temp/`

For example, if our `helloworld` recipe from the [Writing C applications and simple recipes](../writing-recipes-and-c-apps/) lesson failed during compilation:
```bash
cd build/tmp/work/cortexa8hf-neon-poky-linux-gnueabi/helloworld/1.0-r0/temp/

# View the compilation log
cat log.do_compile

# Other useful logs:
# log.do_fetch
# log.do_configure
# log.do_install
```

:::tip[Pro tip]
When BitBake fails, it usually prints the exact absolute path to the log file in the console output. Always copy that path and `cat` it to see the underlying compiler error!
:::

---

## 2. Emitting Custom Messages (`bbnote`, `bbwarn`)

Sometimes when writing complex recipes, you want to print messages to the console to verify variables or warn the user. Because recipes execute within BitBake's Python environment, you cannot just use `echo`. You must use BitBake's logging utilities.

```bash
do_compile() {
    # This prints a standard informational message to the log
    bbnote "Starting compilation with CC=${CC}"
    
    # This prints a yellow warning to the main BitBake console
    bbwarn "Experimental feature enabled!"
    
    # This prints a red error and HALTS the entire build immediately
    if [ ! -f "Makefile" ]; then
        bbfatal "Makefile is missing! Cannot proceed."
    fi
    
    ${CC} ${CFLAGS} main.c -o main
}
```

---

## 3. Working with Makefiles and `oe_runmake`

In the [Writing C applications and simple recipes](../writing-recipes-and-c-apps/) lesson, we compiled a single C file by calling `${CC}` directly. However, 99% of open-source projects use build systems like `Make`. 

When a project has a `Makefile`, you shouldn't call `make` directly in your recipe. Instead, you use Yocto's wrapper function: **`oe_runmake`**.

### Why `oe_runmake` instead of `make`?

If you just run `make`, the host's native GCC compiler might be invoked, producing an x86 binary instead of an ARM binary. `oe_runmake` automatically injects the correct cross-compilation environment variables (like `CC`, `LD`, `CFLAGS`, and parallel execution flags `-j8`) into the Make process.

### Example: Compiling a Make Project

Assume you fetch a tarball that extracts a source tree containing a `Makefile`.

```bash
SUMMARY = "An application built with Make"
LICENSE = "MIT"
LIC_FILES_CHKSUM = "..."

SRC_URI = "https://example.com/myapp-1.0.tar.gz"

# S defaults to ${WORKDIR}/${BP}, which evaluates to ${WORKDIR}/myapp-1.0
# which is exactly where the tarball extracts to!

do_compile() {
    # This executes `make -j8 CC=arm-linux-... CFLAGS=...`
    oe_runmake
}

do_install() {
    # If the Makefile supports standard DESTDIR installation:
    oe_runmake install DESTDIR=${D} PREFIX=/usr
}
```

### Handling Bad Makefiles (`EXTRA_OEMAKE`)

Sometimes, poorly written Makefiles hardcode the compiler (`CC = gcc`). To force the Makefile to use Yocto's cross-compiler, you can pass arguments via the `EXTRA_OEMAKE` variable.

```bash
# Force the Makefile to use our compiler and linker flags
EXTRA_OEMAKE = "'CC=${CC}' 'CFLAGS=${CFLAGS}'"

do_compile() {
    oe_runmake
}
```

---

## 4. Hands-On Lab Exercises

:::tip[LAB 9.1: Break the Build and Read the Log]
1. Open `helloworld.c` (from the [Writing C applications and simple recipes](../writing-recipes-and-c-apps/) lesson) and intentionally remove a semicolon `;`.
2. Rebuild the recipe: `bitbake -c clean helloworld && bitbake helloworld`.
3. BitBake will fail. Find the path to `log.do_compile` in the red error text.
4. `cat` the log file and locate the exact GCC error message complaining about the missing semicolon.
5. Fix the code and rebuild.
:::

:::tip[LAB 9.2: Injecting Warnings]
1. Open your `helloworld_1.0.bb` recipe.
2. Inside the `do_compile` function, add: `bbwarn "This is a custom warning from my recipe!"`
3. Rebuild the recipe.
4. Observe the yellow warning text appearing in the main BitBake terminal output during the build process.
:::

---

## 5. Further Reading

| Resource | URL |
|---|---|
| BitBake Logging | [docs.yoctoproject.org/bitbake/bitbake-user-manual/bitbake-user-manual-metadata.html#logging](https://docs.yoctoproject.org/bitbake/bitbake-user-manual/bitbake-user-manual-metadata.html#logging) |
| oe_runmake documentation | [docs.yoctoproject.org/ref-manual/classes.html#make](https://docs.yoctoproject.org/ref-manual/classes.html#make) |

---

