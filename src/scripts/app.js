import '../styles/global.scss'
import '../styles/app.scss'

const $ = (selector, parent = document) => parent.querySelector(selector)
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)]

const micWrapper = $(".mic-wrapper")
const micInfo = $(".mic-info", micWrapper)

import Artyom from "artyom.js"

const mic_on_sound = new Audio('/audio/mic-on.wav')
const mic_error_sound = new Audio('/audio/mic-error.mp3')
const no_browser_support_sound = new Audio('/audio/mic-error.mp3')

const promptInput = $("#prompt-input")

document.addEventListener('click', () => {
    const artyom = new Artyom()

    if(!artyom.recognizingSupported()){
        no_browser_support_sound.play()
        micWrapper.remove()
        artyom.fatality()
        return
    }

    const UserDictation = artyom.newDictation({
        continuous: true, // Enable continuous if HTTPS connection
        onResult:function(text){
            promptInput.value = text
        },
        onStart:function(){
            console.log("Dictation started by the user")
        },
        onEnd:function(){
            !micWrapper.classList.contains('disabled') && micWrapper.classList.add('disabled')
            micInfo.innerText = 'muted'
        }
    })
    
    UserDictation.start();

    try{
        micWrapper.classList.remove('disabled')
        micInfo.innerText = 'Listening ...'
        mic_on_sound.play()
    }catch(err){
        mic_error_sound.play()
        micWrapper.remove()
        artyom.fatality()
    }

    console.log('clicked')
})