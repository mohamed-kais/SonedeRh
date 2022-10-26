$(document).ready(function() {
    $('#ajouter_vacant').bootstrapValidator({
        
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            sujet: {
                validators: {
                        stringLength: {
                        min: 5,
                    },
                        notEmpty: {
                        message: 'Veuillez saisir le sujet du stage'
                    }
                }
            },
            encadreur: {
                validators: {
                     stringLength: {
                        min: 4,
                    },
                    notEmpty: {
                        message: 'Veuillez saisir le nom de l\'encadreur en charge'
                    }
                }
            },
            type_stage: {
                validators: {
                    notEmpty: {
                        message: 'Veuillez sélectionner le type de stage'
                    }
                }
            },
            date_debut: {
                validators: {
                    notEmpty: {
                        message: 'Veuillez sélectionner la date de lancement'
                    }
                }
            },
         
            
            secteur: {
                validators: {
                    notEmpty: {
                        message: 'Veuillez sélectionner le secteur du stage'
                    }
                }
            },
          
            
            }
        })
        .on('success.form.bv', function(e) {
            $('#success_message').slideDown({ opacity: "show" }, "slow") // Do something ...
                $('#ajouter_vacant').data('bootstrapValidator').resetForm();

            // Prevent form submission
            e.preventDefault();

            // Get the form instance
            var $form = $(e.target);

            // Get the BootstrapValidator instance
            var bv = $form.data('bootstrapValidator');

            // Use Ajax to submit form data
            $.post($form.attr('action'), $form.serialize(), function(result) {
                console.log(result);
            }, 'json');
        });
});