const FileUtility = require('./src/FileUtility');
const Analyst = require('./src/Analyst');

const applicationArguments = process.argv.slice(2);
const numberOfArguments = applicationArguments.length;

const ShowUsage = () => {
	console.log("Usage:");
	console.log("   color.js --test:");
	console.log("      colorize the floorplan in each *.tst file in the tests folder");
	console.log("   color.js {filename}");
	console.log("      colorize the floorplan in {filename}");
}

if( numberOfArguments !== 1 ) {
	ShowUsage();	
} else if( applicationArguments[0] == "--test" ) {
	FileUtility.GetAllTestFiles().forEach(file => {
		const source = FileUtility.ReadFile( file);
		Analyst.Colorize( source, file );
	});
} else {
	Analyst.Colorize( applicationArguments[0] );
}
