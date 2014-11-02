window.onload=function(){
	
var color = 4; // default color
var cols = 52; // number of columns
var rows = 7; // number of rows
var mouse = 0;

colors = colorSelector();
graph = clickableGrid(rows, cols);
ops = operations();
map = generateMap(rows);

document.body.appendChild(colors);
document.body.appendChild(graph);
document.body.appendChild(ops);
document.body.appendChild(map);
document.body.onmouseup = function (e) {
            mouse = 0
        }

// disable drag event for IE
document.body.ondragstart = function (e) {
    return false
}


function mousedown(e) {
    // define event
    var evt = e || window.event;
    // needed for FF to disable dragging
    if (evt.preventDefault) e.preventDefault();
    // set pressed mouse button
    if (evt.which) mouse = evt.which;
    else mouse = evt.button;
    // colorize pixel on mousedown event for TD element
    if (this.tagName == 'TD' && mouse == 1)
    //this.style.backgroundColor = color;
    this.setAttribute('data-color', color);
}

function colorSelector() {
    var colors = document.createElement('ul');
    colors.className = "legend";
    for (var i = 0; i < 5; ++i) {
        var option = colors.appendChild(document.createElement('li'));
        option.className = "color" + i;
        if (i == color) option.className = option.className + " active";
        option.onclick = function () {
            document.getElementsByClassName("active")[0].className = "color" + color;
            color = this.className[5];
            this.className = this.className + " active";
        };
    }
    return colors;
}

function clickableGrid(rows, cols, callback) {
    var i = 0;
    var grid = document.createElement('table');
    grid.className = 'grid';
    grid.id = 'drawingtable';
    for (var r = 0; r < rows; ++r) {
        var tr = grid.appendChild(document.createElement('tr'));
        for (var c = 0; c < cols; ++c) {
            var cell = tr.appendChild(document.createElement('td'));
            cell.className = ++i;
            cell.innerHTML = ' ';
            cell.setAttribute('data-color', 0);
            cell.addEventListener('mousedown', mousedown);
            cell.onmouseover = function (e) {
                if (mouse == 1) this.setAttribute('data-color', color)
            }
        }
    }
    return grid;
}

function operations() {
    var downloadButton = document.createElement('button');
    downloadButton.id = 'download';
    downloadButton.innerHTML = 'Generate map';
    downloadButton.onclick = function() {
    var allTD = document.getElementsByTagName("td");
    var map = [];
    for (var e = 0; e < allTD.length; e++) {
        var line = Math.ceil((e + 1) / cols);
        if (line == 0) line = 1;
        if (map[line] == undefined) map[line] = '';
        map[line] = map[line] + String(allTD[e].getAttribute("data-color"));
        document.getElementById('line' + line).innerHTML = map[line];
    }
    };
    return downloadButton;
}

function generateMap(rows) {
        var map = document.createElement('div');
        for (var r = 0; r < rows; ++r) {
            var par = document.createElement('div');
            par.id = "line" + (r+1);
            map.appendChild(par);
        }
    return map;
}
}
