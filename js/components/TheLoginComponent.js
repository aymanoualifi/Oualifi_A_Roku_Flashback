export default {
    name: 'TheLoginComponent',

    template: `
    <section class="container">
        <div class="jumbotron">
        <img src="images/roku.svg" alt="Roku logo" width="90">
            <p class="lead">
            Before revisiting your favourite movies, tv shows or music from yesteryear, please log in with a valid username and password.
            </p>
        </div>

        <section class="log-in">
            <label class="sr-only" for="inlineFormInputName">Name</label>
            <input ref="username" v-model="username" type="text" class="form-control" id="inlineFormInputName" placeholder="username" required>

            <label class="sr-only" for="inlineFormPassword">Name</label>
            <input ref="password" v-model="password" type="password" class="form-control" id="inlineFormPassword" placeholder="password" required>
        </section>

        <button
            @click="tryLogIn"
            type="submit" 
            class="btn btn-primary login-submit"
        >Go!
        </button>

        <button
        v-if="signup"
        @click="trySignUp"
        type="submit" 
        class="btn btn-primary login-submit signup-submit"
    >Sign Up!
    </button>
    </section>
    `,

    data() {
        return {
            username: '',
            password: '',
            signup: false
        }
    },

    methods: {
        trySignUp() {
            debugger;
        },

        tryLogIn() {
            // sanitize our inputs, make sure they're not empty etc
            // trim() will remove whitespace
            if (this.username.trim().length == 0) {
                console.log('username input is empty');
                this.$refs['username'].classList.add('field-error');
                return; // exit the login function
            }

            if (this.password.trim().length == 0) {
                console.log('password input is empty');
                this.$refs['password'].classList.add('field-error');
                return;
            }
            // end input validation 
            this.$refs['username'].classList.remove('field-error');
            this.$refs['password'].classList.remove('field-error');


            let userData = {
                username: this.username,
                password: this.password
            }

            fetch('/ums/login', {
                method: "POST",
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-type': 'application/json' 
                },
                body: JSON.stringify(userData)
            })
                .then(res => res.json())
                .then(data => {
                    console.log(data);
                    // check for no user and then present a sign up control of some kind
                    if (data.message == "no user") {
                        // turn the sign up button on in the template, set some kind of data to control its appearance in the UI
                        // or add a new route to post the user to the database -> sign up for Roku
                        this.signup = true;
                    }

                    // check for a broken password
                    // if it's broken, mark it and tell the user to try again
                    if (data.message == "wrong password") {
                        this.$refs['password'].classList.add('field-error');
                        // change the label / animate sth
                    }

                    // if theres a user in the data object, that means weve successfully logged in 
                    // the user has been validated on the server side, so were good to go
                    if (data.user) {
                        // let the app know this user is valid and can haz access to everything
                        this.$emit('setauthenticated');

                        // save the user in localstorage so they don't have to log in again
                        window.localStorage.setItem('user', JSON.stringify(data.user));

                        // send the user to the all users page
                        this.$router.push({name: 'allusers'});
                    }
                })
            .catch(error => console.error(error))
        }
    }
}