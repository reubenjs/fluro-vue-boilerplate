<template>
    <page center>
        <v-container style="min-width:320px;">
            <wrapper>
                <constrain xs v-if="!loading">
                    <div class="login-logo">
                        <div>
                            <h2>Forgotten Password</h2>
                            <p class="text-muted small">Enter your email to reset your password</p>
                        </div>
                    </div>
                    <form @submit.prevent="submit">
                        <v-text-field ref="email" v-model="email" :error-messages="emailErrors" label="Email Address" required @blur="$v.email.$touch()"></v-text-field>
                        <v-btn block large color="primary" :disabled="$v.$invalid" type="submit">Send Reset Link</v-btn>
                        <v-btn block @click="back()" large flat>Back</v-btn>
                    </form>
                </constrain>
                <constrain class="text-xs-center" xs v-if="loading">
                    <p class="lead">Processing...</p>
                    <v-progress-circular indeterminate></v-progress-circular>
                </constrain>
            </wrapper>
        </v-container>
    </page>
</template>
<script>
import _ from 'lodash';
import { validationMixin } from 'vuelidate';
import { required, maxLength, email } from 'vuelidate/lib/validators';

/////////////////////////////////////////////////////////

import SEOMixin from '@/mixins/SEOMixin';
import UserMixin from '@/mixins/UserMixin';
import { Layout } from 'fluro-vue-ui';

/////////////////////////////////////////////////////////

export default {
    mixins: [SEOMixin, UserMixin, Layout, validationMixin],
    validations: {
        email: { required, email },
    },

    mounted() {
        if (!this.email || !this.email.length) {
            return this.$refs.email.focus()
        }
    },
    data() {
        return {
            loading: false,
        }
    },
    methods: {
        back() {
            var self = this;
            if (window.history.length) {
                self.$router.go(-1)
            } else {
                //Go to the home page
                self.$router.push({ name: 'home' });
            }
        },
        submit() {
            var instance = this;
            var self = this;


            self.loading = true;

            //Check if there is an application
            var applicationContext = (this.application && this.application.authenticationStyle == 'application');



           
            if (applicationContext) {

                self.$fluro.auth.sendResetPasswordRequest({
                        username: self.email,
                        //This is the route that will receive the token
                        //for the user to reset their password
                        redirect: `/user/reset`,
                    }, {
                        bypassInterceptor: true,
                        application: applicationContext, //Reset from the application
                    })
                    .then(resetSuccess, resetFail);

            } else {

                 console.log('APPLICATION CONTEXT', applicationContext);

                self.$fluro.auth.sendResetPasswordRequest({
                        username: self.email,
                    }, {
                        bypassInterceptor: true,
                    })
                    .then(resetSuccess, resetFail);
            }




            //////////////////////////////////

            function resetSuccess(res) {

                var user = res.data;

                self.$fluro.notify(`Instructions have been sent to ${self.email}`, {
                    duration: 8000,
                    type: 'success',
                })

                self.back();

            }

            //////////////////////////////////

            function resetFail(err) {

                self.loading = false;
                var message = self.$fluro.utils.errorMessage(err);

                console.log('ERROR!', message, err);

                self.$fluro.notify(message, {
                    // icon:'check'
                    duration: 3500,
                    type: 'error',
                })
            }
        },
    },
    computed: {
        // ...mapState(['email']),
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
    },
}
</script>
<style>
</style>