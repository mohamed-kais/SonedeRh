



$("#maj_offre").submit(function(event){
    event.preventDefault();

    var unindexed_array = $(this).serializeArray();
    var data = {}

    $.map(unindexed_array, function(n, i){
        data[n['name']] = n['value']
    })
 console.log(unindexed_array);

    var request = {
        "url" : `http://localhost:3000/api/offres/${data.id}`,
        "method" : "PUT",
        "data" : data
    }

    $.ajax(request).done(function(response){
        alert("Data Updated Successfully!");
    })

})




if(window.location.pathname == "/index"){
    $ondelete = $(".table tbody td a.delete");
    $ondelete.click(function(){
        var id = $(this).attr("data-id")

        var request = {
            "url" : `http://localhost:3000/api/offres/${id}`,
            "method" : "DELETE"
        }

        if(confirm("Do you really want to delete this record?")){
            $.ajax(request).done(function(response){
                alert("Data Deleted Successfully!");
                location.reload();
            })
        }

    })
}
    


if(window.location.pathname == "/index"){

    const form = document.getElementById('indexform');
    const mydd = document.getElementById('dd');
    const mydf = document.getElementById('df');
    var n1 = mydd.toString();
    var n2 = mydf.toString();
    $(form).ready(function() {
        
        if(mydd){
            if (mydd.text().length > 10)
                    mydd.text(mydd.text().substr(0,10))
        }
    });

}



if(window.location.pathname == "/postulations"){
    $ondelete = $(".table tbody td a.delete");
    $ondelete.click(function(){
        var id = $(this).attr("data-id")

        var request = {
            "url" : `http://localhost:3000/api/postulations/${id}`,
            "method" : "DELETE"
        }

        if(confirm("Do you really want to delete this record?")){
            $.ajax(request).done(function(response){
                alert("Data Deleted Successfully!");
                document.getElementById("popup-2").classList.toggle("active");
                location.reload();
            })
        }
        

    })
}
if(window.location.pathname == "/afficher_users"){
    $ondelete = $(".table tbody td a.delete");
    $ondelete.click(function(){
        var id = $(this).attr("data-id")

        var request = {
            "url" : `http://localhost:3000/api/afficher_users/${id}`,
            "method" : "DELETE"
        }

        if(confirm("Do you really want to delete this user?")){
            $.ajax(request).done(function(response){
                alert("User Deleted Successfully!");
               
                location.reload();
            })
        }
        

    })
}



$(".table tbody td a.popme").click(function(event){
    event.preventDefault();

    var unindexed_array = $(this).serializeArray();
    var data = {}

    $.map(unindexed_array, function(n, i){
        data[n['postulations']] = n['postulations']
    })
    
    var request = {
        "url" : `http://localhost:3000/api/postulations/${data.id}`,
        "method" : "GET",
        "data" : data,
        "dataType" : JSON
    }

    $.ajax(request).done(function(response){
        alert("Data Updated Successfully!");
    })

    //if(window.location.pathname == "/postulations/:id"){
       // $onpop = $(".table tbody td a.popme");
        //$onpop.click(function(){
          // var id = $(this).attr("data-id")
    
            document.getElementById("popup-1").classList.toggle("active");
    
        //})
    //}

})


const form = document.getElementById('Ajouter_offre');
    const mytitre = document.getElementById('titre');
    const mydd = document.getElementById('dd');
    const mydf = document.getElementById('df');
    const myrecruteur = document.getElementById('recruteur');
    const mylieu = document.getElementById('lieu');
    
    function checkInputs() {
        var x = 0;
        // trim to remove the whitespaces
        const mytitreValue = mytitre.value.trim();
        const myddValue = mydd.value.trim();
        const mydfValue = mydf.value.trim();
        const myrecruteurValue = myrecruteur.value.trim();
        const mylieuValue = mylieu.value.trim();
        
        if(mytitreValue === '') {
            setErrorFor(mytitre, 'Le champ du titre ne peux pas être vide.');
        } else {
            setSuccessFor(mytitre);
x=x+100;
        }
        
        if(myddValue === '' ) {
            setErrorFor(mydd, 'Le champ de la date de debut ne peux pas être vide.');
        } else {
            setSuccessFor(mydd);
x=x+100;            
        }
        
        
        if(mydfValue === '') {
            setErrorFor(mydf, 'Le champ de la date de fin ne peux pas être vide.');
        }else if( mydfValue <= myddValue){
            setErrorFor(mydf, 'Le champ de la date de clôture est inferieur a la date de lancement, rechanger la date SVP.');
        } else {
            setSuccessFor(mydf);
x=x+100;            
        }
      
        
        if(myrecruteurValue === '') {
            setErrorFor(myrecruteur, 'Le champ Nom du recruteur ne peux pas être vide.');
        } else {
            setSuccessFor(myrecruteur);
x=x+100;
        }
    
        if(mylieuValue === '') {
            setErrorFor(mylieu, 'Le champ lieu et emplacement ne peux pas être vide.');
        } else {
            setSuccessFor(mylieu);
x=x+100; 
        }
        return (x);
    }


    
    function setErrorFor(input, message) {
        const formControl = input.parentElement;
        const small = formControl.querySelector('small');
        formControl.className = 'form-group error';
        small.innerText = message;
    }
    
    function setSuccessFor(input) {
        const formControl = input.parentElement;
        formControl.className = 'form-group success';
    }

    form.addEventListener('submit', e => {
    
    if(checkInputs() != 500){
        e.preventDefault();
    }else{
        
        form.submit();
    }

});
   


 