const FileUtility = require('./src/FileUtility');
const Analyst = require('./src/Analyst');

const applicationArguments = process.argv.slice(2);
const numberOfArguments = applicationArguments.length;

const ShowUsage = () => {
	console.log("Usage:");
	console.log("   color.js --test [ --min ] [ --debug ]");
	console.log("      colorize the floorplan in each *.tst file in the tests folder");
	console.log("   color.js {filename} [ --min ] [ --debug ]");
	console.log("      colorize the floorplan in {filename}");
	console.log("");
	console.log("   use --min to color the floorplan with as few colors as possible");
	console.log("   use --debug to include the internal structures in the output");
};

ParseCommandLine = (arguments) => {
	const numberOfArguments = arguments.length;
	let parsed = {
		filename: "",
		isTestRun: false,
		isMinimal: false,
		isDebug: false,
		isError: false
	};
	if( numberOfArguments < 1 ) {
		parsed.isError = true;
		console.log( "too few arguments" );
	} else if (numberOfArguments > 3 ) {
		parsed.isError = true;
		console.log( "too many arguments" );
	} else {
		arguments.forEach( arg => {
			if( arg.startsWith("--") ) {
				// this is an option
				switch( arg ) {
					case "--test":
						parsed.isTestRun = true;
						break;
					case "--debug":
						parsed.isDebug = true;
						break;
					case "--min":
						parsed.isMinimal = true;
						break;
					default:
						parsed.isError = true;
						console.log( `unknown argument '${arg}'` );
						break;
				}
			} else {
				// this is a filename
				if( parsed.filename.length == 0 ) {
					parsed.filename = arg;
				} else {
					parsed.isError = true;
					console.log( "too many files specified" );
				}
			}
		});
	}
	return parsed;
};

parsedCommandLine = ParseCommandLine( process.argv.slice(2) );

if( parsedCommandLine.isError ) {
	ShowUsage();
} else if( parsedCommandLine.isTestRun ) {
	FileUtility.GetAllTestFiles().forEach(file => {
		const source = FileUtility.ReadFile( file );
		Analyst.Colorize( source, file, parsedCommandLine.isMinimal, parsedCommandLine.isDebug );
	});
} else {
	const source = FileUtility.ReadFile( parsedCommandLine.filename );
	Analyst.Colorize( source, parsedCommandLine.filename, parsedCommandLine.isMinimal, parsedCommandLine.isDebug );
}
