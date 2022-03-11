"use strict";

document.addEventListener("DOMContentLoaded", () => {
    let buttonsX = document.querySelectorAll("#div-x .commandButtonsGroup")
    buttonsX.forEach(chooseX);
    function chooseX(element) {
        element.onclick = function () {
            form.x = this.value;
            buttonsX.forEach(function (element) {
                element.style.backgroundColor = null;
                element.style.color = null;
            });
            this.style.backgroundColor = "#ce1237";
            this.style.color = "white";
            return false;
        }
    }
    let buttonsR = document.querySelectorAll("#div-r .commandButtonsGroup")
    buttonsR.forEach(chooseR);
    function chooseR(element) {
        element.onclick = function () {
            form.r = this.value;
            buttonsR.forEach(function (element) {
                element.style.backgroundColor = null;
                element.style.color = null;
            });
            this.style.backgroundColor = "#ce1237";
            this.style.color = "white";
            drawGraph();
            return false;
        }
    }

});

function validateX(x) {
    if (!isNumeric(x)) {
        textWindow.message="X was not chose";
        return false;
    } else return true
}

function validateY(y) {
    if (y === undefined) {
        textWindow.message="Y is not valid";
        return false;
    } else if (!isNumeric(y)) {
        textWindow.message="Y is not numeric";
        return false;
    } else if (!((y > -3) && (y < 5))) {
        textWindow.message="Y is out of range";
        return false;
    } else return true;
}

function validateR(r) {
    if (!isNumeric(r)) {
        textWindow.message="R was not chose";
        return false;
    } else return true
}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}