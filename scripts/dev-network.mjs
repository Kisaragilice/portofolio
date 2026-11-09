import os from "node:os";

const port = process.env.PORT ?? "3000";
const addresses = Object.values(os.networkInterfaces())
  .flat()
  .filter(
    (entry) =>
      entry && entry.family === "IPv4" && !entry.internal && entry.address,
  )
  .map((entry) => entry.address);

if (addresses.length === 0) {
  console.log(`\nNo LAN IPv4 address found. Open http://localhost:${port}\n`);
} else {
  console.log("\nOpen from a phone on the same Wi-Fi:");
  for (const address of addresses) {
    console.log(`  http://${address}:${port}`);
  }
  console.log("  Use the first address for your Wi-Fi/Ethernet adapter.");
  console.log("  (Allow Node.js through the Windows firewall if needed.)\n");
}
