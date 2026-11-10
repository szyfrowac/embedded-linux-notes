// Single source of truth for the curriculum. The Starlight sidebar
// (astro.config.mjs) and the home dashboard both read from here, so
// adding, removing or reordering a lesson only touches this file.

/** @typedef {{ slug: string, label: string }} Lesson */
/** @typedef {{ id: string, title: string, summary: string, level: string, lessons: Lesson[] }} Module */

/** @type {Module[]} */
export const modules = [
  {
    id: 'm1',
    title: 'Architecture paradigms and fundamentals',
    summary: 'What embedded Linux is, how it compares with bare metal and RTOS designs, and how device trees describe hardware.',
    level: 'Beginner',
    lessons: [
      { slug: '01-introduction', label: 'Embedded Linux ecosystem' },
      { slug: '02-paradigms', label: 'Bare metal vs RTOS vs AMP vs SMP' },
      { slug: '03-applications', label: 'Industrial applications and platform selection' },
      { slug: 'device-trees-dts-dtb-dtc', label: 'Device trees: syntax, compilation and overlays' },
      { slug: 'kernel-customization-and-device-trees', label: 'Kernel customization and device tree integration' },
    ],
  },
  {
    id: 'm2',
    title: 'Build systems: Buildroot and Yocto',
    summary: 'Ways to build a Linux image, a full Buildroot lab, and the Yocto Project from first build to BSP layers.',
    level: 'Intermediate',
    lessons: [
      { slug: '04-build-methods', label: 'Image build methods compared' },
      { slug: '05-buildroot-lab', label: 'Buildroot lab walkthrough' },
      { slug: '06-instructor-notes', label: 'Buildroot notes and pitfalls' },
      { slug: 'embedded-linux-yocto-foundations', label: 'Yocto foundations and fast emulation' },
      { slug: 'yocto-architecture-terminology-workflow', label: 'Yocto architecture, workflow and state' },
      { slug: 'yocto-releases-bsp-layers-wic', label: 'BSP layers, releases and WIC images' },
    ],
  },
  {
    id: 'm3',
    title: 'Custom recipes, packaging and layers',
    summary: 'BitBake syntax, writing recipes for your own C, CMake and Autotools code, and how packages are split and shipped.',
    level: 'Intermediate',
    lessons: [
      { slug: 'bitbake-operators-and-layer-creation', label: 'BitBake operators and layer creation' },
      { slug: 'creating-custom-layers-and-recipes', label: 'Custom layers and recipe organization' },
      { slug: 'writing-recipes-and-c-apps', label: 'Writing C applications and simple recipes' },
      { slug: 'custom-image-recipes-and-features', label: 'Custom image recipes and features' },
      { slug: 'autotools-and-cmake-build-systems', label: 'Autotools and CMake build systems' },
      { slug: 'cmake-recipes-and-devshell-debugging', label: 'CMake recipes and devshell debugging' },
      { slug: 'bitbake-tasks-devtool-and-custom-apps', label: 'BitBake tasks and devtool' },
      { slug: 'package-splitting-and-installed-vs-shipped', label: 'Package splitting: installed vs shipped' },
      { slug: 'static-and-dynamic-shared-libraries', label: 'Static and shared libraries' },
      { slug: 'recipe-dependencies-depends-rdepends', label: 'DEPENDS and RDEPENDS' },
      { slug: 'git-repositories-and-source-patching', label: 'Git sources and patching' },
      { slug: 'filespath-splashscreen-and-bbappends', label: 'FILESEXTRAPATHS, splash screens and bbappends' },
      { slug: 'build-logs-debugging-makefiles', label: 'Build logs and debugging Makefiles' },
    ],
  },
  {
    id: 'm4',
    title: 'Kernel, bootloaders and system init',
    summary: 'Configuring the kernel, booting over the network with U-Boot, and bringing up userspace with systemd or BusyBox.',
    level: 'Advanced',
    lessons: [
      { slug: 'kernel-configuration-menuconfig', label: 'Kernel configuration and menuconfig' },
      { slug: 'uboot-tftp-nfs-booting', label: 'U-Boot, TFTP and NFS booting' },
      { slug: 'init-systems-and-systemd', label: 'Init systems and systemd services' },
      { slug: 'busybox-deep-dive', label: 'BusyBox in depth' },
    ],
  },
  {
    id: 'm5',
    title: 'BSP and hardware bring-up',
    summary: 'Bringing Linux up on real boards and on emulated ones: BeagleBone Black, Raspberry Pi, Zynq-7000 and Renode.',
    level: 'Intermediate',
    lessons: [
      { slug: 'beaglebone-black-hardware-bringup', label: 'BeagleBone Black (AM335x)' },
      { slug: 'raspberry-pi-hardware-bringup', label: 'Raspberry Pi' },
      { slug: '07-zynq-yocto-dtc-tutorial-guide', label: 'Zynq-7000 FPGA SoC' },
      { slug: 'renode-emulation-guide', label: 'Emulating boards in Renode' },
    ],
  },
  {
    id: 'm6',
    title: 'Networking and services',
    summary: 'Network configuration, SSH-based development, embedded web services and inter-process communication.',
    level: 'Intermediate',
    lessons: [
      { slug: 'network-interface-configuration', label: 'Network interface configuration' },
      { slug: 'ssh-and-remote-development', label: 'SSH and remote development' },
      { slug: 'networkmanager-and-systemd-networkd', label: 'NetworkManager and systemd-networkd' },
      { slug: 'embedded-web-services', label: 'Embedded web services' },
      { slug: 'inter-process-communication', label: 'Inter-process communication' },
      { slug: 'secure-remote-access', label: 'Secure remote access' },
    ],
  },
  {
    id: 'm7',
    title: 'Performance, debugging and optimization',
    summary: 'Logging, cross-debugging with GDB, tracing with strace and perf, and cutting boot time and image size.',
    level: 'Advanced',
    lessons: [
      { slug: 'logging-and-diagnostics', label: 'Logging and diagnostics' },
      { slug: 'gdb-and-cross-debugging', label: 'GDB and cross-debugging' },
      { slug: 'strace-ltrace-and-perf', label: 'strace, ltrace and perf' },
      { slug: 'memory-and-storage-optimization', label: 'Memory and storage optimization' },
      { slug: 'startup-time-optimization', label: 'Startup-time optimization' },
      { slug: 'image-size-reduction', label: 'Root filesystem and image size reduction' },
    ],
  },
  {
    id: 'm8',
    title: 'Advanced embedded Linux',
    summary: 'Hardening, OTA updates, SDKs, package feeds and licence compliance for shipping products.',
    level: 'Advanced',
    lessons: [
      { slug: 'production-optimization-hardening-ota', label: 'Hardening, optimization and OTA' },
      { slug: 'sdk-generation-package-management-licensing', label: 'SDKs, package management and licensing' },
    ],
  },
  {
    id: 'm9',
    title: 'Capstone projects',
    summary: 'End-to-end projects that combine the earlier modules into a working, reproducible system.',
    level: 'Advanced',
    lessons: [
      { slug: 'capstone-minimal-arm-image', label: 'Build a minimal ARM Linux image' },
      { slug: 'capstone-custom-yocto-distro', label: 'Create a custom Yocto distribution' },
      { slug: 'capstone-kernel-driver', label: 'Integrate a custom kernel driver' },
      { slug: 'capstone-networked-application', label: 'Build and deploy a networked application' },
      { slug: 'capstone-reproducible-bsp-release', label: 'Produce a reproducible BSP release' },
    ],
  },
];

export const reference = [
  { slug: 'prerequisites-and-setup', label: 'Host setup' },
  { slug: 'overview', label: 'Curriculum overview' },
  { slug: 'cheat-sheet', label: 'BitBake cheat sheet' },
  { slug: 'glossary', label: 'Glossary' },
  { slug: 'troubleshooting-faq', label: 'Troubleshooting FAQ' },
];

/**
 * The Chipwings module is its own menu: the sidebar override (src/components/overrides/Sidebar.astro)
 * shows only these lessons under /chipwings/ and only the embedded Linux course elsewhere.
 * Lesson slugs live in src/content/docs/chipwings/.
 */
export const chipwings = {
  title: 'Chipwings module',
  summary: 'One PolarFire SoC, two operating systems: a PX4 flight controller on NuttX and Linux for the mission computer, built and tested phase by phase in Renode.',
  lessons: [
    { slug: 'chipwings/00-overview', label: 'Overview: why, how, what we changed' },
    { slug: 'chipwings/setup-from-scratch', label: 'Replication guide: set up and run' },
    { slug: 'chipwings/01-architecture', label: '1. Architecture and memory map' },
    { slug: 'chipwings/02-phase0-renode', label: '2. Phase 0: Renode baseline' },
    { slug: 'chipwings/03-phase1-nuttx', label: '3. Phase 1: NuttX on hart 1' },
    { slug: 'chipwings/04-phase2-linux', label: '4. Phase 2: Linux on harts 2-4' },
    { slug: 'chipwings/05-phase3-amp', label: '5. Phase 3: both together (AMP)' },
    { slug: 'chipwings/06-phase4-rpmsg', label: '6. Phase 4: RPMsg over the Mi-V IHC' },
    { slug: 'chipwings/07-phase5-px4-port', label: '7. Phase 5: porting PX4 to hart 1' },
    { slug: 'chipwings/08-phase5-mavlink-isolation', label: '8. Phase 5: MAVLink and isolation' },
    { slug: 'chipwings/09-change-catalogue', label: '9. Every file we changed' },
    { slug: 'chipwings/10-testing-and-next-steps', label: '10. Tests, open issues, hardware' },
  ],
};

/** Sidebar entries in Starlight's format. */
export function sidebar() {
  return [
    ...modules.map((m, i) => ({
      label: `${i + 1}. ${m.title}`,
      collapsed: true,
      items: m.lessons.map((l) => ({ label: l.label, slug: l.slug })),
    })),
    { label: 'Reference', collapsed: true, items: reference.map((l) => ({ label: l.label, slug: l.slug })) },
    // Shown only under /chipwings/ (see the Sidebar override); hidden from the embedded Linux menu.
    { label: chipwings.title, items: chipwings.lessons.map((l) => ({ label: l.label, slug: l.slug })) },
  ];
}
