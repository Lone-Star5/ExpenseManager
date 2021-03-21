let navItems = document.getElementsByClassName('nav-item')
navItems[0].addEventListener('click',()=>{
    window.location = '/';
})

navItems[1].addEventListener('click',()=>{
    window.location = '/settings';
})

Array.from(document.querySelectorAll('.edit')).forEach((data)=>{
    data.addEventListener('click',(e)=>{
        let par = e.target.parentNode.childNodes;
        // console.log(e.target.dataset.id)
        document.getElementById('edit-id').value = e.target.dataset.id;
        console.log(par[9].innerText)
        document.getElementById('edit-itemName').value = par[5].innerText;
        document.getElementById('edit-amount').value = par[7].innerText;
        
        console.log(par);
    })
    
})

Array.from(document.querySelectorAll('.delete-item')).forEach((data)=>{
    data.addEventListener('click',(e)=>{
        let ele = e.target;
        let id = ele.dataset.id 
        console.log(ele)
        console.log(id)
        let object = JSON.stringify({"id":id})
        console.log(object)
        fetch('/expense/delete', {
            method: 'POST',
            // mode: 'cors', // this cannot be 'no-cors'
            headers: {
                'Content-Type': 'application/json'
              },
            body: object,
        }).then( response => response.json()).then((data)=>{
            if(data.message=='success')
                location.reload();
        })
    })
    
})

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}