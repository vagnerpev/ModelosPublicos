$(document).ready(function(){     
/*CODIGO VENTAS JS*/
    //Para cambiar el puntero del mouse en las tablas que permiten seleccionar
    $("#tabla_clientes tr").css('cursor', 'pointer');
    //-- INICIO  Agregar al carrito para VENTAS--//
    //--Definición de variables--//
    var v_subTotal = 0;
    window.v_total = 0; //var global con el total de las ventas
    var v_num = 0;   
    var codigosArray = []; //array en tiempo real para los codigos
    var subTotArray = []; //array en tiempo real para los subtotales   	
	var subTotImpuestoArray = []; //array en tiempo real para los impuestos
	var subtTotNetoArray = []; //array en tiempo real para subTotal neto (sin impuestos)
    var v_codigo;
	var porcentaje_imp = 0;
	var porcentaje_imp_dec = 0;
	var precioVentaNeto = 0;
	var v_subTotNeto = 0;
	var v_subTotImpuesto = 0;	
	var v_descGral = 0;	
	window.v_totVtaConDesc = 0;
	var v_calculo= 0;
	
	//btn para agregar productos al carrito de compras
    $("#btnAgregarCarritoVentas").click(function(){ 
        v_codigo = $("#codigo").val();
        /*if($("#busca").val().length < 1){
            alertify.warning("Debe ingresar un producto");
            $("#buscaCodigo").focus();
        }*/
		if($("#codigo").val().length < 1){
            alertify.warning("Debe ingresar un producto");
            $("#buscaCodigo").focus();
        }
        else
        if($("#stock").val() == 0){
            alertify.alert('Control de Stock', "¡Producto Sin Stock!", function(){
                alertify.message('Revise el Stock');
            });
            $("#buscaCodigo").focus();
        }
        else
		//control de cantidad	
        if(parseFloat($('#cantidad').val()) > parseFloat($("#stock").val()) || parseFloat($('#cantidad').val()) < 0 ){
            //alertify.alert("¡Cantidad fuera de rango!", function(){
                alertify.message('¡Cantidad fuera de rango!');
            //});
            $("#cantidad").focus();
        }
		//control de descuento
		else
		if(parseFloat($("#descuento").val()).toFixed(2) > 99 || parseFloat($("#descuento").val()).toFixed(2) < 0){
			alertify.message('¡Descuento Incorrecto!');
            $("#descuento").focus();
		}
        else
        if($.inArray(v_codigo,codigosArray) != -1){       
                alertify.warning("El producto ya está en el carrito");
                $("#buscaCodigo").focus();
        }
        else
        {
            var fila1 = 0; //bandera para saber si el carrito tiene un producto o no
            var v_id = $("#id").val();
            v_codigo = $("#codigo").val();
            var v_nombre = $("#nombre").val();
            var v_precioVenta = parseFloat($("#precioVenta").val()).toFixed(2);
            var v_stock = parseFloat($("#stock").val());
            var v_cantidad = parseFloat($("#cantidad").val());
            v_desc = parseFloat($("#descuento").val()).toFixed(2) / 100;
            v_precioConDesc = (v_precioVenta - (v_precioVenta * v_desc));
			v_subTotal = v_cantidad * v_precioConDesc;
			//inicio - cálculo con impuestos
				//obtengo 1.21 si el imp es del 21%
				porcentaje_imp_dec = (parseFloat($("#porcentaje_imp").val()).toFixed(2)) / 100;
				porcentaje_imp  = 1 + porcentaje_imp_dec;
				//obtengo el precio de venta Neto
				precioVentaNeto = v_subTotal / porcentaje_imp;
				//obtengo el impuesto de ese precio de venta
				impuesto_PrecioVenta = precioVentaNeto * porcentaje_imp_dec;
				//obtengo los subtotales
				v_subTotImpuesto = v_subTotImpuesto + impuesto_PrecioVenta;
				v_subTotNeto = v_subTotNeto + precioVentaNeto;
			//fin - cálculo con impuestos
            v_total = v_total + v_subTotal;    
            //obtenemos el nro de filas de la tabla HTML
            var n_celdas = $('tr:last td', $("#tablaVentas")).length;
            v_num = v_num + 1;
            if(fila1 = 0) {
                $('#tablaVentas > tbody:last-child').append('<td style="display:none;">'+v_id+'</td><td>'+v_codigo+'</td><td>'+v_nombre+'</td><td>'+v_cantidad+'</td><td>'+v_precioVenta+'</td><td>'+v_desc.toFixed(2)+'</td><td>'+impuesto_PrecioVenta.toFixed(2)+'</td><td>'+precioVentaNeto.toFixed(2)+'</td><td>'+v_subTotal.toFixed(2)+'</td><td><button class="removerCarritoVentas btn btn-danger btn-sm"><span class="glyphicon glyphicon-remove-sign"></span></button></td>');
                fila1 = 1;
                alertify.success('¡Producto Agregado!').delay(2);
                 
            }
            if(fila1 = 1){
                $('#tablaVentas > tbody:last-child').append('<tr><td style="display:none;">'+v_id+'</td><td>'+v_codigo+'</td><td>'+v_nombre+'</td><td>'+v_cantidad+'</td><td>'+v_precioVenta+'</td><td>'+v_desc.toFixed(2)+'</td><td>'+impuesto_PrecioVenta.toFixed(2)+'</td><td>'+precioVentaNeto.toFixed(2)+'</td><td><strong>'+v_subTotal.toFixed(2)+'</strong></td><td><button class="removerCarritoVentas btn btn-danger btn-sm"><span class="glyphicon glyphicon-remove-sign"></span></button></td></tr>');
                alertify.success('¡Producto Agregado!').delay(2);
                
            }
			//si es Monotributista el iva es 0, por lo tanto no muestra las columnas de iva y subtot neto
			if(impuesto_PrecioVenta == 0){
				$('#tablaVentas td:nth-child(7)').css("display","none");
				$('#tablaVentas td:nth-child(8)').css("display","none");
			}
           //capturo los valores de los productos que estan en el carrito en tiempo real 
            var filaActual = $('#tablaVentas').find('tbody').find('tr');
            for (var i = 0; i < filaActual.length; i++) {
                var codigoCapturado = $(filaActual[i]).find('td:eq(1)').html();
				var impuestoCapturado = parseFloat($(filaActual[i]).find('td:eq(6)').text());
				var precioVtaNetoCapturado = parseFloat($(filaActual[i]).find('td:eq(7)').text());
                var subTotCapturado = parseFloat($(filaActual[i]).find('td:eq(8)').text());
            }
			//guardo los valores capturados en sus respectivos array
            codigosArray.push(codigoCapturado);
			subTotImpuestoArray.push(impuestoCapturado);
			subtTotNetoArray.push(precioVtaNetoCapturado);
            subTotArray.push(subTotCapturado);
			//mostramos los totales de impuestos
			$('#txtImpuesto').val(v_subTotImpuesto.toFixed(2)); 
			$('#txtSubTotal').val(v_subTotNeto.toFixed(2));
            //para mostrar con 2 decimales (.toFixed(2))
            $('#txtTotalVenta').val(v_total.toFixed(2));            
            //limpia los campos			
            $('#busca').val('');
            $('#codigo').val('');
            $('#nombre').val('');
            $('#precioVenta').val('');
			$('#precioVenta').prop('disabled', true);
            $('#stock').val('');
            $('#cantidad').val(1);
            $('#cantidad').prop('disabled', true);
            $('#descuento').val(0);
            $('#descuento').prop('disabled', true);
            $('#buscaCodigo').focus();
        }     
    });
	//-- FIN Agregar al carrito para VENTAS--//
    
    // Evento que selecciona la fila y la elimina del carrito de compras
    $(document).on("click", ".removerCarritoVentas", function(){	
        //elimino el codigo del producto del array
        var v_codigo_r = $(this).closest('tr').find('td:eq(1)').text(); //capturo el codigo
        codigosArray.splice($.inArray(v_codigo_r, codigosArray),1); //elimino el codigo
       //elimino el impuesto del array
		var v_subtotalImpuestoR = parseFloat($(this).closest('tr').find('td:eq(6)').text());//capturo
		subTotImpuestoArray.splice($.inArray(v_subtotalImpuestoR, subTotImpuestoArray),1);//elimino
		//elimino el subtotal NETO del array
		var v_subtotalNetoR = parseFloat($(this).closest('tr').find('td:eq(7)').text());//capturo
		subtTotNetoArray.splice($.inArray(v_subtotalNetoR, subtTotNetoArray),1);//elimino
        //elimino el subtotal del array
        var v_subtotalR = parseFloat($(this).closest('tr').find('td:eq(8)').text()); //capturo el subTotal
        subTotArray.splice($.inArray(v_subtotalR, subTotArray),1); //elimino el subTotal
        
        if(subTotArray.length == 0){
            v_total = 0;
			//nuevo de prueba
			v_subTotImpuesto = 0;
			v_subTotNeto = 0;
			
			$('#txtImpuesto').val(v_subTotImpuesto.toFixed(2)); 
			$('#txtSubTotal').val(v_subTotNeto.toFixed(2));
			$('#txtTotalVenta').val(v_total.toFixed(2));

        }else{
			//calculo del nuevo total cada vez q se elimina un producto del carrito en tiempo real    
			var v_subTotImpuestoR = 0;
			var v_subTotNetoR = 0;
			var v_totalR = 0;
            for (var i = 0; i < subTotArray.length; i++) {
				v_subTotImpuestoR = v_subTotImpuestoR + subTotImpuestoArray[i];
				v_subTotNetoR = v_subTotNetoR + subtTotNetoArray[i];
                v_totalR = v_totalR + subTotArray[i];
            }
			v_subTotImpuesto = v_subTotImpuestoR;
            $('#txtImpuesto').val(v_subTotImpuesto.toFixed(2));
			
			v_subTotNeto = v_subTotNetoR;
            $('#txtSubTotal').val(v_subTotNeto.toFixed(2));
			
            v_total = v_totalR;
            $('#txtTotalVenta').val(v_total.toFixed(2));
        }
        alertify.error('Producto removido').delay(2);
        //captura la fila seleccionada y la elimina de la tabla
        $(this).closest('tr').remove();
    });
   
    //*** Inicio CLIENTES ***//
    //Para abrir la ventana modal BUSCAR CLIENTES
	$("#btnBuscarCliente").click(function(){
		 $('#tituloModal').text("Buscar Clientes");
        $('#modal_clientes').modal('show');	
	});
   
    //Activa la extension SELECT para seleccionar una fila en CLIENTES
    tableClientes = $('#tabla_clientes').DataTable( {
        select: true,
        "language": {
                            "sProcessing":    "Procesando...",
                            "sLengthMenu":    "Mostrar _MENU_ registros",
                            "sZeroRecords":   "No se encontraron resultados",
                            "sEmptyTable":    "Ningún dato disponible en esta tabla",
                            "sInfo":          "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                            "sInfoEmpty":     "Mostrando registros del 0 al 0 de un total de 0 registros",
                            "sInfoFiltered":  "(filtrado de un total de _MAX_ registros)",
                            "sInfoPostFix":   "",
                            "sSearch":        "Buscar:",
                            "sUrl":           "",
                            "sInfoThousands":  ",",
                            "sLoadingRecords": "Cargando...",
                            "oPaginate": {
                                "sFirst":    "Primero",
                                "sLast":    "Último",
                                "sNext":    "Siguiente",
                                "sPrevious": "Anterior"
                            },
                            "oAria": {
                                "sSortAscending":  ": Activar para ordenar la columna de manera ascendente",
                                "sSortDescending": ": Activar para ordenar la columna de manera descendente"
                            }
                        }
    });

	var v_idCliente;
	var v_nombre;
	var v_cuit;
	var v_condTribu;
	
    //Selecciona nombre y cuit del cliente desde la ventana modal clientes
    $(document).on("click", "#btnSeleccionarCliente", function(){
        //captura la fila seleccionada y la elimina
        v_idCliente = tableClientes.cell('.selected', 0).data();
        v_nombre = tableClientes.cell('.selected', 1).data();
        v_cuit = tableClientes.cell('.selected', 4).data();
        v_condTribu = tableClientes.cell('.selected', 5).data();		
        $("#idCliente").val(v_idCliente);
        $("#nomyape").val(v_nombre);
        $("#cuit").val(v_cuit);
		$("#txtCondTribu").val(v_condTribu);		
        $('#modal_clientes').modal('hide'); 
    });    
    //*** Fin CLIENTES ***//
   
	//--  INICIO FORMAS DE PAGO --//
    //-- INICIO Calculo de vueltos --//
		v_vuelto = 0;
		$("#importeRecibido").blur(function() {
			if($("#importeRecibido").val() != "0"){
				v_vuelto =  ($("#importeRecibido").val() - $("#totVtaConDesc").val());            
				$("#vuelto").val(v_vuelto.toFixed(2));      
			}    
		});
	//-- FIN Calculo de vueltos --//
		//nuevo para impuestos
		var v_totImpConDesc = 0;
		var v_subTotNetoConDesc = 0;	
	$("#btnCalculaDescGral").click(function(){
	   //control de descuento gral		
	   if(parseFloat($("#descGral").val()).toFixed(2) > 99 || parseFloat($("#descGral").val()).toFixed(2) < 0){
			alertify.message('¡Descuento Incorrecto!');
			$("#descGral").focus();
		}else{		
		v_descGral = parseFloat($("#descGral").val());
		v_totVtaConDesc = v_total - ((v_total * v_descGral) / 100);
		$("#totVtaConDesc").val(v_totVtaConDesc.toFixed(2));
		//nuevo para impuestos
		 v_subTotNetoConDesc = v_totVtaConDesc / porcentaje_imp; //precio de vta neto con desc
		 v_totImpConDesc = 	v_subTotNetoConDesc * porcentaje_imp_dec;			
		}	
	});
    //-- FIN DESCUENTOS --//

	//btn para volvel a la pantalla principal en el modal_pagos
	$("#btnVolverPantalla1").click(function(){
        reiniciarFormasPago();
        //$("#totVtaConDesc").val($("#txtTotalVenta").val());
		$("#totVtaConDesc").val(v_total.toFixed(2));
        $(".pantalla2").hide();
        $(".pantalla1").show();
    });

    //-- Definición de variables para Formas de pago --//
    var idFormaPago = 0; //para las opciones de pago, del 1 al 8
    var opcionbtnPago; //para saber que btn eligio el usuario FP (la clasica), OFP(otra forma pago)

	//funcion que reinicia todos los valores y campos de formas de pago tradicionales
    function reiniciarFormasPago(){
        idFormaPago = 0;
        $('#optionEfectivo').prop('checked', false);
        $('#optionDebito').prop('checked', false);
        $('#optionCredito').prop('checked', false);		
        $("#efectivoCant").val("0.00");
        $("#debitoCant").val("0.00");
        $("#creditoCant").val("0.00");        
		$("#importeRecibido").val("0.00");
        $("#vuelto").val("0.00"); 
		//reinicio comprobantes
		$('select[name="txtComprobante"]').val('1');
		//reinicio select de tarjetas
		$('#tarjetaDebito option:first-child').prop("selected", true);
        $('#tarjetaCredito option:first-child').prop("selected", true);        
		//reinicio cuotas
		$("#cuotas").val(1);		
        //descuentos
        $("#descGral").val("0.00");
    }

	//btn que abre el modal_pagos
    $("#btnFormaDePago").click(function(){
			opcionbtnPago = "FP";
			reiniciarFormasPago();
            $("#modal_pagos").modal("show");
            $("#modal_pagos").draggable({ handle: ".modal-header" });
            $("#btnVolverPantalla1").click();
            $("#totVtaConDesc").val($("#txtTotalVenta").val());
            $("#btnContinuarPantalla2").click(function(){   
				//control de desc Gral
				if(parseFloat($("#descGral").val()).toFixed(2) > 99 || parseFloat($("#descGral").val()).toFixed(2) < 0){
					alertify.message('¡Descuento Incorrecto!');
					$("#descGral").focus();
				}else{
					$("#btnCalculaDescGral").click();//ejecuto por si no se hizo antes		
				}                
                //Evalúo todas las combinaciones posibles con 3 opciones 
                //Solo EFECTIVO
                if( $('#optionEfectivo').prop('checked') && !$('#optionDebito').prop('checked') && !$('#optionCredito').prop('checked')) {
                    $(".pantalla1").hide();
                    $(".pantalla2").show();
                    $("#efectivoOpcion").show();
                    $("#debitoOpcion").hide();
                    $("#creditoOpcion").hide();					
					$("#efectivoCant").val(v_totVtaConDesc.toFixed(2)).prop('disabled', true);					
                    $("#div_calculo").show();                    
                    idFormaPago = 1;
                }else                
                //Solo DEBITO    
                if( !$('#optionEfectivo').prop('checked') && $('#optionDebito').prop('checked') && !$('#optionCredito').prop('checked')) {
                    $(".pantalla1").hide();
                    $(".pantalla2").show();
                    $("#efectivoOpcion").hide();
                    $("#debitoOpcion").show();
                    $("#creditoOpcion").hide();
                    $("#div_calculo").hide();	
                    $("#debitoCant").val(v_totVtaConDesc.toFixed(2)).prop('disabled', true);
                    idFormaPago = 2;            
                }else    
                //Solo CREDITO       
                if( !$('#optionEfectivo').prop('checked') && !$('#optionDebito').prop('checked') && $('#optionCredito').prop('checked')) {
                    $(".pantalla1").hide();
                    $(".pantalla2").show();                    
                    $("#efectivoOpcion").hide();
                    $("#debitoOpcion").hide();
                    $("#creditoOpcion").show();					
                    $("#div_calculo").hide();
                    $("#creditoCant").val(v_totVtaConDesc.toFixed(2)).prop('disabled', true);
                    idFormaPago = 3;
                }else
                //Efectivo y Débito
                if( $('#optionEfectivo').prop('checked') && $('#optionDebito').prop('checked') && !$('#optionCredito').prop('checked')) {
                    $(".pantalla1").hide();
                    $(".pantalla2").show();                    
                    $("#efectivoOpcion").show();
                    $("#debitoOpcion").show();
                    $("#creditoOpcion").hide();                   
                    $("#div_calculo").hide();                    
                    $("#efectivoCant").val(v_totVtaConDesc.toFixed(2)).prop('disabled', false);
					$("#efectivoCant").focus();
                    $("#debitoCant").val(0.00);					
                    $("#efectivoCant").focusout(function() {
						var n1, n2, tot = 0;
					  	//capturo y los paso a numero
					  	n1 = parseFloat($("#efectivoCant").val());
					  	n2 = parseFloat($("#debitoCant").val()); 
						tot = n1 + n2; //sumo los numeros	
						if(tot  > v_totVtaConDesc){
							$("#efectivoCant").val(v_totVtaConDesc.toFixed(2));
							$("#debitoCant").val(0.00);
						}else{
							var temp1 = 0;
							temp1 = v_totVtaConDesc - n1;    
							$("#debitoCant").val(temp1.toFixed(2));     
						}
                    });					
                    idFormaPago = 4;
                }else
                //Efectivo y Credito    
                if ($('#optionEfectivo').prop('checked') && $('#optionCredito').prop('checked') && !$('#optionDebito').prop('checked')) {
                    $(".pantalla1").hide();
                    $(".pantalla2").show();                    
                    $("#efectivoOpcion").show();
                    $("#debitoOpcion").hide();
                    $("#creditoOpcion").show();				
                    $("#div_calculo").hide();                    				
                    $("#efectivoCant").val(v_totVtaConDesc.toFixed(2)).prop('disabled', false);
					$("#efectivoCant").focus();
                    $("#creditoCant").val(0.00);				
					$("#efectivoCant").focusout(function() {
						var n1, n3, tot = 0;
					  	//capturo y los paso a numero
					  	n1 = parseFloat($("#efectivoCant").val());
					  	n3 = parseFloat($("#creditoCant").val()); 
						tot = n1 + n3; //sumo los numeros	
						if(tot  > v_totVtaConDesc){
							$("#efectivoCant").val(v_totVtaConDesc.toFixed(2));
							$("#creditoCant").val(0.00);
						}else{
							var temp1 = 0;
							temp1 = v_totVtaConDesc - n1;    
							$("#creditoCant").val(temp1.toFixed(2));     
						}
                    });					
                    idFormaPago = 5;
                }else
                //Debito y Credito    
                if ( $('#optionDebito').prop('checked') && $('#optionCredito').prop('checked') && !$('#optionEfectivo').prop('checked')) {
                    $(".pantalla1").hide();
                    $(".pantalla2").show();                    
                    $("#efectivoOpcion").hide();
                    $("#debitoOpcion").show();
                    $("#creditoOpcion").show();					
                    $("#div_calculo").hide();                                       
                    $("#debitoCant").val(v_totVtaConDesc.toFixed(2)).prop('disabled', false);
					$("#debitoCant").focus();
                    $("#creditoCant").val(0.00);					
					$("#debitoCant").focusout(function() {
						var n2, n3, tot = 0;
					  	//capturo y los paso a numero
					  	n2 = parseFloat($("#debitoCant").val());
					  	n3 = parseFloat($("#creditoCant").val()); 
						tot = n2 + n3; //sumo los numeros	
						if(tot  > v_totVtaConDesc){
							$("#debitoCant").val(v_totVtaConDesc.toFixed(2));
							$("#creditoCant").val(0.00);
						}else{
							var temp1 = 0;
							temp1 = v_totVtaConDesc - n2;    
							$("#creditoCant").val(temp1.toFixed(2));     
						}
                    });					
                    idFormaPago = 6;                    
                }else
                //Efectivo, Debito y Credito    
                if ( $('#optionEfectivo').prop('checked') && $('#optionDebito').prop('checked') && $('#optionCredito').prop('checked')) {
                    $(".pantalla1").hide();
                    $(".pantalla2").show();                    
                    $("#efectivoOpcion").show();
                    $("#debitoOpcion").show();
                    $("#creditoOpcion").show();					
                    $("#div_calculo").hide();                                       
					$("#efectivoCant").val(v_totVtaConDesc.toFixed(2)).prop('disabled', false);					
					$("#efectivoCant").focus();
					$("#debitoCant").val(0.00).prop('disabled', false);
                    $("#creditoCant").val(0.00);				
				  	$("#efectivoCant").focusout(function() {	
					   var n1, n2, n3, tot = 0;
					  //capturo y los paso a numero
					  n1 = parseFloat($("#efectivoCant").val());
					  n2 = parseFloat($("#debitoCant").val()); 
					  n3 = parseFloat($("#creditoCant").val());
					  tot = n1 + n2 + n3; //sumo los numeros
						//alert("n1 ="+n1+" n2 ="+n2+" n3 = "+n3+" tot = "+tot+" vta tot ="+v_totVtaConDesc);
					  if(parseFloat(tot.toFixed(2)) > parseFloat(v_totVtaConDesc.toFixed(2))){
							$("#efectivoCant").val(v_totVtaConDesc.toFixed(2));
							$("#debitoCant").val(0.00);
							$("#creditoCant").val(0.00);
					   }else{
							var temp1 = 0;
							temp1 = v_totVtaConDesc - (n1 + n3);    
							$("#debitoCant").val(temp1.toFixed(2));   	
					   }
					});
					$("#debitoCant").focusout(function() {	
					   var n1, n2, n3, tot = 0;
					  //capturo y los paso a numero
					  n1 = parseFloat($("#efectivoCant").val());
					  n2 = parseFloat($("#debitoCant").val()); 
					  n3 = parseFloat($("#creditoCant").val());
					  tot = n1 + n2 + n3; //sumo los numeros				
					  if(parseFloat(tot.toFixed(2)) > parseFloat(v_totVtaConDesc.toFixed(2))){
							$("#efectivoCant").val(v_totVtaConDesc.toFixed(2));
							$("#debitoCant").val(0.00);
							$("#creditoCant").val(0.00);
					   }else{
						   var temp1 = 0;
							temp1 = v_totVtaConDesc - (n1 + n2);    
							$("#creditoCant").val(temp1.toFixed(2));   	
					   }
					});
                    idFormaPago = 7;
                }
            });
    });
 
    //--Inicio COMPROBANTE  --//
		var idComprobante = $('select#txtComprobante').val();
		$('#txtIdComprobante').val(idComprobante);
		var descComprobante = $('select#txtComprobante').find("option:selected").text();
		descComprobante = jQuery.trim(descComprobante); //quito los espacios en blanco
		$('#prevComprobante').val(descComprobante);
		//Obtiene el valor "value" del campo de selección “select” despues del evento "change"
		$('select#txtComprobante').on('change',function(){
			//obtengo el value del select (ej el id 1, 2, etc)
			idComprobante = $(this).val();
			$('#txtIdComprobante').val(idComprobante);
			//obtengo el texto de la opción (ej, factura, recibo)
			descComprobante = $(this).find("option:selected").text();
			descComprobante = jQuery.trim(descComprobante); //quito los espacios en blanco
			$('#prevComprobante').val(descComprobante);
		});
    //--Fin COMPROBANTE  --//

	//btn pasa los datos al form previo a confirmar
    $("#btnAplicarFormaPago").click(function(){
            if(idFormaPago !== 0 && idFormaPago !== 8 ){
				//selecciona el value que figura en el option del select
				tarjetaDebito = jQuery.trim($('#tarjetaDebito option:selected').text()); //jQuery.trim quita espacios
                tarjetaCredito = jQuery.trim($('#tarjetaCredito option:selected').text()); 				              
                pagoEfectivo = parseFloat($("#efectivoCant").val()).toFixed(2);
                pagoDebito = parseFloat($("#debitoCant").val()).toFixed(2);
                pagoCredito = parseFloat($("#creditoCant").val()).toFixed(2);				
                v_cuotas = parseInt($("#cuotas").val());                
                $("#frmPagos").show();
                //paso los valores
                switch(idFormaPago) {
                    case 1:
                        $("#prevIdFp").val(1);
                        $("#prevFormaPago").val("Efectivo");
                        break;
                    case 2:
                        $("#prevIdFp").val(2);
                       $("#prevFormaPago").val("Débito");
                       break;
                    case 3:
                        $("#prevIdFp").val(3);
                       $("#prevFormaPago").val("Crédito");
                       break;    
                    case 4:
                        $("#prevIdFp").val(4);
                        $("#prevFormaPago").val("Efectivo-Débito");
                        break;
                    case 5:
                        $("#prevIdFp").val(5);
                       $("#prevFormaPago").val("Efectivo-Crédito");
                       break;
                    case 6:
                        $("#prevIdFp").val(6);
                       $("#prevFormaPago").val("Débito-Crédito");
                       break;        
                    case 7:
                        $("#prevIdFp").val(7);
                       $("#prevFormaPago").val("Efectivo-Débito-Crédito");
                       break;
                }  
                
                $("#prevTDnombre").val(tarjetaDebito);
                $("#prevTCnombre").val(tarjetaCredito);
                $("#prevCantCuotas").val(v_cuotas);                
                $("#prevEfectivo").val(pagoEfectivo);
                $("#prevTD").val(pagoDebito);
                $("#prevTC").val(pagoCredito);				
               	$("#prevOFP").val("0.00"); 				
                $("#prevDesc").val(v_descGral); 								
                $("#prevDescGlobal").val(v_totVtaConDesc.toFixed(2));				
                reiniciarFormasPago();
                $("#btnVolverPantalla1").click();
                $("#modal_pagos").modal("hide");
                $("#btnFormaDePago").hide();
				$("#btnOFP").hide();				
                //deshabilito los botones que funcionan en la venta
                $("#btnAgregarCarritoVentas").prop('disabled', true);
                $('#tablaVentas > tbody > tr > td > .removerCarritoVentas').prop('disabled', true);                
				//habilito el boton de registrar VENTA
				$('#btnRegistrarVenta').prop('disabled', false); //habilito el boton de registrar VENTA
				$("html, body").animate({ scrollTop: 0 }, "slow"); //hago un scroll hasta arriba
				//$('#btnRegistrarVenta').focus();
				if(opcionbtnPago == "FP"){					
				$("#txtImpuesto").val(v_totImpConDesc.toFixed(2));
				$("#txtSubTotal").val(v_subTotNetoConDesc.toFixed(2));				
				$("#txtTotalVenta").val($("#prevDescGlobal").val());
				}
            }    
        }); 
   
	//btn cancela el pago y cierra el formulario
    $("#btnCancelarFormaPago").click(function(){
            //limpio los campos
            //$("#btnConfirmarFormaPago").removeClass('disabled');
            $("#btnFormaDePago").show();
			$("#btnOFP").show();			
            $("#frmPagos").hide();
            $('#btnRegistrarVenta').prop('disabled', true);            
			//dejo los subtotales de impuesto y neto con valores sin decuentos
			$('#txtImpuesto').val(v_subTotImpuesto.toFixed(2)); 
			$('#txtSubTotal').val(v_subTotNeto.toFixed(2));		
			//dejo el total de la venta sin el descuento, en su estado normal
			$("#txtTotalVenta").val(v_total.toFixed(2));		
            //habilito los botones que funcionan en la venta
            $("#btnAgregarCarritoVentas").prop('disabled', false);
            $('#tablaVentas > tbody > tr > td > .removerCarritoVentas').prop('disabled', false);
        });
	//--  FIN FORMAS DE PAGO --//




	//INICIO otras OFP (otras formas de pago)
	selectOFP = 0;
	//funcion que reinicia todos los valores y campos de OFP
	function reiniciarOFP(){
		idFormaPago = 0;
		$("#opcionEfectivo").hide();
		$("#opcionDebito").hide();
		$("#opcionCredito").hide();
		$("#importeE").val("0.00");
		$("#importeD").val("0.00");
		$("#importeC").val("0.00");
		$("#formasDePagoEDC").prop('disabled', true);
		//reinicio datos de Nota de credito
		$("#nroNC").prop('disabled', false);
		$("#nroNC").val(0); 
		$("#importeNC").val(0.00); 
		$("#estadoNC").val("");
		$("#nroVentaAsoc").val("");
		$("#clienteNC").val("");
		$("#cuitNC").val("");
		$("#labelOFP").text("Diferencia");
		$("#totalOFP").val(0.00);
		$("#totalOFP").css("background-color","#fff");	
		$("#totalOFP").css("color","black");	
		$("#totalOFP").css("border","1px solid #ddd");	
		//reinicio comprobantes
		$('select[name="txtComprobante"]').val('1');
		//reinicio select de tarjetas
		$('#tarjDebito option:first-child').prop("selected", true);
		$('#tarjCredito option:first-child').prop("selected", true);		 
		//reinicio select Formas de Pago EDC
		selectOFP = 0;		
		//reinicio btn de Aplicar
		$("#btnAplicarOFP").prop('disabled', true);		
		//reinicio cuotas
		$("#cantCuotas").val(1);		
	}	

	//btn que abre el modal_ofp
	$("#btnOFP").click(function(){ 
		opcionbtnPago = "OFP";
		$("#prevIdFp").val(8);
		reiniciarOFP(); 
		$("#modal_ofp").modal("show");
		$("#modal_ofp").draggable({ handle: ".modal-header" });
		$('#formasDePagoEDC option:first-child').prop("selected", true);		
		$("#modal_pagos").modal("hide");
	 });
	
	$("#nroNC").val(0); //inicializo el input	
	$("#importeNC").val("0.00"); //inicializo el input

	var temp_totVta = 0;
	var totDevolPositiva = 0;
	var totalOFP = 0;	
	var totDevol;
	var estadoDevol;
	var nroVentaAsoc;
	var nomyape;
	var cuit;
	var nroNC = 0;
 
	//BTN busca la nota de credito con ajax
	$("#btnBuscarNC").click(function(){
		nroNC = parseInt($("#nroNC").val());	
		 $.ajax({
			  url: "../libreria/ORM/buscar_NotaCredito.php",
			  type: "POST",
			  datatype:"json",    
			  data:  {nroNC},    
			  success: function(data) {
					//recibo el json desde PHP y lo parseo	
					var datos = JSON.parse(data);
					if (!$.trim(datos)){
						$("#importeNC").val(0.00);//si la consulta no devuelve nada, le pongo cero 
						$("#estadoNC").val("");
						$("#nroVentaAsoc").val("");
						$("#clienteNC").val("");
						$("#cuitNC").val("");
						$("#totalOFP").val(0.00);
						$("#btnAgregarCarritoVentasConNC").prop('disabled', true);
					}
					else{
						totDevol = parseFloat(datos[0].totalDevolucion).toFixed(2);
						estadoDevol = datos[0].estado;
						nroVentaAsoc = datos[0].nroVenta;
						nomyape = datos[0].nomyape;
						cuit = datos[0].cuit;
						totDevolPositiva = Math.abs(totDevol); //para mostrar positivo el importe 	
						$("#importeNC").val(parseFloat(totDevolPositiva).toFixed(2));//muestro el importe 
						$("#estadoNC").val(estadoDevol);//muestro el estado 
						$("#nroVentaAsoc").val(nroVentaAsoc);//muestro el estado 
						$("#clienteNC").val(nomyape);//muestro el estado 
						$("#cuitNC").val(cuit);//muestro el estado 
						$("#btnAgregarCarritoVentasConNC").prop('disabled', false);						
						//calculo de la diferencia con el total de la venta
						temp_totVta = parseFloat($("#txtTotalVenta").val()).toFixed(2);
						totalOFP = parseFloat(Math.abs(temp_totVta - totDevolPositiva)).toFixed(2); //saco el valor absoluto para evitar signos						
						if ($("#estadoNC").val() == "Cancelada" || $("#estadoNC").val() == "Dinero Devuelto"){
							alertify.warning("La Devolución ya fue CANCELADA");
							$("#formasDePagoEDC").prop('disabled', true);
							$("#btnAplicarOFP").prop('disabled', true);
							$("#nroNC").focus();
						}else{
							if (parseFloat($("#txtTotalVenta").val()).toFixed(2) > totDevolPositiva){
								$("#totalOFP").val(totalOFP).css("border","1px solid #5cb85c");	
								$('#labelOFP').hide().text("Faltan...").fadeIn(1000);
								$("#totalOFP").css("background-color","#fff");	
								$("#totalOFP").css("color","black");
								$("#totalOFP").val(totalOFP);
								$("#formasDePagoEDC").prop('disabled', false);
								$("#btnAplicarOFP").prop('disabled', false);
							}else
							if (parseFloat($("#txtTotalVenta").val()).toFixed(2) < totDevolPositiva){
								$('#labelOFP').hide().text("Sobran...").fadeIn(1000);
								$("#totalOFP").css("border","1px solid red");	
								$("#totalOFP").css("background-color","#fff");
								$("#totalOFP").css("color","black");	
								$("#totalOFP").val(totalOFP);
								$("#formasDePagoEDC").prop('disabled', true);
								$("#btnAplicarOFP").prop('disabled', true);
							}else
							if (parseFloat($("#txtTotalVenta").val()).toFixed(2) == totDevolPositiva){
								$('#labelOFP').hide().text("! Importe Exacto !").fadeIn(1000);
								$("#totalOFP").css("border","1px solid #3e9def");
								$("#totalOFP").css("background-color","#3e9def");	
								$("#totalOFP").css("color","white");	
								$("#totalOFP").val(Math.abs(totDevol).toFixed(2));
								$("#formasDePagoEDC").prop('disabled', true);
								$("#btnAplicarOFP").prop('disabled', false);
							}
						}		
					}
			   }
			});
	});

	//boton para cerrar modal_ofp
	$('#btnCerrarModal').click(function() {
		$('#modal_ofp').modal('hide');
	});

	//select para elegir pago complementario E, D o C
	$('select#formasDePagoEDC').on('change',function(){
		selectOFP = $(this).val(); //capturo la forma de pago
		switch(selectOFP) {
				case "Efectivo":
					$("#opcionEfectivo").show();
					$("#opcionDebito").hide();
					$("#opcionCredito").hide();
					$("#importeE").val(totalOFP);
					break;
				case "Debito":
					$("#opcionDebito").show();
					$("#opcionEfectivo").hide();
					$("#opcionCredito").hide();
					$("#importeD").val(totalOFP);
				   break;
				case "Credito":
				   $("#opcionCredito").show();
					$("#opcionDebito").hide();
					$("#opcionEfectivo").hide();
					$("#importeC").val(totalOFP);
				   break; 
				}  
				$("#nroNC").prop('disabled', true);
	});

	//btn pasa los datos al form previo a confirmar
	$("#btnAplicarOFP").click(function(){
		idFormaPago = 8; //es OFP (otra forma de pago) en la tabla formaspagos
		if(idFormaPago == 8 ){
			$("#frmPagos").show();	
			switch(selectOFP) {
				case "Efectivo":	
					$("#prevFormaPago").val("Nota de Crédito-Efectivo");
					break;
				case "Debito":
					$("#prevFormaPago").val("Nota de Crédito-Débito");
				   break;
				case "Credito":
					$("#prevFormaPago").val("Nota de Crédito-Crédito");
				   break; 
				default:
					$("#prevFormaPago").val("Nota de Crédito");
			}

			//selecciona el value que figura en el option del select
			tarjDebito = $('#tarjDebito option:selected').val(); 
			tarjCredito = $('#tarjCredito option:selected').val(); 
			$("#prevTDnombre").val(tarjDebito);
			$("#prevTCnombre").val(tarjCredito);			
			//tomamos los importes
			importeE = parseFloat($("#importeE").val()).toFixed(2);
			importeD = parseFloat($("#importeD").val()).toFixed(2);
			importeC = parseFloat($("#importeC").val()).toFixed(2);			
			$("#prevEfectivo").val(importeE);
			$("#prevTD").val(importeD);
			$("#prevTC").val(importeC);			
			//tomamos la cant de cuotas
			cantCuotas = parseInt($("#cantCuotas").val());
			$("#prevOFP").val(parseFloat(totDevolPositiva).toFixed(2));
			$("#prevCantCuotas").val(cantCuotas);
			$("#prevDesc").val(v_descGral);
			v_totVtaConDesc = parseFloat($("#txtTotalVenta").val());			
			$("#prevDescGlobal").val(v_totVtaConDesc.toFixed(2));			
			//establezco nombre y cuit asociados a la nota de crédito
			$("#nomyape").val(nomyape);
        	$("#cuit").val(cuit);			
			//reincio todos los valores
			reiniciarOFP();
			$("#modal_ofp").modal("hide");
			$("#btnFormaDePago").hide();
			$("#btnOFP").hide();
			$('#btnRegistrarVenta').prop('disabled', false); //habilito el boton de registrar VENTA
			$("html, body").animate({ scrollTop: 0 }, "slow"); //hago un scroll hasta arriba			
			//deshabilito los botones que funcionan en la venta
			$("#btnAgregarCarritoVentas").prop('disabled', true);
			$('#tablaVentas > tbody > tr > td > .removerCarritoVentas').prop('disabled', true);
		}
	});
	
	//FIN otras OFP (otras formas de pago)
	
	//INICIO -- Registrar VENTA - Validación --	//
	//btn que registra la venta final
    $("#btnRegistrarVenta").click(function(){
       idUsuario  = $('#idUsuario').val();     
       idCliente  = $('#idCliente').val();   
	   condTribu  = $('#txtCondTribu').val();   
       nroVenta  = $('#txtNroVenta').val();          
       var fecha = $('#txtFechaActual').val();
       // convertimos la fecha de dd/mm/yyyy a yyyy/mm/dd
       var date = fecha;
       var fecha_actual = date.split("/").reverse().join("-");              
       //Obtenemos la cantidad de productos en el carrito
       var rowCount = $('#tablaVentas tbody tr').length; //se resta 1 porque es la fila de encabezado
       var idArray = []; //Array con los IDs de los productos en el carrito
       var codArray = [];
       var nombresArray = []; //Array con los nombres de los prod 
       var cantidadArray = []; //Array las cantidad de cada producto en el carrito
	   var precioVentaNetoArray = [];//Array con los precios de venta neto, sin impuestos
       var precioVentaArray = [];//Array con los precios de venta de cada producto en el carrito    
       var descuentoArray = []; //Array con los desc de cada producto en el carrito
       var subTotalArray = []; //Array con los subtotales de cada producto en el carrito
        
       $("#tablaVentas tbody tr").each(function(){
           idArray.push($(this).find("td:eq(0)").text());
           codArray.push($(this).find("td:eq(1)").text());
           nombresArray.push($(this).find("td:eq(2)").text());
           cantidadArray.push($(this).find("td:eq(3)").text());
           precioVentaArray.push($(this).find("td:eq(4)").text());
           descuentoArray.push($(this).find("td:eq(5)").text());
		   precioVentaNetoArray.push($(this).find("td:eq(7)").text());
           subTotalArray.push($(this).find("td:eq(8)").text());    
       });
       
        //controlamos que la venta no sea 0
        if(v_totVtaConDesc.toFixed(2) == 0){
            alertify.warning("La venta no puede ser igual a 0");
        }else{ 
            alertify.confirm(
               "<strong>¿Confirma la Venta?</strong>", 
               "<br> Total de la Venta: "+ v_totVtaConDesc.toFixed(2),               
              function(){
                //Para tabla VENTAS  
                $("#txtIdUsuario").val(idUsuario);
                $("#txtIdCliente").val(idCliente);
                $("#txtNroVentaOk").val(nroVenta);
                $("#txtIdComprobante").val(idComprobante);                
                $("#txtDesc").val(v_descGral.toFixed(2));                   
				$("#txtImpuestoOk").val(v_subTotImpuesto.toFixed(2));
				$("#txtSubTotalOk").val(v_subTotNeto.toFixed(2));				
                $("#txtTotalVentaOk").val(v_totVtaConDesc.toFixed(2));
                $("#txtFechaActualOk").val(fecha_actual);
                
                //Para tabla DETALLEVENTA                    
                $('#txtArrayIdProd').val(JSON.stringify(idArray));
                $('#txtArrayCodxProd').val(JSON.stringify(codArray));
                $('#txtArrayNomxProd').val(JSON.stringify(nombresArray));
                $('#txtArrayCantxProd').val(JSON.stringify(cantidadArray));
                $('#txtArrayDescxProd').val(JSON.stringify(descuentoArray));                
				$('#txtArrayPrecioVentaNetoxProd').val(JSON.stringify(precioVentaNetoArray)); 				  
                $('#txtArrayPrecioVentaxProd').val(JSON.stringify(precioVentaArray));
                $('#txtArraysubTotalxProd').val(JSON.stringify(subTotalArray));
                $('#txtRowCount').val(rowCount);
                                  
                //Para tabla PAGOS                
                $("#txtIdFormaPago").val($("#prevIdFp").val());
                $("#txtCuotas").val($("#prevCantCuotas").val());                
                $("#txtPagoEfectivo").val($("#prevEfectivo").val());
                $("#txtPagoDebito").val($("#prevTD").val());
                $("#txtPagoCredito").val($("#prevTC").val());
				
				//nuevo pagoOFP
				$("#txtNombreOFP").val($("#prevFormaPago").val());   
				$("#txtPagoOFP").val($("#prevOFP").val()); 				  
				$("#txtNroNC").val(nroNC);//envio el nro de la NC para saber cual use                   
                $("#txtTarjetaDebito").val($("#prevTDnombre").val());
                $("#txtTarjetaCredito").val($("#prevTCnombre").val());
                
                //habilito los botones que funcionan en la venta
                $("#btnAgregarCarritoVentas").prop('disabled', false);
                $('#tablaVentas > tbody > tr > td > .removerCarritoVentas').prop('disabled', false);
                  
                //Ejecuto el boton para enviar todos los inputs del form ventas  
                $("#btnVenta").click();
                $('#txtTotalVenta').val(0.00);
                  
                alertify.success('¡Venta Exitosa!');
              },
              function(){
                alertify.error('Se canceló la Venta');								  
				//dejo los subtotales de impuesto y neto con valores sin decuentos
				$('#txtImpuesto').val(v_subTotImpuesto.toFixed(2)); 
				$('#txtSubTotal').val(v_subTotNeto.toFixed(2));
				//dejo el total de la venta sin el descuento, en su estado normal
				$("#txtTotalVenta").val(v_total.toFixed(2));				  
              });
        }            
    });    
	//FIN    -- Registrar VENTA - Validación --	//
	
/* CODIGO AUTOCOMPLETE PRODUCTOS JS -- inicio*/
$(function() {	
    // Asignar evento y la función para la limpieza de los campos
    $('#busca').on('input', limpiacampos);    
    $( "#busca" ).autocomplete({
	    minLength: 1, // Inicia autocomplete a partir del 1er caracter tipeado
	    source: function( request, response ) {
	        $.ajax({
                url: "../libreria/ORM/autocomplete_prod.php",
	            dataType: "json",
                type: "GET",
	            data: {
	            	accion: 'autocomplete',
	                parametro: $('#busca').val()
	            },
	            success: function(data) {
	               response(data);
	            }
	        });
	    },
		
	    focus: function( event, ui ) {
	        $("#busca").val( ui.item.nombre );
	        cargarDatos();
	        return false;
	    },
	    select: function( event, ui ) {
	        $("#busca").val( ui.item.nombre );
	        return false;
	    }		
    })
    
    // Este es el texto que se muestra al ir escribiendo en el input
	// Para buscar el producto por NOMOBRE o CODIGO
    /*.autocomplete( "instance" )._renderItem = function( ul, item ) {
      return $( "<li>" )
        .append( "<a><b>Codigo: </b>" + item.codigo + "<br><b>Nombre del Producto: </b>" + item.nombre + "</a><br>" )
        .appendTo( ul );
    };*/

	// Para buscar el producto SOLO por nombre	
	.autocomplete( "instance" )._renderItem = function( ul, item ) {
      return $( "<li>" )
        .append( "<a><b>" + item.nombre + "</b></a><br>" )
        .appendTo( ul );
    };
	
    // Función para cargar los datos de la consulta en los respectivos campos del formulario HTML
    function cargarDatos(){
    	var busca = $('#busca').val();

    	if(busca != "" && busca.length >= 1){
    		$.ajax({
                url: "../libreria/ORM/autocomplete_prod.php",
	            dataType: "json",	
                type: "GET",
	            data: {
	            	accion: 'consulta',
	                parametro: $('#busca').val()
	            },
	            success: function( data ) {
				   //console.log(data);					
                   $('#id').val(data[0].id);    
	               $('#codigo').val(data[0].codigo);
	               $('#nombre').val(data[0].nombre);
	               $('#precioVenta').val(data[0].precioVenta);
	               $('#stock').val(data[0].stock);
                    
                   var maximo = data[0].stock;
                    //para que la cantidad no supere el stock de ese momento
                    $('#cantidad').attr({
                       'max' : maximo ,
                       'min' : 1
                    });
					$('#precioVenta').prop('disabled', false);
                    $('#cantidad').prop('disabled', false);
                    $('#descuento').prop('disabled', false);
	            }
	        });
    	}
    }

    // Función para borrar los campos si la búsqueda está vacía
    function limpiacampos(){
       var busca = $('#busca').val();
       if(busca == ""){
	       $('#codigo').val('');
           $('#nombre').val('')
           $('#precioVenta').val('');
           $('#stock').val('')
       }
    }
});
/* CODIGO AUTOCOMPLETE PRODUCTOS JS -- fin*/	
});	