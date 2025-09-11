import { Routes } from '@angular/router';
import { SettingsShellPage } from './shell/settings-shell';
import { AccountSettingsPage } from './tabs/account/account';
import { SecuritySettingsPage } from './tabs/security/security';
import { AddressesSettingsPage } from './tabs/addresses/addresses';

export const SETTINGS_ROUTES: Routes = [
  {
    path: '',
    component: SettingsShellPage,
    title: 'Settings',
    children: [
      { path: '', redirectTo: 'account', pathMatch: 'full' },
      { path: 'account', component: AccountSettingsPage },
      { path: 'security', component: SecuritySettingsPage },
      { path: 'addresses', component: AddressesSettingsPage },
    ]
  }
];


