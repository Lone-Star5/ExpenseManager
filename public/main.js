let navItems = document.getElementsByClassName('nav-item')
navItems[0].addEventListener('click',()=>{
    window.location = '/';
})

navItems[1].addEventListener('click',()=>{
    window.location = '/settings';
})