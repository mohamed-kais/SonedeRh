window.onload = function() {
const condidatureform = document.querySelector('.candidature-form');
let nep =  document.getElementById('nep');
let cin =  document.getElementById('cin');
let mail =   document.getElementById('mail');



condidatureform.addEventListener('submit', (e)=> {
    e.preventDefault();

    let formData = {
        nep : nep.value,
        cin : cin.value,
        mail : mail.value
    }
  

    let xhr = new XMLHttpRequest();
    xhr.open('POST','/post');
    xhr.setRequestHeader('content-type','application/json');
    xhr.onload = function(){
        console.log(xhr.responseText);
        if(xhr.responseText == 'success'){
            alert('E-mail de refus envoyer au condidat !');
            nep.value = '';
            cin.value = '';
            mail.value = '';
        }else{
            alert('Désolé, un problème est survenu lors de l\'envoi!! :/');
        }
    }
    xhr.send(JSON.stringify(formData));
})
}