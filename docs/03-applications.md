# 03. Industrial & Commercial Applications of Embedded Linux

While hobbyists are familiar with the Raspberry Pi, it is crucial to differentiate between educational prototyping hardware and industrial-grade embedded systems.

---

## Where Embedded Linux is Deployed

- **Industrial Networking & Infrastructure:** Commercial routers, IoT edge gateways, firewalls, and remote telemetry units (RTUs).
- **Aerospace & Defense:** Autonomous vehicle controllers, mission systems, and spaceflight computers (e.g., SpaceX Falcon 9 rocket flight computers run custom Linux kernels).
- **Robotics & Automation:** ROS (Robot Operating System) nodes, automated guided vehicles (AGVs), and industrial manipulator arms.
- **Consumer Electronics & Point-of-Sale (POS):** Smart appliances, interactive kiosks, digital signage, and medical monitoring equipment.

---

::: warning WHY THE RASPBERRY PI IS NOT AN INDUSTRIAL SOLUTION
The Raspberry Pi is an outstanding educational tool and desktop replacement, but it is rarely used in commercial products due to:

1. **Software Bloat:** General-purpose Raspberry Pi OS images contain GUI desktop suites, background daemons, and packages that cause slow boot times and high power draw.
2. **Proprietary GPU Boot Architecture:** Booting relies on closed-source VideoCore GPU binary blobs rather than open standard U-Boot flows.
3. **Hardware Availability & Cost:** Lack of long-term industrial supply chain guarantees (10+ year availability required for industrial boards).

**Production Approach:** Engineers design around System-on-Modules (SOMs) or reference SBC architectures (e.g., STM32MP1, NXP i.MX8, Microchip SAMA5) running a stripped-down, custom-built Linux distribution.
:::
