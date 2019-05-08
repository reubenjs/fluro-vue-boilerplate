<template>
    <v-container>
        <wrapper>
            <constrain class="text-xs-center" xs v-if="loading">
                <p class="lead">Processing...</p>
                <v-progress-circular indeterminate></v-progress-circular>
            </constrain>
            <constrain sm v-if="!loading">
                <h1>Update your details</h1>
                <p>Hi {{details.firstName}}, you can update your password and details below</p>
                <!-- FORMSLY -->
                <form @submit.prevent="submit" >
                    
                    <v-layout row wrap>
                        <v-flex pr-4 d-flex align-center xs12 sm6>
                            <v-text-field outline v-model="firstName" :error-messages="firstNameErrors" required label="First Name" @blur="$v.firstName.$touch()"></v-text-field>
                        </v-flex>
                        <v-flex d-flex align-center xs12 sm6>
                            <v-text-field outline v-model="lastName" :error-messages="lastNameErrors" required label="Last Name" @blur="$v.lastName.$touch()"></v-text-field>
                        </v-flex>
                    </v-layout>
                    <!-- <v-text-field outline v-model="email" :error-messages="emailErrors" label="Email Address" required @blur="$v.email.$touch()"></v-text-field> -->
                    <v-text-field outline type="password" v-model="password" :error-messages="passwordErrors" label="Set a new password" required @input="$v.password.$touch()" @blur="$v.password.$touch()"></v-text-field>
                    <v-text-field outline type="password" v-model="confirmPassword" :error-messages="confirmErrors" label="Confirm your new password" required @input="$v.confirmPassword.$touch()" @blur="$v.confirmPassword.$touch()"></v-text-field>
                    <v-layout row wrap>
                        <v-flex d-flex align-center xs12 sm5>
                           <v-btn block large color="primary" :disabled="$v.$invalid" type="submit">Save changes</v-btn>
                        </v-flex>
                    </v-layout>
                
                </form>
            </constrain>
        </wrapper>
    </v-container>
</template>
<script>
import _ from 'lodash';
import SEOMixin from '@/mixins/SEOMixin';
import UserMixin from '@/mixins/UserMixin';

import { validationMixin } from 'vuelidate';
import { required, minLength, maxLength, email } from 'vuelidate/lib/validators';
import { Layout } from 'fluro-vue';

/////////////////////////////////////////

export default {
    props: ['token'],
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
    mixins: [SEOMixin, validationMixin, UserMixin, Layout],
    data() {
        return {
            details: null,
            loading: true,
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
        }
    },
    created() {
        //When we first get to this page
        //we want to send the token to the server
        //so we can update the user's details
        var self = this;

        // console.log('Checking Token now!', self.token);

        //Check if there is an application
        var applicationContext = (this.application && this.application.authenticationStyle == 'application');



        self.$fluro.auth.retrieveUserFromResetToken(self.token, {
                application: applicationContext,
            })
            .then(function(userDetails) {
                self.details = userDetails;

                //Update our state with the details
                self.firstName = userDetails.firstName;
                self.lastName = userDetails.lastName;
                self.email = userDetails.username || userDetails.email;
                self.lastName = userDetails.lastName;

                //We can stop loading now
                self.loading = false;
            })
            .catch(function(err) {

                //There was a fail
                var message = self.$fluro.utils.errorMessage(err)

                self.$toasted.show(message, {
                    duration: 5500,
                    type: 'error',
                })

                //Take them to the home page
                self.$router.replace({ name: 'home' });
            });
    },
    computed: {
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
                errors.push('Please type your first name')
            }
            return errors;

        },
        lastNameErrors() {

            const errors = []

            if (!this.$v.lastName.$dirty) {
                return errors;
            }

            if (!this.$v.lastName.required) {
                errors.push('Please type your last name')
            }
            return errors;

        },
    },
    methods: {
        submit() {
            var self = this;
            self.loading = true;


            var payload = {
                username: self.email,
                firstName: self.firstName,
                lastName: self.lastName,
                password: self.password,
                confirmPassword: self.confirmPassword,
            }

            /////////////////////////////////

            //Check if there is an application
            var applicationContext = (this.application && this.application.authenticationStyle == 'application');


            //Use the token to update the users details and login in as them
            self.$fluro.auth.updateUserWithToken(self.token, payload, { application: applicationContext }).then(function(user) {

                    //Hi there user.firstName!
                    console.log('Were good!');
                    self.loading = false;

                    self.$toasted.show(`Changes saved!`, {
                        duration: 3500,
                        type: 'success',
                    })

                    //Go to the home page
                    self.$router.replace({
                        name: 'home'
                    })

                })
                .catch(function(err) {

                    //There was a fail
                    var message = self.$fluro.utils.errorMessage(err)

                    self.$toasted.show(message, {
                        duration: 3500,
                        type: 'error',
                    })

                    console.log('Error', message, err);
                    self.loading = false;
                });

        },
    },

}
</script>
<style>
</style>