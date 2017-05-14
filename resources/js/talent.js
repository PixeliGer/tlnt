$(document).ready(function() {
    var career_modal = $('#careerModal');
    var resume_modal = $('#resumeModal');
    careers();

    $('#btnSendResume').click(function(event) {
        $('#resumeModal').modal({
            backdrop: 'static',
            keyboard: true,
            show: true
        });
    });

    function careers() {
        var root_uri = 'http://localhost:8000';
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

        })
        .always(function(data) {

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
    }

});
