import { HttpInterceptorFn } from '@angular/common/http';
import {TokenService} from '../auth/token.service';
import {inject} from '@angular/core';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {


  const tokenService = inject(TokenService);
  const accessToken = tokenService.getAccessToken();

  const cloneReq = req.clone({
    setHeaders: {
      'Content-Type': 'application/json',
      // ...(accessToken ? {'Authentication': 'Bearer ' + accessToken} : undefined)
      // ...(accessToken ? {'Authentication': 'Bearer ' + accessToken} : {})
      ...(accessToken ? {'Authorization': 'Bearer ' + accessToken} : {})
    }
  });

  return next(cloneReq);

};
