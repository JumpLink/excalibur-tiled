/**
 * Returns the last portion of a path, similar to the Unix basename command.
 * @param path
 */
export function basename(path: string) {
  return path.split(/[\\/]/).pop();
}
