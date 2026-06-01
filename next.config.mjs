/** @type {import('next').NextConfig} */
const nextConfig = {
  // better-sqlite3 is een native module en mag niet door de bundler worden
  // meegebundeld; we houden 'm extern zodat hij server-side gewoon werkt.
  serverExternalPackages: ["better-sqlite3"],
};

export default nextConfig;
