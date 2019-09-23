$(document).ready(function(){

    //-- ALTERANDO PAGINA DE CATALOGO --//
    $(".row").on("submit",'form[name="actualizarcatalogo"]',function(){
        var dados = $(this);

        $.ajax({
            url:'ajax/actualizarcatalogo.php',
            type:'POST',
            data:'editar_cat&'+dados.serialize(),
            beforeSend: function(){
                //botao.attr('disabled',true);
                // $('.load').fadeIn('slow');
            },
            success:function(retorno){

                if(retorno == 1){
                    alertify.success('Página alterada com sucesso!');
                }else if(retorno == 2){
                    alertify.error('A página não foi alterada!');
                }else{
                    alertify.error('Erro ao atualizar.');
                }
                console.log(retorno);
            }

        });
        return false;
    });

/*
    $(".row").on("submit",'form[name="uploadcatalogo"]',function(){

        var fd = new FormData();
        fd.append('file', $('#arquivo'));
            $.ajax({
            url: 'ajax/upload.php',
            data: fd,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function(data) {
                alert(data);
            }
        });

    });*/


    $("#uploadcatalogo").on('submit',(function(e) {
        e.preventDefault();
        //$("#message").empty();
        //$('#loading').show();
        $.ajax({
            url: "ajax/upload.php", // Url to which the request is send
            type: "POST",             // Type of request to be send, called as method
            data: new FormData(this), // Data sent to server, a set of key/value pairs (i.e. form fields and values)
            contentType: false,       // The content type used when sending data to the server.
            cache: false,             // To unable request pages to be cached
            processData:false,        // To send DOMDocument or non processed data file it is set to false
            success: function(data)   // A function to be called if request succeeds
            {
                //$('#loading').hide();
              //  $("#message").html(data);
                if(data == 1){
                    alertify.success('Upload realizado com sucesso!');
                }else if(data == 2){
                    alertify.error('Upload não foi realizado com sucesso!');
                }else if(data == 3){
                    alertify.error('Permitido apenas arquivos doc,xls,pdf e txt.!');
                }else{
                    alertify.error('Erro ao arquivo adicionado.');
                }
                console.log(data);
            }
        });
    }));

    function redireciona(url){
        url='';
        window.location = (base_url()+url);
    }

    // base url
    function base_url() {
        url = '';
        var pathparts = location.pathname.split('/');
        if (location.host == 'localhost') {
            var url = location.origin+'/'+pathparts[1].trim('/')+'/'; // http://localhost/myproject/
        }else{
            var url = location.origin; // http://stackoverflow.com
        }
        return url;
    }

});