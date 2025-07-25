import { Component, ViewChild, TemplateRef, OnInit, Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { HttpClient, } from '@angular/common/http';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as  pdfFonts from 'pdfmake/build/vfs_fonts';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
import { DateUtilService } from './date-util.service';
import { Base64service } from '../_base64/Base64'


@Injectable({
	providedIn: 'root'
})

export class PdfGenerationServiceGrua {

	//poliza emitida desde el cor del negocio
	xlogo: any;
	xplan;
	xservicio!: any;
	orden!: any
	xcliente!: any
	xproveedor!: any
	notificacion!: any
	contrato!: any
	xdireccion_proveedor!: any
	xtelefono_proveedor!: any;
	xidentificacion_proveedor!: any;
	xvehiculo!: any;
	xnombre_siniestro!: any;
	xtelefono_siniestro!: any;
	fajuste!: any;
	xaccidente!: any;
	cestatus!: any;
	xestatus!: any;
	xplaca!: any;
	xidentificacion!: any;
	xdireccion_siniestro!: any;
	fsolicitud!: any;
	xorigen_grua!: any;
	xdestino_grua!: any;
	monto_grua!: any;
	msubtotal!: any;
	miva!: any;

	constructor(
		private router: Router,
		private http: HttpClient,
		private dateUtilService: DateUtilService,
		private base64: Base64service
	) {}

	async LoadDataServiceOrder(corden: any) {
		await this.http.get(environment.apiUrl + `/api/v1/events/getServiceOrder/${corden}`).subscribe(async (response: any) => {
			if (response.status) {
				const monto = response.data.mmonto_grua.toString()
				this.orden = corden;
				this.xservicio = response.data.xservicio;
				this.xcliente = response.data.xproveedor;
				this.xproveedor = response.data.xproveedor;
				this.notificacion = response.data.cnotificacion;
				this.contrato = response.data.ccontratoflota;
				this.xdireccion_proveedor = response.data.xdireccion_proveedor;
				this.xtelefono_proveedor = response.data.xtelefono_proveedor;
				this.xidentificacion_proveedor = response.data.xidentidad_proveedor;
				this.xtelefono_siniestro = response.data.xtelefonosiniestro;
				this.xnombre_siniestro = response.data.xnombresiniestro + ' ' + response.data.xapellidosiniestro;
				this.xdireccion_siniestro = response.data.xdireccionsiniestro;
				this.xidentificacion = response.data.icedulasiniestro + '-' + response.data.xcedulasiniestro;
				this.xvehiculo = response.data.xmarca + ' ' + response.data.xmodelo;
				this.xplaca = response.data.xplaca;
				this.fajuste = this.dateUtilService.formatDate(new Date(response.data.fajuste));
				this.xaccidente = response.data.xdescripcion;
				this.cestatus = response.data.cestatusgeneral;
				this.xestatus = response.data.xestatusgeneral;
				this.fsolicitud = response.data.fsolicitud;
				this.xorigen_grua = response.data.xorigen_grua;
				this.xdestino_grua = response.data.xdestino_grua;
				let mmontoGrua = response.data.mmonto_grua;
				if (mmontoGrua !== null && mmontoGrua !== undefined && !isNaN(mmontoGrua)) {
					mmontoGrua = parseFloat(mmontoGrua).toFixed(2);
					const sub = (parseFloat(mmontoGrua) * 100) / 116
					this.msubtotal = sub.toFixed(2) + ' ' + response.data.xmoneda
					const iva = sub * 0.16
					this.miva = iva.toFixed(2) + ' ' + response.data.xmoneda
					console.log(iva);
					this.monto_grua = mmontoGrua + ' ' + response.data.xmoneda
				}
				this.createPdfServiceOrder();
			}
		},(err) => { });
	}

	buildStatus(){
		if(this.cestatus == 13){
		  this.xestatus
		  return "color1"
		}else{
		  this.xestatus
		  return "color2"
		}
	}

	formatDate(dateString) {
		const months = [
			'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
			'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
		];
	
		const date = new Date(dateString);
		const day = date.getDate();
		const month = months[date.getMonth()];
		const year = date.getFullYear();
	
		return `Caracas, ${day} de ${month} del ${year}`;
	}

	createPdfServiceOrder() {
		try {
			const formattedDate = this.formatDate(this.fsolicitud);
			const pdfDefinition: any = {

				content: [
					{
						columns: [
							{
							style: 'header',
							text: [
							  {text: 'RIF: '}, {text: 'J000846448', bold: true},
							  '\nDirección: Av. Francisco de Miranda, Edif. Cavendes, Piso 11 OF 1101',
							  '\nUrb. Los Palos Grandes, 1060 Chacao, Caracas.',
							  '\nTelf. +58 212 283-9619 / +58 424 206-1351',
							  '\nUrl: www.lamundialdeseguros.com'
							],
							alignment: 'left'
						  },
						  {
							width: 160,
							height: 70,
							image: this.base64.logoArysImage().image,
							alignment: 'right'
						  }
						]
					},
					{
						alignment: 'center',
						style: 'title',
						margin: [0, 0, 0, 2],
						table: {
							widths: ['*'],
							body: [
								[{ text: `\n\nORDEN DE ${this.xservicio} #${this.orden}\n\n`, alignment: 'center', fillColor: '#fff', bold: true, border: [false, false, false, false] }],
							]
						}
					},
					{
						style: 'tableExample',
						table: {
							widths: ['*'],
							body: [
								[{text: [{ text: 'FACTURAR A NOMBRE DE: ', bold: true }, this.xnombre_siniestro]}],
								[{text: [{ text: 'IDENTIFICACIÓN: ', bold: true }, this.xidentificacion]}],
								[{text: [{ text: 'DIRECCIÓN FISCAL: ', bold: true }, this.xdireccion_siniestro]}],
								[{text: [{ text: 'TELÉFONO: ', bold: true }, this.xtelefono_siniestro]}],
								[{text: [{ text: '\n'}]}]
							]
						},
						layout: 'noBorders'
					},
					{
						alignment: 'left',
						table: {
							widths: ['*'],
							body: [
								[{ text: '', alignment: 'left', fillColor: '#fff', bold: true, border: [false, true, false, false] }]
							]
						}
					},
					{
						style: 'tableExample',
						table: {
						  widths: ['*', 'auto'],
						  body: [
							[`${formattedDate}`, { text: `${this.xestatus}`, style: this.buildStatus(), noWrap: true }],
							[`\n`, `\n`],
						  ]
						},
						layout: 'noBorders'
					},
					{
						style: 'tableExample',
						table: {
						  widths: ['*', 'auto'],
						  body: [
							[{text: [{ text: ' ' }]}, { text: [{ text: 'MEMBRESÍA: ', bold: true }, `#-${this.contrato}`] }],
						  ]
						},
						layout: 'noBorders'
					},
					{
						style: 'tableExample',
						table: {
						  widths: ['*', 'auto'],
						  body: [
							[{text: [{ text: 'ATENCION: ', bold: true }, this.xproveedor]}, { text: [{ text: 'NOTIFICACIÓN: ', bold: true }, this.notificacion] }],
						  ]
						},
						layout: 'noBorders'
					},
					{
						style: 'tableExample',
						table: {
							widths: ['*'],
							body: [
								[{text: [{ text: 'DIRECCIÓN: ', bold: true }, this.xdireccion_proveedor]}],
								[{text: [{ text: 'RIF: ', bold: true }, this.xidentificacion_proveedor]}],
								[{text: [{ text: 'TELÉFONO: ', bold: true }, this.xtelefono_proveedor]}],
							]
						},
						layout: 'noBorders'
					},
					{
						style: 'tableExample',
						table: {
						  widths: ['*'],
						  body: [
							[`\n\nSirva la presente para solicitarle la prestación del servicio de ${this.xservicio} para nuestro afliado \n\n\n\n`]
						  ]
						},
						layout: 'noBorders'
					},
					{
						style: 'tableExample',
						table: {
						  widths: ['*', 'auto'],
						  body: [
							[{text: [{ text: 'CLIENTE: ', bold: true }, this.xnombre_siniestro]}, { text: [{ text: 'VEHICULO: ', bold: true }, this.xvehiculo] }],
							[{text: [{ text: 'TELÉFONO: ', bold: true }, this.xtelefono_siniestro]}, { text: [{ text: 'PLACA: ', bold: true }, this.xplaca] }],
							[`\n`, `\n`],
						  ]
						},
						layout: 'noBorders'
					},
					{
						style: 'tableExample',
						table: {
							widths: ['*'],
							body: [
								[{text: [{ text: 'FECHA DE AJUSTE: ', bold: true }, this.fajuste]}],
								[{text: [{ text: 'LUGAR DE ORIGEN: ', bold: true }, this.xorigen_grua]}],
								[{text: [{ text: 'LUGAR DE DESTINO: ', bold: true }, this.xdestino_grua]}],
								[{text: [{ text: '\n'}]}]
							]
						},
						layout: 'noBorders'
					},
					{
						style: 'tableExample',
						table: {
							widths: [ 'auto', 325, '*' ], // Ajusta los anchos de las columnas según tus necesidades
							headerRows: 1,
							body: [
								[
									{ text: 'Cantidad', style: 'tableHeader' }, 
									{ text: 'Servicio', style: 'tableHeader' }, 
									{ text: 'Precio', style: 'tableHeader' }
								],
								[
									'1', 
									this.xservicio, 
									this.monto_grua
								],
							]
						},
						layout: 'headerLineOnly'
					},
					{
						alignment: 'right', // Alinea el contenedor a la derecha
						margin: [0, 20, 73, 0],
						columns: [
							{
								width: '*', // Columna de relleno para empujar la tabla a la derecha
								text: ''
							},
							{
								width: 'auto', // La tabla ocupará solo el espacio necesario
								table: {
									body: [
										[{ text: [{ text: 'Subtotal: ', bold: true, alignment: 'left' }] }, { text: [{ text: `${this.msubtotal}`, alignment: 'right' }] }],
										[{ text: [{ text: 'IVA: ', bold: true, alignment: 'left' }] }, { text: [{ text: `${this.miva}`, alignment: 'right' }] }],
										[{ text: [{ text: 'Total: ', bold: true, alignment: 'left' }] }, { text: [{ text: `${this.monto_grua}`, alignment: 'right' }] }],
										[{ text: [{ text: 'Cubierto: ', bold: true, alignment: 'left' }] }, { text: [{ text: `${this.monto_grua}`, alignment: 'right' }] }],
										[{ text: [{ text: 'No Cubierto: ', bold: true, alignment: 'left' }] }, { text: [{ text: '0.00', alignment: 'right' }] }],
									]
								},
								layout: 'noBorders', // Elimina los bordes de la tabla
								style: 'tableExample'
							}
						]
					},
					{
						text: '\n\nSin más a que hacer referencia, me despido',
					},
				],
				styles: {
					title: {
						fontSize: 12,
						bold: true,
						alignment: 'center'
					},
					header: {
						fontSize: 7.5,
						color: 'gray'
					},
					data: {
						fontSize: 8
					},
					col: {
						fontSize: 10
					},
					tableExample: {
						fontSize: 10
					},
					color1: {
						color: '#1D4C01'
					  },
					  color2: {
						color: '#7F0303'
					  },
				},
				background: [
					{
					  // Cargar la imagen de la marca de agua
					  image: this.base64.backgroundArysImage().image,
					  // Definir las dimensiones de la imagen (opcional)
					  width: 400,
					  height: 200,
					  // Establecer la opacidad de la marca de agua
					  opacity: 0.1,
					  // Ajustar la posición de la marca de agua
					  absolutePosition: {x: 90, y: 300} // Ajusta las coordenadas según tu necesidad
					}
				],
				footer: {
					columns: [
						{ image: this.base64.footer1Image().image,
							height: 100,
							fit: [595, 100]
						}
					]
				},
			}
			let pdf = pdfMake.createPdf(pdfDefinition);
			// pdf.download(`Póliza - ${this.xnombrecompleto}`);
			pdf.open();

		}
		catch (err) { console.log() }
	}
}