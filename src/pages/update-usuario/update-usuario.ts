import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Usuario } from '../../models/usuario';
import { ApiUsuariosProvider } from '../../providers/api-usuarios/api-usuarios';
import { UsuarioAtivoProvider } from '../../providers/usuario-ativo/usuario-ativo';
import { LoginPage } from '../login/login';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

/**
 * Generated class for the UpdateUsuarioPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-update-usuario',
  templateUrl: 'update-usuario.html',
})
export class UpdateUsuarioPage {

  public numeroTelefone: string;
  public cargo: string;
  public empresa: string;
  public pais: string;
  public estado: string;
  public areaDeInteresse: string;
  private updateForm: FormGroup;
  private tentouEnviar: boolean;
  private existeErroServidor: boolean;

  public paises = ["Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Anguilla", "Antigua &amp; Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas"
    , "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia &amp; Herzegovina", "Botswana", "Brazil", "British Virgin Islands"
    , "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Cayman Islands", "Chad", "Chile", "China", "Colombia", "Congo", "Cook Islands", "Costa Rica"
    , "Cote D Ivoire", "Croatia", "Cruise Ship", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea"
    , "Estonia", "Ethiopia", "Falkland Islands", "Faroe Islands", "Fiji", "Finland", "France", "French Polynesia", "French West Indies", "Gabon", "Gambia", "Georgia", "Germany", "Ghana"
    , "Gibraltar", "Greece", "Greenland", "Grenada", "Guam", "Guatemala", "Guernsey", "Guinea", "Guinea Bissau", "Guyana", "Haiti", "Honduras", "Hong Kong", "Hungary", "Iceland", "India"
    , "Indonesia", "Iran", "Iraq", "Ireland", "Isle of Man", "Israel", "Italy", "Jamaica", "Japan", "Jersey", "Jordan", "Kazakhstan", "Kenya", "Kuwait", "Kyrgyz Republic", "Laos", "Latvia"
    , "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macau", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Mauritania"
    , "Mauritius", "Mexico", "Moldova", "Monaco", "Mongolia", "Montenegro", "Montserrat", "Morocco", "Mozambique", "Namibia", "Nepal", "Netherlands", "Netherlands Antilles", "New Caledonia"
    , "New Zealand", "Nicaragua", "Niger", "Nigeria", "Norway", "Oman", "Pakistan", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal"
    , "Puerto Rico", "Qatar", "Reunion", "Romania", "Russia", "Rwanda", "Saint Pierre &amp; Miquelon", "Samoa", "San Marino", "Satellite", "Saudi Arabia", "Senegal", "Serbia", "Seychelles"
    , "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "South Africa", "South Korea", "Spain", "Sri Lanka", "St Kitts &amp; Nevis", "St Lucia", "St Vincent", "St. Lucia", "Sudan"
    , "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor L'Este", "Togo", "Tonga", "Trinidad &amp; Tobago", "Tunisia"
    , "Turkey", "Turkmenistan", "Turks &amp; Caicos", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "United States Minor Outlying Islands", "Uruguay"
    , "Uzbekistan", "Venezuela", "Vietnam", "Virgin Islands (US)", "Yemen", "Zambia", "Zimbabwe"];

  constructor(
    public usuarioAtivo: UsuarioAtivoProvider,
    public navCtrl: NavController,
    public apiUsuarios: ApiUsuariosProvider,
    private toastCtrl: ToastController,
    public navParams: NavParams,
    public formBuilder: FormBuilder) {

    let areaDeInteresseFormatada = this.usuarioAtivo.usuario.areaDeInteresse.split(", ");
    console.log(areaDeInteresseFormatada);
    this.tentouEnviar = false;
    this.existeErroServidor = false;
    this.updateForm = formBuilder.group({
      numeroTelefone: [this.usuarioAtivo.usuario.numeroTelefone, Validators.compose([Validators.required, Validators.minLength(12)])],
      cargo: [this.usuarioAtivo.usuario.cargo, Validators.compose([Validators.minLength(5), Validators.maxLength(50)])],
      empresa: [this.usuarioAtivo.usuario.empresa, Validators.compose([Validators.minLength(2), Validators.maxLength(35)])],
      areaDeInteresse: [areaDeInteresseFormatada]
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InscricaoPage');
  }


  atualizaDados() {

    if (!this.validaForm()) return;

    let areaDeInteresseFormatada: string
    this.areaDeInteresse = this.updateForm.controls.areaDeInteresse.value;
    console.log(this.areaDeInteresse);
    for (let i = 0; i < this.areaDeInteresse.length; i++) {
      if (i == 0) {
        areaDeInteresseFormatada = this.areaDeInteresse[i];
      } else {
        areaDeInteresseFormatada = areaDeInteresseFormatada + ", " + this.areaDeInteresse[i];
      }
    }

    console.log(areaDeInteresseFormatada);
    let usuario: Usuario = {
      nome: this.usuarioAtivo.usuario.nome,
      sobrenome: this.usuarioAtivo.usuario.sobrenome,
      nomeUsuario: this.usuarioAtivo.usuario.nomeUsuario,
      id: this.usuarioAtivo.usuario.id,
      email: this.usuarioAtivo.usuario.email,
      numeroTelefone: this.updateForm.controls.numeroTelefone.value,
      cargo: this.updateForm.controls.cargo.value,
      empresa: this.updateForm.controls.empresa.value,
      areaDeInteresse: areaDeInteresseFormatada,
      estado: this.usuarioAtivo.usuario.estado,
      pais: this.usuarioAtivo.usuario.pais,
    }
    this.apiUsuarios.atualizaUsuario(usuario, () => {
      //callback sucesso
      console.log("Usuário atualizado com sucesso!");
      this.presentToast()
      this.navCtrl.pop();
    }, () => {
      //callback erro
      this.existeErroServidor = true;
    });
    console.log('funcao funcionando');
  }

  validaForm() {
    if (!this.updateForm.valid) {
      this.tentouEnviar = true;
      return false;
    } else return true;
  }

  presentToast() {
    let usuario = this.usuarioAtivo.getNomeCompleto()
    let atulizaInscricaoToast = this.toastCtrl.create({

      message: usuario + "Atualizado com sucesso!",
      duration: 3000,
      position: 'top'
    });

    atulizaInscricaoToast.present()
  }

}
