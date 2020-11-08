const fs = require('fs');
const TestLibrary = require('./src/TestLibrary');
const Mapper = require('./src/Mapper');

const applicationArguments = process.argv.slice(2);
const numberOfArguments = applicationArguments.length;

const ShowUsage = () => {
	console.log("Usage:");
	console.log("   color.js --test:");
	console.log("      colorize the floorplan in each *.tst file in the tests folder");
	console.log("   color.js {filename}");
	console.log("      colorize the floorplan in {filename}");
}

mapper = new Mapper();

if( numberOfArguments !== 1 ) {
	ShowUsage();	
} else if( applicationArguments[0] == "--test" ) {
	library = new TestLibrary();
	library.GetAllTestFiles().forEach(file => {
		mapper.Colorize(file);
	});
} else {
	mapper.Colorize(applicationArguments[0]);
}
