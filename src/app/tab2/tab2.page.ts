import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotesService } from '../services/notes.service';
import { UiService } from '../services/ui.service';
import { Camera, CameraResultType, Photo } from '@capacitor/camera';
import { IonImg } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  Imagenbase64: string;
  imgUrl="";
  @ViewChild('foto') foto:IonImg;
  private todo: FormGroup;
  constructor(
    private formBuilder:FormBuilder,
    private noteS:NotesService,
    private uiS:UiService
  ) {
    this.todo = this.formBuilder.group({
      title :['',[Validators.required,
                  Validators.minLength(5)]],
      description : ['']
    })
  }
  public async logForm(){
    if(!this.todo.valid) return;
    await this.uiS.showLoading();
    try{
      await this.noteS.addNote({
        title:this.todo.get('title').value,
        description:this.todo.get('description').value,
        foto: this.imgUrl
      });
      this.todo.reset("");
      this.foto.src=("");
      this.imgUrl=("");
      this.uiS.showToast("¡Nota insertada correctamente!");
    }catch(err){
      console.error(err);
      this.uiS.showToast(" Algo ha ido mal ;( ","danger");
    } finally{
      this.uiS.hideLoading();
    }
  }
  public async hazfoto(){
    const image = await Camera.getPhoto({
      quality: 80,
      allowEditing: true,
      resultType: CameraResultType.Uri,
    });
  
    // image.webPath will contain a path that can be set as an image src.
    // You can access the original file using image.path, which can be
    // passed to the Filesystem API to read the raw data of the image,
    // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
    let imageUrl = image.webPath;
    
    this.foto.src = imageUrl;
    this.convertToBase64();
    
    // Can be set to the src of an image now
    this.foto.src = imageUrl;
    
  }
  
  public convertToBase64() {
    this.Imagenbase64=this.foto.src;
    fetch(this.Imagenbase64)
  .then(res => res.blob())
  .then(blob => {
    // Convert the blob to base64 format
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      this.imgUrl= reader.result as string;
    }
  });
}

}
