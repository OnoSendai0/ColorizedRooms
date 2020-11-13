const FileUtility = require('./src/FileUtility');
const Analyst = require('./src/Analyst');

const applicationArguments = process.argv.slice(2);
const numberOfArguments = applicationArguments.length;

const ShowUsage = () => {
	console.log("Usage:");
	console.log("   color.js --test [ --debug ]");
	console.log("      colorize the floorplan in each *.tst file in the tests folder");
	console.log("   color.js {filename} [ --debug ]");
	console.log("      colorize the floorplan in {filename}");
}

if( numberOfArguments < 1 || numberOfArguments > 2 ) {
	// too few or too many arguments
	ShowUsage();
} else if( numberOfArguments === 2 && applicationArguments[1] !== '--debug' ) {
	// second argument is invalid
	ShowUsage();
} else if( applicationArguments[0] == "--test" ) {
	const showDebug = applicationArguments[1] === '--debug';
	FileUtility.GetAllTestFiles().forEach(file => {
		const source = FileUtility.ReadFile( file);
		Analyst.Colorize( source, file, showDebug );
	});
} else {
	const showDebug = applicationArguments[1] === '--debug';
	const file = applicationArguments[0];
	const source = FileUtility.ReadFile( file);
	Analyst.Colorize( source, file, showDebug );
}
