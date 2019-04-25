<template>
    <wrapper>
        <constrain xs>
            <div class="login-logo">
                <div>
                    <h2>Sign In</h2>
                    <!-- <p class="text-muted small">Please log in to continue</p> -->
                </div>
            </div>

            <form @submit.prevent="submit">
                <v-text-field ref="email" v-model="email" :error-messages="emailErrors" label="Email Address" required @blur="$v.email.$touch()"></v-text-field>
                <v-text-field ref="password" v-model="password" :error-messages="passwordErrors" label="Password" required @input="$v.password.$touch()" @blur="$v.password.$touch()" :type="showPassword ? 'text' : 'password'" :append-icon="showPassword ? 'visibility' : 'visibility_off'" @click:append="showPassword = !showPassword"></v-text-field>
                <!--  -->
                <v-btn block large :disabled="$v.$invalid" color="primary" type="submit">Sign In</v-btn>
                <v-btn block :to="{name:'user.signup'}" large color="light">Create New Account</v-btn>
                <v-btn block :to="{name:'user.forgot'}" large flat>Forgot Password?</v-btn>
            </form>
        </constrain>
    </wrapper>
</template>
<script>
import _ from 'lodash';

import SEOMixin from '@/mixins/SEOMixin';
import UserMixin from '@/mixins/UserMixin';
import { validationMixin } from 'vuelidate';
import { required, maxLength, email } from 'vuelidate/lib/validators';
import {Layout} from 'fluro-vue';



export default {
    mixins: [SEOMixin, UserMixin, Layout, validationMixin],
    validations: {
        email: { required, email },
        password: { required },
    },
    data() {
        return {
            password: '',
            showPassword: false,
        }
    },
    mounted() {

        //If they haven't typed an email in
        if(!this.email || !this.email.length) {
           this.$refs.email.focus()
        } else {
           this.$refs.password.focus()
        }
    },
    methods: {
        submit() {
            var instance = this;
            var self = this;

            //Check if there is an application
            var applicationContext = (this.application && this.application.authenticationStyle == 'application');


            this.$fluro.auth.login({
                    username: self.email,
                    password: self.password,
                }, {
                    bypassInterceptor: true,
                    application: applicationContext, //Sign in to the application rather than Fluro
                })
                .then(loginSuccess, loginFail);

            //////////////////////////////////

            function loginSuccess(res) {

                var user = res.data;
                console.log('Login success', user);
                // instance.$store.commit('user', res.data);

                self.$toasted.show(`Welcome back ${user.firstName}!`, {
                    // icon:'check'
                    duration: 3500,
                    type: 'success',
                })


                if (window.history.length) {
                    self.$router.go(-1)
                } else {
                    //Go to the home page
                    self.$router.push({ name: 'home' });
                }
            }

            //////////////////////////////////

            function loginFail(err) {


                var message = self.$fluro.utils.errorMessage(err);

                console.log('ERROR!', message, err);

                self.$toasted.show(message, {
                    // icon:'check'
                    duration: 3500,
                    type: 'error',
                })



                // instance.$store.dispatch('logout');
            }


        },
    },
    computed: {
        email: {
            set(email) {
                this.$store.commit('email', email);
            },
            get(email) {
                return this.$store.getters.email;
            }
        },
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
    },
}
</script>
<style>
</style>