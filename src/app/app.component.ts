import { Component } from '@angular/core';
import { Accessibility } from 'accessibility/dist/main';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'MiniProyecto2';

  constructor(){
    var opt = new Accessibility({
      language: {
        textToSpeechLang: 'es-MX',
        speechToTextLang: 'es-MX'
      },
      labels:{
        resetTitle: 'Reiniciar',
        closeTitle: 'Cerrar',
        menuTitle: 'Accesibilidad',
        increaseText: 'Aumentar tamaño de letra',
        decreaseText: 'Disminuir tamaño de letra',
        increaseTextSpacing: 'Aumentar espaciado horizontal',
        decreaseTextSpacing: 'Disminuir espaciado horizontal',
        increaseLineHeight: 'Aumentar espaciado vertical',
        decreaseLineHeight: 'Disminuir espaciado vertical',
        invertColors: 'Invertir colores',
        grayHues: 'Escala de Grises',
        underlineLinks: 'Subrayar links',
        bigCursor: ' Cursor más grande',
        speechToText: 'Dictado de texto',
        readingGuide: 'Guía de lectura',
        textToSpeech:'Texto al habla',
        disableAnimations: 'Desabilitar animaciones',
        screenReader: 'Lector de pantalla'
      }
    });
    opt.disableUnsupportedModules();
  }
}