import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../../services/auth-guard.service';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'main-page',
        children: [
          {
            path: "",
            loadChildren: () => import('../main-page/main-page.module').then(m => m.MainPagePageModule),
          },
          {
            path: 'info-experience/:id',
            loadChildren: () => import('../info-experience/info-experience.module').then(m => m.InfoExperiencePageModule),
            canActivate: [AuthGuardService]
          },
          {
            path: 'info-hotel/:id',
            loadChildren: () => import('../info-hotel/info-hotel.module').then(m => m.InfoHotelPageModule),
            canActivate: [AuthGuardService]
          },
          {
            path: 'info-house/:id',
            loadChildren: () => import('../info-house/info-house.module').then(m => m.InfoHousePageModule),
            canActivate: [AuthGuardService]
          }
        ]
      },
      {
        path: 'favorites',
        loadChildren: () => import('../favorites/favorites.module').then(m => m.FavoritesPageModule),
        canActivate: [AuthGuardService]
      },
      {
        path: 'trips',
        loadChildren: () => import('../trips/trips.module').then(m => m.TripsPageModule)
      },
      {
        path: 'profile',
        children: [
          {
            path: "",
            loadChildren: () => import('../profile/profile.module').then(m => m.ProfilePageModule)
          },
          {
            path: 'edit-profile',
            loadChildren: () => import('../edit-profile/edit-profile.module').then( m => m.EditProfilePageModule)
          }
        ]
      },
      {
        path: 'contact-us',
        loadChildren: () => import('../contact-us/contact-us.module').then(m => m.ContactUsPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
