import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

export default withMermaid(defineConfig({
  base: '/embedded-linux-notes/',
  title: "Embedded Linux Notes",
  description: "Comprehensive 16-Day Yocto & Hardware Masterclass — No Hardware Required",
  head: [
    ['meta', { name: 'keywords', content: 'Yocto Project, Embedded Linux, BitBake, Poky, BeagleBone Black, Raspberry Pi, Zynq, ZedBoard, PYNQ, Renode, QEMU, Device Tree, Buildroot' }],
  ],
  themeConfig: {
    logo: '/favicon.ico',
    siteTitle: 'Embedded Linux Guide',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Prerequisites', link: '/prerequisites-and-setup' },
      { text: '16-Day Masterclass', link: '/embedded-linux-yocto-foundations' },
      { text: 'Renode Guide', link: '/renode-emulation-guide' },
      { text: 'Cheat Sheet', link: '/cheat-sheet' }
    ],

    sidebar: [
      {
        text: '🚀 Getting Started',
        collapsed: false,
        items: [
          { text: 'Prerequisites & Setup', link: '/prerequisites-and-setup' },
          { text: 'Course Overview', link: '/overview' }
        ]
      },
      {
        text: 'Part I: Fundamentals & Buildroot',
        collapsed: true,
        items: [
          { text: '01. Linux Ecosystem', link: '/01-introduction' },
          { text: '02. Architecture Paradigms', link: '/02-paradigms' },
          { text: '03. Industrial Applications', link: '/03-applications' },
          { text: '04. Image Build Methods', link: '/04-build-methods' },
          { text: '05. Buildroot Practical Lab', link: '/05-buildroot-lab' },
          { text: '06. Instructor Notes & Pitfalls', link: '/06-instructor-notes' }
        ]
      },
      {
        text: 'Part II: 16-Day Yocto Masterclass',
        collapsed: false,
        items: [
          { text: 'Day 1: Yocto Foundations & QEMU', link: '/embedded-linux-yocto-foundations' },
          { text: 'Day 2: Architecture & Terminology', link: '/yocto-architecture-terminology-workflow' },
          { text: 'Day 3: BeagleBone Black Bring-Up', link: '/beaglebone-black-hardware-bringup' },
          { text: 'Day 4: Releases, BSP Layers & WIC', link: '/yocto-releases-bsp-layers-wic' },
          { text: 'Day 5: Raspberry Pi Bring-Up', link: '/raspberry-pi-hardware-bringup' },
          { text: 'Day 6: BitBake Operators & Layers', link: '/bitbake-operators-and-layer-creation' },
          { text: 'Day 7: Custom Image Recipes', link: '/custom-image-recipes-and-features' },
          { text: 'Day 8: Writing Recipes & C Apps', link: '/writing-recipes-and-c-apps' },
          { text: 'Day 9: Build Logs & Makefiles', link: '/build-logs-debugging-makefiles' },
          { text: 'Day 10: Git Repos & Patching', link: '/git-repositories-and-source-patching' },
          { text: 'Day 11: Package Splitting', link: '/package-splitting-and-installed-vs-shipped' },
          { text: 'Day 12: Shared Libraries', link: '/static-and-dynamic-shared-libraries' },
          { text: 'Day 13: DEPENDS & RDEPENDS', link: '/recipe-dependencies-depends-rdepends' },
          { text: 'Day 14: Autotools & CMake', link: '/autotools-and-cmake-build-systems' },
          { text: 'Day 15: CMake & Devshell', link: '/cmake-recipes-and-devshell-debugging' },
          { text: 'Day 16: BBAppends & Splash', link: '/filespath-splashscreen-and-bbappends' }
        ]
      },
      {
        text: 'Part III: Advanced Deep Dives',
        collapsed: false,
        items: [
          { text: 'Day 17: BusyBox Deep Dive', link: '/busybox-deep-dive' },
          { text: 'Day 18: Device Trees (DTS/DTB)', link: '/device-trees-dts-dtb-dtc' },
          { text: 'Day 19: Kernel & Menuconfig', link: '/kernel-configuration-menuconfig' },
          { text: 'Day 20: U-Boot, TFTP & NFS', link: '/uboot-tftp-nfs-booting' },
          { text: 'Day 21: Systemd & Init Systems', link: '/init-systems-and-systemd' }
        ]
      },
      {
        text: '🔧 Hardware & Emulation',
        collapsed: false,
        items: [
          { text: 'Zynq/PYNQ/ZedBoard Guide', link: '/07-zynq-yocto-dtc-tutorial-guide' },
          { text: '🖥️ Renode Emulation Guide', link: '/renode-emulation-guide' }
        ]
      },
      {
        text: '📖 Reference',
        collapsed: false,
        items: [
          { text: '⚡ BitBake Cheat Sheet', link: '/cheat-sheet' },
          { text: '📚 Glossary of Terms', link: '/glossary' },
          { text: '🔍 Troubleshooting FAQ', link: '/troubleshooting-faq' }
        ]
      }
    ],

    search: {
      provider: 'local'
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/renode/renode' }
    ],

    footer: {
      message: '16-Day Embedded Linux & Yocto Masterclass — No Hardware Required',
      copyright: 'Copyright © 2026'
    },

    outline: {
      level: [2, 3]
    }
  }
}))
