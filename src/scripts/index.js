import '../styles/global.scss'

const faqItems = document.querySelectorAll(".faq-item")
faqItems.forEach(item => {
    item.querySelector('.faq-nav').addEventListener('click', () => item.classList.toggle('active'))
})
