<template>
    <div class="sign-up">
        <p>Vamos criar uma nova conta !</p>
        <input type="text" v-model="email" placeholder="Email"><br>
        <input type="password" v-model="password" placeholder="Senha"><br>
        <button @click="signUp">Criar Conta</button>
        <span>ou voltar para o <router-link to="/login">login</router-link>.</span>
    </div>
</template>

<script>
import firebase from 'firebase'

export default {
    name: 'signUp',
    data() {
        return {
            email: '',
            password: ''
        }
    },
    methods: {
        signUp: function() {
            firebase.auth().createUserWithEmailAndPassword( this.email, this.password ).then(
                (user) => {
                    this.$router.replace('home')
                },
                (err) => {
                    alert('Oops. ' + err.message)
                }
            )
        }
    }
}
</script>

<style scoped>
    .signUp {
        margin-top: 40px;
    }
    input {
        margin-top: 10px;
        width: 20%;
        padding: 15px;
    }
    button {
        margin-top: 20px;
        width: 10%;
        cursor: pointer;
    }
    span {
        display: block;
        margin-top: 20px;
        font-size: 11px;
    }
</style>
