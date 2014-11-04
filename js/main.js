// Author @dvdtoth

window.onload=function(){

var color = 4; // default color
var cols = 52; // number of columns
var rows = 7; // number of rows
var mouse = 0;

document.body.appendChild(colorSelector());
document.body.appendChild(clickableGrid());
document.body.appendChild(operations()[0]);
document.body.appendChild(operations()[1]);
document.body.appendChild(blankMap());
document.body.appendChild(textArea());
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
    if (this.tagName == 'TD' && mouse == 1) this.setAttribute('data-color', color);
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

function clickableGrid() {
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

function operations(button) {
    var downloadButton = document.createElement('button');
    downloadButton.id = 'downloadbutton';
    downloadButton.innerHTML = 'Generate map';
    downloadButton.onclick = function () {
        generateMap();
    };
    var commitsButton = document.createElement('button');
    commitsButton.id = 'commitsbutton';
    commitsButton.innerHTML = 'Generate commits';
    commitsButton.onclick = function () {
        generateMap();
        generateCommits();
    }
    return [downloadButton, commitsButton];
}

function blankMap() {

    // @TODO do this in a textarea
    var map = document.createElement('div');
    for (var r = 0; r < rows; ++r) {
        var par = document.createElement('div');
        par.id = "line" + (r + 1);
        map.appendChild(par);
    }
    return map;
}

function textArea() {
    var textarea = document.createElement("div");
    var input = document.createElement("textarea");
    input.name = "commits";
    input.maxLength = "5000";
    input.cols = "80";
    input.rows = "10";
    input.id = "commits";
    textarea.appendChild(input); //appendChild
    return textarea;
}

function generateMap() {
    var allTD = document.getElementsByTagName("td");
    var map = [];
    for (var e = 0; e < allTD.length; e++) {
        var line = Math.ceil((e + 1) / cols);
        if (line == 0) line = 1;
        if (map[line] == undefined) map[line] = '';
        map[line] = map[line] + String(allTD[e].getAttribute("data-color"));
        document.getElementById('line' + line).innerHTML = map[line];
    }
}

function generateCommits() {
    // loop vertically on weeks of the year, add commits where necessary
    var d = 1
    // @TODO add field for custom date
    now = new Date();
    // Start at -1 year from now
    var date = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    var textarea = document.getElementById("commits");
    textarea.value = 'touch random.txt; git add .\n'
    for (var c = 0; c < cols; ++c) {
        var week = c + 1;
        for (var r = 0; r < rows; ++r) {
            var color = document.getElementById('line' + (r + 1)).innerHTML[c];
            if (color > 0) {
                var printedDate = date.toISOString().substr(0, 11);
                for (var cm = 0; cm < color; ++cm) {
                    var timestamp = printedDate + ("0" + cm).slice(-2) + ':00';
                    var command1 = 'echo \'' +  Math.random().toString(36).substr(2, 16) + '\' > random.txt';
                    var command2 = 'GIT_AUTHOR_DATE=\'' + timestamp + '\' GIT_COMMITTER_DATE=\'' + timestamp + '\' git commit -am \'' + timestamp + '\'';
                    textarea.value = textarea.value + command1 + '\n';
                    textarea.value = textarea.value + command2 + '\n';
                }
            }
            date = new Date(date.setDate(date.getDate() + 1));
        };
    };
}
}
