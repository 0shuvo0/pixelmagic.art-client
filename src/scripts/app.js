import '../styles/global.scss'
import '../styles/app.scss'

const $ = (selector, parent = document) => parent.querySelector(selector)
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)]

const micWrapper = $(".mic-wrapper")
const micInfo = $(".mic-info", micWrapper)

// import Artyom from "artyom.js"
import SpeechRecognition from './utils/scpeech-recognition.js'

import './utils/img-upload.js'

import { getImageEdit, getUserCredits, getCreditPurchaseUrl } from './utils/bff.js'

import { auth, signIn } from './utils/firebase.js'

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
    editingImg.setAttribute('data-imgname', file.name)
    $(".app-section-img-upload").remove()
    $(".app-section").classList.remove('d-none')
    // initApp()
    setTimeout(initSpeechRecognition, 500)
})

function initSpeechRecognition(){
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
                if(final.split(' ').length < 2){
                    setTimeout(() => {
                        prompt.innerText = ''
                        speechRecognition.resume()
                    }, 300)
                    return
                }
    
                !micWrapper.classList.contains('disabled') && micWrapper.classList.add('disabled')
                micInfo.innerText = 'muted'
                
                generateEdit(final).finally(() => {
                    promptInput.innerText = ''
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


const loadingModal = $("#page-loading-modal")

async function generateEdit(prompt){
    if(!prompt){
        alert("No edit asked")
        return
    }

    const currentCredit = parseInt($('.count', userInfoContainer).innerText)
    if(!currentCredit || currentCredit <= 0){
        !(buyCreditsModal.classList.contains('d-none')) && buyCreditsModal.classList.remove('d-none');
        return
    }
    
    loadingModal.classList.remove("d-none")
    try{
    
        const img = editingImg.src
        if(!img){
            alert("No Image Found")
            return
        }
        const newimg = await getImageEdit(img, prompt ,editingImg.getAttribute('data-imgname'))
        if(newimg){
            editingImg.src = 'data:image/png;base64,' + newimg
            $('.count', userInfoContainer).innerText = currentCredit - 1
        }else{
            alert("Something went wrong")
        }
    
    }catch(err){
        alert(err.message || "Error getting edit")
        console.log(err)
    }
    loadingModal.classList.add("d-none")
}

const promptSendBtn = $(".prompt-input .send-icon")
promptSendBtn.addEventListener('click', async () => {
    const p = promptInput.value.trim()
    if(!p) return
    await generateEdit(p)
    promptInput.value = ''
    
})




$$('.modal-wrapper').forEach(m => {
    const closeBtns = $$(".modal-close-btn", m)
    closeBtns.forEach(c => {
        c.addEventListener('click', () => {
            m.classList.add('d-none')
        })
    })
})


const loginModal = $("#login-modal")
const loginBtn = $('.login-btn')
const userInfoContainer = $(".user-info")

const buyCreditsModal = $("#buy-credits-modal")
const buyCreditsBtn = $('.buy-credits-btn')
buyCreditsBtn.addEventListener('click', () => {
    buyCreditsModal.classList.remove('d-none')
})

auth.onAuthStateChanged(async user => {
    if(!user){
        loginModal.classList.remove('d-none')
        !userInfoContainer.classList.contains('d-none') && userInfoContainer.classList.add('d-none');
        return
    }

    !loginModal.classList.contains('d-none') && loginModal.classList.add('d-none');
    userInfoContainer.classList.remove('d-none')

    const creditCount = await getUserCredits()
    if(!creditCount) buyCreditsModal.classList.remove('d-none')
    $('.count', userInfoContainer).innerText = creditCount
})

loginBtn.addEventListener('click', async () => {
    loginBtn.classList.add('disabled')
    await signIn()
    loginBtn.classList.add('remove')
})




let selectedPackage = 'pro'
const creditPacks = $$(".credit-packs-container .credit-pack")
const buyNowBtn = $("#buy-credit-btn")

const packSelectSounds = {
    trial: new Audio('/audio/pack_select_trial.mp3'),
    standard: new Audio('/audio/pack_select_standard.mp3'),
    pro: new Audio('/audio/pack_select_pro.mp3')
}

creditPacks.forEach(pack => {
    pack.addEventListener('click', () => {
        creditPacks.forEach(pack => pack.classList.remove('active'))
        pack.classList.add('active')
        selectedPackage = pack.getAttribute('data-name')
        packSelectSounds[selectedPackage].play()
    })
})

buyNowBtn.addEventListener('click', async () => {
    buyNowBtn.innerHTML = 'Processing ...'
    buyNowBtn.classList.add('disabled')

    try{
        const url = await getCreditPurchaseUrl(selectedPackage)
        if(url){
            window.location.href = url
        }else{
            alert('Something went wrong')
        }
    }catch(err){
        alert('Something went wrong')
        console.log(err)
    }

    buyNowBtn.innerHTML = `<span>Buy Now</span>
            <svg fill="#000000" height="20px" width="20px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
              viewBox="0 0 330 330" xml:space="preserve">
              <path id="XMLID_27_" d="M15,180h263.787l-49.394,49.394c-5.858,5.857-5.858,15.355,0,21.213C232.322,253.535,236.161,255,240,255
                s7.678-1.465,10.606-4.394l75-75c5.858-5.857,5.858-15.355,0-21.213l-75-75c-5.857-5.857-15.355-5.857-21.213,0
                c-5.858,5.857-5.858,15.355,0,21.213L278.787,150H15c-8.284,0-15,6.716-15,15S6.716,180,15,180z" fill="#fff" />
            </svg>`
    buyNowBtn.classList.remove('disabled')
})