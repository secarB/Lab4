let pointsApi = Vue.resource('/point');

Vue.component('rows', {
    props: ['points'],
    template:
        `<tbody><tr v-for="point in points" :key="point.id">
            <td>{{point.x}}</td>
            <td>{{point.y}}</td>
            <td>{{point.r}}</td>
            <td v-if="point.hit" style="color:green; font-weight:bold">True</td>
            <td v-else style="color:red; font-weight:bold">False</td>
            <td>{{point.time}}</td>
        </tr></tbody>`,
});
let table = new Vue({
    el: '#result-table',
    template:
        `<table id="resTable">
        <thead>
                <tr><th>x</th><th>y</th><th>r</th><th>result</th><th>date</th></tr>
        </thead>
        <rows :points="points"></rows>
        </table>`,
    data: {
        points: [],
    },
    created: function () {
        pointsApi.get().then(result => result.json().then(data => {
            table.points = data;
            console.log(table.points);
            loadDots();
        }));
    },
    updated: function () {
        if (this.points.length>0) {
            addDot(table.points.length - 1);
        }
    },
});

let form = new Vue({
    el: '#mainTable',
    data: {
        x: null,
        y: null,
        r: 5
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
                this.$http.post('http://localhost:8080/test/api/points/'+ '3',[str],{headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        Authorization: `Bearer,${localStorage.getItem("token")}`
                    }}).then(
                    result => result.json().then(
                        data => {
                            textWindow.message = "";
                            table.points.push(data);
                        }, error => {
                            textWindow.message = "Something wrong with JSON" + error.body.error;
                            console.log("Something wrong with JSON" + error.body.error)
                        }
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
        reset: function () {
            pointsApi.remove({}).then(result => result.text().then(data => {
                    textWindow.message = data;
                    table.points = [];
                    loadDots();
                }),
                error => {
                    textWindow.message = "Error: " + error.body.error;
                });
        }
    }
})
let textWindow = new Vue({
    el: "#outputContainer",
    template: '<span>{{message}}</span>',
    data: {
        message: ""
    }
})

