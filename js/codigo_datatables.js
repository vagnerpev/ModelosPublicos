$(document).ready(function() { 
	 
  //-- Código para tradusir datatable para portugues --//
    var table = $('.tabl').DataTable({
		             //	"bDestroy": true,
					    destroy: true,
						lengthChange: false,
						"deferRender": true,
		 				"bProcessing": true,
    					"bDeferRender": true,

						//configurado em portugues
											
						
                        "language": {
							"url":"//cdn.datatables.net/plug-ins/1.10.16/i18n/Portuguese.json"
                        },

						/*"language": {
							 "sEmptyTable": "Nenhum registro encontrado",
							 "sInfo": "Mostrando de _START_ até _END_ de _TOTAL_ registros",
							 "sInfoEmpty": "Mostrando 0 até 0 de 0 registros",
							 "sInfoFiltered": "(Filtrados de _MAX_ registros)",
							 "sInfoPostFix": "",
							 "sInfoThousands": ".",
							 "sLengthMenu": "_MENU_ resultados por página",
							 "sLoadingRecords": "Carregando...",
							 "sProcessing": "Processando...",
							 "sZeroRecords": "Nenhum registro encontrado",
							 "sSearch": "Pesquisar",
						"oPaginate": {
							 "sNext": "Próximo",
							 "sPrevious": "Anterior",
							 "sFirst": "Primeiro",
							 "sLast": "Último"
						 },
							 "oAria":{
							 "sSortAscending": ": Ordenar colunas de forma ascendente",
							 "sSortDescending": ": Ordenar colunas de forma descendente"
						 }
						 },*/
					 
						//extension para BUTTONS
						dom: 'Bfrtip', //para ver opciones de 10, 20 o mas paginas hay que añadir letra "l"

						//botones position horizontal agrupados	
						buttons:[
							{
								extend:    'excelHtml5',
								text:      '<i class="fa fa-file-excel-o fa-lg"></i> ',
								titleAttr: 'Exportar a Excel',
								className: 'btn btn-default',

							},
							{
								extend:    'pdfHtml5',
								text:      '<i class="fa fa-file-pdf-o fa-lg"></i> ',
								titleAttr: 'Exportar a PDF',
								className: 'btn btn-default',

							},
							{
								extend:    'print',
								text:      '<i class="fa fa-print fa-lg"></i> ',
								titleAttr: 'Imprimir',
								className: 'btn btn-default',

							},
						],
									 
		
                    });


});