const fs = require('fs');

module.exports = class TestLibrary {
	testFolder = "./tests";

	constructor() {
	}

	GetAllTestFiles() {
		let allTestFiles = [];

		try {
			if( fs.existsSync(this.testFolder)) {
				fs.readdirSync(this.testFolder).forEach(file => {
					allTestFiles.push(`${this.testFolder}/${file}`);
				})
			}
		} catch (e) {
			console.log(e);
		}

		return allTestFiles;
	}
}