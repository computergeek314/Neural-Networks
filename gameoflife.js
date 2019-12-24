cell_width = 40;

function initialize_canvas(){
	ctx = canvas.getContext("2d");
	canvas.width = document.body.clientWidth;
	canvas.height = document.body.clientHeight;
	last_body_width = document.body.clientWidth;
	last_body_height = document.body.clientHeight;
	if(canvas.width > canvas.height){
		pixel_width = canvas.width/cell_width;
		width = cell_width;
		height = Math.ceil(cell_width*canvas.height/canvas.width);
	} else {
		pixel_width = canvas.height/cell_width;
		width = Math.ceil(cell_width*canvas.width/canvas.height);
		height = cell_width;
	}
}

function fill_canvas(r, g, b){
	ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function resize_canvas(event){
	canvas.width = document.body.clientWidth;
	canvas.height = document.body.clientHeight;
	if(canvas.width > canvas.height){
		pixel_width = canvas.width/cell_width;
	} else {
		pixel_width = canvas.height/cell_width;
	}
}

function set_pix(x, y, r, g, b){
	ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
	ctx.fillRect(Math.round(pixel_width*x), Math.round(pixel_width*y), Math.round(0.75*pixel_width), Math.round(0.75*pixel_width));
}

function create_cell_array(){
	cell_array = new Array(width);
	next_cell_array = new Array(width);
	for(var i = 0; i < width; i++){
		cell_array[i] = new Array(height);
		next_cell_array[i] = new Array(height);
		for(var j = 0; j < height; j++){
			cell_array[i][j] = Math.round(Math.random());
			next_cell_array[i][j] = cell_array[i][j];
		}
	}
}

function get_alive_neighbor_count(cell_array, x, y){
	var alive_count = 0;
	if(x > 0){
		alive_count += cell_array[x - 1][y];
		if(y > 0){
			alive_count += cell_array[x - 1][y - 1];
		}
		if(y < height - 1){
			alive_count += cell_array[x - 1][y + 1];
		}
	}
	if(y > 0){
		alive_count += cell_array[x][y - 1];
	}
	if(y < height - 1){
		alive_count += cell_array[x][y + 1];
	}
	if(x < width - 1){
		alive_count += cell_array[x + 1][y];
		if(y > 0){
			alive_count += cell_array[x + 1][y - 1];
		}
		if(y < height - 1){
			alive_count += cell_array[x + 1][y + 1];
		}
	}

	return alive_count;
}

function update_cells(old_cell_array, new_cell_array){
	for(var i = 0; i < width; i++){
		for(var j = 0; j < height; j++){
			var alive_cells = get_alive_neighbor_count(old_cell_array, i, j);
			if((old_cell_array[i][j] && (alive_cells == 2 || alive_cells == 3)) || (!old_cell_array[i][j] && alive_cells == 3)){
				new_cell_array[i][j] = 1;
			} else {
				new_cell_array[i][j] = 0;
			}
		}
	}
}

function display_cells(display_cell_array){
	fill_canvas(0, 0, 0);
	for(var i = 0; i < width; i++){
		for(var j = 0; j < height; j++){
			if(display_cell_array[i][j]){
				set_pix(i, j, 0, 0, 60);
			} else {
				set_pix(i, j, 0, 0, 0);
			}
		}
	}
}

function do_frame(){
	if(frame){
		frame = 0;
		update_cells(cell_array, next_cell_array);
		display_cells(next_cell_array);
	} else {
		frame = 1;
		update_cells(next_cell_array, cell_array);
		display_cells(cell_array);
	}
}

canvas = document.getElementsByClassName("game_of_life")[0];
initialize_canvas();
fill_canvas(0, 0, 0);
frame = 0;
window.addEventListener("load", function (){create_cell_array(); setInterval(do_frame, 100)});
window.addEventListener("resize", resize_canvas);
