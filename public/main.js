let navItems = document.getElementsByClassName('nav-item')
navItems[0].addEventListener('click',()=>{
    window.location = '/';
})

navItems[1].addEventListener('click',()=>{
    window.location = '/settings';
})

console.log(Array.from(document.getElementsByClassName('edit')))
Array.from(document.querySelectorAll('.edit')).forEach((data)=>{
    data.addEventListener('click',(e)=>{
        let newdata = '<%- JSON.stringify(data) %>' ;
        let par = e.target.parentNode.childNodes;
        // console.log(e.target.dataset.id)
        document.getElementById('edit-id').value = e.target.dataset.id;
        console.log(par[9].innerText)
        document.getElementById('edit-itemName').value = par[5].innerText;
        document.getElementById('edit-amount').value = par[7].innerText;
        
        console.log(par);
})
    
})