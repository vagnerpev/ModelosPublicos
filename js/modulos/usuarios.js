$(document).ready(function(){


    //-- VALIDANDO USUÁRIO E SENHA --//
     $("#panel-login").on("submit",'form[name="validaUsuario"]',function(){
          var dados = $(this);
        //console.log(action.serialize());
          $.ajax({
              url:'ajax/usuarios/validaLogin.php',
              type:'POST',
              data:'login&'+dados.serialize(),
              beforeSend: function(){
                  //botao.attr('disabled',true);
                 // $('.load').fadeIn('slow');
              },
              success:function(retorno){

                 if(retorno == 1){
                      alertify.success('Usuário conectado com sucesso!');
                     redireciona();
                  }else if(retorno == 2) {
                      alertify.error('Usuário ou senha invalido!');
                     redireciona("logim.php");
                  }else{
                      alertify.error('Erro ao conectar.');
                  }
                 console.log(retorno);
              }

          });
          return false;
      });


    //-- INICIO CADASTRA DE   USUARIO --//

    $("#btnSalvarUsuario").click(function(){
        var var_nome = $.trim($('#txtNome').val());
        var var_telefone = $.trim($('#txtTelefone').val());
        var var_privilegios = $.trim($('#txtPrivilegio').val());        var var_setor = $.trim($('#txtIDSetor').val());
        var var_user = $.trim($('#txtUser').val());
        var var_email = $.trim($('#email').val());
        var var_senha = $.trim($('#txtSenha').val());
        var var_confSenha = $.trim($('#txtConfSenha').val());

        if(var_nome == ""){
            alertify.warning("Digite  o nome completo!");
            return false;
        }else if(var_telefone == ""){
            alertify.warning("Difite o Numero de Telafone!");
            return false;
        }else if(var_privilegios == ""){
            alertify.warning("Escolha a permissão do Usuário!");
            return false;
        }else if(var_setor== ""){
            alertify.warning("Escolha o setor do Usuário!");
            return false;
        }else if(var_user == ""){
            alertify.warning("Digite  o nome Usuário!");
            return false;
        }else if(var_senha == ""){
            alertify.warning("Digite  uma senha!");
            return false;
        }else if(var_confSenha == ""){
            alertify.warning("Digite  a confirmação de senha!");
            return false;
        }else{

            $.ajax({
                url:'ajax/usuarios/criaUsuario.php',
                type:'POST',
                data:$('#novoUsuario').serialize(),
                beforeSend: function(){
                    //botao.attr('disabled',true);
                    //$('.load').fadeIn('slow');
                },
                success:function(retorno){
                    if(retorno == 1){
                        alertify.success('Usuário cadastrada com sucesso!');
                        $('#novoUsuario').each (function(){
                            this.reset();
                        });
                    }else if(retorno == 2){
                        alertify.error('O Usuário já está cadastrodo!');
                    }else if(retorno == 3){
                        alertify.error('Já existe usuário com este E-mail!');
                    }else if(retorno == 4){
                        alertify.error('A Senha e a Confirmação de Senha devem ser iguais!');
                    }else if(retorno == 5){
                        alertify.error('Erro ao cadastrar Usuário!');
                    }else if(retorno == 6){
                        alertify.error('Voce não tem privilegio de Administrador!');
                    }else{
                        alertify.error('Erro ao cadastrar Usuário!');
                    }
                    console.log(retorno);
                }

            });
            return false;
        }
    });

    // FIM CADASTRO DE USUARIOS


    //-- INICIO EDITAR USUARIOS --//
    $("#btnEditarUsuario").click(function(){
        var var_nome = $.trim($('#txtNome').val());
        var var_privilegios = $.trim($('#txtPrivilegio').val());
        var var_email = $.trim($('#email').val());

        if(var_nome == ""){
            alertify.warning("Digite  o nome!");
            return false;
        }else if(var_privilegios == ""){
            alertify.warning("Escolha a permissão do Usuário!");
            return false;
        }else if(var_email == ""){
            alertify.warning("Digite  um E-mail valido!");
            return false;
        }else{

            $.ajax({
                url:'ajax/usuarios/editaUsuario.php',
                type:'POST',
                data:$('#editaUsuario').serialize(),
                beforeSend: function(){
                    // botao.attr('disabled',true);
                    // $('.load').fadeIn('slow');
                },
                success:function(retorno){

                    if(retorno == 1){
                        alertify.success('Usuário alterado com sucesso!');
                        $("button").prop("disabled", true);
                    }else if(retorno == 2){
                        alertify.error('O Usuário não foi alterada!');
                    }else if(retorno == 3){
                        alertify.error('Já existe usuário com este E-mail!');
                    }else if(retorno == 5){
                        alertify.error('Voce não tem privilegio de Administrador!');
                    }else{
                        alertify.error('Erro ao atualizar.');
                    }
                    console.log(retorno);
                }

            });
            return false;
        }
    });

    //-- ALTERANDO SENHA --//
    $("#btnAlteraSenha").click(function(){
        var var_senha = $.trim($('#senha').val());
        var var_confSenha = $.trim($('#confSenha').val());

        if(var_senha == ""){
            alertify.warning("Digite a nova Senha!");
            return false;
        }else if(var_confSenha == "") {
            alertify.warning("Digite  a confirmação de Senha!");
            return false;
        }else if(var_senha != var_confSenha){
                alertify.warning("A confirmação de Senha de ser a mesma da senha!");
                return false;
            }else {

            $.ajax({
                url: 'ajax/usuarios/alteraSenha.php',
                type: 'POST',
                data: $('#atualizaSenha').serialize(),
                beforeSend: function () {
                    //botao.attr('disabled',true);
                    // $('.load').fadeIn('slow');
                },
                success: function (retorno) {

                    if (retorno == 1) {
                        alertify.success('Senha Alterado com sucesso!');
                                 redireciona();
                    } else if (retorno == 2) {
                        alertify.error('Senha não foi alterado!');
                    } else if (retorno == 3) {
                        alertify.error('As Senha são diferentes!');
                    }else if(retorno == 5){
                        alertify.error('Voce não tem privilegio de Administrador!');
                    } else {
                        alertify.error('Erro ao atualizar.');
                    }
                    console.log(retorno);
                }

            });
            return false;
        }
    });
    // FIM EDITAR DE RAMAL

    function redireciona(url){
        url='/sis-ramais/admin/';
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