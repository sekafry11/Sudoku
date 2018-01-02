/** Sudoku V1.0
Falta agregar checkbox para autocomplete
**/

document.body.appendChild((new function(){
	// Config
	var ts = this,
		pepa = this,
		table = [],
		update_active = true,
		help_level = 0,
		help_maxLevel = 3,
		help_minLevel = 0,
		autocomplete = true,
		show_mini = true,
		missing = [
			[],
			[],
			[],
		],
		set_arr = [];

	// Visual
	var a;
	var parent_element = newNode("div")
		element = newNode("table", ((a = document.getElementById("outSudoku"))?a:parent_element)).setAttr("class", "sudoku"),
		config_element = newNode("div", null),
		help_element = newNode("input", a = ((a = document.getElementById("helpConfig"))?a:config_element), {"value": help_level, "min": help_minLevel, "max": help_maxLevel}).setAttr("type", "range"),
		help_input = newNode("input", a, {"value": help_level, "min": help_minLevel, "max": help_maxLevel}).setAttr("type", "number"),
		show_label = newNode("label", a, {"innerHTML": "Mostrar Cuadricula: "}),
		show_element = newNode("input", show_label, {"type": "checkbox", "checked":show_mini}),
		autocomplete_label = newNode("label", a, {"innerHTML": "Autocompletar: "}),
		autocomplete_element = newNode("input", autocomplete_label, {"type": "checkbox", "checked":autocomplete}),
		load_input = newNode("input", a = ((a = document.getElementById("saveConfig"))?a:config_element)),
		load_element = newNode("button", a, {"innerHTML": "Load"}),
		save_element = newNode("button", a, {"innerHTML": "Save"}),
		reset_element = newNode("button", a, {"innerHTML": "Reset"});
		random_element = newNode("button", a, {"innerHTML": "Cargar sudoku aleatorio"});


	this.init = function(){
		//Load Config
		document.body.setAttribute("class", "level"+help_level);
		createCells();

		//Load Events
		help_input.onchange = help_element.onchange = function(e){
			help_input.value = help_element.value = help_level = e.target.value;
			ts.update();
		};
		show_element.onchange = function(e){element.setAttribute("class", "sudoku"+((show_element.checked)?"":" hiddenHelp"));};
		autocomplete_element.onchange = function(e){autocomplete = autocomplete_element.checked;};
		save_element.onclick = function(){
			var x, y, r = "";
			for(x = 0; x < 9; ++x){
				for(y = 0; y < 9; ++y){
					r += table[x][y].getValue();
				}
			}
			load_input.value = r;
		};
		load_element.onclick = function(){
			console.time("check");
			var arr = load_input.value.split(""), x, y;
			for(var index = 0; index < arr.length; ++index){
				if(arr[index] != "0"){
					x = Math.floor(index/9);
					y = index%9;
					table[x][y].set(arr[index]);
				}
			}
			console.timeEnd("check");
		};
		reset_element.onclick = function(){
			table = [],missing = [[],[],[],];
			element.innerHTML = "";
			createCells();
		};
		random_element.onclick = function(){
			var a = autocomplete, b = help_level;
			autocomplete = true;
			help_level = 0;
			reset_element.onclick();
			window.load(sudo[Math.floor(Math.random()*sudo.length)]);
			autocomplete = a;
			help_level = b;
		};
		window.load = function(v){
			load_input.value = v;
			load_element.onclick();
		};
		update_active = false;
		return parent_element;
	};
	// Create all cell
	function createCells(){
		var x, y, o, tr, temp, b;
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
		var a, b, c, d, e, f, g, h, i, j, k, h, l, m, n;
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
	function set(o){if(autocomplete){o.o.set(o.v)};}
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


		var a, b, c, d;
		for(a = 0; a < 3; ++a){
			c = newNode("tr", mini);
			for(b = 1; b <=3; ++b){
				minid[a*3+b] = d = newNode("td", c, {"innerHTML": a*3+b});
			}
		}

		input.onchange = function(){ts.set(input.value);};
		input.onkeyup = function(a){
			var ny = y; nx = x;
			switch(a.key){
				case "ArrowLeft": --ny; break;
				case "ArrowRight": ++ny; break;
				case "ArrowUp": --nx; break;
				case "ArrowDown": ++nx; break;
			}
			if(nx < 0){nx = 8;}
			if(nx > 8){nx = 0;}
			if(ny < 0){ny = 8;}
			if(ny > 8){ny = 0;}
			table[nx][ny].setFocus();
		};
		this.setFocus = function(){input.focus();};
		this.getTd = function(){return td;};
		this.set = function(a){
			if(setted){return false;}
			setted = true;
			input.value = a;
			mini.setAttribute("class", "hidden");
			for(var b = 0; b < 3; ++b){
				missing[b][missing_index[b]].splice(missing[b][missing_index[b]].indexOf(ts), 1);
				delMiniArr(a, missing[b][missing_index[b]]);
			}
			ts_parent.update();
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
	}
}).init())

var sudo = [];
// Level 1


// Level 2
sudo.push("200000040035600800670841000050300000060209050000008070000184039008003260010000005"); //243
sudo.push("560028000032760900070000000023000001000245000900000270000000060006079510000810032"); //244

// Level 3
sudo.push("080074000050031000004900030000010480740000016021080000090007800000520060000690020");
sudo.push("630050020009000005405080700000120000003894100000067000001070809200000400080040051");
