import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot} from "@angular/router";
import {inject} from "@angular/core";
import {SupabaseAuthService} from "../services/supabase-auth.service";
import {FpRoute} from "../../app.routes";

export const authGuard: CanActivateFn = async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  try {
    const authService: SupabaseAuthService = inject(SupabaseAuthService);
    const router: Router = inject(Router);
    const existSession = await authService.isAuthenticated();

    return existSession
      ? true
      : router.navigate([FpRoute.ADMIN, FpRoute.AUTH, FpRoute.LOGIN]);
  } catch (e) {
    return false;
  }
};


