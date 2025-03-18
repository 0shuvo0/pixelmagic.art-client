import '../styles/global.scss'
import '../styles/index.scss'

const faqItems = document.querySelectorAll(".faq-item")
faqItems.forEach(item => {
    item.querySelector('.faq-nav').addEventListener('click', () => item.classList.toggle('active'))
})

const examples = [
    {
        before: '/images/examples/1-before.png',
        after: '/images/examples/1-after.png',
        prompt: 'Change the background to sunflower field'
    },
    {
        before: '/images/examples/2-before.png',
        after: '/images/examples/2-after.png',
        prompt: 'add a partially vicible coconut tree on the left side'
    },
    {
        before: '/images/examples/3-before.png',
        after: '/images/examples/3-after.png',
        prompt: 'Remove the lights and wires'
    },
    {
        before: '/images/examples/4-before.png',
        after: '/images/examples/4-after.png',
        prompt: 'Give him a birthday hat'
    },
    {
        before: '/images/examples/5-before.png',
        after: '/images/examples/5-after.png',
        prompt: 'Change the background to a snowy place'
    },
    {
        before: '/images/examples/6-before.png',
        after: '/images/examples/6-after.png',
        prompt: 'Replcae sunflowers with a lavender field'
    },
    {
        before: '/images/examples/7-before.png',
        after: '/images/examples/7-after.png',
        prompt: 'Remove the glass in front'
    },
    {
        before: '/images/examples/8-before.png',
        after: '/images/examples/8-after.png',
        prompt: 'Make me pop more'
    }
]

const examplesGrid = document.querySelector(".examples-grid")
window.addEventListener('load', () => {
    examplesGrid.innerHTML = examples.map(item => `
        <div class="example-item">
            <div class="example-img">
            <img loading="lazy" src="${item.before}" alt="" class="img">
            <img loading="lazy" src="${item.after}" alt="" class="img after-img">
            </div>
            <div class="example-prompt">
            <svg width="16px" viewBox="0 0 55 74" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M27.5 55.0833C32.296 55.0833 36.8956 53.1781 40.2868 49.7868C43.6781 46.3955 45.5833 41.7959 45.5833 36.9999V18.9166C45.5833 14.1206 43.6781 9.52102 40.2868 6.12974C36.8956 2.73845 32.296 0.833252 27.5 0.833252C22.704 0.833252 18.1044 2.73845 14.7131 6.12974C11.3219 9.52102 9.41666 14.1206 9.41666 18.9166V36.9999C9.41666 41.7959 11.3219 46.3955 14.7131 49.7868C18.1044 53.1781 22.704 55.0833 27.5 55.0833ZM15.4444 18.9166C15.4444 15.7193 16.7146 12.6529 18.9754 10.392C21.2363 8.13117 24.3027 6.86103 27.5 6.86103C30.6973 6.86103 33.7637 8.13117 36.0246 10.392C38.2854 12.6529 39.5555 15.7193 39.5555 18.9166V36.9999C39.5555 40.1973 38.2854 43.2636 36.0246 45.5245C33.7637 47.7853 30.6973 49.0555 27.5 49.0555C24.3027 49.0555 21.2363 47.7853 18.9754 45.5245C16.7146 43.2636 15.4444 40.1973 15.4444 36.9999V18.9166Z" fill="#000"/>
                <path d="M54.625 37C54.625 36.2006 54.3075 35.434 53.7423 34.8688C53.177 34.3036 52.4104 33.9861 51.6111 33.9861C50.8118 33.9861 50.0452 34.3036 49.48 34.8688C48.9148 35.434 48.5972 36.2006 48.5972 37C48.5972 42.5953 46.3745 47.9615 42.418 51.918C38.4615 55.8745 33.0953 58.0972 27.5 58.0972C21.9047 58.0972 16.5385 55.8745 12.582 51.918C8.62551 47.9615 6.40278 42.5953 6.40278 37C6.40278 36.2006 6.08524 35.434 5.52003 34.8688C4.95482 34.3036 4.18822 33.9861 3.38889 33.9861C2.58956 33.9861 1.82296 34.3036 1.25775 34.8688C0.692534 35.434 0.375 36.2006 0.375 37C0.378166 43.6699 2.83872 50.1048 7.28651 55.0752C11.7343 60.0456 17.8575 63.203 24.4861 63.9441V67.1389H21.4722C20.6729 67.1389 19.9063 67.4564 19.3411 68.0216C18.7759 68.5868 18.4583 69.3534 18.4583 70.1528C18.4583 70.9521 18.7759 71.7187 19.3411 72.2839C19.9063 72.8491 20.6729 73.1666 21.4722 73.1666H33.5278C34.3271 73.1666 35.0937 72.8491 35.6589 72.2839C36.2241 71.7187 36.5417 70.9521 36.5417 70.1528C36.5417 69.3534 36.2241 68.5868 35.6589 68.0216C35.0937 67.4564 34.3271 67.1389 33.5278 67.1389H30.5139V63.9441C37.1425 63.203 43.2657 60.0456 47.7135 55.0752C52.1613 50.1048 54.6218 43.6699 54.625 37Z" fill="#000"/>
            </svg>
            <span class="text">${item.prompt}</span>
            </div>
        </div>
    `).join("")
})

