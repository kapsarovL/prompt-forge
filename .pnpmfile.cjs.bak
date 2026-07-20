const FORCED_VERSIONS = {
  postcss: ">=8.5.10",
  ws: ">=8.20.1",
};

module.exports = {
  hooks: {
    readPackage(pkg) {
      for (const [name, version] of Object.entries(FORCED_VERSIONS)) {
        if (pkg.dependencies?.[name]) {
          pkg.dependencies[name] = version;
        }
      }
      return pkg;
    },
  },
};
