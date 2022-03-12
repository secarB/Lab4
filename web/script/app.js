let pointsApi = Vue.resource('/point');
let a = 6;
Vue.component('rows', {
    props: ['messages'],
    data: function () {
        return {
            x: '',
            y: '',
            r: '',
            result: '',
            id: '',
            currentTime: '',
            workTime: '',
            user: ''
        }
    },
    template:
        ` `,
});
let table = new Vue({
    el: '#result-table',
    template:

        ` 
        <table id="resTable" class="resTable">
        <thead>
                <tr><th>x</th><th>y</th><th>r</th><th>result</th><th>date</th></tr>
        </thead>
        </table>`,

    data: {
        messages: [],
    },
    created: function () {
        this.$http.get('http://localhost:8080/test/api/points/'+ localStorage.getItem("username"),{headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Bearer,${localStorage.getItem("token")}`
            }}).then(data => {
            data.json().then( res => {
                table.messages = res;
                console.log(table.messages);
                loadDots()
            }
            )
        })
        ;
    },
    updated: function () {
        if (this.messages.length>0) {
            addDot(table.messages.length - 1);
        }
    },
});

let form = new Vue({
    el: '#mainTable',
    data: {
        x: null,
        y: null,
        r: 4
    },
    methods: {
        check: function () {
            if (validateR(this.r)&&validateX(this.x)&&validateY(this.y)) {
                let point = {
                    x: this.x,
                    y: this.y,
                    r: this.r,
                }
                let str = '';
                str += `x=${this.x}&`;
                str += `y=${this.y}&`;
                str += `r=${this.r}&`;
                this.$http.post('http://localhost:8080/test/api/points/'+ localStorage.getItem("username"),[str],{headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        Authorization: `Bearer,${localStorage.getItem("token")}`
                    }}).then(
                    result => result.json().then(
                        data => {
                            textWindow.message = "";
                            this.$http.get('http://localhost:8080/test/api/points/'+ localStorage.getItem("username"),{headers: {
                                    "Content-Type": "application/x-www-form-urlencoded",
                                    Authorization: `Bearer,${localStorage.getItem("token")}`
                                }}).then(result => {
                                result.json().then( res => {
                                    table.messages = res;
                                    console.log(res);
                                    loadDots();
                                })
                            });
                        },
                    ),
                    error => {
                        console.log(error);
                        switch (error.status) {
                            case 400:
                                textWindow.message = "Data is not valid.\n";
                                break;
                            case 406:
                                textWindow.message = "Data is not acceptable.\n";
                                break;
                            default:
                                textWindow.message = "Error";
                                break;
                        }
                    });

            }
        },
        logout: function (){
            localStorage.removeItem("token");
            localStorage.removeItem("username");
        }
    }

})

function loadDots() {
    let oldDots = document.querySelectorAll("circle");
    oldDots.forEach(dot => dot.parentNode.removeChild(dot));
    let length = table.messages.length;
    console.log("length: "+length);
    for (let i = 0; i<length; i++) {
        addDot(i);
    }
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

let textWindow = new Vue({
    el: "#outputContainer",
    template: '<span>{{message}}</span>',
    data: {
        message: ""
    }
})

