import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FlowBiteServices } from './core/services/flowbite/flow-bite.services';
import { NavbarComponent } from "./core/components/navbar/navbar";

import { Footer } from "./core/components/footer/footer";
import { BackToTopComponent } from './core/components/back-to-top/back-to-top';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Footer, NgxSpinnerModule, BackToTopComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private readonly flowbiteService = inject(FlowBiteServices)

  ngOnInit(): void {
    this.flowbiteService.loadFlowbite((flowbite) => {
     flowbite.initFlowbite()
    });
  }
}
