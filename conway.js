var
	conway = document.getElementById('conway'),
	context = conway.getContext('2d'),
	w = conway.width,
	h = conway.height,
	ON = 0,
	OFF = 255
;

//initialize
var world = context.createImageData(conway.width, conway.height);
var i = 0;

for(i = 0; i < w * h * 4; i += 4) {
	var value = (Math.random() >= 0.5 ? OFF : ON)
	world.data[i] = value;
	world.data[i+1] = value;
	world.data[i+2] = value;
	world.data[i+3] = 255;
}

context.putImageData(world, 0, 0);

function render() {
	var temp_world = context.getImageData(0,0,w,h);
	world = context.getImageData(0,0,w,h);
	world = world.data;

	var i = 0;
	var a, b, c, d;
	var bors = 0; // neighbor count
	
	for (i = 0; i <= w * h * 4; i += 4) {
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

	//console.log('rendered...');

	context.putImageData(temp_world, 0, 0);

	setTimeout('render()', 1);
}

render();