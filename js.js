/** Sudoku V1.1 **/

(new function(){
	// Config
	var ts = this,
		table = [],
		update_active = true,
		help_level = 0,
		help_maxLevel = 3,
		help_minLevel = 0,
		level_sudo_min = 1,
		level_sudo_max = 3,
		level_sudo_init = 1,
		autocomplete = true,
		show_mini = true,
		missing = [
			[],
			[],
			[],
		],
		set_arr = [];
		last_poin = {x:0, y:0};

	// Visual
	var element = newNode("table", document.getElementById("outSudoku")).setAttr("class", "sudoku"),

		help_range = document.getElementById("range_help"),
		help_input = document.getElementById("range_help_number"),
		
		autocomplete_element = document.getElementById("check_autocomplete"),
		
		check_grid = document.getElementById("check_grid"),
		
		load_input = document.getElementById("load_text"),
		load_element = document.getElementById("load"),
		save_element = document.getElementById("save"),
		reset_element = document.getElementById("reset"),
		random_element = document.getElementById("load_random"),
		level_range = document.getElementById("level_range"),
		level_number = document.getElementById("level_number"),
		level_load = document.getElementById("level_load"),
		verificar_element = document.getElementById("verificar");
	


	this.init = function(){

		createCells();

		//Event Save/Load
		save_element.onclick = function(){load_input.value = tabletoString();};
		load_element.onclick = function(){reset_element.onclick();stringtoTable(load_input.value)};

		reset_element.onclick = function(){
			table = [], missing = [[],[],[]];
			element.innerHTML = "";
			createCells();
		};

		random_element.onclick = function(){
			var a = autocomplete, b = help_level;
			autocomplete = false;
			help_level = 0;
			reset_element.onclick();
			window.load(sudo.random());
			autocomplete = a;
			help_level = b;
		};

		level_number.value = level_range.value = level_sudo_init;
		level_number.max = level_range.max = level_sudo_max;
		level_number.min = level_range.min = level_sudo_min;
		level_number.onchange = level_range.onchange = function(event){
			level_number.value = level_range.value = event.target.value;
		};
		level_load.onclick = function (){
			load_input.value = sudo.random(level_number.value);
			load_element.onclick();
		};

		window.load = function(v){
			load_input.value = v;
			load_element.onclick();
		};
		verificar_element.onclick = verificar;

		//Event Help
		help_input.onchange = help_range.onchange = function(e){
			help_input.value = help_range.value = help_level = e.target.value;
			ts.update();
		};

		check_grid.onchange = function(){
			element.setAttribute("class", "sudoku"+((check_grid.checked)?"":" hiddenHelp"));
		};

		autocomplete_element.onchange = function(){autocomplete = autocomplete_element.checked;};
		

		//Load Config
		help_input.onchange({target:{value:help_level}});
		help_range.min = help_input.min = help_minLevel;
		help_range.max = help_input.max = help_maxLevel;

		autocomplete_element.checked = autocomplete;
		
		check_grid.checked = show_mini;
		check_grid.onchange();

		update_active = false;
	};

	
	// Create all cell
	function createCells(){
		var x, y, tr, temp, b;
		for(x = 0; x < 9; ++x){
			table[x] = [];
			tr = newNode("tr");
			for(y = 0; y < 9; ++y){
				b = Math.floor(x/3)+Math.floor(y/3)*3;
				temp = new Cell(x, y, b, ts);

				if(!missing[0][b]){missing[0][b] = [];}
				if(!missing[1][x]){missing[1][x] = [];}
				if(!missing[2][y]){missing[2][y] = [];}
				missing[0][b].push(temp);
				missing[1][x].push(temp);
				missing[2][y].push(temp);

				tr.appendChild((table[x][y] = temp ).getTd());
			}
			element.appendChild(tr);
		}
	}
	this.update = function(){
		if(update_active){return;}
		update_active = true;
		var a;
		while((a = set_arr.splice(0,1)).length){
			set(a[0]);
		}
		update_active = false;
		checkAll();
	};
	function checkAll(){
		if(help_level < 1){return;}
		var a, b, c, d, e, f, g, h, i, j, k, h;
		for(a in missing){
			for(b in missing[a]){
				c = [];
				for(f in missing[a][b]){
					d = missing[a][b][f].getMini();

					//Help Level 2
					if(d.length == 1){set({o: missing[a][b][f],v: d[0]}); return;}
					for(e in d){
						if(!c[d[e]]){c[d[e]] = [];}
						c[d[e]].push({o: missing[a][b][f],v: d[e]});
					}

					//Help level 3
					if(help_level > 2){
						i = [missing[a][b][f]];
						for(g in missing[a][b]){
							if(missing[a][b][g] == missing[a][b][f]){continue;}
							h = true;
							k = missing[a][b][g].getMini();
							for(j in k){
								if(d.indexOf(k[j]) < 0){h = false; break;}
							}
							if(h){i.push(missing[a][b][g])}
						}
						if(i.length == d.length){
							for(g in missing[a][b]){
								if(i.indexOf(missing[a][b][g]) >= 0){continue;}
								for(h in d){
									missing[a][b][g].miniHidden(d[h]);
								}
							}
						}
					}
				}

				// Help Level 2
				if(help_level > 1){
					for(f in c){
						if(c[f].length == 1){set(c[f][0]); return;}
					}
				}
			}
		}
	}
	function delMiniArr(value, arr){
		for(var a in arr){
			arr[a].miniHidden(value);
		}
	};
	function set(o){if(autocomplete){o.o.set(o.v, true)};}
	function verificar(){
		var x, y, r = true;
		for(x = 0; x < 9; ++x){
			for(y = 0; y < 9; ++y){
				if(!table[x][y].verificar()){r = false; break;}

			}
		}
		console.log(r);
	};
	function tabletoString(){
		var x, y, r = "";
		for(x = 0; x < 9; ++x){
			for(y = 0; y < 9; ++y){
				r += table[x][y].getValue();
			}
		}
		return r;
	}
	function stringtoTable(text){
		var arr = text.split(""), x, y;
		for(var index = 0; index < arr.length; ++index){
			if(arr[index] != "0"){
				x = Math.floor(index/9);
				y = index%9;
				table[x][y].set(arr[index]);
			}
		}
	}
	function resetCuadriculas(){
		var tabla = tabletoString();
		reset_element.onclick();
		stringtoTable(tabla);
		table[last_poin.x][last_poin.y].setFocus();
	};


	/**
	 * Celda
	 * @param {Number} x Coor x
	 * @param {Number} y Coor y
	 * @param {Number} b Bloque
	 * @param {Cell} tsp Cell parent
	 */
	function Cell(x, y, b, tsp){
		var missing_index = [b, x, y],
		 ts = this,
		 ts_parent = tsp,
		 minid = [],
		 missing_cell = [1,2,3,4,5,6,7,8,9],
		 setted = false;

		//Visual
		var td = newNode("td", null, {"name": "x"+x+"y"+y}),
			mini = newNode("table", td).setAttr("class", "mini"),
			input = newNode("input", td ,{"maxlength": 1});


		var a, b, c;
		for(a = 0; a < 3; ++a){
			c = newNode("tr", mini);
			for(b = 1; b <=3; ++b){
				minid[a*3+b] = d = newNode("td", c, {"innerHTML": a*3+b});
			}
		}
		input.onkeydown = function(event){
			if(/^[0-9]*$/.test(event.key)){
				input.value = "";
			}else if(event.key != "Backspace"){

				event.returnValue = false;
			}
		};
		input.onchange = function(){
			if(input.value == 0){ input.value ="";}
			ts.set(input.value);
		};
		input.onkeyup = function(event){
			var ny = y; nx = x;
			switch(event.key){
				case "a":
				case "ArrowLeft": --ny; break;
				case "d":
				case "ArrowRight": ++ny; break;
				case "w":
				case "ArrowUp": --nx; break;
				case "s":
				case "ArrowDown": ++nx; break;
			}
			if(nx < 0){nx = 8;}
			if(nx > 8){nx = 0;}
			if(ny < 0){ny = 8;}
			if(ny > 8){ny = 0;}
			last_poin = {x: nx, y: ny};
			table[nx][ny].setFocus();
		};
		this.setFocus = function(){input.focus();};
		this.getTd = function(){return td;};
		this.set = function(a, auto){
			if(a){
				if(setted && !auto){ // a && setted
					resetCuadriculas();
				}else{ // a && !setted
					input.value = a;
					setted = true;
					mini.setAttribute("class", "hidden");
					sleep(200).then(() => {
						for(var b = 0; b < 3; ++b){
							missing[b][missing_index[b]].splice(missing[b][missing_index[b]].indexOf(ts), 1);
	
							delMiniArr(a, missing[b][missing_index[b]]);
						}
						ts_parent.update();
					});
					
				}
			}else{
				if(setted){ // !a && setted
					input.value = "";
					resetCuadriculas();
				}else{ // !a && !setted
				}
			}
		};
		this.miniHidden = function(a){
			if(setted){return false;}
			minid[a].setAttribute("class", "hidden");
			a *= 1;
			if(missing_cell.indexOf(a) >= 0){missing_cell.splice(missing_cell.indexOf(a), 1);}
			if(missing_cell.length == 1 && help_level > 0){set_arr.push({o: ts, v: missing_cell[0]});}
		};
		this.getMini = function(){return (setted)?[]:missing_cell;};
		this.getValue = function(){return (input.value)?input.value:0;};
		this.verificar = function(){
			var index, second_index;
			for(index = 0; index < 9; ++index){
				if(!input.value){return false;}
				if(ts != table[missing_index[1]][index] && ts.getValue == table[missing_index[1]][index].getValue){return false;}
				if(ts != table[index][missing_index[2]] && ts.getValue == table[index][missing_index[2]].getValue){return false;}
			}
			return true;
		};
	}
	function sleep (time) {
		return new Promise((resolve) => setTimeout(resolve, time));
	}
}).init();

var sudo = { 
	rand: [],
	nivel:[[],[],[],[],[]],
	add: function(sudoku, level){
		this.rand.push(sudoku);
		if(level){
			this.nivel[level].push(sudoku);
		}
	},
	random: function(level){
		console.log("e");
		if(level){
			return this.nivel[level][Math.floor(Math.random()*this.nivel[level].length)];
		}else{
			return this.rand[Math.floor(Math.random()*this.rand.length)];
		}
	}

};

document.getElementById("content").setAttribute("style", "grid-template-columns:"+(Math.max(650, window.innerHeight)-30)+"px 1fr");
document.getElementById("outSudoku").setAttribute("style", "height:"+(Math.max(650, window.innerHeight)-30)+"px");

//Ultimo 242
// Level 1
sudo.add("890500037400003006000010000080000600001050200002000090000090000700600003360007084", 1); //249
sudo.add("030790800000000010200300705050000009300804002700000040501009007040000000009041060", 1); //248
sudo.add("000000002020004006000089100060300200052040870009002060004790000700100030300000000", 1); //247
sudo.add("002500360060024000000000001000041907900000004104230000600000000000810050025007600", 1); //242
// Level 2
sudo.add("200000040035600800670841000050300000060209050000008070000184039008003260010000005", 2); //243
sudo.add("560028000032760900070000000023000001000245000900000270000000060006079510000810032", 2); //244
sudo.add("200090500860000010030070006080900200000603000001007040600040070040000021007020004", 2); //246
sudo.add("000050000370800014100006003010000800009080500002000060700900006480001037000060000", 2); //245
sudo.add("080074000050031000004900030000010480740000016021080000090007800000520060000690020", 2);
sudo.add("630050020009000005405080700000120000003894100000067000001070809200000400080040051", 2);

// Level 3

// Level 4 (Varias soluciones)
sudo.add("000001740000500000060890000400000900030005000205000800300060021108000050000007000", 3); //250
