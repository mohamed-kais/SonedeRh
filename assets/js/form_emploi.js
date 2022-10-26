$(document).ready(function() {
    $('#ajouter_emploi').bootstrapValidator({
        // To use feedback icons, ensure that you use Bootstrap v3.1.0 or later
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            fonction: {
                validators: {
                        stringLength: {
                        min: 5,
                    },
                        notEmpty: {
                        message: 'Veuillez saisir la fonction de l\'emploi'
                    }
                }
            },
            recruteur: {
                validators: {
                     stringLength: {
                        min: 4,
                    },
                    notEmpty: {
                        message: 'Veuillez saisir le nom du recruteur en charge'
                    }
                }
            },
            contrat: {
                validators: {
                    notEmpty: {
                        message: 'Veuillez sélectionner le type de contrat'
                    }
                }
            },
            priorite: {
                validators: {
                    notEmpty: {
                        message: 'Veuillez sélectionner le niveau de priorité'
                    }
                }
            },
            
            paiment: {
                validators: {
                    notEmpty: {
                        message: 'Veuillez sélectionner le montant estimé'
                    },
                    digits: {
                        message: 'The phone number can contain digits only'
                    },
                    stringLength: {
                        min: 2,
                        max: 4,
                        message:'Cette valeur n\'est pas valide'
                    },

                }
            },
            
            secteur: {
                validators: {
                    notEmpty: {
                        message: 'Veuillez sélectionner le secteur de l\'offre'
                    }
                }
            },
          
            description: {
                validators: {
                      stringLength: {
                        min: 50,
                        max: 500,
                        message:'Veuillez entrez au moins 50 caractères et pas plus de 500'
                    },
                    notEmpty: {
                        message: 'Veuillez fournir une description de votre offre'
                    }
                    }
                }
            }
        })
        .on('success.form.bv', function(e) {
            $('#success_message').slideDown({ opacity: "show" }, "slow") // Do something ...
                $('#ajouter_emploi').data('bootstrapValidator').resetForm();

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