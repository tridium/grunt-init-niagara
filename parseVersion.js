/* eslint-env node */
'use strict';

module.exports = function parseVersion(versionStr) {
  const [ match, major, minor ] = (/^(\d+)\.(\d+)$/.exec(versionStr.trim()) || [])
    .map(n => parseInt(n, 10));

  return match && {
    major,
    minor,
    compareTo: version => {
      const other = parseVersion(version);
      return major === other.major ? minor - other.minor : major - other.major;
    }
  };
};
