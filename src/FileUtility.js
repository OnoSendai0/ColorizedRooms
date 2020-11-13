const fs = require('fs');

module.exports = class FileUtility {

	static GetAllTestFiles() {
		const testFolder = "./tests";
		let allTestFiles = [];

		try {
			if( fs.existsSync(testFolder)) {
				fs.readdirSync(testFolder).forEach(file => {
					if( file.endsWith('.tst'))
						allTestFiles.push(`${testFolder}/${file}`);
				})
			}
		} catch (e) {
			console.log(e);
		}

		return allTestFiles;
	}

	static ReadFile( filename ) {
		let lines = [];
		try {
			// return the file contents as an array of lines
			const contents = fs.readFileSync(filename, 'utf-8');
			lines = contents.split("\n");
		} catch( e ) {
			console.log( e );
		}
		return lines;
	}
}