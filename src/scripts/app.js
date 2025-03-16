import '../styles/global.scss'
import '../styles/app.scss'

const $ = (selector, parent = document) => parent.querySelector(selector)
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)]

const micWrapper = $(".mic-wrapper")
const micInfo = $(".mic-info", micWrapper)

// import Artyom from "artyom.js"
import SpeechRecognition from './utils/scpeech-recognition.js'

import './utils/img-upload.js'

const mic_on_sound = new Audio('/audio/mic-on.wav')
const mic_error_sound = new Audio('/audio/mic-error.mp3')
const no_browser_support_sound = new Audio('/audio/mic-error.mp3')

const promptInput = $("#prompt-input")


const selectImgBtn = $("#select-image-btn")
const editingImg = $("#editing-img")

selectImgBtn.addEventListener('click', () => {
    const img = $("#user-selected-photo").src
    const file = $(".user-selected-photo-input").files[0]
    
    if(!img || !file) return alert("Please select an image to edit")


    editingImg.src = img
    $(".app-section-img-upload").remove()
    $(".app-section").classList.remove('d-none')
    // initApp()
    setTimeout(initApp, 500)
})

function initApp(){
    const speechRecognition = new SpeechRecognition()

    try{
        if(!speechRecognition.isSupported()){
            no_browser_support_sound.play()
            micWrapper.remove()
            speechRecognition.destroy()
            return
        }
    
        speechRecognition.start({
            onStart: () => {
                    micWrapper.classList.remove('disabled')
                    micInfo.innerText = 'Listening ...'
                    mic_on_sound.play()
            },
            onResult: res => {
                promptInput.value = res
            },
            onStop: (final) => {
                speechRecognition.pause()
    
                !micWrapper.classList.contains('disabled') && micWrapper.classList.add('disabled')
                micInfo.innerText = 'muted'
                promptInput.innerText = ''
                generateEdit(final).finally(() => {
                    speechRecognition.resume()
                })
            }
        })
    }catch(err){
        micWrapper.remove()
        speechRecognition.destroy()
        mic_error_sound.play()
    }

}

function generateEdit(prompt){
    console.log('prompt:', prompt)
    return new Promise((resolve, reject) => {
        setTimeout(resolve, 1500)
    })
}