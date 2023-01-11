import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Note } from 'src/app/model/note';
import { NotesService } from 'src/app/services/notes.service';
import { UiService } from 'src/app/services/ui.service';
import { Camera, CameraResultType, Photo } from '@capacitor/camera';
import { IonImg } from '@ionic/angular';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {
  Imagenbase64: string;
  imgUrl="";
  @ViewChild('foto') foto:IonImg;
  @Input('data') data:Note;
  private todo: FormGroup;
  constructor(
    private formBuilder:FormBuilder,
    private noteS:NotesService,
    private uiS:UiService,
    private modalCTRL:ModalController
  ) {
   
  }
  ngOnInit() {
    if(!this.data){
      console.log("Crear nota");
    } else {
      this.todo = this.formBuilder.group({
        title :[this.data.title,[Validators.required,
                    Validators.minLength(5)]],
        description : [this.data.description],
        foto : [this.data.foto]
      })
    }
  }

  async logForm(){
    if(!this.todo.valid) return;
    await this.uiS.showLoading();
    try{
      if(!this.data){
        await this.noteS.addNote({
          title:this.todo.get('title').value,
          description:this.todo.get('description').value,
          foto:this.todo.get('foto').value
        });
        this.todo.reset("");
        this.uiS.showToast("¡Nota insertada correctamente!");
      }else{
        await this.noteS.updateNote(
          {id:this.data.id,
           title:this.todo.get('title').value,
           description:this.todo.get('description').value,
           foto:this.todo.get('foto').value
          }
        );
        this.uiS.showToast("¡Nota actualizada correctamente!");
      }
    }catch(err){
      console.error(err);
      this.uiS.showToast(" Algo ha ido mal ;( ","danger");
    } finally{
      this.uiS.hideLoading();
      this.modalCTRL.dismiss( {id:this.data.id,
        title:this.todo.get('title').value,
        description:this.todo.get('description').value,
        foto:this.imgUrl
      });
    }
  }
  public async hazfoto(){
    const image = await Camera.getPhoto({
      quality: 75,
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
