var
	conway = document.getElementById('conway'),
	context = conway.getContext('2d'),
	w = conway.width,
	h = conway.height,
	ON = 0,
	OFF = 255
;

//initialize
var thread_count = read_thread_count();
var thread_status = []; // this will be an array of thread_count items.
var world = context.createImageData(conway.width, conway.height);
var temp_world;
var i = 0;

var bm_start, bm_end;

for(i = 0; i < w * h * 4; i += 4) {
	var value = (Math.random() >= 0.5 ? OFF : ON)
	world.data[i] = value;
	world.data[i+1] = value;
	world.data[i+2] = value;
	world.data[i+3] = 255;
}

context.putImageData(world, 0, 0);

for (i = 0; i < thread_count; i++) {
	thread_status[i] = false;
}

function render() {
	bm_start = new Date();
	
	temp_world = context.getImageData(0,0,w,h);
	world = context.getImageData(0,0,w,h);
	world = world.data;

	var i = 0;
	
	thread_status = [];
	
	// render all chunks
	for (i = 0; i < thread_count; ++i) {
		setTimeout('render_chunk(' + i + ')', 0);
	}	
}

function render_chunk(chunk_index) {
	//index is which chunk we're rendering off of.
		
	var i = 0;
	var a, b, c, d;
	var bors = 0; // neighbor count
	
	/*
	console.log("looping from: " + chunk_index * w * (h / thread_count) * 4);
	console.log("looping to: " + (chunk_index + 1) * w * (h / thread_count) * 4);
	
	return;
	*/
	
	for (i = chunk_index * w * (h / thread_count) * 4; i <= (chunk_index + 1) * w * (h / thread_count) * 4; i += 4) {
		bors = 0;
		var x = Math.floor((i / 4) % w);
		var y = Math.floor((i / 4) / w);
		
		// check if we're at an edge
		if (x - 1 == -1) {
			a = i / 4 + w - 1;
		} else {
			a = i / 4 - 1;
		}
		if (x + 1 == w) {
			b = i / 4 - w + 1;
		} else {
			b = i / 4 + 1;
		}
		if (y - 1 == -1) {
			c = i / 4 + w * (h - 1);
		} else {
			c = i / 4 - w;
		}
		if (y + 1 == h) {
			d = i / 4 - w * (h - 1);
		} else {
			d = i / 4 + w;
		}
		
		//console.log(x + "/" + y);
		//console.log(a + ":" + b + ":" + c + ":" + d);
	
		a *= 4;
		b *= 4;
		c *= 4;
		d *= 4;
		
		//console.log(temp_world.data[c - 4]);
	
		// count neighbors
		if (world[c - 4] == ON) {
			bors++;
		}
		if (world[c] == ON) {
			bors++;
		}
		if (world[c + 4] == ON) {
			bors++;
		}
		if (world[a] == ON) {
			bors++;
		}
		if (world[b] == ON) {
			bors++;
		}
		if (world[d - 4] == ON) {
			bors++;
		}
		if (world[d] == ON) {
			bors++;
		}
		if (world[d + 4] == ON) {
			bors++;
		}
		
		//console.log(i + " bors: " + bors);		
		
		if (world[i] == ON) {
			if (bors < 2 || bors > 3) {
				temp_world.data[i] = OFF;
				temp_world.data[i + 1] = OFF;
				temp_world.data[i + 2] = OFF;
				temp_world.data[i + 3] = 255;
				//console.log("OFF: " + i);
			}
		}	else {
			if (bors == 3) {
				temp_world.data[i] = ON;
				temp_world.data[i + 1] = ON;
				temp_world.data[i + 2] = ON;
				temp_world.data[i + 3] = 255;
				//console.log("ON: " + i)
			}
		}
	}
	
	thread_status.push(true);
	
	if (thread_status.length >= thread_count) {
		context.putImageData(temp_world, 0, 0);

		bm_end = new Date();
		
		document.getElementById('status').innerHTML = (Math.round(1000 / (bm_end - bm_start))) + "fps";

		setTimeout('render()', 1);
	}
}

function read_thread_count() {
	var values = window.location.search.match(/^\?.*threads=(\d+)/);
	
	if (!values) { return 2; } // default value
	
	return values[1];
}

render();