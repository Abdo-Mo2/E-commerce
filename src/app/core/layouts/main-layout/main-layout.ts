import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar';
import { LoaderOverlay } from '../../components/loader-overlay/loader-overlay';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, LoaderOverlay],
  templateUrl: './main-layout.html'
  // removed styleUrls to avoid missing file error
})
export class MainLayout {}
