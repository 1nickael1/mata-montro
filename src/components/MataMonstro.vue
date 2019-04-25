<template>
    <div id="app">
        <div class="panel scores">
            <div class="score">
                <h1>{{jogador}}</h1>
                <div class="life-bar">
                    <div class="life"
                        :class="{danger: playerLife < 20}"
                        :style="{width: playerLife + '%'}"></div>
                </div>
                <div>{{ playerLife }}% HP</div>
                <h1>
                level: {{ level }}
                </h1>
                <div class="life-bar">
                    <div class="life"
                        :style="{width: diferencaxp + '%'}"></div>
                </div>
                <div>{{ xp }}/{{ xpmax }} XP</div>

            </div>
            <div class="score">
                <h1>Monstro</h1>
                <div class="life-bar">
                    <div class="life"
                    :class="{danger: monsterLife < 20}"
                    :style="{width: monsterLife + '%'}"></div>
                </div>
                <div>{{ monsterLife }}% HP</div>
            </div>
        </div>
        <div v-if="hasResult" class="panel result">
            <div v-if="monsterLife == 0" class="win">Você ganhou! :)</div>
            <div v-else class="lose">Você perdeu! :(</div>
        </div>
        <div class="panel buttons">
            <template v-if="running">
                <button @click="attack(false)" class="btn attack">Ataque</button>
                <button @click="attack(true)" class="btn especial-attack">Ataque especial</button>
                <button @click="healAndHurt" class="btn heal">Curar</button>
                <button @click="running = false" class="btn give-up">Desistir</button>
            </template>
            <button v-else class="btn new-game"
            @click="startGame">Iniciar Jogo</button>
        </div>
        <div v-if="logs.length"
            class="panel logs">
                <ul>
                    <li v-for="log in logs"
                        :class="log.cls"
                        class="log">{{ log.text }}</li>
                </ul>
        </div>
    </div>

</template>

<script>
import firebase from 'firebase'
export default {
  name: 'MataMonstro',
  data() {
        return {
            dados: '',
            running: false,
            playerLife: 100,
            monsterLife: 100,
            logs: [],
            xp: 0,
            xpmaxanterior: 0,
            xpmax: 100,
            level:  0,
            diferencaxp: 0,
            jogador: 'Jogador',
        }
        
    },
    computed: {
        hasResult: function() {
            return this.playerLife == 0 || this.monsterLife == 0
        },
        darxp: function() {
        return this.monsterLife == 0
        }
    },
    methods: {
        startGame: function() {
            this.running = true
            this.playerLife = 100
            this.monsterLife = 100
            this.logs = []
            this.obter()
        },
        attack: function(especial) {
            this.hurt('monsterLife', 5, 10, especial, 'Jogador', 'Monstro', 'player')
            if(this.monsterLife > 0) {
                this.hurt('playerLife', 7, 12, false, 'Monstro', 'Jogador', 'monster')
            }
        },
        hurt: function(atr, min, max, especial, source, target, cls) {
            const plus = especial ? 5 : 0
            const hurt = this.getRandom(min + plus, max + plus)
            this[atr] = Math.max(this[atr] - hurt, 0)
            this.registerLog(`${source} atingiu ${target} com ${hurt}.`, cls)
        },
        healAndHurt: function() {
            this.heal(10, 15)
            this.hurt('playerLife', 7, 12, false, 'Monstro', 'Jogador', 'monster')
        },
        heal: function(min, max) {
            const heal = this.getRandom(min, max)
            this.playerLife = Math.min(this.playerLife + heal, 100)
            this.registerLog(`Jogador curou ${heal} de vida.`, 'cura')
        },
        getRandom: function(min, max) {
            const value = Math.random() * (max - min) + min
            return Math.round(value)
        },
        registerLog: function(text, cls) {
            this.logs.unshift({ text, cls })
        },
        verificalvl: function() {
          if (this.xp == this.xpmax) {
              this.diferenca()
              this.levelup()
              this.xp = 0
            } 
          if (this.xp > this.xpmax) {
              this.xp = (this.xp - this.xpmaxanterior)
              this.diferenca()
              this.levelup()
            }
        },
        levelup: function(){
          this.level++
          this.xpmax = Math.round(this.xpmax*1.3)
          this.verificalvl()
        },
        aumentaxp: function(val) {
          this.xp = this.xp + val
          this.xpmaxanterior = this.xpmax
          this.verificalvl()
          this.diferenca()
        },
        diferenca: function() {
          this.diferencaxp = (this.xp / this.xpmax) * 100
        },
        enviar: function(level, xp, xpmax) {
            this.id = firebase.auth().currentUser.uid
            const metodo = this.id ? 'patch' : 'post'
			this.$http[metodo](`/${this.id}.json`, {
            level: this.level,
            xp: this.xp,
            xpmax: this.xpmax,
            //nome: 'nick'

            })
        },
        obter: function() {
            this.id = firebase.auth().currentUser.uid
            this.$http.get(`/${this.id}.json`).then(res => {
                    this.dados = res.data,
                    this.level = this.dados.level,
                    this.xp = this.dados.xp,
                    this.xpmax = this.dados.xpmax
                    //this.jogador = this.dados.nome
                }
            )
        }


    },
    watch: {
        hasResult: function(value) {
            if (value) this.running = false
        },
        darxp: function(value) {
        if (value) {
            this.aumentaxp(Math.round(50+(this.level*1.5)))
            this.enviar()
            }
        }
    }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* Geral */

html {
    font-family: Arial, Helvetica, sans-serif;
}

#app {
    display: flex;
    flex-direction: column;
}

.panel {
    margin: 10px;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
}

/* Área dos pontos */

.scores {
    display: flex;
}

.score {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.score h1 {
    font-weight: 300;
    font-size: 1.6rem;
}

.life-bar {
    width: 80%;
    height: 20px;
    border: 1px solid #AAA;
}

.life-bar .life {
    display: flex;
    justify-content: center;
    height: 100%;
    /* width: 50%; */
    background-color: green;
}

.life-bar .life.danger {
    background-color: red;
}

/* Área do resultado */

.result {
    display: flex;
    justify-content: center;
    font-size: 1.3rem;
    font-weight: 600;
}

.result .win {
    color: green;
}

.result .lose {
    color: red;
}

/* Área dos botoes (controle) */

.buttons {
    display: flex;
    justify-content: center;
}

.btn {
    padding: 5px 10px;
    margin: 0px 10px;
    border-radius: 5px;
    text-transform: uppercase;
    font-size: 1.1rem;
}

.new-game {
    background-color: #4253af;
    color: #fff;
}

.attack {
    background-color: #e51c23;
    color: #fff;
}

.especial-attack {
    background-color: #ff9800;
    color: #000;
}

.heal {
    background-color: #259b24;
    color: #fff;
}

.give-up {
    background-color: #BBB;
    color: #000;
}

/* Área dos logs */

.logs ul {
    display: flex;
    flex-direction: column;
    list-style: none;
    padding: 0;
    margin: 0;
}

.logs ul li {
    display: flex;
    justify-content: center;
    margin: 4px 0px;
    padding: 3px 0px;
    font-weight: 600;
    font-size: 1.1rem;
    text-transform: uppercase;
    border-radius: 3px;
}

.player {
    background-color: #4253afaa;
    color: #fff;
}

.monster {
    background-color: #e51c23aa;
    color: #fff;
}

.cura {
    background-color: #259b24aa;
    color: #fff;
}

</style>
