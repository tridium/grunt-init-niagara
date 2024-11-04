/* eslint-env node */
'use strict';

module.exports = function parseVersion(versionStr) {
  const [ match, major, minor, update ] = (/^(\d+)\.(\d+)\.(\d+)$/.exec(versionStr.trim()) || [])
    .map(n => parseInt(n, 10));

  return match && {
    major,
    minor,
    update,
    compareTo: version => {
      const other = parseVersion(version);
      const majorMinorComparison = major === other.major ? minor - other.minor : major - other.major;
      if(majorMinorComparison !== 0) {
        return majorMinorComparison;
      }
      return minor === other.minor ? update - other.update : minor - other.minor;
    }
  };
};
