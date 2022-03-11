let loginApi = Vue.resource('rest//login');
let regApi = Vue.resource('rest/register');
let caller = null;
let token = '';
let signInForm = new Vue({
    el: '#mainTable',
    data: {
        user: {username: '', password: ''},
        message: ''
    },
    methods: {
        login: function () {


            if (this.user.username.trim().length === 0 || this.user.password.trim().length === 0) {
                this.message = "Please fill all the fields.";
            } else {
                this.message = '';
                this.$http.post('http://localhost:8080/test/rest/auth/login/'+ this.user.username,['password=' + this.user.password],{headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }}).then(
                    result => {
                        // window.location.replace("app");
                        console.log(result);
                    },
                    error => {
                        this.message = error.bodyText;
                        console.log(error);
                    }
                )

            }
        },
        register: function () {
            if (this.user.username.trim().length === 0 || this.user.password.trim().length === 0) {
                this.message = "Please fill all the fields.";
            } else {
                this.message = '';
                this.$http.post('http://localhost:8080/test/api/user/register/'+ this.user.username,['password=' + this.user.password],{headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }}).then(
                    result => {
                        // window.location.replace("app");
                        console.log(result);
                    },
                    error => {
                        console.log(error.status);
                        switch (error.status) {
                            case 403:
                                this.message = "Username already exist.";
                                break;
                            case 400:
                                this.message = "Error with server.";
                                break;
                            default:
                                console.log(error);
                                break;
                        }
                    }
                )
            }
        }
    },
})