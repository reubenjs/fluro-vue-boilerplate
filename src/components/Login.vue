<template>
    <v-container bg fill-height grid-list-md text-xs-center>
        <v-layout row wrap align-center>
            <v-flex>
                <div class="login-box">
                    <div class="login-logo">
                        <div>
                    <h2 v-if="application">{{application.title}}</h2>
                    <p class="text-muted small">Please sign in to continue</p>
                </div>
                </div>

                    <form @submit.prevent="submit">
                        <v-text-field v-model="email" :error-messages="emailErrors" label="Email Address" required @blur="$v.email.$touch()"></v-text-field>
                        <v-text-field v-model="password" :error-messages="passwordErrors" label="Password" required @input="$v.password.$touch()" @blur="$v.password.$touch()" :type="showPassword ? 'text' : 'password'" :append-icon="showPassword ? 'visibility' : 'visibility_off'" @click:append="showPassword = !showPassword"></v-text-field>
                        <v-btn block :disabled="$v.$invalid" large color="primary" type="submit">Submit</v-btn>
                    </form>
                   
                    <!-- <h3>Please Login to Continue</h3>
                    <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="submit">
                        <v-text-field v-model="credentials.username" :rules="emailRules" label="Email Address / Username" required></v-text-field>
                        <v-text-field :append-icon="showPassword ? 'visibility' : 'visibility_off'" :rules="[passwordRules.required, passwordRules.min]" :type="showPassword ? 'text' : 'password'" label="Password" v-model="credentials.password" class="input-group--focused" @click:append="showPassword = !showPassword"></v-text-field>
                        <v-btn :disabled="!valid" block color="primary" @click="submit">
                            Sign In
                        </v-btn>
                    </v-form>
                -->
                </div>
            </v-flex>
        </v-layout>
    </v-container>
</template>
<script>
import { mapActions, mapState, mapGetters, mapMutations } from 'vuex';
import { validationMixin } from 'vuelidate';
import { required, maxLength, email } from 'vuelidate/lib/validators';


export default {
    props: ['callback'],
    mixins: [validationMixin],
    validations: {
        email: { required, email },
        password: { required },
    },
    data() {
        return {
            // email: '',
            password: '',
            showPassword: false,
        }
    },
    computed: {
        // ...mapState(['email']),
        email:{
            set(email) {
                this.$store.commit('email', email);
            },
            get(email) {
                return this.$store.state.session.email;
            }
        },
        ...mapGetters(['application']),
        emailErrors() {

            const errors = []

            if (!this.$v.email.$dirty) {
                return errors;
            }

            if (!this.$v.email.email) {
                errors.push('Must be valid email address')
            }

            if (!this.$v.email.required) {
                errors.push('Email is required')
            }

            return errors;

        },
        passwordErrors() {

            const errors = []

            if (!this.$v.password.$dirty) {
                return errors;
            }

            if (!this.$v.password.required) {
                errors.push('Please type your password')
            }
            return errors;

        },
        // checkboxErrors() {
        //     const errors = []
        //     if (!this.$v.checkbox.$dirty) return errors!this.$v.checkbox.checked && errors.push('You must agree to continue!')
        //     return errors
        // },
        // selectErrors() {
        //     const errors = []
        //     if (!this.$v.select.$dirty) return errors!this.$v.select.required && errors.push('Item is required')
        //     return errors
        // },


    },
    // created() {
    // this.$toasted.show(`Hi  there!`, {
    //             // icon:'check'
    //             duration: 1500000,
    //             type: 'success',
    //         })
    // },
    methods: {

        submit() {
            var instance = this;
            var self = this;


            this.$fluro.auth.login({
                    username: self.email,
                    password: self.password,
                }, {
                    bypassInterceptor: true,
                })
                .then(loginSuccess, loginFail);

            //////////////////////////////////

            function loginSuccess(res) {
                console.log('Login success', res.data);
                var user = res.data;
                // instance.$store.commit('user', res.data);

                self.$toasted.show(`Hi ${user.firstName}!`, {
                    // icon:'check'
                    duration: 1500,
                    type: 'success',
                })
            }

            //////////////////////////////////

            function loginFail(err) {


                var message = self.$fluro.utils.errorMessage(err);

                console.log('ERROR!', message, err);

                self.$toasted.show(message, {
                    // icon:'check'
                    duration: 2500,
                    type: 'error',
                })



                // instance.$store.dispatch('logout');
            }


        }
    }
}
</script>
<style scoped lang="scss">

.bg {
    background: #fafafa;
}
.login-box {


    .login-logo {
        // padding-bottom: 100%;
        min-height: 200px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    max-width: 400px;
    // padding: 50px;
    margin: auto;
    // box-shadow: 0 10px 10px rgba(#000, 0.1);
}
</style>