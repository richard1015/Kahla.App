import { Component } from '@angular/core';
import { AuthApiService } from '../Services/AuthApiService';
import Swal from 'sweetalert2';
import { catchError } from 'rxjs/operators';
import { HeaderService } from '../Services/HeaderService';

@Component({
    templateUrl: '../Views/changePassword.html',
    styleUrls: [
      '../Styles/userDetail.css',
      '../Styles/button.css'
    ]
})
export class ChangePasswordComponent {
    public oldPassword = '';
    public newPassword = '';
    public confirmPassword = '';
    public samePassword = false;
    private valid = false;

    constructor(
        private authApiServer: AuthApiService,
        private headerService: HeaderService
    ) {
        this.headerService.title = 'Change Password';
        this.headerService.returnButton = true;
        this.headerService.button = false;
        this.headerService.shadow = false;
    }

    public checkValid(): void {
        this.samePassword = this.newPassword === this.confirmPassword ? true : false;
        if (this.oldPassword.length >= 6 && this.oldPassword.length <= 32 && this.newPassword.length >= 6 &&
            this.newPassword.length <= 32 && this.samePassword) {
                this.valid = true;
        }
    }

    public onSubmit(): void {
        this.checkValid();
        if (!this.samePassword) {
            Swal('Passwords are not same!', 'error');
        }
        if (!this.valid && this.samePassword) {
            Swal('Password length should between six and thirty-two');
        }
        if (this.valid) {
            this.authApiServer.ChangePassword(this.oldPassword, this.newPassword, this.confirmPassword)
            .pipe(catchError(error => {
                Swal('Network issue', 'Could not connect to Kahla server.', 'error');
                return Promise.reject(error.message || error);
            }))
            .subscribe(result => {
                if (result.code === 0) {
                    Swal('All set', result.message, 'success');
                } else {
                    Swal('Try again', result.message, 'error');
                }
            });
        }
    }
}
