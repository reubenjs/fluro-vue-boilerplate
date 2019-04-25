<template>
    <wrapper>
        <constrain sm>
            <div class="login-logo">
                <div>
                    <!-- <h2 v-if="application">{{application.title}}</h2> -->
                    <h2>Sign Up</h2>
                    <p class="text-muted small">Create your new account to get started</p>
                </div>
            </div>
            <form @submit.prevent="submit">
                <!--  <v-container fluid grid-list-lg> -->
                <v-layout row wrap>
                    <v-flex pr-4 d-flex align-center xs12 sm6>
                        <v-text-field ref="firstName" v-model="firstName" :error-messages="firstNameErrors" required label="First Name" @blur="$v.firstName.$touch()"></v-text-field>
                    </v-flex>
                    <v-flex d-flex align-center xs12 sm6>
                        <v-text-field ref="lastName" v-model="lastName" :error-messages="lastNameErrors" required label="Last Name" @blur="$v.lastName.$touch()"></v-text-field>
                    </v-flex>
                </v-layout>
                <v-text-field ref="email" v-model="email" :error-messages="emailErrors" label="Email Address" required @blur="$v.email.$touch()"></v-text-field>
                <v-text-field ref="password" type="password" v-model="password" :error-messages="passwordErrors" label="Create a Password" required @input="$v.password.$touch()" @blur="$v.password.$touch()"></v-text-field>
                <v-text-field type="password" v-model="confirmPassword" :error-messages="confirmErrors" label="Confirm your password" required @input="$v.confirmPassword.$touch()" @blur="$v.confirmPassword.$touch()"></v-text-field>
                <v-layout row wrap>
                    <v-flex d-flex align-center xs12 sm5>
                        <v-btn block large color="primary" type="submit">Continue</v-btn>
                    </v-flex>
                    <v-flex d-flex offset-sm1 align-center xs12 sm6>
                        <v-btn block :to="{name:'user.login'}" large flat>Already have an account?</v-btn>
                    </v-flex>
                </v-layout>
                <!-- </v-container> -->
            </form>
        </constrain>
    </wrapper>
</template>
<script>
import _ from 'lodash';
import SEOMixin from '@/mixins/SEOMixin';
import UserMixin from '@/mixins/UserMixin';

import { validationMixin } from 'vuelidate';
import { required, minLength, maxLength, email } from 'vuelidate/lib/validators';
import { Layout } from 'fluro-vue';



export default {
    mixins: [SEOMixin, validationMixin, UserMixin, Layout],
    validations: {
        firstName: { required, minLength: minLength(3) },
        lastName: { required, minLength: minLength(4) },
        email: { required, email },
        password: { required, minLength: minLength(6) },
        confirmPassword: {
            required,
            minLength: minLength(6),
            isMatch() {
                return this.$v.password.$model == this.$v.confirmPassword.$model
            }
        },
    },
    mounted() {

        if(!this.firstName || !this.firstName.length) {
           return this.$refs.firstName.focus()
        }

        if(!this.lastName || !this.lastName.length) {
           return this.$refs.lastName.focus()
        }

        if(!this.email || !this.email.length) {
           return this.$refs.email.focus()
        }

        if(!this.password || !this.password.length) {
           return this.$refs.password.focus()
        }
    },
    data() {
        return {
            password: '',
            confirmPassword: '',
            firstName: '',
            lastName: '',
            showPassword: false,
        }
    },
    methods: {
        submit() {
            var instance = this;
            var self = this;


            //Check if there is an application
            var applicationContext = (this.application && this.application.authenticationStyle == 'application');


            
            console.log('Sign up to application')
            this.$fluro.auth.signup({
                    username: self.email,
                    firstName: self.firstName,
                    lastName: self.lastName,
                    password: self.password,
                    confirmPassword: self.confirmPassword,
                }, {
                    bypassInterceptor: true,
                    application: applicationContext, //Sign up to the application rather than Fluro itself
                })
                .then(signupSuccess, signupFail);

            //////////////////////////////////

            function signupSuccess(res) {

                var user = res.data;
                console.log('Signup success', user);
                // instance.$store.commit('user', res.data);

                self.$toasted.show(`Welcome ${user.firstName}!`, {
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

            function signupFail(err) {


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
        confirmErrors() {

            const errors = []

            if (!this.$v.confirmPassword.$dirty) {
                return errors;
            }

            if (!this.$v.confirmPassword.required) {
                errors.push('Please confirm your password')
            }

            if (!this.$v.confirmPassword.isMatch) {
                errors.push('Your passwords do not match')
            }
            return errors;

        },
        firstNameErrors() {

            const errors = []

            if (!this.$v.firstName.$dirty) {
                return errors;
            }

            if (!this.$v.firstName.required) {
                errors.push('Please type your firstName')
            }
            return errors;

        },
        lastNameErrors() {

            const errors = []

            if (!this.$v.lastName.$dirty) {
                return errors;
            }

            if (!this.$v.lastName.required) {
                errors.push('Please type your lastName')
            }
            return errors;

        },
    },
}
</script>
<style>
</style>