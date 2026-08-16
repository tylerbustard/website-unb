import { BlockList, isIP } from "node:net";

const MAX_URL_LENGTH = 4_096;

const nonPublicAddresses = new BlockList();
for (const [network, prefix] of [
  ["0.0.0.0", 8],
  ["10.0.0.0", 8],
  ["100.64.0.0", 10],
  ["127.0.0.0", 8],
  ["169.254.0.0", 16],
  ["172.16.0.0", 12],
  ["192.0.0.0", 24],
  ["192.0.2.0", 24],
  ["192.88.99.0", 24],
  ["192.168.0.0", 16],
  ["198.18.0.0", 15],
  ["198.51.100.0", 24],
  ["203.0.113.0", 24],
  ["224.0.0.0", 4],
  ["240.0.0.0", 4],
]) {
  nonPublicAddresses.addSubnet(network, prefix, "ipv4");
}

for (const [network, prefix] of [
  ["2001::", 23],
  ["2001:db8::", 32],
  ["2002::", 16],
  ["3fff::", 20],
]) {
  nonPublicAddresses.addSubnet(network, prefix, "ipv6");
}

function normalizedHostname(value) {
  const hostname = String(value).toLowerCase();
  return hostname.startsWith("[") && hostname.endsWith("]") ? hostname.slice(1, -1) : hostname;
}

function validatedHttpsUrl(value) {
  if (typeof value !== "string" || value.length > MAX_URL_LENGTH) throw new TypeError("Invalid URL");
  const url = new URL(value);
  if (
    url.protocol !== "https:"
    || !url.hostname
    || url.username
    || url.password
    || (url.port && url.port !== "443")
  ) {
    throw new TypeError("Invalid URL");
  }
  return url;
}

function isPublicIpAddress(address) {
  const family = isIP(address);
  if (family === 4) return !nonPublicAddresses.check(address, "ipv4");
  if (family !== 6) return false;

  const firstHextet = Number.parseInt(address.split(":", 1)[0], 16);
  if (!Number.isFinite(firstHextet) || firstHextet < 0x2000 || firstHextet > 0x3fff) return false;
  return !nonPublicAddresses.check(address, "ipv6");
}

export function isPotentiallyPublicHttpsUrl(value) {
  try {
    const url = validatedHttpsUrl(value);
    const hostname = normalizedHostname(url.hostname);
    const literalFamily = isIP(hostname);
    if (literalFamily) return isPublicIpAddress(hostname);
    return hostname.includes(".")
      && hostname !== "localhost"
      && !hostname.endsWith(".localhost")
      && !hostname.endsWith(".local")
      && !hostname.endsWith(".internal")
      && !hostname.endsWith(".invalid")
      && !hostname.endsWith(".test");
  } catch {
    return false;
  }
}
