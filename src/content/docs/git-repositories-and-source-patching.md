---
title: "Git Repositories & Source Patching"
lesson:
  module: "Custom recipes, packaging and layers"
  level: Intermediate
  time: "5 min"
---


<div class="fd-panel">

**Learning Objectives**
By the end of this module, you will be able to:
1. Use the `git://` fetcher to pull source code directly from Git repositories
2. Lock recipe versions using the `SRCREV` variable
3. Generate standard Git `.patch` files
4. Apply patches automatically during the `do_patch` task using `SRC_URI`

</div>

:::note[Prerequisites]
- Completed [Build Logs, Debugging & Makefiles](../build-logs-debugging-makefiles/)
:::

---

## 1. Fetching Source Code from Git

While fetching `.tar.gz` files over HTTP/HTTPS is common, modern development relies heavily on Git. BitBake has a dedicated `git://` fetcher module designed to handle Git repositories efficiently.

### Basic Git Recipe Example

```bash
SUMMARY = "An application fetched from GitHub"
LICENSE = "MIT"
LIC_FILES_CHKSUM = "..."

# 1. Use git:// protocol. 
# 2. Add protocol=https to fetch over HTTPS port 443 (fixes corporate firewall issues).
# 3. branch=main ensures we are looking at the correct branch.
SRC_URI = "git://github.com/torvalds/linux.git;protocol=https;branch=master"

# SRCREV defines the EXACT Git commit hash to checkout. 
# Never use "${AUTOREV}" in production recipes, as it breaks reproducibility!
SRCREV = "c08dd3c9bd6ebc168ceb27131eb6f658399a9a5a"

# When using git://, the source unpacks into a subdirectory called 'git'
S = "${WORKDIR}/git"

do_compile() {
    oe_runmake
}
```

### Git Fetcher Parameters
- `protocol=https`: (Recommended) Fetches over HTTPS. `protocol=ssh` is required for private repositories.
- `branch=develop`: Specifies the branch to checkout. Defaults to `master`.
- `tag=v1.0`: Check out a specific release tag.

:::caution[Reproducibility]
Yocto is designed to produce the exact same binary output every time you build it. If you use `SRCREV = "${AUTOREV}"`, BitBake will reach out to GitHub on every build to find the latest commit. This means a build done tomorrow might yield a different binary than a build done today. **Always hardcode the exact 40-character `SRCREV` hash in production recipes.**
:::

---

## 2. Source Code Patching

In embedded Linux, you rarely use upstream open-source code exactly as it is. You often need to fix a bug, backport a security patch, or modify a configuration specifically for your hardware. 

Instead of maintaining a massive fork of an entire project (like the Linux kernel) just to change one line of C code, Yocto uses a **patching system**. You download the pristine upstream code, and BitBake applies your custom patches automatically before compiling.

### Step 1: Generate a Patch File

Let's assume we want to patch our `helloworld.c` from the [Writing C applications and simple recipes](../writing-recipes-and-c-apps/) lesson to say "Hello from a Patched Yocto!". 

1. Go to your source code directory.
2. Initialize a local git repository (if it isn't one already).
```bash
git init
git add helloworld.c
git commit -m "Initial pristine code"
```
3. Make your desired change to `helloworld.c`.
4. Commit the change.
```bash
git commit -am "Change greeting text"
```
5. Generate a standard unified patch file using `git format-patch`.
```bash
git format-patch -1
# This generates a file named: 0001-Change-greeting-text.patch
```

### Step 2: Add the Patch to the Recipe

1. Move the generated `.patch` file into your recipe's `files/` subdirectory.
2. Edit your recipe `.bb` file to add the patch to the `SRC_URI`.

```bash
# In your recipe.bb
SRC_URI = "file://helloworld.c \
           file://0001-Change-greeting-text.patch \
          "
```

### How the `do_patch` Task Works

1. BitBake runs `do_unpack`, placing the pristine `helloworld.c` into `${WORKDIR}`.
2. BitBake runs `do_patch`. It sees a file ending in `.patch` in the `SRC_URI`. 
3. It automatically uses the `patch` utility to apply `0001-Change-greeting-text.patch` against the source code.
4. BitBake proceeds to `do_compile` with the modified code.

---

## 3. Hands-On Lab Exercises

:::tip[LAB 10.1: Create and Apply a Patch]
1. Navigate to your `helloworld` recipe directory from the [Writing C applications and simple recipes](../writing-recipes-and-c-apps/) lesson.
2. Modify `helloworld.c` to change the printed text.
3. Use the `git format-patch` workflow described above to generate a `.patch` file.
4. Revert `helloworld.c` back to its original pristine state.
5. Add the `.patch` file to your `helloworld_1.0.bb` recipe's `SRC_URI`.
6. Run `bitbake -c clean helloworld && bitbake helloworld`.
7. Boot QEMU and run `helloworld` to verify the patch was successfully applied during the build.
:::

:::tip[LAB 10.2: Verifying the Patched Source]
Want to prove the patch was applied correctly before building?
1. Run `bitbake -c patch helloworld` (this stops execution right after the patch stage).
2. Navigate to `build/tmp/work/.../helloworld/1.0-r0/`.
3. `cat helloworld.c` and verify that the file physically contains your patched modifications.
:::

---

## 4. Further Reading

| Resource | URL |
|---|---|
| Fetchers Reference (Git) | [docs.yoctoproject.org/bitbake/bitbake-user-manual/bitbake-user-manual-fetching.html#git-fetcher-git](https://docs.yoctoproject.org/bitbake/bitbake-user-manual/bitbake-user-manual-fetching.html#git-fetcher-git) |
| Patching Source Code | [docs.yoctoproject.org/dev-manual/new-recipe.html#patching-code](https://docs.yoctoproject.org/dev-manual/new-recipe.html#patching-code) |

---

