var root_uri = 'http://localhost:8000';
var file;

$(document).ready(function() {
    render_modal();
    careers();

    var career_modal = $('#careerModal');
    var resume_modal = $('#resumeModal');
    var response_modal = $('#responseModal');

    var career_form = $('#career_form');
    var resume_form = $('#resume_form');

    var btnSendResume = $('#btnSendResume');
    var btnCareerApply = $('#btnCareerApply');
    var btnResumeApply = $('#btnResumeApply');

    $(':file').on('change', function() {
        file = this.files[0];
        // if (file.size > 1024) {
        //     alert('max upload size is 1k')
        // }
        // Also see .name, .type
    });

    btnSendResume.click(function(event) {
        resume_modal.modal({
            backdrop: 'static',
            keyboard: true,
            show: true
        });
    });

    btnCareerApply.click(function(event) {
        if (career_form.valid()) {
            var vacante = career_modal.attr('career');
            var careerData = {
                firstName : career_modal.find( $('input[name="firstName"]') ).val(),
                telephone : career_modal.find( $('input[name="telephone"]') ).val(),
                email     : career_modal.find($('input[name="email"]') ).val(),
                vacante   : vacante,
                archivos  : file
            };

            var form = new FormData();
            form.append("nombre", careerData.firstName);
            form.append("telefono", careerData.telephone);
            form.append("email", careerData.email);
            form.append("vacante", careerData.vacante);
            form.append("archivos[]", careerData.archivos);

            career_apply(form);
        }
    });

    btnResumeApply.click(function(event) {
        if (resume_form.valid()) {
            var careerData = {
                descripcion : resume_modal.find( $('textarea[name="r_descripcion"]') ).val(),
                firstName : resume_modal.find( $('input[name="r_firstName"]') ).val(),
                telephone : resume_modal.find( $('input[name="r_telephone"]') ).val(),
                email     : resume_modal.find($('input[name="r_email"]') ).val(),
                vacante   : 'general',
                archivos  : file
            }

            var form = new FormData();
            form.append("nombre", careerData.firstName);
            form.append("telefono", careerData.telephone);
            form.append("email", careerData.email);
            form.append("vacante", careerData.vacante);
            form.append("archivos[]", careerData.archivos);

            career_apply(form);
        }
    });

    function careers() {
        $.ajax({
            url: root_uri + '/listaVacantesJSON',
            type: 'GET',
            dataType: 'json'
        })
        .done(function(data) {
            var careers = data;
            var arr = $.map(careers, function(el) { return el; });
            render_cards(arr);
        })
        .fail(function(data) {
            error_modal();
        })
        .always(function(data) {

        });
    }

    function career_apply(data) {
        data = data;
        $.ajax({
            url: root_uri + '/prospectos/crear',
            type: 'POST',
            dataType: 'json',
            data: data,
            processData: false,
            contentType: false,
            async: true
        })
        .done(function() {
            success_modal();
            if (career_modal.is(':visible')) {
                career_modal.modal('hide')
            } else if (resume_modal.is(':visible')) {
                resume_modal.modal('hide');
            }
        })
        .fail(function() {
            error_modal();
        })
        .always(function() {
            console.log("complete");
        });

    }

    function render_cards(array) {
        var career_cards = array;
        for (var career in career_cards) {
            var card = career_cards[career];
            var _titulo = card.titulo.split(" ");

            $('<div/>',{
                class: 'talent-card',
                id: card.id,
                html: $('<img/>',{
                    src: 'http://' + card.imagen,
                    alt: 'career_ico'
                })
                .add( $('<div/>',{
                    class: 'card-content',
                    html: $('<div/>', {
                        class: 'card-txt',
                        html: $('<span/>',{
                            text: _titulo[0]
                        })
                        .add($('<br/>'))
                        .add($('<span/>',{
                            text: _titulo[1]
                        }))
                        .add( $('<button/>', {
                            type: 'button',
                            name: 'button',
                            class: 'button talent-btn career-btn',
                            text: 'Apply'
                        }).click(function(event) {
                            var id = $(this).closest('.talent-card').attr('id');
                            call_modal(career_cards, id)
                        }))
                    })
                }))
            }).appendTo('.cards-section').show('fast');
        }
    }

    function call_modal(array, id) {
        var careers = array;
        var _id = id;

        for (var career in careers) {
            var career_card = careers[career];
            if (career_card.id == _id) {
                career_modal.find('.modal-body > h2').text(career_card.titulo);
                $('#_about').text(career_card.descripcion);
                $('#_uneed').text(career_card.requerimientos);
            }
        }

        career_modal.modal({
            backdrop: 'static',
            keyboard: true,
            show: true
        });

        career_modal.attr('career', _id);
    }

    function success_modal() {
        response_modal.find('.callback-cnt').addClass('call-success');
        response_modal.find('.callback-wrp > h2').text('AWESOME');
        response_modal.find('.callback-wrp > p').text('Thank you, your message has been sent successfully');
        response_modal.modal({
            backdrop: 'static',
            keyboard: true,
            show: true
        });
    }

    function error_modal() {
        response_modal.find('.callback-cnt').addClass('call-error');
        response_modal.find('.callback-wrp > h2').text('OH NO!');
        response_modal.find('.callback-wrp > p').text('Something went wrong, please try again');
        response_modal.modal({
            backdrop: 'static',
            keyboard: true,
            show: true
        });
    }

    function render_modal() {
        $('<div/>',{
            id: 'responseModal',
            class: 'modal fade',
            role: 'dialog',
            html: $('<div/>',{
                class: 'modal-dialog talent-modal modal-lg',
                html: $('<div/>',{
                    class: 'modal-content',
                    html: $('<div/>',{
                        class: 'modal-header'
                    })
                    .add( $('<div/>',{
                        class: 'modal-body curved',
                        html: $('<div/>',{
                            class: 'callback-wrp',
                            html: $('<div/>',{
                                class: 'callback-cnt'
                            })
                            .add($('<h2/>'))
                            .add($('<p/>'))
                        })
                    }))
                    .add( $('<div/>', {
                        class: 'modal-footer center-stuff',
                        html: $('<button/>',{
                            type: 'button',
                            class: 'button talent-btn talent-btn-white inline',
                            'data-dismiss': 'modal',
                            text: 'BACK HOME'
                        })
                    }))
                })
            })
        }).insertAfter($('#careerModal'));
    }

    career_form.validate({
        rules: {
            firstName: {
                required: true
            },
            telephone: {
                required: true,
                number: true
            },
            email: {
                required: true,
                email: true
            },
            'archivos[]': {
                required: true,
                extension: 'png|pdf'
            }
        },
        messages: {
            firstName: {
                required: "Oops, este campo es requerido"
            },
            telephone:{
                required: "Oops, este campo es requerido",
                number: "Proporciona un número válido"
            },
            email: {
                required: "Oops, este campo es requerido",
                email: "Proporciona un E-mail válido"
            },
            'archivos[]': {
                required: "Proporciona un archivo de imagen o pdf",
                extension: "El formato de tu archivo no es válido"
            }
        },
        highlight: function (element) {
            $(element).closest('.form-input').addClass('has-error');
        },
        unhighlight: function(element) {
            $(element).closest('.form-input').removeClass('has-error');
        },
        errorPlacement: function(error, element) {
            if (element.is('input[type="file"]')) {
                error.insertAfter(element.closest('.file-cnt'));
            } else {
                error.insertAfter(element);
            }
        }
    });

    resume_form.validate({
        rules: {
            r_descripcion: {
                required: false
            },
            r_firstName: {
                required: true,
            },
            r_telephone: {
                required: true,
                number: true
            },
            r_email: {
                required: true,
                email: true
            },
            'r_archivos[]': {
                required: true,
                extension: 'png|pdf'
            }
        },
        messages: {
            r_firstName: {
                required: "Oops, este campo es requerido"
            },
            r_telephone:{
                required: "Oops, este campo es requerido",
                number: "Proporciona un número válido"
            },
            r_email: {
                required: "Oops, este campo es requerido",
                email: "Proporciona un E-mail válido"
            },
            'r_archivos[]': {
                required: "Proporciona un archivo de imagen o pdf",
                extension: "El formato de tu archivo no es válido"
            }
        },
        highlight: function (element) {
            $(element).closest('.form-input').addClass('has-error');
        },
        unhighlight: function(element) {
            $(element).closest('.form-input').removeClass('has-error');
        },
        errorPlacement: function(error, element) {
            if (element.is('input[type="file"]')) {
                error.insertAfter(element.closest('.file-cnt'));
            } else {
                error.insertAfter(element);
            }
        }
    });

    $('#close_resume').click(function(event) {
        var validator = resume_form.validate();
        validator.resetForm();
    });

    $('#close_career').click(function(event) {
        var validator = career_form.validate();
        validator.resetForm();
    });

});
