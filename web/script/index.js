
const onHelios= 'http://localhost:1070/lab4/';
const notOnHelios = 'http://localhost:8080/test/'
let token = '';
let signInForm = new Vue({
    el: '#mainTable',
    data: {
        user: {username: '', password: ''},
        message: ''
    },
    methods: {
        login: function (key, value) {
            if (this.user.username.trim().length === 0 || this.user.password.trim().length === 0) {
                this.message = "Please fill all the fields.";
            } else {
                this.message = '';
                this.$http.post(onHelios+'api/user/login/'+ this.user.username,['password=' + this.user.password],{headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }}).then(
                    result => {
                        localStorage.setItem("token", result.bodyText);
                        localStorage.setItem("username" , this.user.username);
                        console.log(result.bodyText);
                        window.location.replace("app");
                        console.log(result);
                    },
                    error => {
                        switch (error.status) {
                            case 403:
                                this.message = "User is not exist"
                                break;
                            case 401:
                                this.message = "Incorrect password.";
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
        },
        register: function () {
            if (this.user.username.trim().length === 0 || this.user.password.trim().length === 0) {
                this.message = "Please fill all the fields.";
            } else {
                this.message = '';
                this.$http.post(onHelios+'api/user/register/'+ this.user.username,['password=' + this.user.password],{headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }}).then(
                    result => {
                        this.message = "Registration was successful"
                        console.log(result.bodyText);
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