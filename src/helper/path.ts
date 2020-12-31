/**
 * Returns the last portion of a path, similar to the Unix basename command.
 * @param path
 */
export function basename(path: string) {
  return path.split(/[\\/]/).pop();
}

export const defaultPathAccessor = (rootPath: string, path: string) => {
  // Use absolute path if specified
  if (path.indexOf('/') === 0) {
    return path;
  }

  // Load relative to map path
  const pp = rootPath.split('/');
  const relPath = pp.concat([]);

  if (pp.length > 0) {
    // remove file part of path
    relPath.splice(-1);
  }
  relPath.push(path);
  return relPath.join('/');
};
