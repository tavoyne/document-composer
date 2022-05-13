export class BlockTooTallError extends Error {
  constructor() {
    super("Block cannot be placed because it's too tall.");
  }
}
