let navItems = document.getElementsByClassName('nav-item')
navItems[0].addEventListener('click',()=>{
    window.location = '/';
})

navItems[1].addEventListener('click',()=>{
    window.location = '/settings';
})
navItems[3].addEventListener('click',()=>{
    window.location='/register';
})
navItems[4].addEventListener('click',()=>{
    window.location='/login';
})
navItems[5].addEventListener('click',()=>{
    window.location='/logout';
})

Array.from(document.querySelectorAll('.edit')).forEach((data)=>{
    data.addEventListener('click',(e)=>{
        let par = e.target.parentNode.parentNode.parentNode.parentNode.childNodes;
        console.log(par)
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

