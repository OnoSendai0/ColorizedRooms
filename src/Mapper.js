const FloorPlan = require ('./FloorPlan');

module.exports = class Mapper {
	Colorize = (file) => {
		// initialize from source
		let plan = new FloorPlan();
		plan.LoadFromFile(file);
		plan.DumpSource();

		// apply room numbers
		let nextRoomNumber = 0;
		let startOfRoom = plan.FindStartOfNextRoom();
		while(startOfRoom != null) {
			plan.PaintRoom( startOfRoom, nextRoomNumber++);
			startOfRoom = plan.FindStartOfNextRoom();
		}

		// dump internal structure for debugging
//		plan.DumpInternal();

		plan.RenderOutput();
	}

}