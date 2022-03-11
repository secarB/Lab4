"use strict";

const svg = document.getElementById("graph");
const rect = document.getElementById("rect");
const triangle = document.getElementById("triangle");
const path = document.getElementById("path");
const unit = 260/10;

let pt = svg.createSVGPoint();

// window.onresize = function(){
//     drawGraph();
//     loadDots();
// }

document.addEventListener("DOMContentLoaded", () => {
    svg.addEventListener("click", event => {
        let position = getMousePosition(svg, event);
        let point = {
            x: ((position.x - 150)/unit).toFixed(5),
            y: ((150 - position.y)/unit).toFixed(5),
            r: form.r,
        }
        pointsApi.save({}, point).then(result => result.json().then(data => {
            textWindow.message = '';
            // textWindow.response = true;
            // textWindow.lastPoint = data;
            // data.hit = data.hit ? "Попадание" : "Промах";
            table.points.push(data);
        }))
    });
});

function getMousePosition(svg, event) {
    pt.x = event.clientX; pt.y = event.clientY;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
    // let rect = svg.getBoundingClientRect();
    // return {
    //     x: event.clientX - rect.left,
    //     y: event.clientY - rect.top
    // };
}

function drawGraph() {
    let r = form.r;
    if (r>0) {
        rect.setAttribute("width", `${r*unit}`);
        rect.setAttribute("height", `${r*unit/2}`);
        rect.setAttribute("x", `${150 - r*unit}`);
        triangle.setAttribute("points", `150,150 150,${150-r*unit} ${150-r*unit},150`);
        path.setAttribute("d", `M 150,150 L${150+r*unit},150 A ${r*unit},${r*unit} 0 0,1 150,${150+r*unit} Z`);
    } else {
        rect.removeAttribute("width");
        rect.removeAttribute("width");
        triangle.removeAttribute("points");
        path.removeAttribute("d");
    }
}

function loadDots() {
    let oldDots = document.querySelectorAll("circle");
    oldDots.forEach(dot => dot.parentNode.removeChild(dot));
    let length = table.points.length;
    console.log("length: "+length);
    for (let i = 0; i<length; i++) {
        addDot(i);
    }
}

function addDot(pos) {
    let dotCoords = {
        x: table.points[pos].x*unit + 150,
        y: 150 - table.points[pos].y*unit
    };
    let dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    dot.setAttribute("r", "5");
    dot.setAttribute("cx", `${dotCoords.x}`);
    dot.setAttribute("cy", `${dotCoords.y}`);
    dot.setAttribute("fill", table.points[pos].hit? "green" : "red");
    svg.appendChild(dot);
}
