# Recipe Dependencies (DEPENDS & RDEPENDS)

<div style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem; color: white;">

**🎯 Learning Objectives**

By the end of this module, you will be able to:
1. Distinguish between build-time (`DEPENDS`) and run-time (`RDEPENDS`) dependencies
2. Understand how BitBake constructs the `recipe-sysroot` sandbox
3. Use `bitbake -g` to generate and analyze dependency graphs
4. Resolve "missing header" and "command not found" errors

</div>

::: info PREREQUISITES
- Completed [Day 12: Static & Dynamic Shared Libraries](/static-and-dynamic-shared-libraries)
:::

---

## 1. The Two Types of Dependencies

In a massive build system like Yocto with thousands of interconnected recipes, BitBake must know exactly what order to build things in. If Recipe A requires a library provided by Recipe B, BitBake must build Recipe B first.

There are two fundamentally different types of dependencies in Yocto:

![DEPENDS vs RDEPENDS](/depends_vs_rdepends.png)

### Build-Time Dependencies (`DEPENDS`)
If your C code `#include <png.h>`, your recipe cannot compile until the `libpng` recipe has been built and its headers made available to the cross-compiler.

```bash
# This forces BitBake to build 'libpng' and 'zlib' BEFORE compiling this recipe.
DEPENDS = "libpng zlib"
```

### Run-Time Dependencies (`RDEPENDS`)
If your application is a bash script that calls `curl`, it doesn't need `curl` to "compile" (it's just a text file). However, if `curl` isn't installed on the final target board, your script will crash at runtime.

```bash
# This tells BitBake: "If this package is installed on the image, make sure bash and curl are installed too."
# Notice the syntax requires appending the package name (${PN})
RDEPENDS:${PN} = "bash curl"
```

---

## 2. The Sandbox: `recipe-sysroot`

To ensure reproducible builds, BitBake executes every recipe in an isolated sandbox. 

When your recipe runs `do_compile`, the cross-compiler does **not** look in your host machine's `/usr/include` for headers. It looks in a temporary, highly-controlled folder called `recipe-sysroot`.

### How `DEPENDS` Populates the Sysroot

When you set `DEPENDS = "libpng"`, BitBake performs a specialized task called `do_prepare_recipe_sysroot` just before compilation.

1. It finds the outputs of the `libpng` recipe.
2. It physically copies `png.h` and `libpng.so` into your recipe's private `recipe-sysroot/usr/include` and `recipe-sysroot/usr/lib`.
3. It configures the cross-compiler to only search inside `recipe-sysroot`.

If you forget to declare `DEPENDS = "libpng"`, the compiler will fail with `fatal error: png.h: No such file or directory`, *even if `libpng` was built previously by another recipe*.

---

## 3. Dependency Graphs

Sometimes, you end up with a massive image and you want to know *why* a specific package is being installed.

BitBake can generate a DOT-formatted graph of every dependency required to build an image.

```bash
# Generate task-depends.dot and package-depends.dot
bitbake -g core-image-minimal
```

### Analyzing the Graph

You can use standard Linux tools to analyze the `.dot` file.

To convert the graph to a visual PDF (Warning: It will be massive and hard to read):
```bash
sudo apt install graphviz
dot -Tpdf task-depends.dot -o dependencies.pdf
```

To find out exactly what pulled `python3` into your image using `grep`:
```bash
grep -e "-> \"python3\"" task-depends.dot
```
*(This shows every package that has an arrow pointing to python3)*

---

## 4. Hands-On Lab Exercises

::: tip LAB 13.1: The Missing Header Error
1. Create a recipe that compiles a C program containing `#include <zlib.h>`.
2. Do NOT add `DEPENDS = "zlib"`.
3. Build the recipe. It will fail. Look at the `log.do_compile` to see the GCC "No such file or directory" error.
4. Add `DEPENDS = "zlib"` and rebuild. It will succeed.
5. Navigate to your recipe's work directory (`tmp/work/...`) and look inside `recipe-sysroot/usr/include/`. Verify that `zlib.h` is actually there!
:::

::: tip LAB 13.2: Exploring the Graph
1. Run `bitbake -g core-image-minimal`.
2. Open `recipe-depends.dot` in a text editor.
3. Search for `"busybox"`. Look at the lines starting with `"busybox" ->`. These are the dependencies that BusyBox requires to build.
:::

---

## 5. Further Reading

| Resource | URL |
|---|---|
| Dependencies Documentation | [docs.yoctoproject.org/bitbake/bitbake-user-manual/bitbake-user-manual-metadata.html#dependencies](https://docs.yoctoproject.org/bitbake/bitbake-user-manual/bitbake-user-manual-metadata.html#dependencies) |

---

<div style="display: flex; justify-content: space-between; margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #e2e8f0;">
<a href="/day12-static-and-dynamic-shared-libraries">← Day 12: Static & Dynamic Libraries</a>
<a href="/day14-autotools-and-cmake-build-systems">Day 14: Autotools & CMake →</a>
</div>
