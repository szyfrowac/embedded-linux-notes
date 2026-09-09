const lectureData = {
  courseTitle: "Embedded Linux Fundamentals & Hands-On Buildroot Guide",
  subtitle: "Architectural Trade-offs, Build Systems, and Target System Deployment",
  version: "1.0.0",
  pdfPath: "../output/embedded_linux_lecture_notes.pdf",
  sections: [
    {
      id: "sec-1",
      title: "1. Introduction: The Embedded Linux Ecosystem",
      shortTitle: "1. Ecosystem Introduction",
      icon: "fas fa-microchip",
      readingTime: "5 min",
      content: `
        <p class="lead">One of the defining strengths of the Linux operating system is its modular architecture and unmatched adaptability. When stripped of desktop overhead—such as graphical user interfaces (X11/Wayland), heavy desktop environments, and non-essential background daemons—Linux transforms into a highly compact, resilient operating system capable of running on resource-constrained Single Board Computers (SBCs) and Systems-on-Module (SOMs).</p>
        
        <div class="callout callout-concept">
          <div class="callout-header"><i class="fas fa-lightbulb"></i> Why Linux Dominates Embedded Systems</div>
          <div class="callout-body">
            <ul>
              <li><strong>High-Level Hardware Abstraction:</strong> Drivers convert raw hardware registers into standard file system nodes (<code>/dev</code>, <code>/sys</code>, <code>/proc</code>), eliminating bit-manipulation register code for application logic.</li>
              <li><strong>Rich Software Ecosystem:</strong> POSIX APIs, multi-threaded networking stacks (TCP/IP, IPv6, TLS), database engines, web servers, and high-level language runtimes (Python, Node.js, Java, Go, Rust).</li>
              <li><strong>Portability Across Architectures:</strong> Code written against standard C libraries (<code>glibc</code>, <code>musl</code>) compiles seamlessly across ARM, RISC-V, x86, and MIPS platforms.</li>
              <li><strong>Community & Vendor Support:</strong> Extensive open-source driver availability for peripheral ICs, Wi-Fi chips, cellular modems, and graphics accelerators.</li>
            </ul>
          </div>
        </div>

        <p>In 2018, an extensive IoT developer survey conducted by the Eclipse Foundation revealed that <strong>Linux was selected as the primary operating system for IoT and embedded devices by a dominant margin</strong>, eclipsing bare-metal environments, real-time operating systems (RTOS), and proprietary platform OS solutions.</p>
      `
    },
    {
      id: "sec-2",
      title: "2. Comparative Analysis of Embedded Software Architectures",
      shortTitle: "2. Architecture Paradigms",
      icon: "fas fa-layer-group",
      readingTime: "10 min",
      content: `
        <p>To select the right architecture for an embedded system, developers must evaluate CPU power, memory constraints, hardware control precision, timing requirements, and software development overhead.</p>

        <h3>1. Bare Metal Programming</h3>
        <p>Executing code directly on hardware without an intermediate operating system layer.</p>
        <ul>
          <li><strong>Target Processors:</strong> 8-bit (AVR), 16-bit (MSP430), low-end 32-bit MCUs (ARM Cortex-M0/M3).</li>
          <li><strong>Hardware Access:</strong> Direct register bit-flipping (e.g., <code>PORTB |= (1 << 3)</code>).</li>
          <li><strong>Pros:</strong> Ultra-low power, zero OS overhead, microsecond-level hard real-time determinism.</li>
          <li><strong>Cons:</strong> Non-portable code, zero concurrency/multitasking, difficult protocol implementations.</li>
        </ul>

        <h3>2. Real-Time Operating Systems (RTOS)</h3>
        <p>An RTOS (FreeRTOS, NuttX, Zephyr) introduces a kernel scheduler for multitasking while retaining low resource usage.</p>
        <ul>
          <li><strong>Target Processors:</strong> 32-bit MCUs (ARM Cortex-M4/M7, ESP32, RISC-V).</li>
          <li><strong>Pros:</strong> Preemptive multithreading, low RAM footprint (tens of KB), hard/soft real-time timing.</li>
          <li><strong>Cons:</strong> Lacks MMU memory protection, dynamic file system abstractions, and high-level language runtimes.</li>
        </ul>

        <h3>3. Embedded General-Purpose OS (Embedded Linux)</h3>
        <p>A full-featured operating system managing hardware via virtual memory and driver abstractions.</p>
        <ul>
          <li><strong>Target Processors:</strong> 32/64-bit MPUs (ARM Cortex-A, x86-64, RISC-V 64) with a Memory Management Unit (MMU).</li>
          <li><strong>Pros:</strong> Full process isolation, POSIX multithreading, advanced file systems, network protocols, high-level languages.</li>
          <li><strong>Cons:</strong> Higher boot time, larger storage footprint, loss of microsecond real-time determinism (unless PREEMPT_RT patched).</li>
        </ul>

        <div class="callout callout-concept">
          <div class="callout-header"><i class="fas fa-microchip"></i> Heterogeneous SoC Architecture (MPU + MCU)</div>
          <div class="callout-body">
            <p>Modern SoCs (e.g., STM32MP1, NXP i.MX8) combine both paradigms on a single silicon die:</p>
            <ol>
              <li><strong>Application Core(s):</strong> ARM Cortex-A runs Embedded Linux for networking, UI, vision algorithms, and web services.</li>
              <li><strong>Co-Processor Core(s):</strong> ARM Cortex-M/R runs Bare Metal or RTOS for microsecond sensor loops and motor control.</li>
            </ol>
            <p>Inter-core communication is managed via shared SRAM using <code>RPMsg</code> and <code>OpenAMP</code>.</p>
          </div>
        </div>

        <h3>Architectural Paradigm Matrix</h3>
        <div class="table-responsive">
          <table class="styled-table">
            <thead>
              <tr>
                <th>Feature</th>
                <th>Bare Metal</th>
                <th>Real-Time OS (RTOS)</th>
                <th>Embedded Linux</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Processor Type</strong></td>
                <td>Microcontroller (MCU)</td>
                <td>High-end MCU</td>
                <td>Microprocessor (MPU)</td>
              </tr>
              <tr>
                <td><strong>MMU Required?</strong></td>
                <td>No</td>
                <td>No</td>
                <td>Yes</td>
              </tr>
              <tr>
                <td><strong>Clock Speed</strong></td>
                <td>8 MHz – 100 MHz</td>
                <td>48 MHz – 400 MHz</td>
                <td>500 MHz – 2.0+ GHz</td>
              </tr>
              <tr>
                <td><strong>RAM Needed</strong></td>
                <td>Bytes to KB</td>
                <td>Kilobytes to MB</td>
                <td>128 MB to Gigabytes</td>
              </tr>
              <tr>
                <td><strong>Hardware Access</strong></td>
                <td>Register bit-flipping</td>
                <td>BSP / Direct Registers</td>
                <td>Driver nodes (<code>/dev</code>, <code>/sys</code>)</td>
              </tr>
              <tr>
                <td><strong>Real-Time</strong></td>
                <td>Hard Real-Time (&mu;s)</td>
                <td>Hard/Soft Real-Time</td>
                <td>Non-deterministic (unless PREEMPT_RT)</td>
              </tr>
            </tbody>
          </table>
        </div>
      `
    },
    {
      id: "sec-3",
      title: "3. Industrial & Commercial Applications of Embedded Linux",
      shortTitle: "3. Industrial Uses vs RPi",
      icon: "fas fa-industry",
      readingTime: "7 min",
      content: `
        <p>Embedded Linux powers critical infrastructure, consumer electronics, and high-reliability industrial hardware worldwide.</p>

        <h3>Key Deployment Sectors</h3>
        <ul>
          <li><strong>Industrial Networking:</strong> Commercial routers, IoT edge gateways, firewalls, and remote telemetry units (RTUs).</li>
          <li><strong>Aerospace & Defense:</strong> Spacecraft computers (SpaceX Falcon 9 flight computers run custom Linux), autonomous drone controllers.</li>
          <li><strong>Robotics & Automation:</strong> ROS (Robot Operating System) nodes, AGVs, and industrial arms.</li>
          <li><strong>Consumer & Commercial:</strong> Interactive kiosks, digital signage, medical devices, point-of-sale terminals.</li>
        </ul>

        <div class="callout callout-warning">
          <div class="callout-header"><i class="fas fa-exclamation-triangle"></i> Why Raspberry Pi is NOT an Industrial Solution</div>
          <div class="callout-body">
            <p>While the Raspberry Pi is an exceptional educational tool, it is rarely used in commercial production due to:</p>
            <ol>
              <li><strong>Software Bloat:</strong> Stock Raspberry Pi OS images contain heavy desktop environments, slow boot daemons, and unnecessary packages.</li>
              <li><strong>Proprietary GPU Boot Architecture:</strong> Booting relies on closed-source VideoCore GPU binary blobs rather than open standard U-Boot flows.</li>
              <li><strong>Supply Chain Guarantees:</strong> Commercial hardware requires 10+ year availability guarantees not provided by consumer SBC vendors.</li>
            </ol>
            <p><strong>Production Approach:</strong> Engineers build around Systems-on-Module (SOMs) or reference SBC architectures (STM32MP1, NXP i.MX8, Microchip SAMA5) running custom Linux images.</p>
          </div>
        </div>
      `
    },
    {
      id: "sec-4",
      title: "4. Methods for Building Embedded Linux Systems",
      shortTitle: "4. Build Systems Comparison",
      icon: "fas fa-cogs",
      readingTime: "8 min",
      content: `
        <p>Engineers use three primary strategies to bring up Linux on target hardware:</p>

        <ol>
          <li><strong>Strategy 1: Pre-Made Vendor Images</strong> (Fast setup, but heavy software bloat, long boot times, high storage footprint).</li>
          <li><strong>Strategy 2: Manual Source Compilation</strong> ("Glutton for punishment" method—manual cross-compiling toolchains, U-Boot, kernel, BusyBox).</li>
          <li><strong>Strategy 3: Automated Build Systems</strong> (Buildroot, Yocto, OpenWRT).</li>
        </ol>

        <h3>Build System Comparison Matrix</h3>
        <div class="table-responsive">
          <table class="styled-table">
            <thead>
              <tr>
                <th>Metric / Feature</th>
                <th>Buildroot</th>
                <th>Yocto Project (Poky/BitBake)</th>
                <th>OpenWRT</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Primary Goal</strong></td>
                <td>Simplicity & Speed</td>
                <td>Enterprise Scalability & Customization</td>
                <td>Networking & Router Gear</td>
              </tr>
              <tr>
                <td><strong>Build Paradigm</strong></td>
                <td>Single Make-based Makefile</td>
                <td>Recipe-based (<code>.bb</code>) Layer system</td>
                <td>Package Manager oriented</td>
              </tr>
              <tr>
                <td><strong>Learning Curve</strong></td>
                <td>Very Low (Hours)</td>
                <td>High (Weeks/Months)</td>
                <td>Moderate</td>
              </tr>
              <tr>
                <td><strong>Disk Footprint</strong></td>
                <td>5 GB – 15 GB</td>
                <td>50 GB – 100+ GB</td>
                <td>10 GB – 20 GB</td>
              </tr>
              <tr>
                <td><strong>Target Update Model</strong></td>
                <td>Monolithic OS image flash</td>
                <td>Layered image or package feed</td>
                <td>On-device package manager (<code>opkg</code>)</td>
              </tr>
            </tbody>
          </table>
        </div>
      `
    },
    {
      id: "sec-5",
      title: "5. Hands-On Practical Lab: Building Embedded Linux with Buildroot",
      shortTitle: "5. Hands-On Buildroot Lab",
      icon: "fas fa-terminal",
      readingTime: "15 min",
      content: `
        <p>This hands-on lab guides you through building, cross-compiling, flashing, and booting a custom minimal Linux distribution targeting the <strong>STMicroelectronics STM32MP157D-DK1 Discovery Kit</strong>.</p>

        <h3>Phase 1: Host System Preparation</h3>
        <div class="cmd-block">
          <div class="cmd-header">
            <span><i class="fas fa-terminal"></i> Step 1.1: Install Mandatory Host Packages</span>
            <button class="copy-btn" onclick="copyCode(this)"><i class="far fa-copy"></i> Copy</button>
          </div>
          <pre><code>sudo apt update && sudo apt upgrade -y
sudo apt install -y build-essential libncurses5-dev libncursesw5-dev \
                    bison flex git rsync unzip bc wget cpio libssl-dev</code></pre>
        </div>

        <div class="cmd-block">
          <div class="cmd-header">
            <span><i class="fas fa-terminal"></i> Step 1.2: Clone Buildroot Repository</span>
            <button class="copy-btn" onclick="copyCode(this)"><i class="far fa-copy"></i> Copy</button>
          </div>
          <pre><code>mkdir -p ~/projects && cd ~/projects
git clone https://git.buildroot.net/buildroot
cd buildroot</code></pre>
        </div>

        <h3>Phase 2: Target Configuration</h3>
        <div class="cmd-block">
          <div class="cmd-header">
            <span><i class="fas fa-terminal"></i> Step 2.1: Apply Board Default Configuration</span>
            <button class="copy-btn" onclick="copyCode(this)"><i class="far fa-copy"></i> Copy</button>
          </div>
          <pre><code>make st_stm32mp157a_dk1_defconfig</code></pre>
        </div>

        <div class="cmd-block">
          <div class="cmd-header">
            <span><i class="fas fa-terminal"></i> Step 2.2: Customize Options via Menuconfig</span>
            <button class="copy-btn" onclick="copyCode(this)"><i class="far fa-copy"></i> Copy</button>
          </div>
          <pre><code>make menuconfig</code></pre>
        </div>

        <h3>Phase 3: Cross-Compilation</h3>
        <div class="cmd-block">
          <div class="cmd-header">
            <span><i class="fas fa-terminal"></i> Step 3.1: Trigger Monolithic Build</span>
            <button class="copy-btn" onclick="copyCode(this)"><i class="far fa-copy"></i> Copy</button>
          </div>
          <pre><code>make</code></pre>
        </div>

        <div class="callout callout-tip">
          <div class="callout-header"><i class="fas fa-info-circle"></i> What Buildroot Performs During Compilation</div>
          <div class="callout-body">
            <ol>
              <li>Cross-compiles host toolchain (<code>arm-linux-gnueabihf-gcc</code>).</li>
              <li>Compiles First Stage Bootloader (TF-A) and U-Boot.</li>
              <li>Compiles Linux Kernel (<code>zImage</code>) and Device Tree Blob (<code>.dtb</code>).</li>
              <li>Assembles BusyBox rootfs and packages raw <code>sdcard.img</code>.</li>
            </ol>
          </div>
        </div>

        <h3>Phase 4: Flashing Image to SD Card</h3>
        <div class="cmd-block">
          <div class="cmd-header">
            <span><i class="fas fa-terminal"></i> Step 4.1: Identify Block Device</span>
            <button class="copy-btn" onclick="copyCode(this)"><i class="far fa-copy"></i> Copy</button>
          </div>
          <pre><code>lsblk
sudo umount /dev/mmcblk2p* 2>/dev/null || true</code></pre>
        </div>

        <div class="callout callout-warning">
          <div class="callout-header"><i class="fas fa-skull-crossbones"></i> Warning: Raw Disk Overwrite Hazard</div>
          <div class="callout-body">
            <p>The <code>dd</code> tool performs raw bit-for-bit copying. Specifying your host operating system drive (e.g., <code>/dev/sda</code>) will destroy your host system without prompt! Double-check drive names with <code>lsblk</code>.</p>
          </div>
        </div>

        <div class="cmd-block">
          <div class="cmd-header">
            <span><i class="fas fa-terminal"></i> Step 4.2: Flash Raw Image with dd</span>
            <button class="copy-btn" onclick="copyCode(this)"><i class="far fa-copy"></i> Copy</button>
          </div>
          <pre><code>sudo dd if=output/images/sdcard.img of=/dev/mmcblk2 bs=1M status=progress
sync</code></pre>
        </div>

        <h3>Phase 5: Hardware Connection & Serial Terminal</h3>
        <div class="cmd-block">
          <div class="cmd-header">
            <span><i class="fas fa-terminal"></i> Step 5.1: Grant Serial User Permissions</span>
            <button class="copy-btn" onclick="copyCode(this)"><i class="far fa-copy"></i> Copy</button>
          </div>
          <pre><code>sudo usermod -aG dialout $USER
groups $USER</code></pre>
        </div>

        <div class="cmd-block">
          <div class="cmd-header">
            <span><i class="fas fa-terminal"></i> Step 5.2: Open Console with picocom</span>
            <button class="copy-btn" onclick="copyCode(this)"><i class="far fa-copy"></i> Copy</button>
          </div>
          <pre><code>picocom -b 115200 /dev/ttyACM0</code></pre>
        </div>

        <h3>Phase 6: Target Shell Exploration & POSIX Scripting</h3>
        <div class="cmd-block">
          <div class="cmd-header">
            <span><i class="fas fa-terminal"></i> Step 6.1: Inspect Target System Node</span>
            <button class="copy-btn" onclick="copyCode(this)"><i class="far fa-copy"></i> Copy</button>
          </div>
          <pre><code># Login with username: root (no password)
uname -a
free -h
df -h
cat /proc/cpuinfo</code></pre>
        </div>

        <div class="cmd-block">
          <div class="cmd-header">
            <span><i class="fas fa-terminal"></i> Step 6.2: Create and Execute Script in vi</span>
            <button class="copy-btn" onclick="copyCode(this)"><i class="far fa-copy"></i> Copy</button>
          </div>
          <pre><code>vi test.sh
# Add contents:
# #!/bin/sh
# echo "Hello from Custom Embedded Linux!"
chmod +x test.sh
./test.sh</code></pre>
        </div>
      `
    },
    {
      id: "sec-6",
      title: "6. Instructor Teaching Notes & Student Assessment",
      shortTitle: "6. Instructor Notes & Q&A",
      icon: "fas fa-user-graduate",
      readingTime: "6 min",
      content: `
        <div class="callout callout-tip">
          <div class="callout-header"><i class="fas fa-chalkboard-teacher"></i> Pedagogical Insight: 157A vs 157D Hardware Nuance</div>
          <div class="callout-body">
            <p>In this lab, the <code>st_stm32mp157a_dk1_defconfig</code> was applied to an <strong>STM32MP157D</strong> discovery kit board.</p>
            <ul>
              <li><strong>STM32MP157A:</strong> Rated clock frequency up to 650 MHz (no hardware crypto engine).</li>
              <li><strong>STM32MP157D:</strong> Rated clock frequency up to 800 MHz (includes hardware crypto engine).</li>
            </ul>
            <p>Because clock initialization code in the 157A defconfig runs at 650 MHz, executing the 157A binary image on a 157D chip safely underclocks the target processor. Emphasize to students that production builds must match exact chip sub-variants to utilize full performance.</p>
          </div>
        </div>

        <h3>Student Review Questions</h3>
        <ol>
          <li>Contrast bare-metal programming with Embedded Linux in terms of real-time determinism, memory requirements, and code portability.</li>
          <li>Explain the function of a Memory Management Unit (MMU) and state why it is mandatory for running standard Embedded Linux.</li>
          <li>Describe the architecture of a Heterogeneous Multi-Core SoC (e.g., STM32MP1) and explain how task allocation is divided between MPU and MCU cores.</li>
          <li>Compare Buildroot and the Yocto Project. Under what conditions would an engineering team choose Buildroot over Yocto?</li>
          <li>Trace the boot sequence of an embedded Linux target from power-on reset to the root login prompt.</li>
        </ol>
      `
    }
  ]
};
