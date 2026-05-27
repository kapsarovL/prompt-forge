module.exports = {
  hooks: {
    readPackage(pkg) {
      if (pkg.dependencies?.postcss) {
        pkg.dependencies.postcss = ">=8.5.10";
      }
      return pkg;
    },
  },
};
