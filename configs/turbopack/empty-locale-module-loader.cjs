module.exports = function emptyLocaleModuleLoader() {
	return "const removedLocale = undefined;\nexport default removedLocale;\n";
};
