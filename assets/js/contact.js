window.onload = function() {
const contactform = document.querySelector('.contact-form');


let name =  document.getElementById('name');
let sender = document.getElementById('sender');
let to = document.getElementById('to');
let message = document.getElementById('message');

contactform.addEventListener('submit', (e)=> {
    e.preventDefault();

    let formData = {
        name : name.value,
        sender : sender.value,
        to : to.value,
        message : message.value
    }

    let xhr = new XMLHttpRequest();
    xhr.open('POST','/send-email');
    xhr.setRequestHeader('content-type','application/json');
    xhr.onload = function(){
        console.log(xhr.responseText);
        if(xhr.responseText == 'success'){
            alert('E-mail envoyer au condidat !');
            name.value = '';
            sender.value = '';
            to.value = '';
            message.value = '';
        }else{
            alert('Désolé, un problème est survenu!! :/');
        }
    }
    xhr.send(JSON.stringify(formData));
})
}