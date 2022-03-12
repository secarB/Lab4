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
        let str = '';
        str += `x=${point.x}&`;
        str += `y=${point.y}&`;
        str += `r=${point.r}&`;
        console.log(str);
        Vue.http.post('http://localhost:8080/test/api/points/'+ localStorage.getItem("username"),[str],{headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Bearer,${localStorage.getItem("token")}`
            }}).then(
            result => result.json().then(
                data => {
                    Vue.http.get('http://localhost:8080/test/api/points/'+ localStorage.getItem("username"),{headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                            Authorization: `Bearer,${localStorage.getItem("token")}`
                        }}).then(result => {
                            result.json().then( res => {
                                table.messages = res;
                                console.log(table.messages);
                                loadDots();
                        })
                    });
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
        rect.setAttribute("width", `${r*unit/2}`);
        rect.setAttribute("height", `${r*unit}`);
        rect.setAttribute("x", `${150-r*unit/2}`);

        rect.setAttribute("y", `${150-r*unit}`);
        triangle.setAttribute("points", `150,150 150,${150-r*unit} ${150+r*unit/2},150`);
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
    let length = table.messages.length;
    console.log("length: "+length);

    $('#resBody').remove();
    let newRow = '<tbody id = "resBody">';
    for (let i = 0; i<length; i++) {
        addDot(i);
        newRow += '<tr>';
        newRow += '<td>' + table.messages[i].x + '</td>';
        newRow += '<td>' + table.messages[i].y + '</td>';
        newRow += '<td>' + table.messages[i].r + '</td>';
        newRow += '<td>' + table.messages[i].result + '</td>';
        newRow += '<td>' + table.messages[i].currentTime + '</td>';
        newRow += '</tr>';
    }
    newRow += '</tbody>';
    $('#resTable').append(newRow);
}

function addDot(pos) {
    let dotCoords = {
        x: table.messages[pos].x*unit + 150,
        y: 150 - table.messages[pos].y*unit
    };
    let dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    dot.setAttribute("r", "4");
    dot.setAttribute("cx", `${dotCoords.x}`);
    dot.setAttribute("cy", `${dotCoords.y}`);
    dot.setAttribute("fill", table.messages[pos].result? "green" : "red");
    svg.appendChild(dot);
}
