$(document).ready(function() {
	
	//funcion para validar numeros
	$(function(){
	  $('.soloNumeros').keypress(function(e) {
		if(isNaN(this.value+""+String.fromCharCode(e.charCode))) return false;
	  })
	  .on("cut copy paste",function(e){
		e.preventDefault();
	  });

	});
	
	
    //Inicializa el tema bootstrap de Alertify
    alertify.defaults.transition = "slide";
    alertify.defaults.theme.ok = "btn btn-primary";
    alertify.defaults.theme.cancel = "btn btn-danger";
    alertify.defaults.theme.input = "form-control";
    
       
    //--Inicio CATEGORIA - Para la vista NUEVO PRODUCTO --//
    var idCategoria = $('select#txtCategoria').val();
    $('#txtIdCategoria').val(idCategoria);
    //Obtener el valor "value" de un campo de selección “select” despues del evento "change"
    $('select#txtCategoria').on('change',function(){
        //var idCategoria = $(this).val();
         idCategoria = $(this).val();
        //alert(idCategoria);
       $('#txtIdCategoria').val(idCategoria);
    });
    //--Fin CATEGORIA - Para la vista NUEVO PRODUCTO --//
    
    //--Inicio MARCA - Para la vista NUEVO PRODUCTO --//
    var idMarca = $('select#txtMarca').val();
    $('#txtIdMarca').val(idMarca);
    //Obtener el valor "value" de un campo de selección “select” despues del evento "change"
    $('select#txtMarca').on('change',function(){
         idMarca = $(this).val();
        //alert(idMarca);
       $('#txtIdMarca').val(idMarca);
    });
    //--Fin MARCA - Para la vista NUEVO PRODUCTO --//
    
    //--Inicio UNIDAD - Para la vista NUEVO PRODUCTO --//
    var idUnidad = $('select#txtUnidad').val();
    $('#txtIdUnidad').val(idUnidad);
    //Obtener el valor "value" de un campo de selección “select” despues del evento "change"
    $('select#txtUnidad').on('change',function(){
         idUnidad = $(this).val();
        //alert(idUnidad);
       $('#txtIdUnidad').val(idUnidad);
    });
    //--Fin UNIDAD - Para la vista NUEVO PRODUCTO --//
    
    
  
    
	//Para que al abrir una ventana modal, se haga foco en el elemento que tiene el autofocus
	$('.modal').on('shown.bs.modal', function() {
	  $(this).find('[autofocus]').focus();
	});
    
	
	//Para cambio de pais
	//puede ser con el metodo "change" o "blur"
	$('select[name="txtPais"]').on("change", function() {
		if($('select[name="txtPais"]').val() !== "AR"){
			$('#txtCondicionIVA').prop('disabled', true);
			$('select[name="txtCondicionIVA"]').val('NI');
			$('#txtIngBrutos').val("NO");
			$('#cajaAlicuota').show();
			
		}else{
			
			$('#txtNombreImpuesto').val("IVA");
			$('#txtPorcentajeImpuesto').val("21.00");
			$('select[name="txtCondicionIVA"]').val('RI');
			$('#txtMoneda').val("$");
			$('#txtIdenTributaria').val("CUIT");
			$('#txtIngBrutos').val(" ");
			$('#txtCondicionIVA').prop('disabled', false);
			
		}
	});
	
	
	//Para cuando cambia el combo select a Monotributista
	$('select[name="txtCondicionIVA"]').on("change", function() {
		if($('select[name="txtCondicionIVA"]').val() == "MT"){
			$('#txtPorcentajeImpuesto').val("0.00");
			$('#cajaAlicuota').hide();
		}else{
			$('#txtPorcentajeImpuesto').val("21.00");
			$('#cajaAlicuota').show();
		}	
	});
	
	
	
	//Para cuando carga la pagina cambia a Monotributista
	if($('select[name="txtCondicionIVA"]').val() == "MT"){	
			$('#cajaAlicuota').hide();
	}
	if($('select[name="txtPais"]').val() != "AR"){	
			$('#txtCondicionIVA').prop('disabled', true);
			$('select[name="txtCondicionIVA"]').val('NI');
			$('#cajaAlicuota').show();
	}
	
	
	
	 
    // Código para imprimir
   $(".btnImprime").click(function (){
        $("div#myPrintArea").printArea();
    })
   
	
	//Control de stock con JQeury
   	$('#tablaProductos').dataTable({
		"bDestroy": true,
		"createdRow": function ( row, data, index ) { 
		//si es 0 el stock esta agotado	
		if ( data[5] == 0 ) {
			$('td', row).eq(5).css({
				'background-color':'#E26A6A',
				'color': 'white',
				'border-style':'solid',
				'border-width': ' 1px 1px 1px 1px',
				'border-color': '#2C3E50',
			});
		} 
		//si es menor al stock minimo (y distinto de cero)	
		if ( data[5] * 1 <= data[6] * 1 && data[5] != 0) {
			$('td', row).eq(5).css({
				'background-color':'#edab61',
				'color': 'white',
				'border-style':'solid',
				'border-width': ' 1px 1px 1px 1px',
				'border-color': '#2C3E50',
			});
		}
        }
    } );
   
   	
   


    //***Inicio PRODUCTOS ***//
        //controla que el codigo ingresado no se repita en la Base de datos
        var codProdArray = [] ;
        var v_codigo_control;
        $("#tablaCodigos tbody tr").each(function(){
            codProdArray.push($(this).find("td:eq(0)").text());
        });  
        
        //Para controlar que el codigo insertado no este duplicado//
        $('#txtCodigo').focusout(function () {
            if ($("#txtCodigo").val().length < 1){
                //campo vacío
            }else {
                v_codigo_control = $("#txtCodigo").val();
                if ($.inArray(v_codigo_control,codProdArray) != -1) {
                    alertify.error("¡El Código ya existe!");
                    $("#txtCodigo").focus();    
            }
            }
            
        });
	//***Fin PRODUCTOS ***//

    
    //***Inicio CATEGORIAS ***//
        //controla que la categoría ingresada no se repita en la Base de datos
        var categoriasArray = [] ;
        var v_cat_control;
        $("#tablaCategorias tbody tr").each(function(){
            categoriasArray.push($(this).find("td:eq(0)").text());
        });  
        
        //Para controlar que el codigo insertado no este duplicado//
        $('#txtDescripcion').focusout(function () {
            if ($("#txtDescripcion").val().length < 1){
                //campo vacío
            }else {
                v_cat_control = $("#txtDescripcion").val();
                if ($.inArray(v_cat_control,categoriasArray) != -1) {
                    alertify.error("¡La Categoría ya existe!");
                    $("#txtDescripcion").focus();    
            }
            }
            
        });
    //***Fin CATEGORIAS ***//


    //***Inicio COMPROBANTES ***//
        //controla que la categoría ingresada no se repita en la Base de datos
        var comprobantesArray = [] ;
        var v_comp_control;
        $("#tablaComprobantes tbody tr").each(function(){
            comprobantesArray.push($(this).find("td:eq(0)").text());
        });  
        
        //Para controlar que el comprobante insertado no este duplicado//
        $('#txtDescripcion').focusout(function () {
            if ($("#txtDescripcion").val().length < 1){
                
            }else {
                v_comp_control = $("#txtDescripcion").val();
                if ($.inArray(v_comp_control,comprobantesArray) != -1) {
                    alertify.error("¡El Comprobante ya existe!");
                    $("#txtDescripcion").focus();    
            }
            }
            
        });
    //***Fin COMPROBANTES ***//
    
    
    //***Inicio MARCAS ***//
        //controla que la categoría ingresada no se repita en la Base de datos
        var marcasArray = [] ;
        var v_marca_control;
        $("#tablaMarcas tbody tr").each(function(){
            marcasArray.push($(this).find("td:eq(0)").text());
        });  
        
        //Para controlar que el codigo insertado no este duplicado//
        $('#txtDescripcion').focusout(function () {
            if ($("#txtDescripcion").val().length < 1){
                //campo vacío
            }else {
                v_marca_control = $("#txtDescripcion").val();
                if ($.inArray(v_marca_control,marcasArray) != -1) {
                    alertify.error("¡La Marca ya existe!");
                    $("#txtDescripcion").focus();    
            }
            }
            
        });
    //***Fin MARCAS ***//



    //***Inicio UNIDADES ***//
        //controla que la unidadess ingresada no se repita en la Base de datos
        var unidadesArray = [] ;
        var v_unidad_control;
        $("#tablaUnidades tbody tr").each(function(){
            unidadesArray.push($(this).find("td:eq(0)").text());
        });  
        
        //Para controlar que el codigo insertado no este duplicado//
        $('#txtDescripcion').focusout(function () {
            if ($("#txtDescripcion").val().length < 1){
                //campo vacío
            }else {
                v_unidad_control = $("#txtDescripcion").val();
                if ($.inArray(v_unidad_control,unidadesArray) != -1) {
                    alertify.error("¡La Unidad/Medida ya existe!");
                    $("#txtDescripcion").focus();    
            }
            }
            
        });
    //***Fin UNIDADES ***//


    //*** Inicio USUARIOS ***//
        //controla que el email o cuenta ingresado no se repita en la Base de datos
        var usuariosArray = [] ;
        var u_codigo_control;
        $("#tablaUsuarios tbody tr").each(function(){
            usuariosArray.push($(this).find("td:eq(0)").text());
        });  
        
        //Para controlar que el codigo insertado no este duplicado//
        $('#email').focusout(function () {
            if ($("#email").val().length < 1){
                //campo vacío
            }else {
                u_codigo_control = $("#email").val();
                if ($.inArray(u_codigo_control,usuariosArray) != -1) {
                    alertify.error("¡El nombre de Usuario ya existe!");
                    $("#email").focus();    
            }
            }
            
        });
    //*** Fin USUARIOS ***//




    //*** Inicio USUARIOS ***//
    //Para abrir la ventana modal BUSCAR USUARIOS
    function abrirModalUsuarios(){
        $('#tituloModal').text("Buscar Usuarios");
        $('#modal_usuarios').modal('show');
    }

    //*** Fin USUARIOS ***//


    //-- Controlamos que las password coincidan y luego ejecutamos el submit del formulario  --//
    		 $('#btnControlaPass').click(function(){
        alertify.error("No disponible en versión DEMO");
     }); 

	   /* $("#btnControlaPass").click(function(){
		var password = $("#password").val();
	        var confirm_password = $("#confirmaPassword").val();
	        
	        if (password.length < 1){
	            alertify.warning("Ingrese una password");
	        }
	        else{
	          if (password != confirm_password) {
	            alertify.error("La Password no coincide");
	            $('#password').focus();
	          } else {
	              alertify.alert("Alta de Usuario","Operación Exitosa!", function(){
	                  userU = $('#user').val();
	                  passwordU = $('#password').val();
	                  
	                  $('#txtUser').val(userU);
	                  $('#txtPassword').val(passwordU);
	                  
	                  $('#btnRegistrarUsuario').click();
	            });
	            }              
	        }
	        
	     });*/



	  $("#btnBkp").click(function(){ 
		  alertify.success("¡Backup generado con Éxito!");
	  });
});       