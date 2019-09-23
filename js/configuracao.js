$(document).ready(function(){

    //-- ALTERANDO CONFIGURAÇÕES --//
    $(".row").on("submit",'form[name="actualizarconfig"]',function(){
        var dados = $(this);

        $.ajax({
            url:'ajax/actualizarconfig.php',
            type:'POST',
            data:'editar_config&'+dados.serialize(),
            beforeSend: function(){
                //botao.attr('disabled',true);
                // $('.load').fadeIn('slow');
            },
            success:function(retorno){

                if(retorno == 1){
                    alertify.success('Configurações alteradas com sucesso!');
                }else if(retorno == 2){
                    alertify.error('As configurações não foram alteradas!');
                }else{
                    alertify.error('Erro ao atualizar.');
                }
                console.log(retorno);
            }

        });
        return false;
    });



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