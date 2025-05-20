import { Component } from '@angular/core';
import {NgIf} from '@angular/common';
import {TabNotificationComponent} from '../tabs/tab-notification/tab-notification.component';
import {SidebarStatusService} from '../../services/status/sidebar-status.service';
import {SettingsStatusService} from '../../services/status/settings-status.service';
import { SettingsComponent } from '../tabs/settings/settings.component';
import { UserService } from '../../services/user.service';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { TokenService } from '../../services/auth/token.service'; 
import { UseStateService } from '../../services/auth/use-state.service';
import { PopupService } from '../../services/utils/popup.service';

@Component({
  selector: 'app-header-backoffice',
  imports: [
    NgIf,
    TabNotificationComponent,
    SettingsComponent
  ],
  standalone: true,
  templateUrl: './header-backoffice.component.html',
  styleUrl: './header-backoffice.component.scss'
})
export class HeaderBackofficeComponent implements OnInit {

  isActive: boolean = false;
  isActiveMenuHeader: boolean = true;

  // Variables de tabs

  isActiveItems: any = {
    isActiveNotification: false,
    isActiveSettings: false,
  }
  user: any = {
    username: '',
    firstName: '',
    lastName: '',
    role: '',
    address: '',
  };
  constructor(
    private sidebarStatusService: SidebarStatusService,
    private settingsStatusService: SettingsStatusService,
    private userService: UserService,
    private router: Router,
    private tokenService: TokenService,
    private userStateService: UseStateService,
    private popupService: PopupService
  ) {}
  ngOnInit(): void {
    this.sidebarStatusService.status$.subscribe((status: boolean) => {
      this.isActiveMenuHeader = status;
    });
  }
  toggleSettings() {
    this.settingsStatusService.toggleSettings();
  }
  // isActiveNotification: boolean = false;

  toggleLogo() {
    this.isActive = !this.isActive;
    this.sidebarStatusService.changeStatus(this.isActive);
  }

  toggleItem(option: string) {
    if (this.isActiveItems[option]) {
      this.isActiveItems[option] = false;
    } else {
      Object.keys(this.isActiveItems).forEach((item) => {
        this.isActiveItems[item] = false;
      });
      this.isActiveItems[option] = true;
  
      // Fetch user info when the profile dropdown is opened
      if (option === 'isActiveProfile') {
        this.fetchUserData();
      }
    }
  }
  // Fetch user data from the backend
  fetchUserData() {
    this.userService.getUserData().subscribe({
      next: (data) => {
        this.user = data; // Store the fetched data
        console.log('User data fetched:', data); // Log the data for debugging
      },
      error: (err) => {
        console.error('Error fetching user data:', err); // Log the error for debugging
      },
    });
  }
  closeSession(): void {
    this.popupService
      .showConfirmationWithActions(
        'Cerrar sesión',
        '¿Estás seguro de que deseas cerrar sesión?'
      )
      .then((confirmed) => {
        if (confirmed) {
          // User clicked "Seguro"
          this.popupService.loader('Cerrando sesión', 'Vuelva pronto');
  
          this.tokenService.removeToken();
          this.userStateService.removeSession();
  
          setTimeout(() => {
            this.popupService.close();
            this.router.navigate(['/login']);
          }, 1500);
        } else {
          // User clicked "Cancelar"
          console.log('Session close canceled.'); // Optional: Add a log or other action
        }
      });
  }
  
  showUserProfile() {
    const userRole = this.userStateService.getRole(); // Get the user's role
  
    if (userRole === 'ADMIN') {
      this.router.navigate(['admin/user-profile']); // Navigate to admin profile
    } else if (userRole === 'STUDENT') {
      this.router.navigate(['client/user-profile']); // Navigate to client profile
    }  else if (userRole === 'TEACHER') {
      this.router.navigate(['seller/user-profile']); // Navigate to client profile
    }else {
      console.error('Unknown role:', userRole); // Handle unknown roles
      this.popupService.showMessage('Error', 'Unknown user role', 'error');
    }
  }
  
  navigateToChangePassword() {
    const userRole = this.userStateService.getRole(); // Get the user's role
  
    if (userRole === 'ADMIN') {
      this.router.navigate(['admin/change-password']); // Navigate to admin profile
    } else if (userRole === 'STUDENT') {
      this.router.navigate(['client/change-password']); // Navigate to client profile
    }  else if (userRole === 'TEACHER') {
      this.router.navigate(['seller/change-password']); // Navigate to client profile
    }else {
      console.error('Unknown role:', userRole); // Handle unknown roles
      this.popupService.showMessage('Error', 'Unknown user role', 'error');
    }
  }
  
  navigateToAddProduct() {
    const userRole = this.userStateService.getRole(); // Get the user's role
  
    if (userRole === 'ADMIN') {
      this.router.navigate(['admin/add-post']); // Navigate to admin profile
    }  else if (userRole === 'TEACHER') {
      this.router.navigate(['seller/add-post']); // Navigate to client profile
    } else {
      console.error(userRole," No tiene acceso"); // Handle unknown roles
      this.popupService.showMessage('Error', `${userRole}, No tiene acceso. ` , 'error');
    }
  }
  
  navigateToAllProduct() {
    const userRole = this.userStateService.getRole();
  
    if (userRole === 'STUDENT') {
      this.router.navigate(['client/tienda']); // Navigate to admin profile
    }  else if (userRole === 'ADMIN') {
      this.router.navigate(['admin/tienda']); // Navigate to client profile
    }else if (userRole === 'TEACHER') {
      this.router.navigate(['seller/tienda']); // Navigate to client profile
    }else {
      console.error(userRole," No tiene acceso"); // Handle unknown roles
      this.popupService.showMessage('Error', `${userRole}, No tiene acceso. ` , 'error');
    }
  }
  navigateToCart() {
    const userRole = this.userStateService.getRole();
  
    if (userRole === 'STUDENT') {
      this.router.navigate(['client/cart']); // Navigate to admin profile
    }  else if (userRole === 'ADMIN') {
      this.router.navigate(['admin/cart']); // Navigate to client profile
    }else {
      console.error(userRole," No tiene acceso"); // Handle unknown roles
      this.popupService.showMessage('Error', `${userRole}, No tiene acceso. ` , 'error');
    }
  }
  closeProfileDropdown(): void {
    this.isActiveItems.isActiveProfile = false;
  }
  
}
